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
  ref: string
  title: string
  syllabus_code: string
  mcq_count: string
  short_ans_count: string
  structured_count: string
  extended_count: string
}

const EMPTY_FORM: ModalForm = {
  ref: '',
  title: '',
  syllabus_code: '',
  mcq_count: '0',
  short_ans_count: '0',
  structured_count: '0',
  extended_count: '0',
}

function subSubtopicToForm(s: SubSubtopic): ModalForm {
  return {
    ref: s.ref,
    title: s.title,
    syllabus_code: s.syllabus_code ?? '',
    mcq_count: String(s.mcq_count),
    short_ans_count: String(s.short_ans_count),
    structured_count: String(s.structured_count),
    extended_count: String(s.extended_count),
  }
}

interface SubSubtopicModalProps {
  open: boolean
  editing: SubSubtopic | null
  onClose: () => void
  onSave: (form: ModalForm) => Promise<void>
}

function SubSubtopicModal({ open, editing, onClose, onSave }: SubSubtopicModalProps) {
  const [form, setForm] = useState<ModalForm>(editing ? subSubtopicToForm(editing) : EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  // Reset form when modal opens
  function handleOpenChange(isOpen: boolean) {
    if (isOpen) {
      setForm(editing ? subSubtopicToForm(editing) : EMPTY_FORM)
    } else {
      onClose()
    }
  }

  function set(field: keyof ModalForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const total =
    (Number(form.mcq_count) || 0) +
    (Number(form.short_ans_count) || 0) +
    (Number(form.structured_count) || 0) +
    (Number(form.extended_count) || 0)

  async function handleSave() {
    setSaving(true)
    try {
      await onSave(form)
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editing ? 'Edit Sub-subtopic' : 'Add Sub-subtopic'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Ref</Label>
              <Input
                value={form.ref}
                onChange={(e) => set('ref', e.target.value)}
                placeholder="e.g. 1.1.1"
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Syllabus Code</Label>
              <Input
                value={form.syllabus_code}
                onChange={(e) => set('syllabus_code', e.target.value)}
                placeholder="optional"
                className="h-8 text-xs"
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Title</Label>
            <Input
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="Sub-subtopic title"
              className="h-8 text-xs"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            <div className="space-y-1">
              <Label className="text-xs">MCQ</Label>
              <Input
                type="number"
                min={0}
                value={form.mcq_count}
                onChange={(e) => set('mcq_count', e.target.value)}
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Short Ans</Label>
              <Input
                type="number"
                min={0}
                value={form.short_ans_count}
                onChange={(e) => set('short_ans_count', e.target.value)}
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Structured</Label>
              <Input
                type="number"
                min={0}
                value={form.structured_count}
                onChange={(e) => set('structured_count', e.target.value)}
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Extended</Label>
              <Input
                type="number"
                min={0}
                value={form.extended_count}
                onChange={(e) => set('extended_count', e.target.value)}
                className="h-8 text-xs"
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Total Qs (auto): <strong>{total}</strong>
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave} disabled={saving || !form.ref || !form.title}>
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
    const qs_total =
      (Number(form.mcq_count) || 0) +
      (Number(form.short_ans_count) || 0) +
      (Number(form.structured_count) || 0) +
      (Number(form.extended_count) || 0)

    if (editTarget) {
      // PATCH
      const res = await fetch(`/api/schedule/sub-subtopics/${editTarget.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ref: form.ref,
          title: form.title,
          syllabus_code: form.syllabus_code || null,
          mcq_count: Number(form.mcq_count) || 0,
          short_ans_count: Number(form.short_ans_count) || 0,
          structured_count: Number(form.structured_count) || 0,
          extended_count: Number(form.extended_count) || 0,
          qs_total,
        }),
      })
      const data = await res.json() as { sub_subtopic?: SubSubtopic; error?: string }
      if (!res.ok) {
        toast.error(data.error ?? 'Update failed')
        throw new Error(data.error)
      }
      const updated = data.sub_subtopic!
      pushUpdate(items.map((x) => (x.id === updated.id ? updated : x)))
      toast.success('Sub-subtopic updated')
    } else {
      // POST
      const res = await fetch('/api/schedule/sub-subtopics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subtopic_id: subtopic.id,
          ref: form.ref,
          title: form.title,
          syllabus_code: form.syllabus_code || null,
          mcq_count: Number(form.mcq_count) || 0,
          short_ans_count: Number(form.short_ans_count) || 0,
          structured_count: Number(form.structured_count) || 0,
          extended_count: Number(form.extended_count) || 0,
          qs_total,
        }),
      })
      const data = await res.json() as { sub_subtopic?: SubSubtopic; error?: string }
      if (!res.ok) {
        toast.error(data.error ?? 'Create failed')
        throw new Error(data.error)
      }
      pushUpdate([...items, data.sub_subtopic!])
      toast.success('Sub-subtopic added')
    }
    setEditTarget(null)
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this sub-subtopic? This cannot be undone.')) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/schedule/sub-subtopics/${id}`, { method: 'DELETE' })
      const data = await res.json() as { ok?: boolean; error?: string }
      if (!res.ok) {
        toast.error(data.error ?? 'Delete failed')
        return
      }
      pushUpdate(items.filter((x) => x.id !== id))
      toast.success('Sub-subtopic deleted')
    } catch {
      toast.error('Delete failed')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-3 col-span-full">
      <div className="flex items-center justify-between gap-2">
        <h4 className="text-sm font-semibold">Sub-subtopics</h4>
        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600">
          {items.length}
        </span>
      </div>

      {items.length === 0 ? (
        <p className="text-xs text-muted-foreground">No sub-subtopics yet.</p>
      ) : (
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="text-xs h-8 py-1 w-20">Ref</TableHead>
                <TableHead className="text-xs h-8 py-1">Title</TableHead>
                <TableHead className="text-xs h-8 py-1 w-24">Syllabus</TableHead>
                <TableHead className="text-xs h-8 py-1 text-right w-16">Total Qs</TableHead>
                <TableHead className="text-xs h-8 py-1 text-right w-12">MCQ</TableHead>
                <TableHead className="text-xs h-8 py-1 text-right w-16">Short</TableHead>
                <TableHead className="text-xs h-8 py-1 text-right w-20">Struct.</TableHead>
                <TableHead className="text-xs h-8 py-1 text-right w-16">Ext.</TableHead>
                {isAdmin && <TableHead className="text-xs h-8 py-1 w-20" />}
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((s) => (
                <TableRow key={s.id} className="hover:bg-muted/20">
                  <TableCell className="text-xs font-mono py-1.5">{s.ref}</TableCell>
                  <TableCell className="text-xs py-1.5">{s.title}</TableCell>
                  <TableCell className="text-xs py-1.5">
                    {s.syllabus_code ? (
                      <span className="text-muted-foreground">{s.syllabus_code}</span>
                    ) : (
                      <span className="text-muted-foreground/40">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-xs py-1.5 text-right tabular-nums">{s.qs_total}</TableCell>
                  <TableCell className="text-xs py-1.5 text-right tabular-nums">{s.mcq_count}</TableCell>
                  <TableCell className="text-xs py-1.5 text-right tabular-nums">{s.short_ans_count}</TableCell>
                  <TableCell className="text-xs py-1.5 text-right tabular-nums">{s.structured_count}</TableCell>
                  <TableCell className="text-xs py-1.5 text-right tabular-nums">{s.extended_count}</TableCell>
                  {isAdmin && (
                    <TableCell className="py-1.5">
                      <div className="flex items-center gap-1 justify-end">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6"
                          onClick={() => { setEditTarget(s); setModalOpen(true) }}
                          title="Edit"
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
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
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {isAdmin && (
        <Button
          size="sm"
          variant="outline"
          className="gap-1.5 text-xs"
          onClick={() => { setEditTarget(null); setModalOpen(true) }}
        >
          <Plus className="h-3.5 w-3.5" />
          Add Sub-subtopic
        </Button>
      )}

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
