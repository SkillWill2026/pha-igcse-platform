export const dynamic = 'force-dynamic'

import Anthropic from '@anthropic-ai/sdk'
import { createAdminClient } from '@/lib/supabase'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { embedTexts } from '@/lib/voyage'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// Retry logic for Claude API overloaded errors
async function callClaudeWithRetry(client: Anthropic, params: Parameters<Anthropic['messages']['create']>[0], maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await client.messages.create(params)
    } catch (err: unknown) {
      const e = err as { error?: { type?: string }; status?: number }
      if ((e?.error?.type === 'overloaded_error' || e?.status === 529) && attempt < maxRetries) {
        console.log(`[generate-answer] Claude overloaded, retry ${attempt}/${maxRetries}`)
        await new Promise(resolve => setTimeout(resolve, 3000 * attempt))
        continue
      }
      throw err
    }
  }
}

export async function POST(request: Request) {
  try {
    const { question_id, image_urls, force_regenerate } = await request.json()
    if (!question_id) {
      return NextResponse.json({ error: 'question_id is required' }, { status: 400 })
    }

    // 1. Fetch the question
    let question = await prisma.questions.findUnique({
      where:  { id: question_id },
      select: { id: true, content_text: true, marks: true, difficulty: true, topic_id: true, subtopic_id: true },
    })

    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 })
    }

    // Auto-classify subtopic + sub-subtopic
    try {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/api/classify-question`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ question_id }),
      })
      const reclassified = await prisma.questions.findUnique({
        where:  { id: question_id },
        select: { id: true, content_text: true, marks: true, difficulty: true, topic_id: true, subtopic_id: true, sub_subtopic_id: true },
      })
      if (reclassified) {
        question = { ...question, ...reclassified }
      }
    } catch (classifyErr) {
      console.warn('[generate-answer] Auto-classification failed, continuing:', classifyErr)
    }

    // Fetch topic and subtopic
    const [topic, subtopic] = await Promise.all([
      question.topic_id
        ? prisma.topics.findUnique({ where: { id: question.topic_id }, select: { name: true, ref: true } })
        : Promise.resolve(null),
      question.subtopic_id
        ? prisma.subtopics.findUnique({ where: { id: question.subtopic_id }, select: { title: true } })
        : Promise.resolve(null),
    ])

    // 2. RAG: embed the question and search the databank — RPC stays on Supabase
    let ragContext = ''
    let ragSources: string[] = []
    let bestSimilarity = 0

    try {
      const [queryEmbedding] = await embedTexts([question.content_text ?? ''])

      const supabase = createAdminClient()
      const { data: chunks, error: searchError } = await supabase.rpc(
        'search_databank_chunks',
        {
          query_embedding:      queryEmbedding,
          match_count:          5,
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
          .map((c: { document_title: string; doc_type: string; page_number: number | null }) =>
            `${c.document_title}${c.page_number ? `, p.${c.page_number}` : ''}`)
          .filter((v: string, i: number, a: string[]) => a.indexOf(v) === i)
      }
    } catch (ragError) {
      console.warn('[generate-answer] RAG search failed, falling back to base generation:', ragError)
    }

    // 3. Build the prompt
    const topicName    = topic?.name  ?? 'Mathematics'
    const topicRef     = topic?.ref   ?? ''
    const subtopicTitle = subtopic?.title ?? ''
    const hasRAG = ragContext.length > 0

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

    // 4. Convert image URLs to base64 if provided
    const imageContent: Array<{ type: 'image'; source: { type: 'base64'; media_type: 'image/png'; data: string } }> = []
    if (image_urls && Array.isArray(image_urls)) {
      for (const url of image_urls) {
        try {
          let base64Data: string
          if (url.startsWith('data:image')) {
            base64Data = url.split(',')[1]
          } else {
            const imgRes = await fetch(url)
            const buffer = await imgRes.arrayBuffer()
            base64Data = Buffer.from(buffer).toString('base64')
          }
          imageContent.push({
            type:   'image',
            source: { type: 'base64', media_type: 'image/png', data: base64Data },
          })
        } catch (imgErr) {
          console.warn('[generate-answer] Failed to process image:', url, imgErr)
        }
      }
    }

    // 5. Build message content with images + text
    const messageContent = [
      ...imageContent,
      { type: 'text' as const, text: userPrompt },
    ]

    // 6. Call Claude Sonnet with vision (with retry on overload)
    const message = await callClaudeWithRetry(anthropic, {
      model:     'claude-sonnet-4-6',
      max_tokens: 2048,
      system:     systemPrompt,
      messages:   [{ role: 'user', content: messageContent }],
    })

    const answerContent = message!.content[0].type === 'text' ? message!.content[0].text : ''

    // 5. Calculate confidence score
    let confidenceScore: number
    if (hasRAG && bestSimilarity > 0.7)      { confidenceScore = 0.92 }
    else if (hasRAG && bestSimilarity > 0.5) { confidenceScore = 0.82 }
    else if (hasRAG && bestSimilarity > 0.3) { confidenceScore = 0.72 }
    else                                     { confidenceScore = 0.55 }

    const finalContent = answerContent

    // 7. Upsert the answer
    let answer
    const existingAnswer = await prisma.answers.findFirst({
      where:  { question_id },
      select: { id: true },
    })

    if (force_regenerate) {
      // Delete existing answer and insert new one
      if (existingAnswer) {
        await prisma.answers.delete({ where: { id: existingAnswer.id } })
      }
      answer = await prisma.answers.create({
        data: {
          question_id,
          content:          finalContent,
          confidence_score: confidenceScore,
          status:           'draft',
          ai_generated:     true,
        },
      })
    } else if (existingAnswer) {
      answer = await prisma.answers.update({
        where: { id: existingAnswer.id },
        data:  {
          content:          finalContent,
          confidence_score: confidenceScore,
          status:           'draft',
          updated_at:       new Date(),
        },
      })
    } else {
      answer = await prisma.answers.create({
        data: {
          question_id,
          content:          finalContent,
          confidence_score: confidenceScore,
          status:           'draft',
          ai_generated:     true,
        },
      })
    }

    return NextResponse.json({
      answer,
      rag_used:   hasRAG,
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
