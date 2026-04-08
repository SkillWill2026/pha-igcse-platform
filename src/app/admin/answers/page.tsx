'use client'

import { useState, useEffect, useMemo } from 'react'
import { unstable_noStore as noStore } from 'next/cache'
import { createAdminClient } from '@/lib/supabase'
import type { AnswerWithQuestion } from '@/types/database'
import { AnswersLibrary } from './answers-library'
import { AnswersStatusLibrary } from './status-library'
import { Button } from '@/components/ui/button'

type TabMode = 'active' | 'rejected' | 'deleted'

export default function AnswersPage() {
  const [answers, setAnswers] = useState<AnswerWithQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<TabMode>('active')

  useEffect(() => {
    const fetchAnswers = async () => {
      setLoading(true)
      try {
        const supabase = createAdminClient()

        // Fetch all answers with linked questions
        const [aRes, qRes] = await Promise.all([
          supabase
            .from('answers')
            .select('id, content_text, step_by_step, mark_scheme, confidence_score, status, ai_generated, serial_number, created_at, updated_at, question_id')
            .order('created_at', { ascending: false }),
          supabase
            .from('questions')
            .select('id, serial_number, content_text, difficulty, question_type, marks, status, ai_extracted, exam_board_id, topic_id, subtopic_id, sub_subtopic_id, image_url')
        ])

        const questionMap = new Map((qRes.data ?? []).map((q) => [q.id, q]))
        const answersData = (aRes.data ?? []).map((a) => ({
          ...a,
          questions: questionMap.get(a.question_id) ?? null,
        })) as AnswerWithQuestion[]

        setAnswers(answersData)
      } catch (err) {
        console.error('[AnswersPage] error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAnswers()
  }, [])

  const counts = useMemo(() => ({
    active: answers.filter((a) => ['draft', 'approved'].includes(a.status)).length,
    rejected: answers.filter((a) => a.status === 'rejected').length,
    deleted: answers.filter((a) => a.status === 'deleted').length,
  }), [answers])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">
          {tab === 'active' && 'Answers Library'}
          {tab === 'rejected' && 'Rejected Answers'}
          {tab === 'deleted' && 'Deleted Answers'}
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          {tab === 'active' && 'Review and approve AI-generated solutions.'}
          {tab === 'rejected' && 'Answers that have been rejected. Restore to active or permanently delete.'}
          {tab === 'deleted' && 'Soft-deleted answers. Restore to active or to rejected.'}
        </p>
      </div>

      {/* Tab buttons */}
      <div className="flex gap-2 border-b">
        <Button
          variant={tab === 'active' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setTab('active')}
          className="gap-2"
        >
          Active
          {counts.active > 0 && (
            <span className="rounded-full bg-blue-100 text-blue-800 px-2 py-0.5 text-xs font-bold">
              {counts.active}
            </span>
          )}
        </Button>
        <Button
          variant={tab === 'rejected' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setTab('rejected')}
          className="gap-2"
        >
          Rejected
          {counts.rejected > 0 && (
            <span className="rounded-full bg-amber-100 text-amber-800 px-2 py-0.5 text-xs font-bold">
              {counts.rejected}
            </span>
          )}
        </Button>
        <Button
          variant={tab === 'deleted' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setTab('deleted')}
          className="gap-2"
        >
          Deleted
          {counts.deleted > 0 && (
            <span className="rounded-full bg-red-100 text-red-800 px-2 py-0.5 text-xs font-bold">
              {counts.deleted}
            </span>
          )}
        </Button>
      </div>

      {/* Tab content */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading answers…</div>
      ) : tab === 'active' ? (
        <AnswersStatusLibrary answers={answers} mode="active" />
      ) : tab === 'rejected' ? (
        <AnswersStatusLibrary answers={answers} mode="rejected" />
      ) : (
        <AnswersStatusLibrary answers={answers} mode="deleted" />
      )}
    </div>
  )
}
