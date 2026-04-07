'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ArrowRight, Loader2, Trash2, Wand2, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { TypeBadge } from '@/components/admin/type-badge'
import { StatusBadge } from '@/components/admin/status-badge'
import { DifficultyStars } from '@/components/admin/difficulty-stars'
import { DeleteDialog } from '@/components/admin/delete-dialog'
import type { QuestionWithRelations } from '@/types/database'

const ALL = '__all__'

// ── Board abbreviation + colour ───────────────────────────────────────────────

function getBoardAbbr(name: string): string {
  if (name.includes('Cambridge')) return 'CAM'
  if (name.includes('Edexcel'))   return 'EDX'
  if (name.includes('AQA'))       return 'AQA'
  return name.slice(0, 3).toUpperCase()
}

const BOARD_COLORS: Record<string, { solid: string; outline: string }> = {
  CAM: {
    solid:   'bg-blue-600 text-white border-blue-600',
    outline: 'border border-blue-400 text-blue-600 bg-transparent',
  },
  EDX: {
    solid:   'bg-purple-600 text-white border-purple-600',
    outline: 'border border-purple-400 text-purple-600 bg-transparent',
  },
  AQA: {
    solid:   'bg-emerald-600 text-white border-emerald-600',
    outline: 'border border-emerald-400 text-emerald-600 bg-transparent',
  },
}

function getBoardColors(abbr: string) {
  return BOARD_COLORS[abbr] ?? {
    solid:   'bg-gray-600 text-white border-gray-600',
    outline: 'border border-gray-400 text-gray-600 bg-transparent',
  }
}

// ── Group type ────────────────────────────────────────────────────────────────

interface BoardEntry {
  id:         string
  name:       string
  abbr:       string
  isOriginal: boolean
}

interface QuestionGroup {
  id:           string                 // original question's id — used for navigation
  original:     QuestionWithRelations
  boardEntries: BoardEntry[]
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  questions:     QuestionWithRelations[]
  boards:        { id: string; name: string }[]
  topics:        { id: string; ref: string; name: string }[]
  subtopics:     { id: string; ref: string; name: string; topic_id: string }[]
  subSubtopics:  { id: string; ref: string; title: string; subtopic_id: string }[]
}

// ── Component ─────────────────────────────────────────────────────────────────

