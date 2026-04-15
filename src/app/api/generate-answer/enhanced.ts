// =============================================================================
// ENHANCED ANSWER GENERATION — 3-LAYER QUALITY FIX
// Session 7 | 15 April 2026
//
// LAYER 1: Raise similarity threshold 0.3 → 0.55
//          If no chunk meets threshold: return insufficient_databank_coverage
// LAYER 2: Verification call (claude-haiku-4-5, low cost)
// LAYER 3: Real confidence badges surfaced via response flags
// =============================================================================

import Anthropic from '@anthropic-ai/sdk'
import { createAdminClient } from '@/lib/supabase'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { embedTexts } from '@/lib/voyage'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SIMILARITY_THRESHOLD = 0.55
const MATCH_COUNT = 5

async function callClaudeWithRetry(
  params: Parameters<Anthropic['messages']['create']>[0],
  maxRetries = 3
) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await anthropic.messages.create(params)
    } catch (err: unknown) {
      const e = err as { error?: { type?: string }; status?: number }
      if ((e?.error?.type === 'overloaded_error' || e?.status === 529) && attempt < maxRetries) {
        console.log(`[enhanced-answer] Claude overloaded, retry ${attempt}/${maxRetries}`)
        await new Promise(resolve => setTimeout(resolve, 3000 * attempt))
        continue
      }
      throw err
    }
  }
}

async function verifyAnswer(
  questionText: string,
  answerText: string
): Promise<{ verdict: 'correct' | 'likely_wrong' | 'uncertain'; issue: string }> {
  try {
    const verifyPrompt = `You are a Cambridge IGCSE Mathematics examiner checking a model answer.

QUESTION:
${questionText}

PROPOSED ANSWER:
${answerText}

Check this answer carefully:
1. Are all calculations mathematically correct?
2. Does the answer directly address what the question asks?
3. Are the correct units and significant figures used?

Respond with ONLY valid JSON — no explanation, no markdown, no backticks:
{"verdict": "correct" | "likely_wrong" | "uncertain", "issue": "brief description or empty string"}`

    const verifyMsg = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 200,
      messages: [{ role: 'user', content: verifyPrompt }],
    })

    const raw = verifyMsg.content[0].type === 'text' ? verifyMsg.content[0].text.trim() : ''
    const parsed = JSON.parse(raw)
    if (['correct', 'likely_wrong', 'uncertain'].includes(parsed.verdict)) {
      return { verdict: parsed.verdict, issue: parsed.issue ?? '' }
    }
    return { verdict: 'uncertain', issue: 'Unexpected format' }
  } catch (err) {
    console.warn('[enhanced-answer] Verification failed, defaulting to uncertain:', err)
    return { verdict: 'uncertain', issue: 'Verification call failed' }
  }
}

function getBadge(
  bestSimilarity: number,
  verdict: 'correct' | 'likely_wrong' | 'uncertain'
): 'high_confidence' | 'review_recommended' | 'must_review' {
  if (verdict === 'likely_wrong') return 'must_review'
  if (bestSimilarity > 0.7 && verdict === 'correct') return 'high_confidence'
  return 'review_recommended'
}

