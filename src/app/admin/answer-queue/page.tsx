import { unstable_noStore } from 'next/cache'
import { createAdminClient } from '@/lib/supabase'
import { AnswerQueueClient } from '@/components/admin/AnswerQueueClient'

export const dynamic = 'force-dynamic'

export default async function AnswerQueuePage() {
  unstable_noStore()

  let answers: unknown[] = []
  let error: string | null = null

  try {
    const supabase = createAdminClient()

    const { data, error: fetchError } = await supabase
      .from('answers')
      .select(`
        id,
        serial,
        content,
        confidence_score,
        status,
        created_at,
        question_id,
        questions (
          id,
          serial,
          content,
          status,
          topics ( name, ref ),
          subtopics ( title )
        )
      `)
      .in('status', ['approved', 'draft'])
      .or('confidence_score.lt.0.7,confidence_score.is.null')
      .order('confidence_score', { ascending: true, nullsFirst: true })
      .limit(200)

    if (fetchError) {
      error = fetchError.message
    } else {
      answers = data ?? []
    }
  } catch (e) {
    error = e instanceof Error ? e.message : 'Unknown error'
  }

  return <AnswerQueueClient initialAnswers={answers} initialError={error} />
}
