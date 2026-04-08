'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ArrowRight, Loader2, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { TypeBadge } from '@/components/admin/type-badge'
import { DifficultyStars } from '@/components/admin/difficulty-stars'
import { displayQuestionSerial, displayAnswerSerial, serialBadgeColor } from '@/lib/serial'
import type { QuestionWithRelations } from '@/types/database'

type Mode = 'rejected' | 'deleted'

interface BatchAction {
  label: string
  status: 'approved' | 'rejected' | 'deleted'
  className?: string
}

const MODE_CONFIG: Record<Mode, {
  title: string
  emptyText: string
  batchActions: BatchAction[]
  rowActions: BatchAction[]
}> = {
  rejected: {
    title: 'Rejected Questions',
    emptyText: 'No rejected questions.',
    batchActions: [
      { label: 'Restore to Active', status: 'approved', className: 'border-green-300 text-green-700 hover:bg-green-50' },
      { label: 'Delete', status: 'deleted', className: 'border-red-300 text-red-700 hover:bg-red-50' },
    ],
    rowActions: [
      { label: 'Restore', status: 'approved' },
      { label: 'Delete', status: 'deleted' },
    ],
  },
  deleted: {
    title: 'Deleted Questions',
    emptyText: 'No deleted questions.',
    batchActions: [
      { label: 'Restore to Active', status: 'approved', className: 'border-green-300 text-green-700 hover:bg-green-50' },
      { label: 'Restore to Rejected', status: 'rejected', className: 'border-amber-300 text-amber-700 hover:bg-amber-50' },
    ],
    rowActions: [
      { label: 'Restore to Active', status: 'approved' },
      { label: 'Restore to Rejected', status: 'rejected' },
    ],
  },
}

interface Props {
  mode: Mode
}