export function QuestionsLibrary({ questions, boards, topics, subtopics, subSubtopics }: Props) {
  const router = useRouter()
  const [deletingId,        setDeletingId]        = useState<string | null>(null)
  const [boardId,           setBoardId]           = useState(ALL)
  const [topicId,           setTopicId]           = useState(ALL)
  const [subtopicId,        setSubtopicId]        = useState(ALL)
  const [subSubtopicId,     setSubSubtopicId]     = useState(ALL)
  const [qtype,             setQtype]             = useState(ALL)
  const [status,            setStatus]            = useState(ALL)
  const [diffMin,           setDiffMin]           = useState(ALL)
  const [diffMax,           setDiffMax]           = useState(ALL)
  const [assignLoading,     setAssignLoading]     = useState(false)
  const [showAssignConfirm, setShowAssignConfirm] = useState(false)

  const unassignedCount = useMemo(
    () => questions.filter((q) => !q.subtopics).length,
    [questions],
  )

  // Cascade subtopics
  const filteredSubtopics = useMemo(
    () => (topicId === ALL ? subtopics : subtopics.filter((s) => s.topic_id === topicId)),
    [topicId, subtopics],
  )

  // Cascade sub-subtopics
  const filteredSubSubtopics = useMemo(
    () => (subtopicId === ALL ? subSubtopics : subSubtopics.filter((s) => s.subtopic_id === subtopicId)),
    [subtopicId, subSubtopics],
  )

  // ── Build groups ───────────────────────────────────────────────────────────
  const groups = useMemo<QuestionGroup[]>(() => {
    const byId = new Map<string, QuestionWithRelations>(questions.map((q) => [q.id, q]))

    // Walk the source_question_id chain upward to find the ultimate root.
    // Memoised to avoid repeated traversal for siblings in the same chain.
    const rootCache = new Map<string, string>()
    function findRoot(id: string): string {
      if (rootCache.has(id)) return rootCache.get(id)!
      const q = byId.get(id)
      if (!q || !q.source_question_id) {
        rootCache.set(id, id)
        return id
      }
      const root = findRoot(q.source_question_id)
      rootCache.set(id, root)
      return root
    }

    // Bucket every question under its root id
    const buckets = new Map<string, QuestionWithRelations[]>()
    for (const q of questions) {
      const rootId = findRoot(q.id)
      if (!buckets.has(rootId)) buckets.set(rootId, [])
      buckets.get(rootId)!.push(q)
    }

    const result: QuestionGroup[] = []
    for (const [rootId, members] of Array.from(buckets)) {
      const original = byId.get(rootId)

      if (!original) {
        // Root is not in this dataset (was deleted or from a different upload batch).
        // Surface each member as its own standalone group instead of silently dropping them.
        for (const m of members) {
          result.push({
            id: m.id,
            original: m,
            boardEntries: [{
              id:         m.exam_board_id,
              name:       m.exam_boards?.name ?? '',
              abbr:       getBoardAbbr(m.exam_boards?.name ?? ''),
              isOriginal: true,
            }],
          })
        }
        continue
      }

      // Deduplicate by board id (a board can appear multiple times from chained copies)
      const seenBoards = new Set<string>()
      const boardEntries: BoardEntry[] = []
      // Put original's board first so it gets the solid pill
      for (const m of [original, ...members.filter((member: QuestionWithRelations) => member.id !== original.id)]) {
        if (seenBoards.has(m.exam_board_id)) continue
        seenBoards.add(m.exam_board_id)
        boardEntries.push({
          id:         m.exam_board_id,
          name:       m.exam_boards?.name ?? '',
          abbr:       getBoardAbbr(m.exam_boards?.name ?? ''),
          isOriginal: m.id === rootId,
        })
      }

      result.push({ id: rootId, original, boardEntries })
    }

    // Preserve server sort order (created_at desc of the original)
    result.sort(
      (a, b) =>
        new Date(b.original.created_at).getTime() -
        new Date(a.original.created_at).getTime(),
    )
    return result
  }, [questions])

  // ── Filter groups ──────────────────────────────────────────────────────────
  const filteredGroups = useMemo(() => {
    return groups.filter((g) => {
      const q = g.original
      // Board filter: pass if any member is from this board
      if (boardId       && boardId       !== ALL && !g.boardEntries.some((b) => b.id === boardId)) return false
      if (topicId       && topicId       !== ALL && q.topics?.id    !== topicId)    return false
      if (subtopicId    && subtopicId    !== ALL && q.subtopics?.id !== subtopicId) return false
      if (subSubtopicId && subSubtopicId !== ALL && (q as any).sub_subtopic_id !== subSubtopicId) return false
      if (qtype         && qtype         !== ALL && q.question_type !== qtype)      return false
      if (status        && status        !== ALL && q.status        !== status)     return false
      if (diffMin       && diffMin       !== ALL && q.difficulty < Number(diffMin)) return false
      if (diffMax       && diffMax       !== ALL && q.difficulty > Number(diffMax)) return false
      return true
    })
  }, [groups, boardId, topicId, subtopicId, subSubtopicId, qtype, status, diffMin, diffMax])

  // ── Counts (groups, not rows) ──────────────────────────────────────────────
  const counts = useMemo(() => ({
    total:    filteredGroups.length,
    draft:    filteredGroups.filter((g) => g.original.status === 'draft').length,
    approved: filteredGroups.filter((g) => g.original.status === 'approved').length,
    rejected: filteredGroups.filter((g) => g.original.status === 'rejected').length,
  }), [filteredGroups])

  const hasFilters =
    boardId !== ALL || topicId !== ALL || subtopicId !== ALL || subSubtopicId !== ALL ||
    qtype !== ALL || status !== ALL || diffMin !== ALL || diffMax !== ALL

  const clearFilters = () => {
    setBoardId(ALL); setTopicId(ALL); setSubtopicId(ALL); setSubSubtopicId(ALL)
    setQtype(ALL); setStatus(ALL); setDiffMin(ALL); setDiffMax(ALL)
  }

  async function handleAssignSubtopics() {
    setShowAssignConfirm(false)
    setAssignLoading(true)
    try {
      const res = await fetch('/api/admin/assign-subtopics', { method: 'POST' })
      if (!res.ok) {
        const d = await res.json() as { error?: string }
        toast.error(d.error ?? 'Auto-assign failed')
        return
      }
      const d = await res.json() as { total: number; assigned: number; skipped: number; errors: number }
      toast.success(`Assigned ${d.assigned} of ${d.total} questions`)
      window.location.reload()
    } catch {
      toast.error('Auto-assign failed')
    } finally {
      setAssignLoading(false)
    }
  }

  async function handleDelete(groupId: string) {
    setDeletingId(groupId)
    try {
      const res = await fetch(`/api/questions/${groupId}`, { method: 'DELETE' })
      if (!res.ok) {
        const d = await res.json() as { error?: string }
        toast.error(d.error ?? 'Delete failed')
        return
      }
      toast.success('Question deleted')
      router.refresh()
    } catch {
      toast.error('Delete failed')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-4">
      {/* ── Auto-assign button ─────────────────────────────────────────── */}
      {unassignedCount > 0 && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            disabled={assignLoading}
            onClick={() => setShowAssignConfirm(true)}
          >
            {assignLoading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Assigning...
              </>
            ) : (
              <>
                <Wand2 className="h-3.5 w-3.5" />
                Auto-assign Subtopics ({unassignedCount})
              </>
            )}
          </Button>
        </div>
      )}

      {/* ── Auto-assign confirmation dialog ───────────────────────────── */}
      <Dialog open={showAssignConfirm} onOpenChange={setShowAssignConfirm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Auto-assign Subtopics</DialogTitle>
            <DialogDescription>
              This will use AI to assign subtopics to all {unassignedCount} unlinked questions. Continue?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAssignConfirm(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssignSubtopics}>
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Filter bar ─────────────────────────────────────────────────── */}
      <div className="rounded-lg border bg-card p-4 space-y-3">
        <div className="flex flex-wrap gap-2 items-center">
          <FilterSelect
            placeholder="All Boards"
            value={boardId}
            onValueChange={setBoardId}
            options={boards.map((b) => ({ value: b.id, label: b.name }))}
          />
          <FilterSelect
            placeholder="All Topics"
            value={topicId}
            onValueChange={(v) => { setTopicId(v); setSubtopicId(ALL) }}
            options={topics.map((t) => ({ value: t.id, label: `${t.ref} – ${t.name}` }))}
          />
          <FilterSelect
            placeholder="All Subtopics"
            value={subtopicId}
            onValueChange={(v) => { setSubtopicId(v); setSubSubtopicId(ALL) }}
            options={filteredSubtopics.map((s) => ({ value: s.id, label: `${s.ref} – ${s.name}` }))}
            className="w-56"
          />
          {filteredSubSubtopics.length > 0 && (
            <FilterSelect
              placeholder="All Sub-subtopics"
              value={subSubtopicId}
              onValueChange={setSubSubtopicId}
              options={filteredSubSubtopics.map((s) => ({ value: s.id, label: `${s.ref} – ${s.title}` }))}
              className="w-56"
            />
          )}
          <FilterSelect
            placeholder="All Types"
            value={qtype}
            onValueChange={setQtype}
            options={[
              { value: 'mcq',          label: 'MCQ' },
              { value: 'short_answer', label: 'Short Answer' },
              { value: 'structured',   label: 'Structured' },
              { value: 'extended',     label: 'Extended' },
            ]}
          />
          <FilterSelect
            placeholder="All Statuses"
            value={status}
            onValueChange={setStatus}
            options={[
              { value: 'draft',    label: 'Draft' },
              { value: 'approved', label: 'Approved' },
              { value: 'rejected', label: 'Rejected' },
            ]}
          />
          <FilterSelect
            placeholder="Min Diff"
            value={diffMin}
            onValueChange={setDiffMin}
            options={[1,2,3,4,5].map((n) => ({ value: String(n), label: `Min ${n}★` }))}
          />
          <FilterSelect
            placeholder="Max Diff"
            value={diffMax}
            onValueChange={setDiffMax}
            options={[1,2,3,4,5].map((n) => ({ value: String(n), label: `Max ${n}★` }))}
          />
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1">
              <X className="h-3 w-3" /> Clear
            </Button>
          )}
        </div>
      </div>

      {/* ── Summary bar ────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground px-1">
        <SummaryPill label="Total"    value={counts.total}    />
        <SummaryPill label="Draft"    value={counts.draft}    color="text-gray-600"  />
        <SummaryPill label="Approved" value={counts.approved} color="text-green-700" />
        <SummaryPill label="Rejected" value={counts.rejected} color="text-red-700"   />
      </div>

      {/* ── Table ──────────────────────────────────────────────────────── */}
      <div className="rounded-lg border overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-36">Subtopic</TableHead>
              <TableHead className="w-40">Boards</TableHead>
              <TableHead className="w-28">Difficulty</TableHead>
              <TableHead className="w-28">Type</TableHead>
              <TableHead className="w-16 text-right">Marks</TableHead>
              <TableHead className="w-24">Status</TableHead>
              <TableHead className="w-24" />
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredGroups.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-12">
                  {questions.length === 0
                    ? 'No questions yet — upload a paper to get started.'
                    : `No questions match the current filters. (${questions.length} loaded)`}
                </TableCell>
              </TableRow>
            ) : (
              filteredGroups.map((g) => {
                const q = g.original
                return (
                  <TableRow key={g.id} className="hover:bg-muted/30">
                    <TableCell>
                      <span className="font-mono text-xs text-muted-foreground">
                        {q.subtopics?.ref ?? '—'}
                      </span>
                      <span className="ml-1.5 text-xs">{q.subtopics?.name ?? ''}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {g.boardEntries.map((b) => {
                          const colors = getBoardColors(b.abbr)
                          return (
                            <span
                              key={b.id}
                              className={cn(
                                'inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-bold tracking-wide',
                                b.isOriginal ? colors.solid : colors.outline,
                              )}
                              title={b.name}
                            >
                              {b.abbr}
                            </span>
                          )
                        })}
                      </div>
                    </TableCell>
                    <TableCell><DifficultyStars value={q.difficulty} /></TableCell>
                    <TableCell><TypeBadge type={q.question_type} /></TableCell>
                    <TableCell className="text-right font-semibold tabular-nums text-sm">
                      {q.marks}
                    </TableCell>
                    <TableCell><StatusBadge status={q.status} /></TableCell>
                    <TableCell>
                      <button
                        onClick={() => { router.refresh(); router.push(`/admin/questions/${g.id}`) }}
                        className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'gap-1')}
                      >
                        Review <ArrowRight className="h-3 w-3" />
                      </button>
                    </TableCell>
                    <TableCell>
                      <DeleteDialog
                        onConfirm={() => handleDelete(g.id)}
                        isLoading={deletingId === g.id}
                      >
                        <button
                          className={cn(
                            buttonVariants({ variant: 'ghost', size: 'sm' }),
                            'text-muted-foreground hover:text-destructive px-2',
                          )}
                          aria-label="Delete question"
                          disabled={deletingId === g.id}
                        >
                          {deletingId === g.id
                            ? <Trash2 className="h-3.5 w-3.5 animate-pulse" />
                            : <Trash2 className="h-3.5 w-3.5" />}
                        </button>
                      </DeleteDialog>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function FilterSelect({
  placeholder,
  value,
  onValueChange,
  options,
  className,
}: {
  placeholder: string
  value: string
  onValueChange: (v: string) => void
  options: { value: string; label: string }[]
  className?: string
}) {
  return (
    <Select value={value} onValueChange={(v) => onValueChange(v ?? ALL)}>
      <SelectTrigger className={cn('h-8 text-xs', className ?? 'w-36')}>
        {value !== ALL
          ? <span className="truncate">{options.find((o) => o.value === value)?.label}</span>
          : <span className="text-muted-foreground truncate">{placeholder}</span>}
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={false}>
        <SelectItem value={ALL} label={placeholder}>{placeholder}</SelectItem>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value} label={o.label}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function SummaryPill({
  label,
  value,
  color = 'text-foreground',
}: {
  label: string
  value: number
  color?: string
}) {
  return (
    <span>
      <span className={`font-semibold tabular-nums ${color}`}>{value}</span>{' '}
      <span className="text-muted-foreground">{label}</span>
    </span>
  )
}
