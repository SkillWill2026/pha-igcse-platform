'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight, Pencil, Plus, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Subtopic, SubtopicStatus, TopicWithSubtopics } from '@/types/schedule'

// ── Topic badge colours (C1–C9+) ──────────────────────────────────────────────
const TOPIC_COLORS: Record<string, string> = {
  C1: 'bg-blue-100   text-blue-800   border-blue-200',
  C2: 'bg-purple-100 text-purple-800 border-purple-200',
  C3: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  C4: 'bg-amber-100  text-amber-800  border-amber-200',
  C5: 'bg-rose-100   text-rose-800   border-rose-200',
  C6: 'bg-cyan-100   text-cyan-800   border-cyan-200',
  C7: 'bg-orange-100 text-orange-800 border-orange-200',
  C8: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  C9: 'bg-teal-100   text-teal-800   border-teal-200',
}

function topicColor(ref: string) {
  return TOPIC_COLORS[ref] ?? 'bg-gray-100 text-gray-700 border-gray-200'
}

// ── Status pill ────────────────────────────────────────────────────────────────
const STATUS_STYLES: Record<SubtopicStatus, string> = {
  draft:       'bg-gray-100   text-gray-700  border border-gray-200',
  in_progress: 'bg-blue-100   text-blue-700  border border-blue-200',
  review:      'bg-amber-100  text-amber-700 border border-amber-200',
  approved:    'bg-green-100  text-green-800 border border-green-200',
}

const STATUS_LABELS: Record<SubtopicStatus, string> = {
  draft:       'Draft',
  in_progress: 'In Progress',
  review:      'In Review',
  approved:    'Approved',
}

const STATUS_OPTIONS: SubtopicStatus[] = ['draft', 'in_progress', 'review', 'approved']

function StatusPill({ status }: { status: SubtopicStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap',
        STATUS_STYLES[status],
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  )
}

// ── Progress helpers ───────────────────────────────────────────────────────────
function progressFraction(status: SubtopicStatus): number {
  if (status === 'approved')    return 1
  if (status === 'review')      return 0.75
  if (status === 'in_progress') return 0.5
  return 0
}