export function StatusQuestionsLibrary({ mode }: Props) {
  const router = useRouter()
  const config = MODE_CONFIG[mode]

  const [questions,   setQuestions]   = useState<QuestionWithRelations[]>([])
  const [loading,     setLoading]     = useState(true)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [actionLoading, setActionLoading] = useState(false)
  const [rowActionLoading, setRowActionLoading] = useState<string | null>(null)

  const fetchQuestions = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/questions?status=${mode}`)
      if (!res.ok) {
        const d = await res.json() as { error?: string }
        console.error('[StatusQuestionsLibrary] fetch error:', d.error)
        return
      }
      const data = await res.json()
      setQuestions(Array.isArray(data) ? data as QuestionWithRelations[] : [])
      setSelectedIds(new Set())
    } catch (err) {
      console.error('[StatusQuestionsLibrary] unexpected:', err)
    } finally {
      setLoading(false)
    }
  }, [mode])

  useEffect(() => {
    fetchQuestions()
  }, [fetchQuestions])

  // ── Selection ──────────────────────────────────────────────────────────────
  const allSelected  = questions.length > 0 && questions.every((q) => selectedIds.has(q.id))
  const someSelected = questions.some((q) => selectedIds.has(q.id))

  function toggleAll() {
    if (allSelected) setSelectedIds(new Set())
    else setSelectedIds(new Set(questions.map((q) => q.id)))
  }

  function toggleOne(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  // ── Batch action ───────────────────────────────────────────────────────────
  async function handleBatchAction(newStatus: 'approved' | 'rejected' | 'deleted') {
    const ids = Array.from(selectedIds)
    if (ids.length === 0) return
    setActionLoading(true)
    try {
      const res = await fetch('/api/questions/batch-status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question_ids: ids, status: newStatus }),
      })
      if (!res.ok) {
        const d = await res.json() as { error?: string }
        toast.error(d.error ?? 'Action failed')
        return
      }
      const d = await res.json() as { updated: number }
      toast.success(`${d.updated} question${d.updated !== 1 ? 's' : ''} updated`)
      await fetchQuestions()
    } catch {
      toast.error('Action failed')
    } finally {
      setActionLoading(false)
    }
  }

  // ── Row action ─────────────────────────────────────────────────────────────
  async function handleRowAction(questionId: string, newStatus: 'approved' | 'rejected' | 'deleted') {
    setRowActionLoading(questionId + newStatus)
    try {
      const res = await fetch(`/api/questions/${questionId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) {
        const d = await res.json() as { error?: string }
        toast.error(d.error ?? 'Action failed')
        return
      }
      toast.success('Question updated')
      await fetchQuestions()
    } catch {
      toast.error('Action failed')
    } finally {
      setRowActionLoading(null)
    }
  }

  return (
    <div className="space-y-4 pb-20">
      <div className="rounded-lg border overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-10">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-input accent-primary"
                  checked={allSelected}
                  ref={(el) => { if (el) el.indeterminate = someSelected && !allSelected }}
                  onChange={toggleAll}
                  aria-label="Select all questions"
                />
              </TableHead>
              <TableHead className="w-32">Q Serial</TableHead>
              <TableHead className="w-32">A Serial</TableHead>
              <TableHead className="w-36">Subtopic</TableHead>
              <TableHead className="w-28">Difficulty</TableHead>
              <TableHead className="w-28">Type</TableHead>
              <TableHead className="w-16 text-right">Marks</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-12">
                  <Loader2 className="h-5 w-5 animate-spin inline-block mr-2" />
                  Loading questions…
                </TableCell>
              </TableRow>
            ) : questions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-12">
                  {config.emptyText}
                </TableCell>
              </TableRow>
            ) : (
              questions.map((q) => {
                const isSelected = selectedIds.has(q.id)
                const qStatus = q.status
                const aStatus = q.answer_status ?? qStatus
                return (
                  <TableRow key={q.id} className={cn('hover:bg-muted/30', isSelected && 'bg-primary/5')}>
                    <TableCell>
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-input accent-primary"
                        checked={isSelected}
                        onChange={() => toggleOne(q.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <SerialPill
                        display={displayQuestionSerial(q.serial_number, qStatus)}
                        status={qStatus}
                      />
                    </TableCell>
                    <TableCell>
                      <SerialPill
                        display={displayAnswerSerial(q.answer_serial ?? null, aStatus)}
                        status={aStatus}
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <span className="font-mono text-xs text-muted-foreground">
                          {q.subtopics?.ref ?? '—'}
                        </span>
                        <span className="ml-1.5 text-xs">{q.subtopics?.name ?? ''}</span>
                      </div>
                    </TableCell>
                    <TableCell><DifficultyStars value={q.difficulty} /></TableCell>
                    <TableCell><TypeBadge type={q.question_type} /></TableCell>
                    <TableCell className="text-right font-semibold tabular-nums text-sm">
                      {q.marks}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 justify-end">
                        <button
                          onClick={() => router.push(`/admin/questions/${q.id}`)}
                          className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'gap-1 text-xs')}
                        >
                          Review <ArrowRight className="h-3 w-3" />
                        </button>
                        {config.rowActions.map((action) => (
                          <button
                            key={action.status}
                            onClick={() => handleRowAction(q.id, action.status)}
                            disabled={rowActionLoading === q.id + action.status}
                            className={cn(
                              buttonVariants({ variant: 'outline', size: 'sm' }),
                              'text-xs',
                              action.status === 'approved' && 'border-green-300 text-green-700 hover:bg-green-50',
                              action.status === 'rejected' && 'border-amber-300 text-amber-700 hover:bg-amber-50',
                              action.status === 'deleted'  && 'border-red-300 text-red-700 hover:bg-red-50',
                            )}
                          >
                            {rowActionLoading === q.id + action.status
                              ? <Loader2 className="h-3 w-3 animate-spin mr-1" />
                              : null}
                            {action.label}
                          </button>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* ── Floating batch action bar ───────────────────────────────────── */}
      {selectedIds.size > 0 && (
        <div
          className="fixed bottom-0 left-0 right-0 z-50 flex items-center gap-3 border-t bg-white shadow-lg"
          style={{ padding: '12px 24px' }}
        >
          <span className="text-sm font-medium text-muted-foreground flex-1">
            {selectedIds.size} question{selectedIds.size !== 1 ? 's' : ''} selected
          </span>
          {config.batchActions.map((action) => (
            <Button
              key={action.status}
              variant="outline"
              size="sm"
              disabled={actionLoading}
              onClick={() => handleBatchAction(action.status)}
              className={action.className}
            >
              {actionLoading ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : null}
              {action.label}
            </Button>
          ))}
          <Button
            variant="ghost"
            size="sm"
            disabled={actionLoading}
            onClick={() => setSelectedIds(new Set())}
          >
            <X className="h-3.5 w-3.5 mr-1" /> Clear
          </Button>
        </div>
      )}
    </div>
  )
}

function SerialPill({ display, status }: { display: string; status: string }) {
  const [copied, setCopied] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  if (display === '—') return <span className="font-mono text-xs text-muted-foreground/40">—</span>

  function handleClick() {
    navigator.clipboard.writeText(display).then(() => {
      setCopied(true)
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <button
      onClick={handleClick}
      title={copied ? 'Copied!' : 'Click to copy'}
      className={cn(
        'inline-flex items-center rounded px-1.5 py-0.5 font-mono text-[11px] hover:opacity-80 transition-colors',
        serialBadgeColor(status),
      )}
    >
      {copied ? 'Copied!' : display}
    </button>
  )
}
