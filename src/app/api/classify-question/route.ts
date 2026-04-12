export const dynamic = 'force-dynamic'

import { createAdminClient } from '@/lib/supabase'
import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function classifyQuestion(questionId: string, restrictToTopicId?: string | null): Promise<void> {
  const supabase = createAdminClient()

  // Fetch question
  const { data: question, error: qError } = await supabase
    .from('questions')
    .select('id, content_text, topic_id')
    .eq('id', questionId)
    .single()

  if (qError || !question) {
    throw new Error('Question not found')
  }

  // Skip classification for MIX topic — tutor assigns manually
  const effectiveTopicId = restrictToTopicId ?? question.topic_id
  if (!effectiveTopicId) return

  // Fetch all subtopics with their topics
  const [subtopicsRes, subSubtopicsRes, topicsRes] = await Promise.all([
    supabase.from('subtopics').select('id, title, topic_id').eq('topic_id', effectiveTopicId).order('sort_order'),
    Promise.resolve({ data: [] }),
    supabase.from('topics').select('id, name, ref'),
  ])

  const subtopics = subtopicsRes.data ?? []
  const subSubtopics = subSubtopicsRes.data ?? []
  const topicsMap = Object.fromEntries(
    (topicsRes.data ?? []).map(t => [t.id, t])
  )

  // Build classification prompt
  const subtopicList = subtopics
    .map(s => {
      const topic = topicsMap[s.topic_id]
      return `ID:${s.id} | ${topic?.ref ?? ''} ${topic?.name ?? ''} — ${s.title}`
    })
    .join('\n')

  const message = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 256,
    system: `You are a Cambridge IGCSE Mathematics (0580) curriculum expert.
Given a question, identify the most appropriate subtopic from the provided list.
Respond ONLY with valid JSON in this exact format:
{"subtopic_id": "uuid-here"}
No explanation, no markdown, just the JSON object.`,
    messages: [{
      role: 'user',
      content: `QUESTION: ${question.content_text}

AVAILABLE SUBTOPICS (topic: ${effectiveTopicId}):
${subtopicList}

Which subtopic_id best matches this question?
Return ONLY JSON: {"subtopic_id": "..."}`
    }]
  })

  const responseText = message.content[0].type === 'text'
    ? message.content[0].text.trim()
    : '{}'

  let classification: { subtopic_id?: string; sub_subtopic_id?: string | null }
  try {
    // Strip markdown code fences if Claude wrapped the JSON
    const cleaned = responseText
      .replace(/```json\s*/gi, '')
      .replace(/```\s*/gi, '')
      .trim()
    // Extract JSON object if there's surrounding text
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/)
    const jsonStr = jsonMatch ? jsonMatch[0] : cleaned
    classification = JSON.parse(jsonStr)
  } catch {
    // AI couldn't find a match — return gracefully
    return
  }

  // Validate that subtopic_id is a proper UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (!classification.subtopic_id || !uuidRegex.test(classification.subtopic_id)) {
    return
  }

  // Find the topic_id for the matched subtopic
  const matchedSubtopic = subtopics.find(s => s.id === classification.subtopic_id)
  const newTopicId = matchedSubtopic?.topic_id ?? question.topic_id

  // Update the question
  const updates: Record<string, unknown> = {
    subtopic_id: classification.subtopic_id,
    topic_id: newTopicId,
    updated_at: new Date().toISOString(),
  }

  const { data: updated, error: updateError } = await supabase
    .from('questions')
    .update(updates)
    .eq('id', questionId)
    .select()
    .single()

  if (updateError) {
    throw new Error(updateError.message)
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as { question_id?: string; topic_id?: string | null }
    const { question_id, topic_id } = body

    if (!question_id) {
      return NextResponse.json({ error: 'question_id is required' }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Fetch question BEFORE classification to compare after
    const { data: before } = await supabase
      .from('questions')
      .select('subtopic_id, topic_id')
      .eq('id', question_id)
      .single()

    // Run classification
    await classifyQuestion(question_id, topic_id ?? null)

    // Fetch updated question to check if classification changed anything
    const { data: updated } = await supabase
      .from('questions')
      .select('subtopic_id, topic_id')
      .eq('id', question_id)
      .single()

    // If no subtopic assigned after classification attempt, no match was found
    if (!updated?.subtopic_id) {
      return NextResponse.json(
        { error: 'No matching subtopic found for this question within the selected topic. Try selecting a different topic first.' },
        { status: 422 }
      )
    }

    // Fetch subtopic title for the toast message
    const { data: subtopicData } = await supabase
      .from('subtopics')
      .select('title, ref')
      .eq('id', updated.subtopic_id)
      .single()

    return NextResponse.json({
      subtopic_id: updated.subtopic_id,
      topic_id: updated.topic_id,
      sub_subtopic_id: null,
      subtopic_title: subtopicData ? `${subtopicData.ref} – ${subtopicData.title}` : updated.subtopic_id,
    })
  } catch (error) {
    console.error('[classify-question] Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Classification failed' },
      { status: 500 }
    )
  }
}
