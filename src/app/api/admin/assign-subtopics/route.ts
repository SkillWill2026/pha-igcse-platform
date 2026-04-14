export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
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
    const anthropic = createAnthropicClient()

    // 1. Fetch questions where subtopic_id IS NULL
    const questions = await prisma.questions.findMany({
      where: { subtopic_id: null },
      select: { id: true, content_text: true },
    })

    // 2. Fetch all subtopics
    const subtopics = await prisma.subtopics.findMany({
      select: { id: true, ref: true, title: true, topic_id: true },
    })

    // 3. Fetch all topics (used only for logging context)
    const _topics = await prisma.topics.findMany({ select: { id: true, ref: true, name: true } })
    void _topics

    // 4. Fetch all sub_subtopics (non-fatal if missing)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let subSubtopics: any[] = []
    try {
      subSubtopics = await prisma.sub_subtopics.findMany({
        select: { id: true, subtopic_id: true, ext_num: true, outcome: true, sort_order: true },
        orderBy: { sort_order: 'asc' },
      })
    } catch (sstErr) {
      console.error('[assign-subtopics] sub_subtopics fetch error:', sstErr)
      // Non-fatal — continue without sub-subtopic assignment
    }

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
          .map((ss: any) => `  → objective ${ss.ext_num}: ${ss.id} | ${ss.outcome ?? ''}`)
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
            const validSubSst =
              subSubtopicId !== null &&
              typeof subSubtopicId === 'string' &&
              isValidUuid(subSubtopicId) &&
              subSubtopicIds.has(subSubtopicId)

            await prisma.questions.update({
              where: { id: question.id },
              data: {
                subtopic_id: subtopicId,
                ...(validSubSst && { sub_subtopic_id: subSubtopicId }),
              },
            })

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
              question.content_text?.slice(0, 120),
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
