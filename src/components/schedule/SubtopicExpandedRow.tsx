'use client'

import { useState } from 'react'
import { Loader2, Pencil, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { PPTSection }      from '@/components/schedule/PPTSection'
import { ExamplesSection } from '@/components/schedule/ExamplesSection'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { Subtopic, SubSubtopic } from '@/types/schedule'

interface Props {
  subtopic:    Subtopic
  topicRef:    string
  topicName:   string
  isAdmin:     boolean
  onUpdate:    (subtopic: Subtopic) => void
}

// ── SubSubtopic Modal ──────────────────────────────────────────────────────────

interface ModalForm {
  ext_num: string
  core_num: string
  outcome: string
  tier: 'both' | 'extended'
}

const EMPTY_FORM: ModalForm = { ext_num: '', core_num: '', outcome: '', tier: 'both' }

function subSubtopicToForm(s: SubSubtopic): ModalForm {
  return {
    ext_num:  String(s.ext_num),
    core_num: s.core_num != null ? String(s.core_num) : '',
    outcome:  s.outcome,
    tier:     s.tier,
  }
}

interface SubSubtopicModalProps {
  open:    boolean
  editing: SubSubtopic | null
  onClose: () => void
  onSave:  (form: ModalForm) => Promise<void>
}

function SubSubtopicModal({ open, editing, onClose, onSave }: SubSubtopicModalProps) {
  const [form, setForm] = useState<ModalForm>(editing ? subSubtopicToForm(editing) : EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  function handleOpenChange(isOpen: boolean) {
    if (isOpen) setForm(editing ? subSubtopicToForm(editing) : EMPTY_FORM)
    else onClose()
  }

  function set<K extends keyof ModalForm>(field: K, value: ModalForm[K]) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSave() {
    setSaving(true)
    try { await onSave(form); onClose() } finally { setSaving(false) }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{editing ? 'Edit Learning Objective' : 'Add Learning Objective'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 py-2">
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Ext. Obj #</Label>
              <Input
                type="number" min={1}
                value={form.ext_num}
                onChange={(e) => set('ext_num', e.target.value)}
                placeholder="e.g. 1"
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Core Obj # (optional)</Label>
              <Input
                type="number" min={1}
                value={form.core_num}
                onChange={(e) => set('core_num', e.target.value)}
                placeholder="if differs"
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Tier</Label>
              <select
                value={form.tier}
                onChange={(e) => set('tier', e.target.value as 'both' | 'extended')}
                className="h-8 w-full rounded-md border border-input bg-background px-2 text-xs"
              >
                <option value="both">Both</option>
                <option value="extended">Extended only</option>
              </select>
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Learning Outcome</Label>
            <textarea
              value={form.outcome}
              onChange={(e) => set('outcome', e.target.value)}
              placeholder="Learning objective text"
              rows={3}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs resize-none focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button size="sm" onClick={handleSave} disabled={saving || !form.ext_num || !form.outcome}>
            {saving ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : null}
            {editing ? 'Save Changes' : 'Add'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ── SubSubtopics Section ───────────────────────────────────────────────────────

interface SubSubtopicsSectionProps {
  subtopic: Subtopic
  isAdmin:  boolean
  onUpdate: (updated: Subtopic) => void
}

function SubSubtopicsSection({ subtopic, isAdmin, onUpdate }: SubSubtopicsSectionProps) {
  const [items, setItems] = useState<SubSubtopic[]>(subtopic.sub_subtopics ?? [])
  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<SubSubtopic | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  function pushUpdate(newItems: SubSubtopic[]) {
    setItems(newItems)
    onUpdate({ ...subtopic, sub_subtopics: newItems })
  }

  async function handleSave(form: ModalForm) {
    if (editTarget) {
      const res = await fetch(`/api/schedule/sub-subtopics/${editTarget.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ext_num:  Number(form.ext_num),
          core_num: form.core_num ? Number(form.core_num) : null,
          outcome:  form.outcome,
          tier:     form.tier,
        }),
      })
      const data = await res.json() as { sub_subtopic?: SubSubtopic; error?: string }
      if (!res.ok) { toast.error(data.error ?? 'Update failed'); throw new Error(data.error) }
      pushUpdate(items.map((x) => (x.id === editTarget.id ? data.sub_subtopic! : x)))
      toast.success('Learning objective updated')
    } else {
      const res = await fetch('/api/schedule/sub-subtopics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subtopic_id: subtopic.id,
          ext_num:     Number(form.ext_num),
          core_num:    form.core_num ? Number(form.core_num) : null,
          outcome:     form.outcome,
          tier:        form.tier,
        }),
      })
      const data = await res.json() as { sub_subtopic?: SubSubtopic; error?: string }
      if (!res.ok) { toast.error(data.error ?? 'Create failed'); throw new Error(data.error) }
      pushUpdate([...items, data.sub_subtopic!])
      toast.success('Learning objective added')
    }
    setEditTarget(null)
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this learning objective? This cannot be undone.')) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/schedule/sub-subtopics/${id}`, { method: 'DELETE' })
      const data = await res.json() as { ok?: boolean; error?: string }
      if (!res.ok) { toast.error(data.error ?? 'Delete failed'); return }
      pushUpdate(items.filter((x) => x.id !== id))
      toast.success('Learning objective deleted')
    } catch {
      toast.error('Delete failed')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-3 col-span-full">
      <div className="flex items-center justify-between gap-2">
        <h4 className="text-sm font-semibold">Learning Objectives</h4>
        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600">
          {items.length}
        </span>
      </div>

      {items.length === 0 ? (
        <p className="text-xs text-muted-foreground">No learning objectives.</p>
      ) : (
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="text-xs h-8 py-1 w-14">Ext#</TableHead>
                <TableHead className="text-xs h-8 py-1 w-14">Core#</TableHead>
                <TableHead className="text-xs h-8 py-1">Learning Outcome</TableHead>
                <TableHead className="text-xs h-8 py-1 w-20">Tier</TableHead>
                <TableHead className="text-xs h-8 py-1 w-16" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((s) => (
                <TableRow key={s.id} className="hover:bg-muted/20 align-top">
                  <TableCell className="text-xs font-mono py-2">{s.ext_num}</TableCell>
                  <TableCell className="text-xs font-mono py-2 text-muted-foreground">
                    {s.core_num ?? '—'}
                  </TableCell>
                  <TableCell className="text-xs py-2 leading-relaxed">{s.outcome}</TableCell>
                  <TableCell className="py-2">
                    <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-xs font-medium ${
                      s.tier === 'extended'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {s.tier === 'extended' ? 'E' : 'C+E'}
                    </span>
                  </TableCell>
                  <TableCell className="py-1.5">
                      <div className="flex items-center gap-1 justify-end">
                        <Button
                          size="icon" variant="ghost" className="h-6 w-6"
                          onClick={() => { setEditTarget(s); setModalOpen(true) }}
                          title="Edit"
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button
                          size="icon" variant="ghost"
                          className="h-6 w-6 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDelete(s.id)}
                          disabled={deletingId === s.id}
                          title="Delete"
                        >
                          {deletingId === s.id
                            ? <Loader2 className="h-3 w-3 animate-spin" />
                            : <Trash2 className="h-3 w-3" />}
                        </Button>
                      </div>
                    </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Button
        size="sm" variant="outline" className="gap-1.5 text-xs"
        onClick={() => { setEditTarget(null); setModalOpen(true) }}
      >
        <Plus className="h-3.5 w-3.5" />
        Add Learning Objective
      </Button>

      <SubSubtopicModal
        open={modalOpen}
        editing={editTarget}
        onClose={() => { setModalOpen(false); setEditTarget(null) }}
        onSave={handleSave}
      />
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────────

export function SubtopicExpandedRow({ subtopic, topicRef, topicName, isAdmin, onUpdate }: Props) {
  function handleCountChange(count: number) {
    onUpdate({ ...subtopic, examples_count: count })
  }

  return (
    <div className="px-4 py-4 bg-muted/10 border-t space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PPT Section */}
        <div className="min-w-0">
          <PPTSection
            subtopic={subtopic}
            topicRef={topicRef}
            isAdmin={isAdmin}
            onUpdate={onUpdate}
          />
        </div>

        {/* Examples Section */}
        <div className="min-w-0">
          <ExamplesSection
            subtopic={subtopic}
            topicName={topicName}
            isAdmin={isAdmin}
            onCountChange={handleCountChange}
          />
        </div>
      </div>

      {/* Sub-subtopics Section — full width */}
      <div className="border-t pt-4">
        <SubSubtopicsSection
          subtopic={subtopic}
          isAdmin={isAdmin}
          onUpdate={onUpdate}
        />
      </div>
    </div>
  )
}
