'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { MathRenderer } from '@/components/admin/math-renderer'
import { StatusBadge } from '@/components/admin/status-badge'
import { TypeBadge } from '@/components/admin/type-badge'
import { DifficultyStars } from '@/components/admin/difficulty-stars'
import { RejectDialog } from '@/components/admin/reject-dialog'
import type { AnswerWithQuestion } from '@/types/database'

export function AnswerReviewClient({ answer }: { answer: AnswerWithQuestion }) {
  const router = useRouter()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const q = answer.questions as any

  const [contentText, setContentText] = useState(answer.content)
  const [markScheme,  setMarkScheme]  = useState(answer.mark_scheme)
  const [status,      setStatus]      = useState(answer.status)

  const [isSaving,    setIsSaving]    = useState(false)
  const [isApproving, setIsApproving] = useState(false)
  const [isRejecting, setIsRejecting] = useState(false)

  async function patchAnswer(updates: Record<string, unknown>) {
    const res = await fetch(`/api/answers/${answer.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })
    if (!res.ok) {
      const d = await res.json() as { error?: string }
      throw new Error(d.error ?? `Server error ${res.status}`)
    }
  }

  async function handleSaveDraft() {
    setIsSaving(true)
    try {
      await patchAnswer({ content: contentText, mark_scheme: markScheme })
      toast.success('Answer saved as draft')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setIsSaving(false)
    }
  }

  async function handleApprove() {
    setIsApproving(true)
    try {
      await patchAnswer({ content_text: contentText, mark_scheme: markScheme, status: 'approved' })
      setStatus('approved')
      toast.success('Answer approved')
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Approve failed')
    } finally {
      setIsApproving(false)
    }
  }

  async function handleReject(note: string) {
    setIsRejecting(true)
    try {
      await patchAnswer({ status: 'rejected' })
      setStatus('rejected')
      if (note) console.info(`[Rejection note for answer ${answer.id}]:`, note)
      toast.success('Answer rejected')
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Reject failed')
    } finally {
      setIsRejecting(false)
    }
  }

  const isBusy = isSaving || isApproving || isRejecting

  return (
    <div className="space-y-6">
      {/* Status */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Status:</span>
        <StatusBadge status={status} />
        {answer.confidence_score != null && (
          <span className="text-sm text-muted-foreground ml-2">
            Confidence:{' '}
            <span className="font-medium">{Math.round(answer.confidence_score * 100)}%</span>
          </span>
        )}
      </div>

      {/* ── Original question (read-only) ──────────────────────────────── */}
      <section className="space-y-2">
        <div className="flex items-center gap-3">
          <Label className="text-xs uppercase tracking-wide text-muted-foreground">
            Original Question
          </Label>
          {q?.question_type && <TypeBadge type={q.question_type} />}
          {q?.difficulty    && <DifficultyStars value={q.difficulty} />}
          {q?.marks         && (
            <span className="text-xs text-muted-foreground">{q.marks} marks</span>
          )}
        </div>
        <div className="rounded-lg border bg-muted/30 p-4 text-sm">
          <MathRenderer text={q?.content_text ?? ''} />
        </div>
      </section>

      {/* ── Step-by-step (read-only cards) ─────────────────────────────── */}
      {answer.step_by_step.length > 0 && (
        <section className="space-y-2">
          <Label className="text-xs uppercase tracking-wide text-muted-foreground">
            Step-by-Step Solution
          </Label>
          <ol className="space-y-2">
            {answer.step_by_step.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold mt-0.5">
                  {i + 1}
                </span>
                <div className="flex-1 rounded-lg border bg-muted/20 px-4 py-2 text-sm">
                  <MathRenderer text={step} />
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* ── Edit final answer ──────────────────────────────────────────── */}
      <section className="space-y-2">
        <Label htmlFor="content-text">Final Answer (editable)</Label>
        <Textarea
          id="content-text"
          value={contentText}
          onChange={(e) => setContentText(e.target.value)}
          rows={4}
          className="font-mono text-sm resize-y"
          placeholder="Final answer (use $...$ for inline math)"
        />
      </section>

      {/* ── Mark scheme ───────────────────────────────────────────────── */}
      <section className="space-y-2">
        <Label htmlFor="mark-scheme">Mark Scheme (editable)</Label>
        <Textarea
          id="mark-scheme"
          value={markScheme}
          onChange={(e) => setMarkScheme(e.target.value)}
          rows={3}
          className="text-sm resize-y"
          placeholder="Describe what earns marks…"
        />
      </section>

      {/* ── Actions ──────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-3 pt-2">
        <Button variant="outline" onClick={handleSaveDraft} disabled={isBusy}>
          {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Save Draft
        </Button>

        <Button onClick={handleApprove} disabled={isBusy || status === 'approved'}>
          {isApproving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Approve
        </Button>

        <RejectDialog onConfirm={handleReject} isLoading={isRejecting}>
          <Button variant="destructive" disabled={isBusy || status === 'rejected'}>
            {isRejecting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Reject
          </Button>
        </RejectDialog>
      </div>
    </div>
  )
}
