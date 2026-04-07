'use client'

import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { Subtopic, SubtopicStatus } from '@/types/schedule'

const STATUS_OPTIONS: { value: SubtopicStatus; label: string }[] = [
  { value: 'draft',       label: 'Draft' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'review',      label: 'In Review' },
  { value: 'approved',    label: 'Approved' },
]

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  topicId: string
  subtopic?: Subtopic
  onSave: (subtopic: Subtopic) => void
}

const EMPTY = {
  ref: '', title: '', due_date: '', sprint_week: '' as string,
  mcq_count: 0, short_ans_count: 0, structured_count: 0, extended_count: 0,
  status: 'draft' as SubtopicStatus,
}

export function SubtopicModal({ open, onOpenChange, topicId, subtopic, onSave }: Props) {
  const isEdit = !!subtopic
  const [form, setForm]       = useState(EMPTY)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError]     = useState('')

  useEffect(() => {
    if (open) {
      setError('')
      setForm(
        subtopic
          ? {
              ref:              subtopic.ref,
              title:            subtopic.title,
              due_date:         subtopic.due_date ?? '',
              sprint_week:      subtopic.sprint_week != null ? String(subtopic.sprint_week) : '',
              mcq_count:        subtopic.mcq_count,
              short_ans_count:  subtopic.short_ans_count,
              structured_count: subtopic.structured_count,
              extended_count:   subtopic.extended_count,
              status:           subtopic.status,
            }
          : EMPTY,
      )
    }
  }, [open, subtopic])

  function set(field: string, value: string | number) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  const qsTotal     = form.mcq_count + form.short_ans_count + form.structured_count + form.extended_count
  const sprintLabel = form.sprint_week || 'Select sprint'
  const statusLabel = STATUS_OPTIONS.find((o) => o.value === form.status)?.label ?? 'Draft'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim()) {
      setError('Title is required.')
      return
    }
    setError('')
    setIsLoading(true)
    try {
      const payload = {
        ...form,
        topic_id:    topicId,
        qs_total:    qsTotal,
        due_date:    form.due_date || null,
        sprint_week: form.sprint_week || null,
      }
      const url    = isEdit ? `/api/schedule/subtopics/${subtopic!.id}` : '/api/schedule/subtopics'
      const method = isEdit ? 'PATCH' : 'POST'
      const res    = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json() as { subtopic?: Subtopic; error?: string }
      if (!res.ok) throw new Error(data.error ?? 'Failed to save subtopic')
      onSave(data.subtopic!)
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save subtopic')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Subtopic' : 'Add Subtopic'}</DialogTitle>
        </DialogHeader>

        <form id="subtopic-form" onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Ref + Title */}
          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="s-ref">Ref</Label>
              <Input
                id="s-ref"
                value={form.ref}
                onChange={(e) => set('ref', e.target.value)}
                placeholder="1.1"
                disabled={isLoading}
              />
            </div>
            <div className="col-span-3 space-y-1.5">
              <Label htmlFor="s-title">Title <span className="text-destructive">*</span></Label>
              <Input
                id="s-title"
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
                placeholder="Types of numbers"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Due date + Sprint + Status */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="s-due">Due Date</Label>
              <Input
                id="s-due"
                type="date"
                value={form.due_date}
                onChange={(e) => set('due_date', e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Sprint Week</Label>
              <Select
                value={String(form.sprint_week)}
                onValueChange={(v) => set('sprint_week', v ?? '')}
              >
                <SelectTrigger className="w-full">
                  <span>{sprintLabel}</span>
                </SelectTrigger>
                <SelectContent alignItemWithTrigger={false}>
                  {Array.from({ length: 14 }, (_, i) => `Wk ${i + 1}`).map((w) => (
                    <SelectItem key={w} value={w} label={w}>
                      {w}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) => set('status', (v ?? 'draft') as SubtopicStatus)}
              >
                <SelectTrigger className="w-full">
                  <span>{statusLabel}</span>
                </SelectTrigger>
                <SelectContent alignItemWithTrigger={false}>
                  {STATUS_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value} label={o.label}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Question counts */}
          <div className="space-y-2">
            <div className="grid grid-cols-4 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="s-mcq">MCQ</Label>
                <Input
                  id="s-mcq"
                  type="number"
                  min={0}
                  value={form.mcq_count}
                  onChange={(e) => set('mcq_count', Number(e.target.value))}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="s-short">Short Ans</Label>
                <Input
                  id="s-short"
                  type="number"
                  min={0}
                  value={form.short_ans_count}
                  onChange={(e) => set('short_ans_count', Number(e.target.value))}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="s-struct">Structured</Label>
                <Input
                  id="s-struct"
                  type="number"
                  min={0}
                  value={form.structured_count}
                  onChange={(e) => set('structured_count', Number(e.target.value))}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="s-ext">Extended</Label>
                <Input
                  id="s-ext"
                  type="number"
                  min={0}
                  value={form.extended_count}
                  onChange={(e) => set('extended_count', Number(e.target.value))}
                  disabled={isLoading}
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Total Qs:{' '}
              <span className="font-semibold text-foreground tabular-nums">{qsTotal}</span>
              {' '}(calculated automatically)
            </p>
          </div>

          {error && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}
        </form>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" form="subtopic-form" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
