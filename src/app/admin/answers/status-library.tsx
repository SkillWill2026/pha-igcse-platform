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
import { StatusBadge } from '@/components/admin/status-badge'
import { displayAnswerSerial, displayQuestionSerial, serialBadgeColor } from '@/lib/serial'
import type { AnswerWithQuestion } from '@/types/database'

type Mode = 'active' | 'rejected' | 'deleted'

interface BatchAction {
  label: string
  status: 'approved' | 'rejected' | 'deleted'
  className?: string
}

const MODE_CONFIG: Record<Mode, {
  title: string
  subtitle: string
  emptyText: string
  batchActions: BatchAction[]
  rowActions: BatchAction[]
  statusFilter: string[]
}> = {
  active: {
    title: 'Answers Library',
    subtitle: 'Review and approve AI-generated solutions.',
    emptyText: 'No active answers.',
    batchActions: [
      { label: 'Reject', status: 'rejected', className: 'border-amber-300 text-amber-700 hover:bg-amber-50' },
      { label: 'Delete', status: 'deleted', className: 'border-red-300 text-red-700 hover:bg-red-50' },
    ],
    rowActions: [
      { label: 'Reject', status: 'rejected' },
      { label: 'Delete', status: 'deleted' },
    ],
    statusFilter: ['draft', 'approved'],
  },
  rejected: {
    title: 'Rejected Answers',
    subtitle: 'Answers that have been rejected. Restore to active or permanently delete.',
    emptyText: 'No rejected answers.',
    batchActions: [
      { label: 'Restore to Active', status: 'approved', className: 'border-green-300 text-green-700 hover:bg-green-50' },
      { label: 'Delete', status: 'deleted', className: 'border-red-300 text-red-700 hover:bg-red-50' },
    ],
    rowActions: [
      { label: 'Restore', status: 'approved' },
      { label: 'Delete', status: 'deleted' },
    ],
    statusFilter: ['rejected'],
  },
  deleted: {
    title: 'Deleted Answers',
    subtitle: 'Soft-deleted answers. Restore to active or to rejected.',
    emptyText: 'No deleted answers.',
    batchActions: [
      { label: 'Restore to Active', status: 'approved', className: 'border-green-300 text-green-700 hover:bg-green-50' },
      { label: 'Restore to Rejected', status: 'rejected', className: 'border-amber-300 text-amber-700 hover:bg-amber-50' },
    ],
    rowActions: [
      { label: 'Restore to Active', status: 'approved' },
      { label: 'Restore to Rejected', status: 'rejected' },
    ],
    statusFilter: ['deleted'],
  },
}

interface Props {
  answers: AnswerWithQuestion[]
  mode: Mode
}

export function AnswersStatusLibrary({ answers: allAnswers, mode }: Props) {
  const router = useRouter()
  const config = MODE_CONFIG[mode]

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [actionLoading, setActionLoading] = useState(false)
  const [rowActionLoading, setRowActionLoading] = useState<string | null>(null)

  // Filter by status for this mode
  const answers = useMemo(
    () => allAnswers.filter((a) => config.statusFilter.includes(a.status)),
    [allAnswers, config.statusFilter],
  )

  // ── Selection ──────────────────────────────────────────────────────────────
  const allSelected  = answers.length > 0 && answers.every((a) => selectedIds.has(a.id))
  const someSelected = answers.some((a) => selectedIds.has(a.id))

  function toggleAll() {
    if (allSelected) setSelectedIds(new Set())
    else setSelectedIds(new Set(answers.map((a) => a.id)))
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
      const res = await fetch('/api/answers/bulk-status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids, status: newStatus }),
      })
      if (!res.ok) {
        const d = await res.json() as { error?: string }
        toast.error(d.error ?? 'Action failed')
        return
      }
      const d = await res.json() as { updated: number }
      toast.success(`${d.updated} answer${d.updated !== 1 ? 's' : ''} updated`)
      router.refresh()
    } catch {
      toast.error('Action failed')
    } finally {
      setActionLoading(false)
    }
  }

  // ── Row action ─────────────────────────────────────────────────────────────
  async function handleRowAction(answerId: string, newStatus: 'approved' | 'rejected' | 'deleted') {
    setRowActionLoading(answerId + newStatus)
    try {
      const res = await fetch(`/api/answers/${answerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) {
        const d = await res.json() as { error?: string }
        toast.error(d.error ?? 'Action failed')
        return
      }
      toast.success('Answer updated')
      router.refresh()
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
                  aria-label="Select all answers"
                />
              </TableHead>
              <TableHead className="w-28">Serial</TableHead>
              <TableHead className="w-28">Q Serial</TableHead>
              <TableHead className="flex-1">Preview (first 80 chars)</TableHead>
              <TableHead className="w-24">Created</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {answers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-12">
                  {config.emptyText}
                </TableCell>
              </TableRow>
            ) : (
              answers.map((a) => {
                const isSelected = selectedIds.has(a.id)
                const aStatus = a.status
                const qStatus = a.questions?.status ?? 'draft'
                const preview = (a.content ?? '').substring(0, 80).trim() + (a.content && a.content.length > 80 ? '…' : '')
                const createdDate = new Date(a.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })

                return (
                  <TableRow key={a.id} className={cn('hover:bg-muted/30', isSelected && 'bg-primary/5')}>
                    <TableCell>
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-input accent-primary"
                        checked={isSelected}
                        onChange={() => toggleOne(a.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <SerialPill
                        display={displayAnswerSerial(a.serial_number ?? null, aStatus)}
                        status={aStatus}
                      />
                    </TableCell>
                    <TableCell>
                      <SerialPill
                        display={displayQuestionSerial(a.questions?.serial_number ?? null, qStatus)}
                        status={qStatus}
                      />
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground truncate">
                      {preview || '(empty)'}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {createdDate}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 justify-end">
                        <button
                          onClick={() => router.push(`/admin/answers/${a.id}`)}
                          className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'gap-1 text-xs')}
                        >
                          Review <ArrowRight className="h-3 w-3" />
                        </button>
                        {config.rowActions.map((action) => (
                          <button
                            key={action.status}
                            onClick={() => handleRowAction(a.id, action.status)}
                            disabled={rowActionLoading === a.id + action.status}
                            className={cn(
                              buttonVariants({ variant: 'outline', size: 'sm' }),
                              'text-xs',
                              action.status === 'approved' && 'border-green-300 text-green-700 hover:bg-green-50',
                              action.status === 'rejected' && 'border-amber-300 text-amber-700 hover:bg-amber-50',
                              action.status === 'deleted'  && 'border-red-300 text-red-700 hover:bg-red-50',
                            )}
                          >
                            {rowActionLoading === a.id + action.status
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
            {selectedIds.size} answer{selectedIds.size !== 1 ? 's' : ''} selected
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
