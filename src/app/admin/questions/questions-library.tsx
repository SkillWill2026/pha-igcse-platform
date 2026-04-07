'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ArrowRight, Loader2, Trash2, Wand2, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { Button } from '@/components/ui/button'
import { SyllabusSelector } from '@/components/SyllabusSelector'
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
import type { QuestionWithRelations, UploadBatch } from '@/types/database'

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
  id:           string
  original:     QuestionWithRelations
  boardEntries: BoardEntry[]
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  boards: { id: string; name: string }[]
}

// ── Component ─────────────────────────────────────────────────────────────────

export function QuestionsLibrary({ boards }: Props) {
  const router = useRouter()

  // ── Questions state (fetched client-side) ──────────────────────────────────
  const [questions,  setQuestions]  = useState<QuestionWithRelations[]>([])
  const [loading,    setLoading]    = useState(true)

  // ── Filter state ───────────────────────────────────────────────────────────
  const [selectorKey,      setSelectorKey]      = useState(0)          // remount to reset SyllabusSelector
  const [topicFilter,      setTopicFilter]      = useState<string | null>(null)
  const [subtopicFilter,   setSubtopicFilter]   = useState<string | null>(null)
  const [subSubtopicFilter,setSubSubtopicFilter]= useState<string | null>(null)
  const [boardId,          setBoardId]          = useState(ALL)
  const [qtype,            setQtype]            = useState(ALL)
  const [status,           setStatus]           = useState(ALL)
  const [diffMin,          setDiffMin]          = useState(ALL)
  const [diffMax,          setDiffMax]          = useState(ALL)
  const [batchFilter,      setBatchFilter]      = useState(ALL)
  const [batches,          setBatches]          = useState<UploadBatch[]>([])

  const [deletingId,        setDeletingId]        = useState<string | null>(null)
  const [assignLoading,     setAssignLoading]     = useState(false)
  const [showAssignConfirm, setShowAssignConfirm] = useState(false)

  // ── Fetch questions whenever syllabus filters change ───────────────────────
  const fetchQuestions = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (topicFilter       && topicFilter       !== '') params.set('topic_id',        topicFilter)
      if (subtopicFilter    && subtopicFilter    !== '') params.set('subtopic_id',     subtopicFilter)
      if (subSubtopicFilter && subSubtopicFilter !== '') params.set('sub_subtopic_id', subSubtopicFilter)
      if (batchFilter       && batchFilter       !== ALL) params.set('batch_id',        batchFilter)

      const url = '/api/questions' + (params.size > 0 ? '?' + params.toString() : '')
      const res = await fetch(url)
      if (!res.ok) {
        const d = await res.json() as { error?: string }
        console.error('[QuestionsLibrary] fetch error:', d.error)
        return
      }
      const data = await res.json()
      setQuestions(Array.isArray(data) ? data as QuestionWithRelations[] : [])
    } catch (err) {
      console.error('[QuestionsLibrary] unexpected:', err)
    } finally {
      setLoading(false)
    }
  }, [topicFilter, subtopicFilter, subSubtopicFilter, batchFilter])

  useEffect(() => {
    fetchQuestions()
  }, [fetchQuestions])

  // Fetch recent batches for the filter dropdown
  useEffect(() => {
    fetch('/api/upload-batch')
      .then((r) => r.json())
      .then((d) => setBatches(Array.isArray(d) ? d as UploadBatch[] : []))
      .catch(() => {})
  }, [])

  // ── Build groups ───────────────────────────────────────────────────────────
  const groups = useMemo<QuestionGroup[]>(() => {
    const byId = new Map<string, QuestionWithRelations>(questions.map((q) => [q.id, q]))

    const rootCache = new Map<string, string>()
    function findRoot(id: string): string {
      if (rootCache.has(id)) return rootCache.get(id)!
      const q = byId.get(id)
      if (!q || !q.source_question_id) { rootCache.set(id, id); return id }
      const root = findRoot(q.source_question_id)
      rootCache.set(id, root)
      return root
    }

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
        for (const m of members) {
          result.push({
            id: m.id, original: m,
            boardEntries: [{
              id: m.exam_board_id, name: m.exam_boards?.name ?? '',
              abbr: getBoardAbbr(m.exam_boards?.name ?? ''), isOriginal: true,
            }],
          })
        }
        continue
      }

      const seenBoards = new Set<string>()
      const boardEntries: BoardEntry[] = []
      for (const m of [original, ...members.filter((member) => member.id !== original.id)]) {
        if (seenBoards.has(m.exam_board_id)) continue
        seenBoards.add(m.exam_board_id)
        boardEntries.push({
          id: m.exam_board_id, name: m.exam_boards?.name ?? '',
          abbr: getBoardAbbr(m.exam_boards?.name ?? ''), isOriginal: m.id === rootId,
        })
      }
      result.push({ id: rootId, original, boardEntries })
    }

    result.sort((a, b) => {
      const sa = a.original.serial_number ?? ''
      const sb = b.original.serial_number ?? ''
      return sa.localeCompare(sb)
    })
    return result
  }, [questions])

  // ── Client-side filters (board / type / status / difficulty) ──────────────
  const filteredGroups = useMemo(() => {
    return groups.filter((g) => {
      const q = g.original
      if (boardId && boardId !== ALL && !g.boardEntries.some((b) => b.id === boardId)) return false
      if (qtype  && qtype  !== ALL && q.question_type !== qtype)       return false
      if (status && status !== ALL && q.status        !== status)      return false
      if (diffMin && diffMin !== ALL && q.difficulty < Number(diffMin)) return false
      if (diffMax && diffMax !== ALL && q.difficulty > Number(diffMax)) return false
      return true
    })
  }, [groups, boardId, qtype, status, diffMin, diffMax])

  // ── Counts ─────────────────────────────────────────────────────────────────
  const counts = useMemo(() => ({
    total:    filteredGroups.length,
    draft:    filteredGroups.filter((g) => g.original.status === 'draft').length,
    approved: filteredGroups.filter((g) => g.original.status === 'approved').length,
    rejected: filteredGroups.filter((g) => g.original.status === 'rejected').length,
  }), [filteredGroups])

  const unassignedCount = useMemo(
    () => questions.filter((q) => !q.subtopics).length,
    [questions],
  )

  const hasFilters =
    boardId !== ALL || batchFilter !== ALL ||
    topicFilter !== null || subtopicFilter !== null || subSubtopicFilter !== null ||
    qtype !== ALL || status !== ALL || diffMin !== ALL || diffMax !== ALL

  const clearFilters = () => {
    setBoardId(ALL)
    setTopicFilter(null); setSubtopicFilter(null); setSubSubtopicFilter(null)
    setSelectorKey((k) => k + 1)  // force SyllabusSelector to re-mount and reset
    setQtype(ALL); setStatus(ALL); setDiffMin(ALL); setDiffMax(ALL); setBatchFilter(ALL)
  }

  // ── Handlers ───────────────────────────────────────────────────────────────

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
      await fetchQuestions()
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
      await fetchQuestions()
    } catch {
      toast.error('Delete failed')
    } finally {
      setDeletingId(null)
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-4">
      {/* ── Auto-assign button ─────────────────────────────────────────── */}
      {unassignedCount > 0 && (
        <div className="flex justify-end">
          <Button
            variant="outline" size="sm" className="gap-1.5"
            disabled={assignLoading}
            onClick={() => setShowAssignConfirm(true)}
          >
            {assignLoading ? (
              <><Loader2 className="h-3.5 w-3.5 animate-spin" />Assigning...</>
            ) : (
              <><Wand2 className="h-3.5 w-3.5" />Auto-assign Subtopics ({unassignedCount})</>
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
            <Button variant="outline" onClick={() => setShowAssignConfirm(false)}>Cancel</Button>
            <Button onClick={handleAssignSubtopics}>Continue</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Filter bar ─────────────────────────────────────────────────── */}
      <div className="rounded-lg border bg-card p-4 space-y-3">
        <div className="flex flex-wrap gap-4 items-start">
          {/* Three-level syllabus selector (drives server-side filtering) */}
          <div className="w-72">
            <SyllabusSelector
              key={selectorKey}
              onTopicChange={setTopicFilter}
              onSubtopicChange={setSubtopicFilter}
              onSubSubtopicChange={setSubSubtopicFilter}
            />
          </div>

          {/* Client-side filters */}
          <div className="flex flex-wrap gap-2 items-center flex-1 pt-5">
            <FilterSelect
              placeholder="All Boards"
              value={boardId}
              onValueChange={setBoardId}
              options={boards.map((b) => ({ value: b.id, label: b.name }))}
            />
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
            {batches.length > 0 && (
              <FilterSelect
                placeholder="All Batches"
                value={batchFilter}
                onValueChange={setBatchFilter}
                className="w-48"
                options={batches.map((b) => ({
                  value: b.id,
                  label: `${new Date(b.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} · ${b.total_files}f · ${b.total_questions_extracted}q`,
                }))}
              />
            )}
            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1">
                <X className="h-3 w-3" /> Clear
              </Button>
            )}
          </div>
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
              <TableHead className="w-28">Serial</TableHead>
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
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-muted-foreground py-12">
                  <Loader2 className="h-5 w-5 animate-spin inline-block mr-2" />
                  Loading questions…
                </TableCell>
              </TableRow>
            ) : filteredGroups.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-muted-foreground py-12">
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
                      <div className="flex flex-col gap-0.5">
                        <SerialPill serial={q.serial_number ?? null} />
                        {q.parent_question_ref && (
                          <span className="font-mono text-[11px] text-muted-foreground">
                            Q{q.parent_question_ref}{q.part_label ? `(${q.part_label})` : ''}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <span className="font-mono text-xs text-muted-foreground">
                          {q.subtopics?.ref ?? '—'}
                        </span>
                        <span className="ml-1.5 text-xs">{q.subtopics?.name ?? ''}</span>
                      </div>
                      {q.sub_subtopics && (
                        <div className="text-[11px] text-muted-foreground mt-0.5">
                          {q.sub_subtopics.ext_num}.{' '}
                          {q.sub_subtopics.outcome.length > 60
                            ? q.sub_subtopics.outcome.slice(0, 60) + '…'
                            : q.sub_subtopics.outcome}
                        </div>
                      )}
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
                        onClick={() => router.push(`/admin/questions/${g.id}`)}
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
      <SelectContent className="max-h-64 overflow-y-auto" alignItemWithTrigger={false}>
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

function SerialPill({ serial }: { serial: string | null }) {
  const [copied, setCopied] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  if (!serial) return <span className="font-mono text-xs text-muted-foreground/40">—</span>

  function handleClick() {
    navigator.clipboard.writeText(serial!).then(() => {
      setCopied(true)
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <button
      onClick={handleClick}
      title={copied ? 'Copied!' : 'Click to copy'}
      className="inline-flex items-center rounded px-1.5 py-0.5 font-mono text-[11px] bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
    >
      {copied ? 'Copied!' : serial}
    </button>
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
