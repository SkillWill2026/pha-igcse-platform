'use client'

import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
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
import type { Topic } from '@/types/schedule'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  topic?: Topic
  onSave: (topic: Topic & { subtopics: [] }) => void
}

const EMPTY = {
  ref: '',
  name: '',
  subtopic_count: 0,
  total_questions: 0,
  ppt_decks: 0,
  completion_date: '',
  hours_est: 0,
}

export function TopicModal({ open, onOpenChange, topic, onSave }: Props) {
  const isEdit = !!topic
  const [form, setForm]       = useState(EMPTY)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError]     = useState('')

  useEffect(() => {
    if (open) {
      setError('')
      setForm(
        topic
          ? {
              ref:             topic.ref,
              name:            topic.name,
              subtopic_count:  topic.subtopic_count,
              total_questions: topic.total_questions,
              ppt_decks:       topic.ppt_decks,
              completion_date: topic.completion_date ?? '',
              hours_est:       topic.hours_est ?? 0,
            }
          : EMPTY,
      )
    }
  }, [open, topic])

  function set(field: string, value: string | number) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.ref.trim() || !form.name.trim()) {
      setError('Ref and Name are required.')
      return
    }
    setError('')
    setIsLoading(true)
    try {
      const payload = {
        ...form,
        completion_date: form.completion_date || null,
        hours_est:       form.hours_est || null,
      }
      const url    = isEdit ? `/api/schedule/topics/${topic!.id}` : '/api/schedule/topics'
      const method = isEdit ? 'PATCH' : 'POST'
      const res    = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json() as { topic?: Topic & { subtopics: [] }; error?: string }
      if (!res.ok) throw new Error(data.error ?? 'Failed to save topic')
      onSave(data.topic!)
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save topic')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Topic' : 'Add Topic'}</DialogTitle>
        </DialogHeader>

        <form id="topic-form" onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="t-ref">Ref <span className="text-destructive">*</span></Label>
              <Input
                id="t-ref"
                value={form.ref}
                onChange={(e) => set('ref', e.target.value)}
                placeholder="C1"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="t-name">Name <span className="text-destructive">*</span></Label>
              <Input
                id="t-name"
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                placeholder="Number"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="t-subtopic-count">Subtopics</Label>
              <Input
                id="t-subtopic-count"
                type="number"
                min={0}
                value={form.subtopic_count}
                onChange={(e) => set('subtopic_count', Number(e.target.value))}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="t-total-qs">Total Qs</Label>
              <Input
                id="t-total-qs"
                type="number"
                min={0}
                value={form.total_questions}
                onChange={(e) => set('total_questions', Number(e.target.value))}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="t-ppt">PPT Decks</Label>
              <Input
                id="t-ppt"
                type="number"
                min={0}
                value={form.ppt_decks}
                onChange={(e) => set('ppt_decks', Number(e.target.value))}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="t-date">Completion Date</Label>
              <Input
                id="t-date"
                type="date"
                value={form.completion_date}
                onChange={(e) => set('completion_date', e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="t-hours">Hours Est.</Label>
              <Input
                id="t-hours"
                type="number"
                min={0}
                value={form.hours_est}
                onChange={(e) => set('hours_est', Number(e.target.value))}
                disabled={isLoading}
              />
            </div>
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
          <Button type="submit" form="topic-form" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
