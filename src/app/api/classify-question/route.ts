import { createAdminClient } from '@/lib/supabase'
import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(request: Request) {
  try {
    const { question_id } = await request.json()
    if (!question_id) {
      return NextResponse.json({ error: 'question_id is required' }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Fetch question
    const { data: question, error: qError } = await supabase
      .from('questions')
      .select('id, content_text, topic_id')
      .eq('id', question_id)
      .single()

    if (qError || !question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 })
    }

    // Fetch all subtopics with their topics
    const [subtopicsRes, subSubtopicsRes, topicsRes] = await Promise.all([
      supabase.from('subtopics').select('id, title, topic_id').order('sort_order'),
      supabase.from('sub_subtopics').select('id, outcome, subtopic_id').order('sort_order'),
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
Given a question, identify the most appropriate subtopic and sub-subtopic from the provided lists.
Respond ONLY with valid JSON in this exact format:
{"subtopic_id": "uuid-here", "sub_subtopic_id": "uuid-or-null"}
No explanation, no markdown, just the JSON object.`,
      messages: [{
        role: 'user',
        content: `QUESTION: ${question.content_text}

AVAILABLE SUBTOPICS:
${subtopicList}

AVAILABLE SUB-SUBTOPICS FOR REFERENCE:
${subSubtopics
  .filter(s => subtopics.find(st => st.id === s.subtopic_id))
  .map(s => {
    const parentSubtopic = subtopics.find(st => st.id === s.subtopic_id)
    return `ID:${s.id} | subtopic_id:${s.subtopic_id} | ${parentSubtopic?.title ?? ''} → ${s.outcome}`
  })
  .join('\n')}

Which subtopic_id and sub_subtopic_id best matches this question?
Return ONLY JSON: {"subtopic_id": "...", "sub_subtopic_id": "..." or null}`
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
      return NextResponse.json({
        error: 'Classification parsing failed',
        raw: responseText
      }, { status: 500 })
    }

    if (!classification.subtopic_id) {
      return NextResponse.json({ error: 'No subtopic identified' }, { status: 500 })
    }

    // Find the topic_id for the matched subtopic
    const matchedSubtopic = subtopics.find(s => s.id === classification.subtopic_id)
    const newTopicId = matchedSubtopic?.topic_id ?? question.topic_id

    // Verify sub_subtopic belongs to the matched subtopic
    let validSubSubtopicId: string | null = null
    if (classification.sub_subtopic_id) {
      const matchedSubSub = subSubtopics.find(
        s => s.id === classification.sub_subtopic_id &&
             s.subtopic_id === classification.subtopic_id
      )
      validSubSubtopicId = matchedSubSub?.id ?? null
    }

    // Update the question
    const updates: Record<string, unknown> = {
      subtopic_id: classification.subtopic_id,
      topic_id: newTopicId,
      sub_subtopic_id: validSubSubtopicId,
      updated_at: new Date().toISOString(),
    }

    const { data: updated, error: updateError } = await supabase
      .from('questions')
      .update(updates)
      .eq('id', question_id)
      .select()
      .single()

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      subtopic_id: classification.subtopic_id,
      sub_subtopic_id: validSubSubtopicId,
      topic_id: newTopicId,
      subtopic_title: matchedSubtopic?.title ?? null,
    })

  } catch (error) {
    console.error('[classify-question] Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Classification failed' },
      { status: 500 }
    )
  }
}
