import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { createAnthropicClient } from '@/lib/anthropic'

export const runtime = 'nodejs'
export const maxDuration = 300

const SYSTEM_PROMPT = `You are an IGCSE Mathematics content classifier.
You will be given a question text and a list of subtopics with their sub-subtopics.
Your job is to identify the most specific classification for this question.
Respond with ONLY a JSON object in this exact format: {"subtopic_id": "uuid-here", "sub_subtopic_id": "uuid-here-or-null"}
If you cannot confidently assign a subtopic, use null for both.
If you can assign a subtopic but not a sub-subtopic, use null for sub_subtopic_id only.
Do not explain. Do not add any other text. JSON only.`

function isValidUuid(s: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s)
}

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

export async function POST() {
  try {
    const supabase = createAdminClient()
    const anthropic = createAnthropicClient()

    // 1. Fetch questions where subtopic_id IS NULL
    const { data: questionsRaw, error: qErr } = await supabase
      .from('questions')
      .select('id, content_text')
      .is('subtopic_id', null)

    if (qErr) {
      console.error('[assign-subtopics] questions fetch error:', qErr.message)
      return NextResponse.json({ error: qErr.message }, { status: 500 })
    }

    const questions = questionsRaw ?? []

    // 2. Fetch all subtopics
    const { data: subtopicsRaw, error: sErr } = await supabase
      .from('subtopics')
      .select('id, ref, title, topic_id')

    if (sErr) {
      console.error('[assign-subtopics] subtopics fetch error:', sErr.message)
      return NextResponse.json({ error: sErr.message }, { status: 500 })
    }

    const subtopics = subtopicsRaw ?? []

    // 3. Fetch all topics
    const { data: topicsRaw, error: tErr } = await supabase
      .from('topics')
      .select('id, ref, name')

    if (tErr) {
      console.error('[assign-subtopics] topics fetch error:', tErr.message)
      return NextResponse.json({ error: tErr.message }, { status: 500 })
    }

    const _topics = topicsRaw ?? []
    void _topics

    // 4. Fetch all sub_subtopics
    const { data: subSubtopicsRaw, error: sstErr } = await supabase
      .from('sub_subtopics')
      .select('id, ref, title, subtopic_id')

    if (sstErr) {
      console.error('[assign-subtopics] sub_subtopics fetch error:', sstErr.message)
      // Non-fatal — continue without sub-subtopic assignment
    }

    const subSubtopics = subSubtopicsRaw ?? []
    const subSubtopicIds = new Set(subSubtopics.map((s) => s.id))

    // Build a map from subtopic_id → sub_subtopics[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sstBySubtopic = new Map<string, any[]>()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const ss of subSubtopics as any[]) {
      if (!sstBySubtopic.has(ss.subtopic_id)) sstBySubtopic.set(ss.subtopic_id, [])
      sstBySubtopic.get(ss.subtopic_id)!.push(ss)
    }

    const subtopicIds = new Set(subtopics.map((s) => s.id))

    // Build the subtopic list for AI context (with nested sub-subtopics)
    const subtopicList = subtopics
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((s: any) => {
        const sstList = sstBySubtopic.get(s.id) ?? []
        const sstLines = sstList
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((ss: any) => `  → sub-subtopic: ${ss.id} | ${ss.ref} | ${ss.title ?? ''}`)
          .join('\n')
        return `Subtopic: ${s.id} | ${s.ref} | ${s.title ?? ''}` + (sstLines ? '\n' + sstLines : '')
      })
      .join('\n')

    let assigned = 0
    let subAssigned = 0
    let skipped = 0
    let errors = 0

    const BATCH_SIZE = 5

    for (let i = 0; i < questions.length; i += BATCH_SIZE) {
      const batch = questions.slice(i, i + BATCH_SIZE)

      for (const question of batch) {
        try {
          const userMessage =
            `Question: ${question.content_text}\n\n` +
            `Available subtopics (with sub-subtopics):\n${subtopicList}\n\n` +
            `Which subtopic (and optionally sub-subtopic) does this question belong to?`

          const aiResponse = await anthropic.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 256,
            system: SYSTEM_PROMPT,
            messages: [{ role: 'user', content: userMessage }],
          })

          const raw =
            aiResponse.content[0].type === 'text'
              ? aiResponse.content[0].text.trim()
              : ''

          const jsonStr = raw
            .replace(/^```(?:json)?\s*/i, '')
            .replace(/\s*```$/i, '')
            .trim()

          let parsed: { subtopic_id: string | null; sub_subtopic_id?: string | null }
          try {
            parsed = JSON.parse(jsonStr) as { subtopic_id: string | null; sub_subtopic_id?: string | null }
          } catch {
            console.error('[assign-subtopics] JSON parse failed for question', question.id, '— raw:', raw.slice(0, 200))
            errors++
            continue
          }

          const subtopicId = parsed.subtopic_id
          const subSubtopicId = parsed.sub_subtopic_id ?? null

          if (
            subtopicId !== null &&
            typeof subtopicId === 'string' &&
            isValidUuid(subtopicId) &&
            subtopicIds.has(subtopicId)
          ) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const updatePayload: any = { subtopic_id: subtopicId }

            const validSubSst =
              subSubtopicId !== null &&
              typeof subSubtopicId === 'string' &&
              isValidUuid(subSubtopicId) &&
              subSubtopicIds.has(subSubtopicId)

            if (validSubSst) {
              updatePayload.sub_subtopic_id = subSubtopicId
            }

            const { error: updateErr } = await supabase
              .from('questions')
              .update(updatePayload)
              .eq('id', question.id)

            if (updateErr) {
              console.error('[assign-subtopics] update error for question', question.id, ':', updateErr.message)
              errors++
              continue
            }

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const matchedSubtopic = subtopics.find((s: any) => s.id === subtopicId) as any
            console.log(
              '[assign-subtopics] Assigned question',
              question.id,
              '→ subtopic',
              matchedSubtopic?.ref ?? subtopicId,
              validSubSst ? `→ sub-subtopic ${subSubtopicId}` : '',
            )
            assigned++
            if (validSubSst) subAssigned++
          } else {
            console.log(
              '[assign-subtopics] Skipped question',
              question.id,
              '— content preview:',
              question.content_text.slice(0, 120),
            )
            skipped++
          }
        } catch (err) {
          console.error('[assign-subtopics] error processing question', question.id, ':', err)
          errors++
        }
      }

      if (i + BATCH_SIZE < questions.length) {
        await sleep(1000)
      }
    }

    const total = questions.length
    console.log(`[assign-subtopics] Done — total: ${total}, assigned: ${assigned}, sub_assigned: ${subAssigned}, skipped: ${skipped}, errors: ${errors}`)

    return NextResponse.json({ total, assigned, sub_assigned: subAssigned, skipped, errors })
  } catch (err) {
    console.error('[POST /api/admin/assign-subtopics]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
