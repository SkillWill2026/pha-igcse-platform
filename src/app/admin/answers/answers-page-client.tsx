'use client'

import { useState, useMemo } from 'react'
import { AnswersStatusLibrary } from './status-library'
import { Button } from '@/components/ui/button'
import type { AnswerWithQuestion } from '@/types/database'

type TabMode = 'active' | 'rejected' | 'deleted'

interface Props {
  answers: AnswerWithQuestion[]
  initialError: string | null
}

export function AnswersPageClient({ answers, initialError }: Props) {
  const [tab, setTab] = useState<TabMode>('active')

  if (initialError) {
    return (
      <div className="p-8 rounded-lg border border-red-300 bg-red-50">
        <h2 className="text-lg font-semibold text-red-900 mb-2">Error Loading Answers</h2>
        <p className="text-sm text-red-700">{initialError}</p>
      </div>
    )
  }

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
      {tab === 'active' ? (
        <AnswersStatusLibrary answers={answers} mode="active" />
      ) : tab === 'rejected' ? (
        <AnswersStatusLibrary answers={answers} mode="rejected" />
      ) : (
        <AnswersStatusLibrary answers={answers} mode="deleted" />
      )}
    </div>
  )
}
