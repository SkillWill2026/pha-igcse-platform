export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const maxDuration = 60

import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { embedTexts } from '@/lib/voyage'
import type { Slide } from '@/types/ppt'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(request: NextRequest) {
  try {
    const { subtopic_id, subject_id, tutor_notes } = await request.json()

    if (!subtopic_id || !subject_id) {
      return NextResponse.json({ error: 'subtopic_id and subject_id are required' }, { status: 400 })
    }

    const supabase = createAdminClient()

    // 1. Fetch subtopic + topic info
    const [subtopicRes, subjectRes] = await Promise.all([
      supabase.from('subtopics').select('id, ref, title, topic_id').eq('id', subtopic_id).single(),
      supabase.from('subjects').select('id, name, code').eq('id', subject_id).single(),
    ])

    if (!subtopicRes.data || !subjectRes.data) {
      return NextResponse.json({ error: 'Subtopic or subject not found' }, { status: 404 })
    }

    const subtopic = subtopicRes.data
    const subject = subjectRes.data

    const topicRes = subtopic.topic_id
      ? await supabase.from('topics').select('name, ref').eq('id', subtopic.topic_id).single()
      : { data: null }
    const topic = topicRes.data

    // 2. Fetch approved questions for this subtopic
    const { data: questions } = await supabase
      .from('questions')
      .select('id, content_text, marks, difficulty')
      .eq('subtopic_id', subtopic_id)
      .eq('status', 'approved')
      .order('difficulty', { ascending: true })
      .limit(6)

    // 3. RAG search — embed subtopic title and search databank
    const searchQuery = `${subject.name} ${topic?.name ?? ''} ${subtopic.title}`
    const [queryEmbedding] = await embedTexts([searchQuery])

    const { data: chunks } = await supabase.rpc('search_databank_chunks', {
      query_embedding: queryEmbedding,
      match_count: 8,
      similarity_threshold: 0.25,
    })

    // 4. Check if databank has relevant content
    if (!chunks || chunks.length === 0) {
      return NextResponse.json(
        { error: 'Data not available in Databank', code: 'NO_DATABANK_DATA' },
        { status: 422 }
      )
    }

    const ragContext = chunks.map((c: { content: string }, i: number) => `[Source ${i + 1}]\n${c.content}`).join('\n\n')
    const questionsContext = questions && questions.length > 0
      ? questions.map((q, i) => `Q${i + 1} (${q.marks} mark${q.marks !== 1 ? 's' : ''}): ${q.content_text}`).join('\n')
      : 'No approved questions available yet — create concept slides only.'

    const tutorNotesSection = tutor_notes
      ? `\n\nTUTOR FEEDBACK TO INCORPORATE:\n${tutor_notes}`
      : ''

    // 5. Generate slides with Claude Sonnet
    const systemPrompt = `You are an expert IGCSE ${subject.name} teacher creating clear, structured lesson slides for students.
You MUST generate content ONLY from the provided databank sources. Do not invent content not present in the sources.
Respond with a valid JSON array of slide objects only. No markdown, no explanation, no backticks.`

    const userPrompt = `Create a complete lesson slide deck for this subtopic:

SUBJECT: ${subject.name} (${subject.code})
TOPIC: ${topic?.name ?? 'Unknown'}
SUBTOPIC: ${subtopic.title} (${subtopic.ref ?? ''})

DATABANK SOURCES (use ONLY this content):
${ragContext}

APPROVED EXAM QUESTIONS TO USE AS EXAMPLES:
${questionsContext}
${tutorNotesSection}

Generate slides in this EXACT JSON structure — an array of slide objects:

Slide types and their required fields:
1. TITLE slide (1 slide): { "id":"s1", "type":"title", "title":"subtopic name", "subtitle":"subject code + topic ref", "speaker_notes":"warm welcome, overview of what student will learn", "youchi_pose":"excited" }
2. CONCEPT slides (1-2 slides): { "id":"s2", "type":"concept", "title":"clear heading", "bullets":["point 1","point 2","point 3"], "key_concept":"one essential rule or formula to remember", "speaker_notes":"detailed teacher explanation of each bullet for TTS narration, 3-5 sentences", "youchi_pose":"thinking" }
3. QUESTION slide (one per approved question, max 4): { "id":"s3", "type":"question", "title":"Try This", "question_content":"full question text with marks", "speaker_notes":"encourage student to pause and attempt, hint without giving away answer", "youchi_pose":"waiting" }
4. ANSWER slide (immediately after each question): { "id":"s4", "type":"answer", "title":"Solution", "answer_working":["Step 1: ...","Step 2: ..."], "answer_content":"final answer", "speaker_notes":"walk through each step clearly for TTS narration", "youchi_pose":"thumbs_up" }
5. SUMMARY slide (1 slide): { "id":"sN", "type":"summary", "title":"Key Takeaways", "bullets":["takeaway 1","takeaway 2","takeaway 3"], "speaker_notes":"congratulate student, reinforce the 3 most important points", "youchi_pose":"laughing" }

RULES:
- Speaker notes must be full sentences suitable for text-to-speech narration
- Content must come ONLY from databank sources
- Keep bullets concise (max 12 words each)
- Question/answer pairs must be adjacent slides
- Return ONLY the JSON array, nothing else`

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
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

    // 6. Save to ppt_decks
    const deckTitle = `${subtopic.title} — ${subject.code}`
    const { data: deck, error: insertErr } = await supabase
      .from('ppt_decks')
      .insert({
        subtopic_id,
        subject_id,
        title: deckTitle,
        slides,
        status: 'draft',
        tutor_notes: tutor_notes ?? null,
      })
      .select()
      .single()

    if (insertErr) {
      return NextResponse.json({ error: insertErr.message }, { status: 500 })
    }

    return NextResponse.json({ deck })
  } catch (err) {
    console.error('[ppt/generate]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
