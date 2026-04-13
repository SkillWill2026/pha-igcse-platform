export const dynamic = 'force-dynamic'

import { createAdminClient } from '@/lib/supabase'
import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// Rule-based fallback matcher for sub-subtopic when Claude returns null
function ruleBasedSubSubtopic(questionText: string, subSubtopics: {id: string, outcome: string}[]): string | null {
  const text = questionText.toLowerCase()

  const rules = [
    { keywords: ['draw', 'plot', 'sketch', 'construct', 'grid', 'axes'], outcomeContains: ['drawing', 'draw', 'plot', 'sketch', 'construct'] },
    { keywords: ['solve', 'solution', 'graphically', 'intersection'], outcomeContains: ['solving', 'graphically'] },
    { keywords: ['table of values', 'complete the table', 'fill in'], outcomeContains: ['drawing', 'table'] },
    { keywords: ['reciprocal', '1/x'], outcomeContains: ['reciprocal'] },
    { keywords: ['exponential', 'growth', 'decay'], outcomeContains: ['exponential'] },
    { keywords: ['quadratic', 'x^2', 'x²', 'parabola'], outcomeContains: ['quadratic'] },
    { keywords: ['linear', 'straight line', 'gradient', 'y=mx'], outcomeContains: ['linear'] },
  ]

  for (const rule of rules) {
    const questionMatches = rule.keywords.some(kw => text.includes(kw))
    if (questionMatches) {
      const match = subSubtopics.find(ss =>
        rule.outcomeContains.some(oc => ss.outcome.toLowerCase().includes(oc))
      )
      if (match) return match.id
    }
  }
  return null
}

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

  // Fetch all subtopics with their topics, and ALL sub-subtopics
  const [subtopicsRes, allSubSubtopicsRes, topicsRes] = await Promise.all([
    supabase.from('subtopics').select('id, title, topic_id').eq('topic_id', effectiveTopicId).order('sort_order'),
    supabase.from('sub_subtopics').select('id, outcome, subtopic_id').order('sort_order'),
    supabase.from('topics').select('id, name, ref'),
  ])

  const subtopics = subtopicsRes.data ?? []
  const allSubSubtopics = allSubSubtopicsRes.data ?? []
  const topicsMap = Object.fromEntries(
    (topicsRes.data ?? []).map(t => [t.id, t])
  )

  // Build classification prompt with subtopics and their UUIDs
  const subtopicList = subtopics
    .map(s => {
      const topic = topicsMap[s.topic_id]
      const subSubs = allSubSubtopics.filter(ss => ss.subtopic_id === s.id)
      const subSubLines = subSubs.length > 0
        ? '\n  Sub-subtopics:\n' + subSubs.map(ss => `    - ID:${ss.id} | ${ss.outcome}`).join('\n')
        : '\n  Sub-subtopics: none'
      return `ID:${s.id} | ${topic?.ref ?? ''} – ${s.title}${subSubLines}`
    })
    .join('\n')

  const message = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 512,
    system: `You are a Cambridge IGCSE Mathematics (0580) curriculum expert.
Given a question, identify the MOST SPECIFIC subtopic and sub-subtopic from the provided lists.
You MUST select a sub-subtopic if any of the listed ones are relevant — do not return null unless truly none apply.
Respond ONLY with valid JSON: {"subtopic_id": "exact-uuid", "sub_subtopic_id": "exact-uuid-or-null"}
STRICT RULES:
- subtopic_id MUST be one of the UUIDs from AVAILABLE SUBTOPICS. Never invent a UUID.
- sub_subtopic_id MUST be one of the UUIDs listed under the chosen subtopic, or null ONLY if none are relevant.
- When in doubt between sub-subtopics, choose the most specific match.
- Return ONLY the JSON object. No explanation, no markdown, no code blocks.`,
    messages: [{
      role: 'user',
      content: `QUESTION: ${question.content_text}

AVAILABLE SUBTOPICS (topic: ${effectiveTopicId}):
${subtopicList}

Which subtopic_id best matches this question?
Select the most specific sub-subtopic that applies. If the question involves drawing, plotting, or constructing a specific type of graph, select the corresponding drawing sub-subtopic.
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
    // AI couldn't find a match — return gracefully
    return
  }

  // Validate that subtopic_id is a proper UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (!classification.subtopic_id || !uuidRegex.test(classification.subtopic_id)) {
    return
  }

  // Validate that subtopic_id exists in the fetched subtopics
  const matchedSubtopic = subtopics.find(s => s.id === classification.subtopic_id)
  if (!matchedSubtopic) {
    return
  }

  const newTopicId = matchedSubtopic.topic_id

  // Validate and use sub_subtopic_id if provided
  let subSubtopicId: string | null = null
  if (classification.sub_subtopic_id) {
    // Validate that sub_subtopic_id is a proper UUID format
    if (!uuidRegex.test(classification.sub_subtopic_id)) {
      // Set to null instead of failing
      subSubtopicId = null
    } else {
      // Validate that sub_subtopic_id exists in the fetched sub-subtopics for this subtopic
      const subSubtopicExists = allSubSubtopics.some(
        ss => ss.id === classification.sub_subtopic_id && ss.subtopic_id === matchedSubtopic.id
      )
      if (!subSubtopicExists) {
        // Set to null instead of failing
        subSubtopicId = null
      } else {
        subSubtopicId = classification.sub_subtopic_id
      }
    }
  }

  // Apply rule-based fallback if Claude returned null
  if (!subSubtopicId && matchedSubtopic) {
    const subSubsForSubtopic = allSubSubtopics.filter(ss => ss.subtopic_id === matchedSubtopic.id)
    const fallback = ruleBasedSubSubtopic(question.content_text, subSubsForSubtopic)
    if (fallback) {
      subSubtopicId = fallback
    }
  }

  // Update the question
  const updates: Record<string, unknown> = {
    subtopic_id: classification.subtopic_id,
    sub_subtopic_id: subSubtopicId,
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
      .select('subtopic_id, topic_id, sub_subtopic_id')
      .eq('id', question_id)
      .single()

    // Run classification
    await classifyQuestion(question_id, topic_id ?? null)

    // Fetch updated question to check if classification changed anything
    const { data: updated } = await supabase
      .from('questions')
      .select('subtopic_id, topic_id, sub_subtopic_id')
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

    // Fetch sub-subtopic title if one was assigned
    let subSubtopicTitle: string | null = null
    if (updated.sub_subtopic_id) {
      const { data: subSubtopicData } = await supabase
        .from('sub_subtopics')
        .select('outcome')
        .eq('id', updated.sub_subtopic_id)
        .single()
      subSubtopicTitle = subSubtopicData?.outcome ?? null
    }

    return NextResponse.json({
      subtopic_id: updated.subtopic_id,
      topic_id: updated.topic_id,
      sub_subtopic_id: updated.sub_subtopic_id ?? null,
      subtopic_title: subtopicData ? `${subtopicData.ref} – ${subtopicData.title}` : updated.subtopic_id,
      sub_subtopic_title: subSubtopicTitle,
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Classification failed' },
      { status: 500 }
    )
  }
}
