'use client'

import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { Download, Loader2, Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { TopicRow } from '@/components/schedule/TopicRow'
import { TopicModal } from '@/components/schedule/TopicModal'
import { SubtopicModal } from '@/components/schedule/SubtopicModal'
import type { Subtopic, SubtopicStatus, Topic, TopicWithSubtopics } from '@/types/schedule'


// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  sub,
}: {
  label: string
  value: string | number
  sub?: string
}) {
  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">
        {label}
      </p>
      <p className="text-2xl font-bold tabular-nums">{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
    </div>
  )
}

// ── CSV export ─────────────────────────────────────────────────────────────────
function exportCsv(topics: TopicWithSubtopics[]) {
  const header = 'Topic Ref,Topic Name,Subtopic Ref,Subtopic Title,Due Date,Sprint Week,Total Qs,MCQ,Short Ans,Structured,Extended,Status'
  const rows = topics.flatMap((t) =>
    t.subtopics.map((s) =>
      [
        t.ref,
        `"${t.name}"`,
        s.ref,
        `"${s.title}"`,
        s.due_date ?? '',
        s.sprint_week ?? '',
        s.qs_total,
        s.mcq_count,
        s.short_ans_count,
        s.structured_count,
        s.extended_count,
        s.status,
      ].join(','),
    ),
  )
  const csv  = [header, ...rows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = 'content-delivery-schedule.csv'
  a.click()
  URL.revokeObjectURL(url)
}

// ── Props ─────────────────────────────────────────────────────────────────────
interface Props {
  initialTopics: TopicWithSubtopics[]
  isAdmin:       boolean
}

export function ScheduleClient({ initialTopics, isAdmin }: Props) {
  const [topics,      setTopics]      = useState<TopicWithSubtopics[]>(initialTopics)

  // Filters
  const [searchQ,       setSearchQ]       = useState('')
  const [filterSprint,  setFilterSprint]  = useState('all')
  const [filterStatus,  setFilterStatus]  = useState('all')
  const [filterTopic,   setFilterTopic]   = useState('all')

  // Topic modal
  const [addTopicOpen,  setAddTopicOpen]  = useState(false)
  const [editTopic,     setEditTopic]     = useState<Topic | null>(null)

  // Subtopic modal
  const [addSubtopicTopicId, setAddSubtopicTopicId] = useState<string | null>(null)
  const [editSubtopic,       setEditSubtopic]        = useState<Subtopic | null>(null)

  // Delete confirms
  const [deleteTopicTarget,    setDeleteTopicTarget]    = useState<TopicWithSubtopics | null>(null)
  const [deleteSubtopicTarget, setDeleteSubtopicTarget] = useState<{ subtopic: Subtopic; topicId: string } | null>(null)
  const [deleteLoading,        setDeleteLoading]        = useState(false)

  // ── Stats ──────────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const allSubs   = topics.flatMap((t) => t.subtopics)
    const totalQs   = allSubs.reduce((acc, s) => acc + s.qs_total, 0)
    const approved  = allSubs.filter((s) => s.status === 'approved')
    const approvedQs = approved.reduce((acc, s) => acc + s.qs_total, 0)
    const topicsComplete = topics.filter(
      (t) => t.subtopics.length > 0 && t.subtopics.every((s) => s.status === 'approved'),
    ).length

    const today = new Date(); today.setHours(0, 0, 0, 0)

    // Subtopics that have both a due_date and a sprint_week string, and are not yet approved
    const incomplete = allSubs.filter(
      (s) => s.sprint_week != null && s.due_date && s.status !== 'approved',
    )

    let currentSprint: string | null = null

    if (incomplete.length > 0) {
      // Prefer subtopics due today or in the future; fall back to overdue ones
      const upcoming = incomplete.filter((s) => new Date(s.due_date!) >= today)
      const pool     = upcoming.length > 0 ? upcoming : incomplete

      // Pick the subtopic with the earliest due_date
      const earliest = pool.reduce((best, s) =>
        new Date(s.due_date!) < new Date(best.due_date!) ? s : best,
      )
      currentSprint = String(earliest.sprint_week)
    }

    return { totalQs, approvedCount: approved.length, approvedQs, topicsComplete, currentSprint }
  }, [topics])

  // ── Sprint options derived from actual data ────────────────────────────────
  const sprintOptions = useMemo(() => {
    const seen  = new Set<string>()
    const opts: string[] = []
    topics.flatMap((t) => t.subtopics).forEach((s) => {
      const v = s.sprint_week != null ? String(s.sprint_week) : null
      if (v && !seen.has(v)) { seen.add(v); opts.push(v) }
    })
    // Sort numerically by extracting trailing number, fall back to string sort
    opts.sort((a, b) => {
      const na = parseInt(a.replace(/\D/g, ''), 10)
      const nb = parseInt(b.replace(/\D/g, ''), 10)
      return isNaN(na) || isNaN(nb) ? a.localeCompare(b) : na - nb
    })
    return opts
  }, [topics])

  // ── Filtered view ─────────────────────────────────────────────────────────
  const filteredTopics = useMemo(() => {
    const q = searchQ.toLowerCase()
    return topics
      .map((t) => ({
        ...t,
        filteredSubs: t.subtopics.filter((s) => {
          if (q && !s.title.toLowerCase().includes(q) && !s.ref.toLowerCase().includes(q)) return false
          if (filterSprint !== 'all' && String(s.sprint_week) !== filterSprint) return false
          if (filterStatus !== 'all' && s.status !== filterStatus) return false
          return true
        }),
      }))
      .filter((t) => {
        if (filterTopic !== 'all' && t.id !== filterTopic) return false
        // If content filters are active, hide topics with no matching subtopics
        const hasContentFilter = q || filterSprint !== 'all' || filterStatus !== 'all'
        if (hasContentFilter && t.filteredSubs.length === 0) return false
        return true
      })
  }, [topics, searchQ, filterSprint, filterStatus, filterTopic])

  const totalSubtopics = topics.reduce((acc, t) => acc + t.subtopics.length, 0)

  // ── Mutation helpers ───────────────────────────────────────────────────────
  function upsertTopic(topic: TopicWithSubtopics) {
    setTopics((prev) => {
      const idx = prev.findIndex((t) => t.id === topic.id)
      if (idx === -1) return [...prev, topic]
      const next = [...prev]
      next[idx]  = { ...topic, subtopics: prev[idx].subtopics }
      return next
    })
  }

  function removeTopic(id: string) {
    setTopics((prev) => prev.filter((t) => t.id !== id))
  }

  function upsertSubtopic(subtopic: Subtopic) {
    setTopics((prev) =>
      prev.map((t) => {
        if (t.id !== subtopic.topic_id) return t
        const idx = t.subtopics.findIndex((s) => s.id === subtopic.id)
        const subs =
          idx === -1
            ? [...t.subtopics, subtopic]
            : t.subtopics.map((s) => (s.id === subtopic.id ? subtopic : s))
        return { ...t, subtopics: subs }
      }),
    )
  }

  function removeSubtopic(id: string, topicId: string) {
    setTopics((prev) =>
      prev.map((t) =>
        t.id !== topicId ? t : { ...t, subtopics: t.subtopics.filter((s) => s.id !== id) },
      ),
    )
  }

  // ── Inline status change ───────────────────────────────────────────────────
  async function handleStatusChange(subtopicId: string, topicId: string, status: SubtopicStatus) {
    try {
      const res  = await fetch(`/api/schedule/subtopics/${subtopicId}`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ status }),
      })
      const data = await res.json() as { subtopic?: Subtopic; error?: string }
      if (!res.ok) throw new Error(data.error ?? 'Failed to update status')
      upsertSubtopic(data.subtopic!)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update status')
    }
  }

  // ── Delete topic ───────────────────────────────────────────────────────────
  async function confirmDeleteTopic() {
    if (!deleteTopicTarget) return
    setDeleteLoading(true)
    try {
      const res = await fetch(`/api/schedule/topics/${deleteTopicTarget.id}`, { method: 'DELETE' })
      const data = await res.json() as { ok?: boolean; error?: string }
      if (!res.ok) throw new Error(data.error ?? 'Failed to delete topic')
      removeTopic(deleteTopicTarget.id)
      toast.success(`Topic ${deleteTopicTarget.ref} deleted`)
      setDeleteTopicTarget(null)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete topic')
    } finally {
      setDeleteLoading(false)
    }
  }

  // ── Delete subtopic ────────────────────────────────────────────────────────
  async function confirmDeleteSubtopic() {
    if (!deleteSubtopicTarget) return
    setDeleteLoading(true)
    try {
      const { subtopic, topicId } = deleteSubtopicTarget
      const res  = await fetch(`/api/schedule/subtopics/${subtopic.id}`, { method: 'DELETE' })
      const data = await res.json() as { ok?: boolean; error?: string }
      if (!res.ok) throw new Error(data.error ?? 'Failed to delete subtopic')
      removeSubtopic(subtopic.id, topicId)
      toast.success(`Subtopic "${subtopic.title}" deleted`)
      setDeleteSubtopicTarget(null)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete subtopic')
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-0.5">Content Delivery Schedule</h1>
          <p className="text-sm text-muted-foreground">
            IGCSE Mathematics · {totalSubtopics} subtopics · April – July 2026
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => exportCsv(topics)} className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          {isAdmin && (
            <Button onClick={() => setAddTopicOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Topic
            </Button>
          )}
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          label="Total Questions"
          value={stats.totalQs.toLocaleString()}
          sub="across all subtopics"
        />
        <StatCard
          label="Approved"
          value={stats.approvedCount}
          sub={`${stats.approvedQs.toLocaleString()} Qs complete`}
        />
        <StatCard
          label="Current Sprint"
          value={stats.currentSprint ?? '—'}
          sub="based on due dates"
        />
        <StatCard
          label="Topics Complete"
          value={`${stats.topicsComplete}/${topics.length}`}
          sub="all subtopics approved"
        />
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <Input
            className="pl-8"
            placeholder="Search subtopics…"
            value={searchQ}
            onChange={(e) => setSearchQ(e.target.value)}
          />
        </div>

        <Select value={filterSprint} onValueChange={(v) => setFilterSprint(v ?? 'all')}>
          <SelectTrigger className="w-32">
            <span>{filterSprint === 'all' ? 'All Sprints' : filterSprint}</span>
          </SelectTrigger>
          <SelectContent alignItemWithTrigger={false}>
            <SelectItem value="all" label="All Sprints">All Sprints</SelectItem>
            {sprintOptions.map((v) => (
              <SelectItem key={v} value={v} label={v}>{v}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v ?? 'all')}>
          <SelectTrigger className="w-32">
            <span>
              {filterStatus === 'all'
                ? 'All Statuses'
                : filterStatus === 'in_progress'
                  ? 'In Progress'
                  : filterStatus === 'review'
                    ? 'In Review'
                    : filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}
            </span>
          </SelectTrigger>
          <SelectContent alignItemWithTrigger={false}>
            <SelectItem value="all"        label="All Statuses">All Statuses</SelectItem>
            <SelectItem value="draft"       label="Draft">Draft</SelectItem>
            <SelectItem value="in_progress" label="In Progress">In Progress</SelectItem>
            <SelectItem value="review"      label="In Review">In Review</SelectItem>
            <SelectItem value="approved"    label="Approved">Approved</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterTopic} onValueChange={(v) => setFilterTopic(v ?? 'all')}>
          <SelectTrigger className="w-44">
            <span>
              {filterTopic === 'all'
                ? 'All Topics'
                : topics.find((t) => t.id === filterTopic)?.name ?? 'All Topics'}
            </span>
          </SelectTrigger>
          <SelectContent alignItemWithTrigger={false}>
            <SelectItem value="all" label="All Topics">All Topics</SelectItem>
            {topics.map((t) => (
              <SelectItem key={t.id} value={t.id} label={`${t.ref} ${t.name}`}>
                {t.ref} {t.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* ── Topic blocks ── */}
      <div className="space-y-3">
        {filteredTopics.length === 0 ? (
          <div className="rounded-lg border bg-card p-12 text-center text-muted-foreground">
            No topics match the current filters.
          </div>
        ) : (
          filteredTopics.map((t) => (
            <TopicRow
              key={t.id}
              topic={t}
              isAdmin={isAdmin}
              filteredSubtopics={t.filteredSubs}
              onEditTopic={() => setEditTopic(t)}
              onDeleteTopic={() => setDeleteTopicTarget(t)}
              onAddSubtopic={() => setAddSubtopicTopicId(t.id)}
              onEditSubtopic={(s) => setEditSubtopic(s)}
              onDeleteSubtopic={(s) => setDeleteSubtopicTarget({ subtopic: s, topicId: t.id })}
              onStatusChange={(sid, status) => handleStatusChange(sid, t.id, status)}
            />
          ))
        )}
      </div>

      {/* ── Topic modal (add) ── */}
      <TopicModal
        open={addTopicOpen}
        onOpenChange={setAddTopicOpen}
        onSave={(topic) => {
          upsertTopic(topic as TopicWithSubtopics)
          toast.success(`Topic ${topic.ref} added`)
        }}
      />

      {/* ── Topic modal (edit) ── */}
      <TopicModal
        open={!!editTopic}
        onOpenChange={(open) => { if (!open) setEditTopic(null) }}
        topic={editTopic ?? undefined}
        onSave={(topic) => {
          upsertTopic(topic as TopicWithSubtopics)
          toast.success(`Topic ${topic.ref} updated`)
          setEditTopic(null)
        }}
      />

      {/* ── Subtopic modal (add) ── */}
      {addSubtopicTopicId && (
        <SubtopicModal
          open
          onOpenChange={(open) => { if (!open) setAddSubtopicTopicId(null) }}
          topicId={addSubtopicTopicId}
          onSave={(sub) => {
            upsertSubtopic(sub)
            toast.success(`Subtopic "${sub.title}" added`)
            setAddSubtopicTopicId(null)
          }}
        />
      )}

      {/* ── Subtopic modal (edit) ── */}
      {editSubtopic && (
        <SubtopicModal
          open
          onOpenChange={(open) => { if (!open) setEditSubtopic(null) }}
          topicId={editSubtopic.topic_id}
          subtopic={editSubtopic}
          onSave={(sub) => {
            upsertSubtopic(sub)
            toast.success(`Subtopic "${sub.title}" updated`)
            setEditSubtopic(null)
          }}
        />
      )}

      {/* ── Delete topic confirm ── */}
      <Dialog
        open={!!deleteTopicTarget}
        onOpenChange={(open) => { if (!open) setDeleteTopicTarget(null) }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Topic</DialogTitle>
            <DialogDescription>
              Delete <strong>{deleteTopicTarget?.ref} {deleteTopicTarget?.name}</strong>?
              {' '}All subtopics will also be deleted. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteTopicTarget(null)}
              disabled={deleteLoading}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteTopic} disabled={deleteLoading}>
              {deleteLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete subtopic confirm ── */}
      <Dialog
        open={!!deleteSubtopicTarget}
        onOpenChange={(open) => { if (!open) setDeleteSubtopicTarget(null) }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Subtopic</DialogTitle>
            <DialogDescription>
              Delete <strong>&quot;{deleteSubtopicTarget?.subtopic.title}&quot;</strong>?
              {' '}This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteSubtopicTarget(null)}
              disabled={deleteLoading}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteSubtopic} disabled={deleteLoading}>
              {deleteLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
