export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const maxDuration = 60

import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { createAdminClient } from '@/lib/supabase'
import { prisma } from '@/lib/prisma'
import { embedTexts } from '@/lib/voyage'
import type { Slide } from '@/types/ppt'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(request: NextRequest) {
  try {
    const { subtopic_id, subject_id, tutor_notes } = await request.json()

    if (!subtopic_id || !subject_id) {
      return NextResponse.json({ error: 'subtopic_id and subject_id are required' }, { status: 400 })
    }

    // Fetch subtopic and subject in parallel
    const [subtopic, subject] = await Promise.all([
      prisma.subtopics.findUnique({
        where: { id: subtopic_id },
        select: { id: true, ref: true, title: true, topic_id: true },
      }),
      prisma.subjects.findUnique({
        where: { id: subject_id },
        select: { id: true, name: true, code: true },
      }),
    ])

    if (!subtopic || !subject) {
      return NextResponse.json({ error: 'Subtopic or subject not found' }, { status: 404 })
    }

    const topic = subtopic.topic_id
      ? await prisma.topics.findUnique({
          where: { id: subtopic.topic_id },
          select: { name: true, ref: true },
        })
      : null

    const [subSubtopics, questions] = await Promise.all([
      prisma.sub_subtopics.findMany({
        where: { subtopic_id },
        select: { id: true, outcome: true, ext_num: true, core_num: true, tier: true },
        orderBy: { sort_order: 'asc' },
        take: 6,
      }),
      prisma.questions.findMany({
        where: { subtopic_id, status: 'approved' },
        select: { id: true, content_text: true, marks: true, difficulty: true, sub_subtopic_id: true },
        orderBy: { difficulty: 'asc' },
      }),
    ])

    const subs = subSubtopics

    const questionsBySub: Record<string, { id: string; content_text: string | null; marks: number | null }[]> = {}
    for (const q of questions) {
      const key = q.sub_subtopic_id ?? 'unassigned'
      if (!questionsBySub[key]) questionsBySub[key] = []
      questionsBySub[key].push(q)
    }

    const searchQueries = subs.length > 0
      ? subs.map(s => `${subject.name} ${subtopic.title} ${s.outcome}`)
      : [`${subject.name} ${topic?.name ?? ''} ${subtopic.title}`]

    const embeddings = await embedTexts(searchQueries)

    // ── RPC: vector similarity search — keep on Supabase (Postgres function) ──
    const supabase = createAdminClient()
    const chunkResults = await Promise.all(
      embeddings.map(embedding =>
        supabase.rpc('search_databank_chunks', {
          query_embedding:      embedding,
          match_count:          4,
          similarity_threshold: 0.25,
        })
      )
    )

    const seenChunkIds = new Set<string>()
    const allChunks: { content: string }[] = []
    for (const res of chunkResults) {
      for (const chunk of res.data ?? []) {
        const key = chunk.content.slice(0, 50)
        if (!seenChunkIds.has(key)) {
          seenChunkIds.add(key)
          allChunks.push(chunk)
        }
      }
    }

    if (allChunks.length === 0) {
      return NextResponse.json(
        { error: 'Data not available in Databank', code: 'NO_DATABANK_DATA' },
        { status: 422 }
      )
    }

    const ragContext = allChunks.map((c, i) => `[Source ${i + 1}]\n${c.content}`).join('\n\n')

    const subsSection = subs.length > 0
      ? subs.map((s, i) => {
          const qs    = questionsBySub[s.id] ?? questionsBySub['unassigned'] ?? []
          const qText = qs.slice(0, 2).map((q, qi) => `  Q${qi + 1} (${q.marks}m): ${q.content_text}`).join('\n')
          return `SUB-SUBTOPIC ${i + 1}: ${s.outcome}\n${qText || '  (no approved questions yet — concept slide only)'}`
        }).join('\n\n')
      : 'No sub-subtopics defined — generate general concept slides.'

    const tutorNotesSection = tutor_notes ? `\n\nTUTOR FEEDBACK:\n${tutor_notes}` : ''

    const systemPrompt = `You are an expert IGCSE ${subject.name} teacher creating structured lesson slides.
You MUST use content ONLY from the provided databank sources. Do not invent content.
Respond with a valid JSON array of slide objects only. No markdown, no backticks.`

    const userPrompt = `Create a complete lesson slide deck structured by sub-subtopics.

SUBJECT: ${subject.name} (${subject.code})
TOPIC: ${topic?.name ?? 'Unknown'}
SUBTOPIC: ${subtopic.title} (${subtopic.ref ?? ''})

DATABANK SOURCES (use ONLY this content):
${ragContext}

SUB-SUBTOPICS WITH EXAM QUESTIONS:
${subsSection}
${tutorNotesSection}

REQUIRED SLIDE STRUCTURE (in this exact order):

1. TITLE slide (1 slide):
{ "id":"s1", "type":"title", "title":"${subtopic.title}", "subtitle":"${subject.code} · ${topic?.ref ?? ''} ${subtopic.ref ?? ''}", "speaker_notes":"Welcome narration. Explain what the student will learn across all sub-subtopics.", "youchi_pose":"excited" }

2. OVERVIEW slide (1 slide — each bullet MUST exactly match the sub-subtopic outcome text used in section slides):
{ "id":"s2", "type":"overview", "title":"In This Lesson", "bullets":["exact outcome text 1","exact outcome text 2","exact outcome text 3"], "speaker_notes":"Preview each learning outcome briefly.", "youchi_pose":"thinking" }

3. For EACH sub-subtopic, in order:

  a. SECTION divider:
  { "id":"sX", "type":"section", "title":"[EXACT same text as the matching overview bullet]", "subtitle":"Part N of ${subs.length || 1}", "section_number":N, "speaker_notes":"Brief intro to this learning outcome.", "youchi_pose":"wink" }

  b. CONCEPT slide:
  { "id":"sX", "type":"concept", "title":"clear heading", "bullets":["key point 1","key point 2","key point 3"], "key_concept":"the essential rule or formula", "speaker_notes":"Full TTS narration 3-5 sentences from databank.", "youchi_pose":"thinking" }

  c. QUESTION slide (only if question exists):
  { "id":"sX", "type":"question", "title":"Try This", "question_content":"full question [N marks]", "speaker_notes":"Encourage student to attempt. Hint without revealing answer.", "youchi_pose":"waiting" }

  d. ANSWER slide (immediately after question):
  { "id":"sX", "type":"answer", "title":"Solution", "answer_working":["Step 1: ...","Step 2: ..."], "answer_content":"final answer", "speaker_notes":"Walk through each step for TTS.", "youchi_pose":"thumbs_up" }

4. SUMMARY slide (1 slide):
{ "id":"sN", "type":"summary", "title":"Key Takeaways", "bullets":["point 1","point 2","point 3"], "speaker_notes":"Congratulate student. Reinforce 3 most important points.", "youchi_pose":"laughing" }

CRITICAL RULE: The overview bullet text and the section slide title for each sub-subtopic MUST be identical strings so the navigation links work correctly.

RULES:
- Speaker notes full sentences for TTS
- Content ONLY from databank
- Bullets max 12 words
- Question and Answer slides adjacent
- Return ONLY the JSON array`

    const response = await anthropic.messages.create({
      model:      'claude-sonnet-4-20250514',
      max_tokens: 6000,
      system:     systemPrompt,
      messages:   [{ role: 'user', content: userPrompt }],
    })

    const rawText = response.content.find(b => b.type === 'text')?.text ?? ''
    let slides: Slide[]

    try {
      const cleaned = rawText.replace(/```json|```/g, '').trim()
      slides = JSON.parse(cleaned)
      if (!Array.isArray(slides)) throw new Error('Not an array')
    } catch {
      console.error('[ppt/generate] JSON parse failed:', rawText.slice(0, 200))
      return NextResponse.json({ error: 'Failed to parse AI-generated slides' }, { status: 500 })
    }

    const deckTitle = `${subtopic.title} — ${subject.code}`
    const deck = await prisma.ppt_decks.create({
      data: {
        subtopic_id,
        subject_id,
        title:       deckTitle,
        slides:      slides as Prisma.InputJsonValue,
        status:      'draft',
        tutor_notes: tutor_notes ?? null,
      },
    })

    return NextResponse.json({ deck })
  } catch (err) {
    console.error('[ppt/generate]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
