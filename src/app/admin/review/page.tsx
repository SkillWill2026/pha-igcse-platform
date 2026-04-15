import { unstable_noStore as noStore } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { createAdminClient } from '@/lib/supabase'
import type { QuestionWithRelations, AnswerRow } from '@/types/database'
import { ReviewQueueClient } from './review-queue-client'

export const dynamic = 'force-dynamic'

const PAGE_SIZE = 30

interface DraftQuestion extends QuestionWithRelations {
  answer: AnswerRow | null
}

interface PageProps {
  searchParams: { subject?: string; page?: string; questionId?: string }
}

export default async function ReviewPage({ searchParams }: PageProps) {
  noStore()
  const subjectCode = searchParams.subject ?? '0580'
  const page = Math.max(0, parseInt(searchParams.page ?? '0'))
  const questionId = searchParams.questionId ?? null

  let drafts: DraftQuestion[] = []
  let totalCount = 0
  let error: string | null = null

  try {
    const supabase = createAdminClient()

    // If a specific questionId is provided, load just that question
    if (questionId) {
      const question = await prisma.questions.findUnique({
        where: { id: questionId },
      })

      if (question) {
        const [boardRes, topicRes, subtopicRes, sstRes] = await Promise.all([
          supabase.from('exam_boards').select('id, name'),
          supabase.from('topics').select('id, ref, name'),
          supabase.from('subtopics').select('id, ref, title, topic_id'),
          supabase.from('sub_subtopics').select('id, subtopic_id, ext_num, outcome, tier'),
        ])

        const answer = await prisma.answers.findFirst({
          where: { question_id: question.id },
        })

        const boardMap = new Map((boardRes.data ?? []).map((b) => [b.id, b]))
        const topicMap = new Map((topicRes.data ?? []).map((t) => [t.id, t]))
        const subtopicMap = new Map((subtopicRes.data ?? []).map((s) => [s.id, { id: s.id, ref: s.ref, name: s.title }]))
        const sstMap = new Map((sstRes.data ?? []).map((s) => [s.id, s]))

        drafts = [{
          ...question,
          exam_boards: boardMap.get(question.exam_board_id ?? '') ?? null,
          topics: topicMap.get(question.topic_id ?? '') ?? null,
          subtopics: subtopicMap.get(question.subtopic_id ?? '') ?? null,
          sub_subtopics: sstMap.get(question.sub_subtopic_id ?? '') ?? null,
          answer_serial: null,
          answer_status: null,
          answers: [],
          question_images: [],
          answer: answer ?? null,
        }] as unknown as DraftQuestion[]

        totalCount = 1
      }
    } else {
      // Normal draft queue flow
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

      const whereClause = {
        status: 'draft',
        ...(topicIds.length > 0
          ? { OR: [{ topic_id: { in: topicIds } }, { topic_id: null }] }
          : { topic_id: null }),
      }

      const [count, questions] = await Promise.all([
        prisma.questions.count({ where: whereClause }),
        prisma.questions.findMany({
          where: whereClause,
          orderBy: [
            { batch_id: 'desc' },
            { batch_position: 'asc' },
            { created_at: 'asc' },
          ],
          skip: page * PAGE_SIZE,
          take: PAGE_SIZE,
        }),
      ])

      totalCount = count

      if (questions.length > 0) {
        const [boardRes, topicRes, subtopicRes, sstRes] = await Promise.all([
          supabase.from('exam_boards').select('id, name'),
          supabase.from('topics').select('id, ref, name'),
          supabase.from('subtopics').select('id, ref, title, topic_id'),
          supabase.from('sub_subtopics').select('id, subtopic_id, ext_num, outcome, tier'),
        ])

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
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
