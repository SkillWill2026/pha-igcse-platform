export const dynamic = 'force-dynamic'

import Anthropic from '@anthropic-ai/sdk'
import { createAdminClient } from '@/lib/supabase'
import { NextResponse } from 'next/server'
import { embedTexts } from '@/lib/voyage'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: Request) {
  try {
    const { question_id } = await request.json()
    if (!question_id) {
      return NextResponse.json({ error: 'question_id is required' }, { status: 400 })
    }

    const supabase = createAdminClient()

    // 1. Fetch the question
    const { data: question, error: questionError } = await supabase
      .from('questions')
      .select('id, content_text, marks, difficulty, topic_id, subtopic_id')
      .eq('id', question_id)
      .single()

    if (questionError || !question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 })
    }

    // Auto-classify subtopic + sub-subtopic
    try {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/api/classify-question`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question_id }),
      })
      const { data: reclassified } = await supabase
        .from('questions')
        .select('id, content_text, marks, difficulty, topic_id, subtopic_id, sub_subtopic_id')
        .eq('id', question_id)
        .single()
      if (reclassified) {
        Object.assign(question, reclassified)
      }
    } catch (classifyErr) {
      console.warn('[generate-answer] Auto-classification failed, continuing:', classifyErr)
    }

    // Fetch topic and subtopic separately
    const [topicRes, subtopicRes] = await Promise.all([
      question.topic_id
        ? supabase.from('topics').select('name, ref').eq('id', question.topic_id).single()
        : Promise.resolve({ data: null }),
      question.subtopic_id
        ? supabase.from('subtopics').select('title').eq('id', question.subtopic_id).single()
        : Promise.resolve({ data: null }),
    ])

    const topic = topicRes.data
    const subtopic = subtopicRes.data

    // 2. RAG: embed the question and search the databank
    let ragContext = ''
    let ragSources: string[] = []
    let bestSimilarity = 0

    try {
      const [queryEmbedding] = await embedTexts([question.content_text])

      const { data: chunks, error: searchError } = await supabase.rpc(
        'search_databank_chunks',
        {
          query_embedding: queryEmbedding,
          match_count: 5,
          similarity_threshold: 0.3,
        }
      )

      if (!searchError && chunks && chunks.length > 0) {
        bestSimilarity = chunks[0].similarity

        ragContext = chunks
          .map((c: {
            content: string
            document_title: string
            doc_type: string
            page_number: number | null
            similarity: number
          }) => {
            const source = `[${c.document_title}${c.page_number ? `, p.${c.page_number}` : ''}]`
            return `${source}\n${c.content}`
          })
          .join('\n\n---\n\n')

        ragSources = chunks
          .filter((c: { similarity: number }) => c.similarity > 0.4)
          .map((c: {
            document_title: string
            doc_type: string
            page_number: number | null
          }) => `${c.document_title}${c.page_number ? `, p.${c.page_number}` : ''}`)
          .filter((v: string, i: number, a: string[]) => a.indexOf(v) === i)
      }
    } catch (ragError) {
      console.warn('[generate-answer] RAG search failed, falling back to base generation:', ragError)
    }

    // 3. Build the prompt
    const topicName = topic?.name ?? 'Mathematics'
    const topicRef = topic?.ref ?? ''
    const subtopicTitle = subtopic?.title ?? ''
    const hasRAG = ragContext.length > 0

    const systemPrompt = `You are an expert Cambridge IGCSE Mathematics tutor (syllabus 0580).
Your job is to write a complete, step-by-step model answer for exam questions.

FORMATTING RULES:
- Use **Working:** for method steps and **Answer:** for the final answer
- Use LaTeX for all mathematics: inline $x^2$ and display $$\\frac{a}{b}$$
- Be precise — every mark should be earnable from your answer
- Match the mark allocation exactly (${question.marks ?? 1} mark${(question.marks ?? 1) !== 1 ? 's' : ''})

IMPORTANT: Never fabricate mark scheme steps. If unsure, show the most rigorous mathematical method.`

    const userPrompt = hasRAG
      ? `Topic: ${topicRef} ${topicName}${subtopicTitle ? ` — ${subtopicTitle}` : ''}
Marks: ${question.marks ?? 1}

QUESTION:
${question.content_text}

RELEVANT SOURCE MATERIAL FROM DATABANK:
${ragContext}

Using the source material above where relevant, write a complete model answer for this question.`
      : `Topic: ${topicRef} ${topicName}${subtopicTitle ? ` — ${subtopicTitle}` : ''}
Marks: ${question.marks ?? 1}

QUESTION:
${question.content_text}

Write a complete model answer for this question.`

    // 4. Call Claude
    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    })

    const answerContent = message.content[0].type === 'text'
      ? message.content[0].text
      : ''

    // 5. Calculate confidence score
    let confidenceScore: number
    if (hasRAG && bestSimilarity > 0.7) {
      confidenceScore = 0.92
    } else if (hasRAG && bestSimilarity > 0.5) {
      confidenceScore = 0.82
    } else if (hasRAG && bestSimilarity > 0.3) {
      confidenceScore = 0.72
    } else {
      confidenceScore = 0.55
    }

    // Use answer content as-is, no source citations appended
    const finalContent = answerContent

    // 6. Upsert the answer
    const { data: existingAnswer } = await supabase
      .from('answers')
      .select('id')
      .eq('question_id', question_id)
      .maybeSingle()

    let answer
    if (existingAnswer) {
      const { data, error } = await supabase
        .from('answers')
        .update({
          content: finalContent,
          confidence_score: confidenceScore,
          status: 'draft',
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingAnswer.id)
        .select()
        .single()
      if (error) throw error
      answer = data
    } else {
      const { data, error } = await supabase
        .from('answers')
        .insert({
          question_id,
          content: finalContent,
          confidence_score: confidenceScore,
          status: 'draft',
          ai_generated: true,
        })
        .select()
        .single()
      if (error) throw error
      answer = data
    }

    return NextResponse.json({
      answer,
      rag_used: hasRAG,
      rag_sources: ragSources,
      similarity: bestSimilarity,
    })

  } catch (error) {
    console.error('[generate-answer] Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate answer' },
      { status: 500 }
    )
  }
}