export async function enhancedGenerateAnswer(request: Request): Promise<NextResponse> {
  try {
    const { question_id, image_urls, force_regenerate } = await request.json()

    if (!question_id) {
      return NextResponse.json({ error: 'question_id is required' }, { status: 400 })
    }

    // 1. Fetch question
    let question = await prisma.questions.findUnique({
      where: { id: question_id },
      select: { id: true, content_text: true, marks: true, difficulty: true, topic_id: true, subtopic_id: true },
    })
    if (!question) return NextResponse.json({ error: 'Question not found' }, { status: 404 })

    // Auto-classify
    try {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/api/classify-question`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question_id }),
      })
      const reclassified = await prisma.questions.findUnique({
        where: { id: question_id },
        select: { id: true, content_text: true, marks: true, difficulty: true, topic_id: true, subtopic_id: true, sub_subtopic_id: true },
      })
      if (reclassified) question = { ...question, ...reclassified }
    } catch (classifyErr) {
      console.warn('[enhanced-answer] Auto-classification failed, continuing:', classifyErr)
    }

    const [topic, subtopic] = await Promise.all([
      question.topic_id
        ? prisma.topics.findUnique({ where: { id: question.topic_id }, select: { name: true, ref: true } })
        : Promise.resolve(null),
      question.subtopic_id
        ? prisma.subtopics.findUnique({ where: { id: question.subtopic_id }, select: { title: true } })
        : Promise.resolve(null),
    ])

    // 2. LAYER 1 — RAG with raised threshold
    let ragContext = ''
    let ragSources: string[] = []
    let bestSimilarity = 0
    let insufficientCoverage = false

    try {
      const [queryEmbedding] = await embedTexts([question.content_text ?? ''])
      const supabase = createAdminClient()
      const { data: chunks, error: searchError } = await supabase.rpc('search_databank_chunks', {
        query_embedding: queryEmbedding,
        match_count: MATCH_COUNT,
        similarity_threshold: SIMILARITY_THRESHOLD,
      })

      if (!searchError && chunks && chunks.length > 0) {
        bestSimilarity = chunks[0].similarity
        ragContext = chunks
          .map((c: { content: string; document_title: string; page_number: number | null }) =>
            `[${c.document_title}${c.page_number ? `, p.${c.page_number}` : ''}]\n${c.content}`)
          .join('\n\n---\n\n')
        ragSources = chunks
          .filter((c: { similarity: number }) => c.similarity > 0.55)
          .map((c: { document_title: string; page_number: number | null }) =>
            `${c.document_title}${c.page_number ? `, p.${c.page_number}` : ''}`)
          .filter((v: string, i: number, a: string[]) => a.indexOf(v) === i)
      } else {
        insufficientCoverage = true
      }
    } catch (ragError) {
      console.warn('[enhanced-answer] RAG search failed:', ragError)
      insufficientCoverage = true
    }

    // LAYER 1 gate — no databank coverage, do NOT generate
    if (insufficientCoverage) {
      console.log('[enhanced-answer]', { question_id, similarity: 0, rag_used: false, insufficient_coverage: true })
      return NextResponse.json({
        insufficient_databank_coverage: true,
        message: 'No databank match found above threshold — manual answer required',
        rag_used: false,
        similarity: 0,
      })
    }

    // 3. Build prompt
    const topicName = topic?.name ?? 'Mathematics'
    const topicRef = topic?.ref ?? ''
    const subtopicTitle = subtopic?.title ?? ''

    const systemPrompt = `You are an expert Cambridge IGCSE Mathematics teacher writing model answers for students.

FORMAT RULES — follow exactly:
- Structure the answer with clear numbered steps: "**1) Step title**"
- Under each step, write a brief plain-English explanation, then show the calculation on its own line
- Use simple inline LaTeX only for formulas: $A = l \\times w$
- For final answers: write "**Answer: [value with units]**" on its own line
- Keep each step short — one concept per step
- Never write long paragraphs
- Never show alternative methods unless the question asks for them
- If the question involves a diagram you cannot see: state which measurements are needed and show the method using those labels

CONTENT RULES:
- Use ONLY the specific numbers from the question — never invent values
- Show every arithmetic step clearly
- Match the number of marks — more marks means more steps shown
- Always end with a clear final answer`

    const userPrompt = `Topic: ${topicRef} ${topicName}${subtopicTitle ? ` — ${subtopicTitle}` : ''}
Marks: ${question.marks ?? 1}

QUESTION:
${question.content_text}

RELEVANT SOURCE MATERIAL FROM DATABANK:
${ragContext}

Using the source material above where relevant, write a complete model answer for this question.`

    // 4. Images
    const imageContent: Array<{ type: 'image'; source: { type: 'base64'; media_type: 'image/png'; data: string } }> = []
    if (image_urls && Array.isArray(image_urls)) {
      for (const url of image_urls) {
        try {
          const base64Data = url.startsWith('data:image')
            ? url.split(',')[1]
            : Buffer.from(await (await fetch(url)).arrayBuffer()).toString('base64')
          imageContent.push({ type: 'image', source: { type: 'base64', media_type: 'image/png', data: base64Data } })
        } catch (imgErr) {
          console.warn('[enhanced-answer] Failed to process image:', url, imgErr)
        }
      }
    }

    // 5. Call Claude Sonnet
    const message = await callClaudeWithRetry({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      system: systemPrompt,
      messages: [{ role: 'user', content: [...imageContent, { type: 'text' as const, text: userPrompt }] }],
    })

    const answerContent = message!.content[0].type === 'text' ? message!.content[0].text : ''

    // 6. LAYER 2 — Verification
    const verification = await verifyAnswer(question.content_text ?? '', answerContent)

    // 7. LAYER 3 — Real confidence score + badge
    let confidenceScore: number
    if (bestSimilarity > 0.7 && verification.verdict === 'correct')      { confidenceScore = 0.92 }
    else if (bestSimilarity > 0.55 && verification.verdict === 'correct') { confidenceScore = 0.82 }
    else if (verification.verdict === 'uncertain')                         { confidenceScore = 0.65 }
    else                                                                   { confidenceScore = 0.40 }

    const badge = getBadge(bestSimilarity, verification.verdict)

    console.log('[enhanced-answer]', {
      question_id,
      similarity: bestSimilarity,
      rag_used: true,
      verification_verdict: verification.verdict,
      verification_issue: verification.issue,
      confidence: confidenceScore,
      badge,
      insufficient_coverage: false,
    })

    // 8. Upsert answer
    const existingAnswer = await prisma.answers.findFirst({ where: { question_id }, select: { id: true } })
    const answerData = { content: answerContent, confidence_score: confidenceScore, status: 'draft', ai_generated: true }

    let answer
    if (force_regenerate) {
      if (existingAnswer) await prisma.answers.delete({ where: { id: existingAnswer.id } })
      answer = await prisma.answers.create({ data: { question_id, ...answerData } })
    } else if (existingAnswer) {
      answer = await prisma.answers.update({ where: { id: existingAnswer.id }, data: { ...answerData, updated_at: new Date() } })
    } else {
      answer = await prisma.answers.create({ data: { question_id, ...answerData } })
    }

    return NextResponse.json({
      answer,
      rag_used: true,
      rag_sources: ragSources,
      similarity: bestSimilarity,
      verification_verdict: verification.verdict,
      verification_issue: verification.issue,
      confidence_badge: badge,
      insufficient_databank_coverage: false,
    })

  } catch (error) {
    console.error('[enhanced-answer] Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate answer' },
      { status: 500 }
    )
  }
}