function MiniBar({ value, max, className }: { value: number; max: number; className?: string }) {
  const pct = max === 0 ? 0 : Math.round((value / max) * 100)
  return (
    <div className={cn('h-1.5 w-full rounded-full bg-muted overflow-hidden', className)}>
      <div
        className="h-full rounded-full bg-primary transition-all"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

// ── Props ─────────────────────────────────────────────────────────────────────
interface Props {
  topic:              TopicWithSubtopics
  isAdmin:            boolean
  filteredSubtopics:  Subtopic[]       // already filtered by parent
  onEditTopic:        () => void
  onDeleteTopic:      () => void
  onAddSubtopic:      () => void
  onEditSubtopic:     (s: Subtopic) => void
  onDeleteSubtopic:   (s: Subtopic) => void
  onStatusChange:     (subtopicId: string, status: SubtopicStatus) => void
}

export function TopicRow({
  topic,
  isAdmin,
  filteredSubtopics,
  onEditTopic,
  onDeleteTopic,
  onAddSubtopic,
  onEditSubtopic,
  onDeleteSubtopic,
  onStatusChange,
}: Props) {
  const [expanded, setExpanded] = useState(false)

  const approvedCount = topic.subtopics.filter((s) => s.status === 'approved').length
  const totalCount    = topic.subtopics.length

  const dueLabel = topic.completion_date
    ? new Date(topic.completion_date).toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric',
      })
    : null

  return (
    <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
      {/* ── Topic header ── */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => setExpanded((v) => !v)}
        onKeyDown={(e) => e.key === 'Enter' && setExpanded((v) => !v)}
        className="group flex items-center gap-3 px-4 py-3 cursor-pointer select-none hover:bg-muted/40 transition-colors"
      >
        {/* Chevron */}
        <span className="text-muted-foreground shrink-0">
          {expanded
            ? <ChevronDown className="h-4 w-4" />
            : <ChevronRight className="h-4 w-4" />}
        </span>

        {/* Ref badge */}
        <span
          className={cn(
            'inline-flex shrink-0 items-center rounded-md border px-2 py-0.5 text-xs font-semibold',
            topicColor(topic.ref),
          )}
        >
          {topic.ref}
        </span>

        {/* Name + meta */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium leading-tight truncate">{topic.name}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {totalCount} subtopic{totalCount !== 1 ? 's' : ''}
            {' · '}
            {topic.total_questions} Qs
            {dueLabel ? ` · Due ${dueLabel}` : ''}
          </p>
        </div>

        {/* Mini progress bar */}
        <div className="hidden sm:flex flex-col items-end gap-1 shrink-0 w-32">
          <span className="text-xs text-muted-foreground">
            {approvedCount}/{totalCount} approved
          </span>
          <MiniBar value={approvedCount} max={totalCount || 1} />
        </div>

        {/* Admin actions — stop propagation so clicking buttons doesn't toggle expand */}
        {isAdmin && (
          <div
            className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7"
              onClick={onAddSubtopic}
              title="Add subtopic"
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7"
              onClick={onEditTopic}
              title="Edit topic"
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={onDeleteTopic}
              title="Delete topic"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </div>

      {/* ── Subtopics table ── */}
      {expanded && (
        <div className="border-t overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="w-8 pl-4">#</TableHead>
                <TableHead>Subtopic</TableHead>
                <TableHead className="w-28">Due</TableHead>
                <TableHead className="w-16 text-center">Sprint</TableHead>
                <TableHead className="w-16 text-center">Total</TableHead>
                <TableHead className="w-12 text-center">MCQ</TableHead>
                <TableHead className="w-16 text-center">Short</TableHead>
                <TableHead className="w-20 text-center">Struct.</TableHead>
                <TableHead className="w-16 text-center">Ext.</TableHead>
                <TableHead className="w-28">Status</TableHead>
                <TableHead className="w-36">Progress</TableHead>
                {isAdmin && <TableHead className="w-16" />}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubtopics.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={isAdmin ? 12 : 11}
                    className="text-center text-muted-foreground py-8 text-sm"
                  >
                    No subtopics match the current filters.
                  </TableCell>
                </TableRow>
              ) : (
                filteredSubtopics.map((sub, idx) => {
                  const frac       = progressFraction(sub.status)
                  const doneApprox = Math.round(sub.qs_total * frac)
                  const dueStr     = sub.due_date
                    ? new Date(sub.due_date).toLocaleDateString('en-GB', {
                        day: '2-digit', month: 'short',
                      })
                    : '—'

                  return (
                    <TableRow key={sub.id} className="group/row hover:bg-muted/20">
                      <TableCell className="pl-4 text-xs text-muted-foreground">{idx + 1}</TableCell>
                      <TableCell>
                        <div className="min-w-[160px]">
                          {sub.ref && (
                            <span className="text-xs text-muted-foreground mr-1.5">{sub.ref}</span>
                          )}
                          <span className="text-sm">{sub.title}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                        {dueStr}
                      </TableCell>
                      <TableCell className="text-center text-xs text-muted-foreground">
                        {sub.sprint_week ?? '—'}
                      </TableCell>
                      <TableCell className="text-center text-sm font-medium">{sub.qs_total}</TableCell>
                      <TableCell className="text-center text-xs text-muted-foreground">{sub.mcq_count}</TableCell>
                      <TableCell className="text-center text-xs text-muted-foreground">{sub.short_ans_count}</TableCell>
                      <TableCell className="text-center text-xs text-muted-foreground">{sub.structured_count}</TableCell>
                      <TableCell className="text-center text-xs text-muted-foreground">{sub.extended_count}</TableCell>

                      {/* Status — clickable for admins */}
                      <TableCell>
                        {isAdmin ? (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                                <StatusPill status={sub.status} />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                              {STATUS_OPTIONS.map((s) => (
                                <DropdownMenuItem
                                  key={s}
                                  onClick={() => onStatusChange(sub.id, s)}
                                  className={sub.status === s ? 'font-medium' : ''}
                                >
                                  <StatusPill status={s} />
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        ) : (
                          <StatusPill status={sub.status} />
                        )}
                      </TableCell>

                      {/* Progress */}
                      <TableCell>
                        <div className="flex items-center gap-2 min-w-[100px]">
                          <MiniBar value={doneApprox} max={sub.qs_total || 1} className="flex-1" />
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {doneApprox}/{sub.qs_total}
                          </span>
                        </div>
                      </TableCell>

                      {/* Actions */}
                      {isAdmin && (
                        <TableCell>
                          <div className="flex items-center gap-1 opacity-0 group-hover/row:opacity-100 transition-opacity">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-6 w-6"
                              onClick={() => onEditSubtopic(sub)}
                            >
                              <Pencil className="h-3 w-3" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-6 w-6 text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => onDeleteSubtopic(sub)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>

          {/* Add subtopic footer */}
          {isAdmin && (
            <div className="border-t px-4 py-2">
              <button
                onClick={onAddSubtopic}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                Add subtopic
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
