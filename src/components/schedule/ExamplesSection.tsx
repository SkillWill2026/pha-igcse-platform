'use client'

import { useEffect, useState } from 'react'
import { Loader2, Sparkles, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'
import type { Subtopic } from '@/types/schedule'

interface ExampleItem {
  id:           string
  content_text: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  answers:      any[]
}

interface Props {
  subtopic:   Subtopic
  topicName:  string
  isAdmin:    boolean
  onCountChange: (count: number) => void
}

const MAX_EXAMPLES = 3

export function ExamplesSection({ subtopic, topicName, isAdmin, onCountChange }: Props) {
  const [examples,       setExamples]       = useState<ExampleItem[]>([])
  const [approvedCount,  setApprovedCount]  = useState(0)
  const [loading,        setLoading]        = useState(true)
  const [generating,     setGenerating]     = useState(false)
  const [genError,       setGenError]       = useState('')
  const [deleteTarget,   setDeleteTarget]   = useState<ExampleItem | null>(null)
  const [deleteLoading,  setDeleteLoading]  = useState(false)

  const required = subtopic.examples_required ?? MAX_EXAMPLES

  // Fetch examples and approved question count on mount
  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const supabase = createSupabaseBrowserClient()
        const [exRes, countRes] = await Promise.all([
          supabase
            .from('questions')
            .select('id, content_text, answers(id, content, step_by_step, status)')
            .eq('subtopic_id', subtopic.id)
            .eq('is_example', true),
          supabase
            .from('questions')
            .select('*', { count: 'exact', head: true })
            .eq('subtopic_id', subtopic.id)
            .eq('status', 'approved')
            .eq('is_example', false),
        ])
        if (cancelled) return
        const exList = (exRes.data ?? []) as ExampleItem[]
        setExamples(exList)
        setApprovedCount(countRes.count ?? 0)
        onCountChange(exList.length)
      } catch {
        // silent
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subtopic.id])

  // ── Generate ───────────────────────────────────────────────────────────────
  async function handleGenerate() {
    setGenerating(true)
    setGenError('')
    try {
      const res  = await fetch('/api/schedule/examples/generate', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          subtopic_id:    subtopic.id,
          subtopic_ref:   subtopic.ref,
          subtopic_title: subtopic.title,
          topic_name:     topicName,
        }),
      })
      const data = await res.json() as {
        ok?: boolean
        examples?: ExampleItem[]
        count?: number
        error?: string
      }
      if (!res.ok) throw new Error(data.error ?? 'Generation failed')
      const newList = data.examples ?? []
      setExamples(newList as ExampleItem[])
      // Approved non-example count decreases by how many were marked
      setApprovedCount((prev) => Math.max(0, prev - (data.count ?? newList.length - examples.length)))
      onCountChange(newList.length)
      toast.success(`${newList.length} example${newList.length !== 1 ? 's' : ''} generated`)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Generation failed'
      setGenError(msg)
      toast.error(msg)
    } finally {
      setGenerating(false)
    }
  }

  // ── Delete ─────────────────────────────────────────────────────────────────
  async function handleDelete() {
    if (!deleteTarget) return
    setDeleteLoading(true)
    try {
      const res  = await fetch(`/api/schedule/examples/${deleteTarget.id}`, { method: 'DELETE' })
      const data = await res.json() as { ok?: boolean; error?: string }
      if (!res.ok) throw new Error(data.error ?? 'Delete failed')
      const newList = examples.filter((e) => e.id !== deleteTarget.id)
      setExamples(newList)
      setApprovedCount((prev) => prev + 1) // it's back as a non-example
      onCountChange(newList.length)
      setDeleteTarget(null)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Delete failed')
    } finally {
      setDeleteLoading(false)
    }
  }

  const canGenerate  = examples.length < required && approvedCount > 0
  const atMax        = examples.length >= required
  const noApproved   = approvedCount === 0

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <h4 className="text-sm font-semibold">Worked Examples</h4>
        <span
          className={cn(
            'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
            examples.length >= required
              ? 'bg-green-100 text-green-800'
              : examples.length > 0
                ? 'bg-amber-100 text-amber-700'
                : 'bg-gray-100 text-gray-600',
          )}
        >
          {examples.length} / {required}
        </span>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex items-center gap-2 text-xs text-muted-foreground py-2">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Loading…
        </div>
      ) : (
        <>
          {/* Examples list */}
          <div className="space-y-2">
            {examples.length === 0 ? (
              <p className="text-xs text-muted-foreground">No worked examples yet.</p>
            ) : (
              examples.map((ex, idx) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const ans = ex.answers?.find((a: any) => a.status === 'approved') ?? ex.answers?.[0]
                return (
                  <div key={ex.id} className="rounded-md border bg-muted/20 p-3 space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-medium text-muted-foreground">Example {idx + 1}</p>
                      {isAdmin && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-5 w-5 text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
                          onClick={() => setDeleteTarget(ex)}
                          title="Remove example"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                    <p className="text-xs leading-relaxed line-clamp-3">{ex.content_text}</p>
                    {ans?.content && (
                      <div className="border-t pt-1.5 mt-1.5">
                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-4">
                          {ans.content}
                        </p>
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>

          {/* Generate button */}
          {isAdmin && (
            <div className="space-y-1.5">
              <Button
                size="sm"
                variant="outline"
                onClick={handleGenerate}
                disabled={generating || !canGenerate}
                className="gap-2 text-xs"
              >
                {generating
                  ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  : <Sparkles className="h-3.5 w-3.5" />}
                {generating ? 'Generating…' : 'Generate with AI'}
              </Button>
              {atMax && (
                <p className="text-xs text-muted-foreground">Maximum {required} examples reached.</p>
              )}
              {!atMax && noApproved && (
                <p className="text-xs text-muted-foreground">
                  No approved questions available for this subtopic.
                </p>
              )}
              {genError && (
                <p className="text-xs text-destructive">{genError}</p>
              )}
            </div>
          )}
        </>
      )}

      {/* Delete confirm */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Remove Example</DialogTitle>
            <DialogDescription>
              Remove this worked example? The question will remain in the question bank.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={deleteLoading}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteLoading}>
              {deleteLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
