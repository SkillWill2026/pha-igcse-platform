export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { prisma } from '@/lib/prisma'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// Keyword-based topic detection (fast and reliable)
function detectTopicFromText(text: string, topics: { id: string; name: string; ref: string }[]): string | null {
  const t = text.toLowerCase()
  const find = (keyword: string) => topics.find(tp => tp.name.toLowerCase().includes(keyword))?.id ?? null

  // Mensuration: anything about calculating area, volume, perimeter — including real-world contexts
  if (/\b(area|perimeter|volume|surface area|litres?|coverage|paint|fence|fencing|carpet|tile|tiling|cm²|m²|mm²|capacity|cross.section|compound shape)\b/.test(t)) {
    return find('mensuration')
  }
  // Algebra: equations, rearranging, formulae, expressions, sequences
  if (/\b(subject|rearrange|transpose|expand|factorise|simplify|expression|sequence|nth term|function|inequality|quadratic|simultaneous|indices|algebraic)\b/.test(t) || /\bsolve\b/.test(t) && !/\bangle\b/.test(t)) {
    return find('algebra')
  }
  // Probability
  if (/\b(probability|chance|likelihood|tree diagram|random|event|mutually exclusive|independent)\b/.test(t)) {
    return find('probability')
  }
  // Statistics
  if (/\b(mean|median|mode|range|frequency|histogram|pie chart|scatter|average|quartile|percentile|cumulative)\b/.test(t)) {
    return find('statistics')
  }
  // Number
  if (/\b(percentage|fraction|ratio|decimal|standard form|significant figures|rounding|estimate|lcm|hcf|prime|integer|calculator)\b/.test(t)) {
    return find('number')
  }
  // Trigonometry
  if (/\b(sine|cosine|tangent|trigonometry|bearing|elevation|depression|pythagoras|hypotenuse)\b/.test(t) || /\b(sin|cos|tan)\s*[\^(]/.test(t)) {
    return find('trigonometry')
  }
  // Vectors and Transformations
  if (/\b(vector|translation|rotation|reflection|enlargement|transformation|column vector)\b/.test(t)) {
    return find('vector')
  }
  // Coordinate Geometry
  if (/\b(gradient|y-intercept|midpoint|coordinate|straight line graph|distance between points|equation of a line)\b/.test(t)) {
    return find('coordinate')
  }
  // Geometry: only if explicitly about angles, constructions, shape properties — NOT calculations
  if (/\b(angle|polygon|construction|symmetry|congruent|similar|circle theorem|tangent from|chord|arc|sector|cyclic|parallel lines|locus)\b/.test(t)) {
    return find('geometry')
  }

  return null // Fall back to Haiku only if no keywords matched
}

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
    { keywords: ['area', 'perimeter', 'compound', 'shape', 'rectangle', 'triangle', 'circle', 'trapezium'], outcomeContains: ['area', 'perimeter'] },
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

// Keyword-based Mensuration subtopic detection
function detectMensurationSubtopic(text: string, subtopics: { id: string; title: string }[]): string | null {
  const t = text.toLowerCase()
  const find = (keyword: string) => subtopics.find(s => s.title.toLowerCase().includes(keyword))?.id ?? null

  // Volume: 3D shapes
  if (/\b(volume|cylinder|cone|sphere|prism|pyramid|cuboid|cube|hemisphere)\b/.test(t)) return find('volume')
  // Surface area
  if (/\bsurface area\b/.test(t)) return find('surface area') ?? find('volume')
  // Arc/sector (circles)
  if (/\b(arc length|sector area|arc|sector)\b/.test(t) && /\b(area|length|perimeter)\b/.test(t)) return find('arc') ?? find('circle')
  // Compound shapes: area of walls, floors, rooms, fields, painted surfaces
  if (
    /\b(area|compound|wall|floor|field|garden|path|frame|shaded|square)\b/.test(t) ||
    /paint(ing|ed|s)?\b/.test(t) ||
    /\bcovers?\b/.test(t) ||
    /\blitres?\b/.test(t) ||
    /\benough\b/.test(t) ||
    /how\s+much/.test(t) ||
    /m\s*[\^2²]/.test(t) ||
    /cm\s*[\^2²]/.test(t)
  ) {
    return find('compound') ?? find('area') ?? find('mensuration')
  }
  // Perimeter
  if (/\bperimeter\b/.test(t)) return find('perimeter') ?? find('compound')
  // Units of measure ONLY if explicitly about converting units — NOT just because m² appears
  if (/\b(convert|conversion|change.*unit|unit.*change)\b/.test(t)) return find('unit')

  return null
}

export async function classifyQuestion(questionId: string, restrictToTopicId?: string | null, searchAllTopics = false): Promise<void> {
  const question = await prisma.questions.findUnique({
    where:  { id: questionId },
    select: { id: true, content_text: true, topic_id: true },
  })

  if (!question) throw new Error('Question not found')

  const cleanText = (question.content_text ?? '')
    .replace(/\$\$[\s\S]*?\$\$/g, '[math expression]')
    .replace(/\$([^$]+)\$/g, '$1')
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)')
    .replace(/\\[a-zA-Z]+/g, '')
    .trim()

  const topics = await prisma.topics.findMany({
    select:  { id: true, name: true, ref: true },
    orderBy: { ref: 'asc' },
  })

  // STEP 1: Identify topic (only if searchAllTopics and no topic pre-selected)
  let effectiveTopicId: string | null = searchAllTopics ? null : (restrictToTopicId ?? question.topic_id ?? null)

  if (searchAllTopics && topics.length > 0) {
    // Try keyword-based detection first (fast and reliable)
    const keywordTopicId = detectTopicFromText(cleanText, topics)
    if (keywordTopicId) {
      effectiveTopicId = keywordTopicId
    } else {
      // Fall back to Sonnet for higher accuracy if keywords didn't match
      const topicList = topics.map(t => `ID:${t.id} | ${t.ref} – ${t.name}`).join('\n')
      const topicMsg = await anthropic.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 256,
        system: `You are a Cambridge IGCSE Mathematics (0580) curriculum expert. Identify which topic a question belongs to. KEY RULES: Mensuration = CALCULATE area/volume/perimeter. Geometry = angle properties/constructions/shape names. Algebra = equations/formulae/rearranging. Respond ONLY with JSON: {"topic_id": "exact-uuid"}`,
        messages: [{ role: 'user', content: `QUESTION: ${cleanText}\n\nTOPICS:\n${topicList}\n\nReturn ONLY JSON: {"topic_id": "..."}` }]
      })
      const topicText = topicMsg.content[0].type === 'text' ? topicMsg.content[0].text.trim() : '{}'
      try {
        const cleaned = topicText.replace(/```json\s*/gi, '').replace(/```\s*/gi, '').trim()
        const jsonMatch = cleaned.match(/\{[\s\S]*\}/)
        const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : cleaned)
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
        if (parsed.topic_id && uuidRegex.test(parsed.topic_id) && topics.find(t => t.id === parsed.topic_id)) {
          effectiveTopicId = parsed.topic_id
        }
      } catch { /* ignore */ }
    }
  }

  if (!effectiveTopicId) return

  // STEP 2: Identify subtopic + sub-subtopic within the chosen topic
  const [subtopics, allSubSubtopics] = await Promise.all([
    prisma.subtopics.findMany({
      where:   { topic_id: effectiveTopicId },
      select:  { id: true, title: true, topic_id: true, ref: true },
      orderBy: { sort_order: 'asc' },
    }),
    prisma.sub_subtopics.findMany({
      select:  { id: true, outcome: true, subtopic_id: true },
      orderBy: { sort_order: 'asc' },
    }),
  ])

  // Try subtopic keyword detection first for Mensuration
  const isMensuration = topics.find(t => t.id === effectiveTopicId)?.name?.toLowerCase().includes('mensuration')
  if (isMensuration) {
    const keywordSubtopicId = detectMensurationSubtopic(cleanText, subtopics)
    if (keywordSubtopicId) {
      const matchedSub = subtopics.find(s => s.id === keywordSubtopicId)
      if (matchedSub) {
        const subSubsForSubtopic = allSubSubtopics.filter(ss => ss.subtopic_id === keywordSubtopicId)
        const subSubtopicId = ruleBasedSubSubtopic(question.content_text ?? '', subSubsForSubtopic) ??
          (subSubsForSubtopic.length > 0 ? subSubsForSubtopic[0].id : null)

        await prisma.questions.update({
          where: { id: questionId },
          data:  { subtopic_id: keywordSubtopicId, sub_subtopic_id: subSubtopicId, topic_id: effectiveTopicId, updated_at: new Date() },
        })
        return
      }
    }
  }

  const subtopicList = subtopics.map(s => {
    const subSubs = allSubSubtopics.filter(ss => ss.subtopic_id === s.id)
    const subSubLines = subSubs.length > 0
      ? '\n  Sub-subtopics:\n' + subSubs.map(ss => `    - ID:${ss.id} | ${ss.outcome}`).join('\n')
      : '\n  Sub-subtopics: none'
    return `ID:${s.id} | ${s.ref ?? ''} – ${s.title}${subSubLines}`
  }).join('\n')

  const message = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 512,
    system: `You are a Cambridge IGCSE Mathematics (0580) curriculum expert. Given a question, identify the MOST SPECIFIC subtopic and sub-subtopic from the provided lists. You MUST select a sub-subtopic if any are relevant. Respond ONLY with valid JSON: {"subtopic_id": "exact-uuid", "sub_subtopic_id": "exact-uuid-or-null"} STRICT RULES: - subtopic_id MUST be one of the UUIDs listed. Never invent a UUID. - sub_subtopic_id MUST be one of the UUIDs listed under the chosen subtopic, or null if none apply. - Return ONLY the JSON object. No explanation, no markdown.`,
    messages: [{ role: 'user', content: `QUESTION: ${cleanText}\n\nAVAILABLE SUBTOPICS:\n${subtopicList}\n\nWhich subtopic_id and sub_subtopic_id best match this question? Return ONLY JSON: {"subtopic_id": "...", "sub_subtopic_id": "..."}` }]
  })

  const responseText = message.content[0].type === 'text' ? message.content[0].text.trim() : '{}'
  let classification: { subtopic_id?: string; sub_subtopic_id?: string | null } = {}
  try {
    const cleaned = responseText.replace(/```json\s*/gi, '').replace(/```\s*/gi, '').trim()
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/)
    classification = JSON.parse(jsonMatch ? jsonMatch[0] : cleaned)
  } catch { return }

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (!classification.subtopic_id || !uuidRegex.test(classification.subtopic_id)) return

  const matchedSubtopic = subtopics.find(s => s.id === classification.subtopic_id)
  if (!matchedSubtopic) return

  const newTopicId = matchedSubtopic.topic_id
  let subSubtopicId: string | null = null

  if (classification.sub_subtopic_id && uuidRegex.test(classification.sub_subtopic_id)) {
    const exists = allSubSubtopics.some(ss => ss.id === classification.sub_subtopic_id && ss.subtopic_id === matchedSubtopic.id)
    if (exists) subSubtopicId = classification.sub_subtopic_id
  }

  if (!subSubtopicId) {
    const subSubsForSubtopic = allSubSubtopics.filter(ss => ss.subtopic_id === matchedSubtopic.id)
    const fallback = ruleBasedSubSubtopic(question.content_text ?? '', subSubsForSubtopic)
    if (fallback) subSubtopicId = fallback
  }

  await prisma.questions.update({
    where: { id: questionId },
    data:  { subtopic_id: classification.subtopic_id, sub_subtopic_id: subSubtopicId, topic_id: newTopicId, updated_at: new Date() },
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as { question_id?: string; topic_id?: string | null }
    const { question_id, topic_id } = body

    if (!question_id) {
      return NextResponse.json({ error: 'question_id is required' }, { status: 400 })
    }

    // Fetch question BEFORE classification to compare after
    const before = await prisma.questions.findUnique({
      where:  { id: question_id },
      select: { subtopic_id: true, topic_id: true, sub_subtopic_id: true },
    })

    // Run classification
    await classifyQuestion(question_id, topic_id ?? null, topic_id === null || topic_id === undefined ? true : false)

    // Fetch updated question to check if classification changed anything
    const updated = await prisma.questions.findUnique({
      where:  { id: question_id },
      select: { subtopic_id: true, topic_id: true, sub_subtopic_id: true },
    })

    // Suppress unused variable warning
    void before

    // If no subtopic assigned after classification attempt, no match was found
    if (!updated?.subtopic_id) {
      return NextResponse.json(
        { error: 'No matching subtopic found for this question within the selected topic. Try selecting a different topic first.' },
        { status: 422 }
      )
    }

    // Fetch subtopic title for the toast message
    const subtopicData = await prisma.subtopics.findUnique({
      where:  { id: updated.subtopic_id },
      select: { title: true, ref: true },
    })

    // Fetch sub-subtopic title if one was assigned
    let subSubtopicTitle: string | null = null
    if (updated.sub_subtopic_id) {
      const subSubtopicData = await prisma.sub_subtopics.findUnique({
        where:  { id: updated.sub_subtopic_id },
        select: { outcome: true },
      })
      subSubtopicTitle = subSubtopicData?.outcome ?? null
    }

    return NextResponse.json({
      subtopic_id:        updated.subtopic_id,
      topic_id:           updated.topic_id,
      sub_subtopic_id:    updated.sub_subtopic_id ?? null,
      subtopic_title:     subtopicData ? `${subtopicData.ref} – ${subtopicData.title}` : updated.subtopic_id,
      sub_subtopic_title: subSubtopicTitle,
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Classification failed' },
      { status: 500 }
    )
  }
}
