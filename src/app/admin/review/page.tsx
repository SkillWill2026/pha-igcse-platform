import { unstable_noStore as noStore } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { createAdminClient } from '@/lib/supabase'
import type { QuestionWithRelations, AnswerRow } from '@/types/database'
import { ReviewQueueClient } from './review-queue-client'

export const dynamic = 'force-dynamic'

interface DraftQuestion extends QuestionWithRelations {
  answer: AnswerRow | null
}

interface PageProps {
  searchParams: { subject?: string }
}

export default async function ReviewPage({ searchParams }: PageProps) {
  noStore()
  const subjectCode = searchParams.subject ?? '0580'

  let drafts: DraftQuestion[] = []
  let error: string | null = null

  try {
    const supabase = createAdminClient()

    // Resolve subject code → subject id → topic IDs (still from Supabase for curriculum)
    const subjectRes = await supabase
      .from('subjects')
      .select('id')
      .eq('code', subjectCode)
      .single()

    const subjectId = subjectRes.data?.id ?? null

    let topicIds: string[] = []
    if (subjectId) {
      const { data: topicsData } = await supabase
        .from('topics')
        .select('id')
        .eq('subject_id', subjectId)
      topicIds = (topicsData ?? []).map((t) => t.id)
    }

    // Fetch draft questions from Azure via Prisma
    const questions = await prisma.questions.findMany({
      where: {
        status: 'draft',
        ...(topicIds.length > 0
          ? { OR: [{ topic_id: { in: topicIds } }, { topic_id: null }] }
          : { topic_id: null }),
      },
      orderBy: [
        { batch_id: 'desc' },
        { batch_position: 'asc' },
        { created_at: 'asc' },
      ],
    })

    if (questions.length > 0) {
      // Fetch related data from Supabase (curriculum stays there)
      const [boardRes, topicRes, subtopicRes, sstRes] = await Promise.all([
        supabase.from('exam_boards').select('id, name'),
        supabase.from('topics').select('id, ref, name'),
        supabase.from('subtopics').select('id, ref, title, topic_id'),
        supabase.from('sub_subtopics').select('id, subtopic_id, ext_num, outcome, tier'),
      ])

      // Fetch answers from Azure
      const questionIds = questions.map((q) => q.id)
      const answers = await prisma.answers.findMany({
        where: { question_id: { in: questionIds } },
      })

      const boardMap = new Map((boardRes.data ?? []).map((b) => [b.id, b]))
      const topicMap = new Map((topicRes.data ?? []).map((t) => [t.id, t]))
      const subtopicMap = new Map((subtopicRes.data ?? []).map((s) => [s.id, { id: s.id, ref: s.ref, name: s.title }]))
      const sstMap = new Map((sstRes.data ?? []).map((s) => [s.id, s]))
      const answerMap = new Map(answers.map((a) => [a.question_id, a]))

      drafts = questions.map((q) => ({
        ...q,
        exam_boards: boardMap.get(q.exam_board_id ?? '') ?? null,
        topics: topicMap.get(q.topic_id ?? '') ?? null,
        subtopics: subtopicMap.get(q.subtopic_id ?? '') ?? null,
        sub_subtopics: sstMap.get(q.sub_subtopic_id ?? '') ?? null,
        answer_serial: null,
        answer_status: null,
        answers: [],
        question_images: [],
        answer: answerMap.get(q.id) ?? null,
      })) as unknown as DraftQuestion[]
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[ReviewPage] unexpected error:', err)
    error = `Unexpected error: ${msg}`
  }

  return <ReviewQueueClient key={subjectCode} drafts={drafts} initialError={error} />
}
