'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2, Sparkles, Star, Trash2, Upload, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
} from '@/components/ui/select'
import { MathRenderer } from '@/components/admin/math-renderer'
import { RejectDialog } from '@/components/admin/reject-dialog'
import { DeleteDialog } from '@/components/admin/delete-dialog'
import type { QuestionWithRelations, QuestionType, QuestionStatus } from '@/types/database'

const QUESTION_TYPES: { value: QuestionType; label: string }[] = [
  { value: 'mcq',          label: 'MCQ' },
  { value: 'short_answer', label: 'Short Answer' },
  { value: 'structured',   label: 'Structured' },
  { value: 'extended',     label: 'Extended' },
]

const STATUS_OPTIONS: { value: QuestionStatus; label: string }[] = [
  { value: 'draft',    label: 'Draft' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
]

const STATUS_COLORS: Record<QuestionStatus, string> = {
  draft:    'text-gray-600',
  approved: 'text-green-700',
  rejected: 'text-red-700',
}

const UNASSIGNED = '__unassigned__'

export function ReviewClient({
  question,
  allBoards,
  allSubtopics,
  allTopics,
  allSubSubtopics,
}: {
  question: QuestionWithRelations
  allBoards: { id: string; name: string }[]
  allSubtopics: { id: string; ref: string; title: string; topic_id: string }[]
  allTopics: { id: string; ref: string; name: string }[]
  allSubSubtopics: { id: string; ref: string; title: string; subtopic_id: string }[]
}) {
  const router = useRouter()

  const [contentText,      setContentText]      = useState(question.content_text)
  const [difficulty,       setDifficulty]       = useState(question.difficulty)
  const [questionType,     setQuestionType]     = useState<QuestionType>(question.question_type)
  const [marks,            setMarks]            = useState(question.marks)
  const [status,           setStatus]           = useState<QuestionStatus>(question.status)
  const [imageUrl,         setImageUrl]         = useState<string | null>(question.image_url)
  const [linkedBoardIds,   setLinkedBoardIds]   = useState<Set<string>>(new Set())

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [subtopicId,    setSubtopicId]    = useState<string | null>((question as any).subtopic_id ?? null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [subSubtopicId, setSubSubtopicId] = useState<string | null>((question as any).sub_subtopic_id ?? null)

  const relevantSubSubtopics = useMemo(
    () => (subtopicId ? allSubSubtopics.filter((s) => s.subtopic_id === subtopicId) : []),
    [subtopicId, allSubSubtopics],
  )

  const topicGroups = useMemo(() => {
    const map = new Map(allTopics.map((t) => ({ ...t, items: [] as typeof allSubtopics })).map((t) => [t.id, t]))
    for (const s of allSubtopics) {
      const g = map.get(s.topic_id)
      if (g) g.items.push(s)
    }
    return Array.from(map.values()).filter((g) => g.items.length > 0)
  }, [allSubtopics, allTopics])

  const [isSaving,         setIsSaving]         = useState(false)
  const [isApproving,      setIsApproving]      = useState(false)
  const [isRejecting,      setIsRejecting]      = useState(false)
  const [isDeleting,       setIsDeleting]       = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [imageJustUploaded, setImageJustUploaded] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Boards the question doesn't already belong to (for cross-board linking)
  const otherBoards = allBoards.filter((b) => b.id !== question.exam_board_id)

  // Sync image state from DB whenever the question changes (client-side navigation
  // reuses the component instance, so useState initial value won't re-run).
  useEffect(() => {
    setImageUrl(question.image_url)
    setImageJustUploaded(false)
    setLinkedBoardIds(new Set())
  }, [question.id, question.image_url])

  // ── Helpers ───────────────────────────────────────────────────────────────
  async function patchQuestion(updates: Record<string, unknown>) {
    const res = await fetch(`/api/questions/${question.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })
    if (!res.ok) {
      const d = await res.json() as { error?: string }
      throw new Error(d.error ?? `Server error ${res.status}`)
    }
    return res.json()
  }

  // ── Actions ───────────────────────────────────────────────────────────────
  async function handleStatusChange(newStatus: QuestionStatus) {
    try {
      await patchQuestion({ status: newStatus })
      setStatus(newStatus)
      toast.success(`Status changed to ${newStatus}`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Status update failed')
    }
  }

  async function handleSubtopicChange(value: string) {
    const newId = value === UNASSIGNED ? null : value
    const subtopic = allSubtopics.find((s) => s.id === newId)
    try {
      await patchQuestion({ subtopic_id: newId, topic_id: subtopic?.topic_id ?? null, sub_subtopic_id: null })
      setSubtopicId(newId)
      setSubSubtopicId(null)
      toast.success('Subtopic updated')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Update failed')
    }
  }

  async function handleSubSubtopicChange(value: string) {
    const newId = value === UNASSIGNED ? null : value
    try {
      await patchQuestion({ sub_subtopic_id: newId })
      setSubSubtopicId(newId)
      toast.success('Sub-subtopic updated')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Update failed')
    }
  }

  async function handleSaveDraft() {
    setIsSaving(true)
    try {
      await patchQuestion({
        content_text: contentText,
        difficulty,
        question_type: questionType,
        marks,
        image_url: imageUrl,
      })
      setImageJustUploaded(false)
      toast.success('Saved as draft')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setIsSaving(false)
    }
  }

  async function handleApprove() {
    setIsApproving(true)
    try {
      await patchQuestion({
        content_text: contentText,
        difficulty,
        question_type: questionType,
        marks,
        image_url: imageUrl,
        status: 'approved',
      })
      setStatus('approved')

      // Copy to any checked boards before generating the answer
      if (linkedBoardIds.size > 0) {
        const copyRes = await fetch(`/api/questions/${question.id}/copy-to-boards`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ exam_board_ids: Array.from(linkedBoardIds) }),
        })
        if (!copyRes.ok) {
          const d = await copyRes.json() as { error?: string }
          throw new Error(d.error ?? 'Failed to copy to boards')
        }
        setLinkedBoardIds(new Set())
      }

      toast.success('Question approved — generating answer…')

      const genRes = await fetch('/api/generate-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question_id: question.id }),
      })
      const genData = await genRes.json() as { answer?: { id: string }; error?: string }
      if (!genRes.ok) throw new Error(genData.error ?? 'Answer generation failed')

      toast.success('Answer generated — review it in Answers Library', {
        action: {
          label: 'Review',
          onClick: () => router.push(`/admin/answers/${genData.answer!.id}`),
        },
      })
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
      await patchQuestion({ status: 'rejected' })
      setStatus('rejected')
      if (note) console.info(`[Rejection note for ${question.id}]:`, note)
      toast.success('Question rejected')
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Reject failed')
    } finally {
      setIsRejecting(false)
    }
  }

  async function handleDelete() {
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/questions/${question.id}`, { method: 'DELETE' })
      if (!res.ok) {
        const d = await res.json() as { error?: string }
        throw new Error(d.error ?? 'Delete failed')
      }
      toast.success('Question deleted')
      router.push('/admin/questions')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Delete failed')
    } finally {
      setIsDeleting(false)
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setIsUploadingImage(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch(`/api/questions/${question.id}/image`, { method: 'POST', body: fd })
      const data = await res.json() as { url?: string; error?: string }
      if (!res.ok) throw new Error(data.error ?? 'Upload failed')
      setImageUrl(data.url!)
      setImageJustUploaded(true)
      toast.success('Image uploaded')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setIsUploadingImage(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  async function handleImageRemove() {
    try {
      const res = await fetch(`/api/questions/${question.id}/image`, { method: 'DELETE' })
      if (!res.ok) {
        const d = await res.json() as { error?: string }
        throw new Error(d.error ?? 'Remove failed')
      }
      setImageUrl(null)
      setImageJustUploaded(false)
      toast.success('Image removed')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Remove failed')
    }
  }

  const isBusy = isSaving || isApproving || isRejecting || isDeleting

  return (
    <div className="space-y-6">
      {/* ── Status dropdown ──────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">Status:</span>
        <Select
          value={status}
          onValueChange={(v) => handleStatusChange((v ?? 'draft') as QuestionStatus)}
        >
          <SelectTrigger className="h-8 w-32 text-xs">
            <span className={STATUS_COLORS[status]}>
              {STATUS_OPTIONS.find((s) => s.value === status)?.label}
            </span>
          </SelectTrigger>
          <SelectContent alignItemWithTrigger={false}>
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s.value} value={s.value} label={s.label}>
                <span className={STATUS_COLORS[s.value]}>{s.label}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* ── Subtopic selector ───────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">Subtopic:</span>
        <Select
          value={subtopicId ?? UNASSIGNED}
          onValueChange={handleSubtopicChange}
        >
          <SelectTrigger className="h-8 w-72 text-xs">
            {subtopicId
              ? (() => {
                  const s = allSubtopics.find((x) => x.id === subtopicId)
                  return s
                    ? <span className="truncate"><span className="font-mono text-muted-foreground mr-1">{s.ref}</span>{s.title}</span>
                    : <span className="text-muted-foreground truncate">— Unassigned —</span>
                })()
              : <span className="text-muted-foreground">— Unassigned —</span>}
          </SelectTrigger>
          <SelectContent className="max-h-72" alignItemWithTrigger={false}>
            <SelectItem value={UNASSIGNED} label="— Unassigned —">
              <span className="text-muted-foreground">— Unassigned —</span>
            </SelectItem>
            <SelectSeparator />
            {topicGroups.map((group) => (
              <SelectGroup key={group.id}>
                <SelectLabel>{group.ref} {group.name}</SelectLabel>
                {group.items.map((s) => (
                  <SelectItem key={s.id} value={s.id} label={`${s.ref} – ${s.title}`}>
                    <span className="font-mono text-xs text-muted-foreground mr-1.5">{s.ref}</span>
                    {s.title}
                  </SelectItem>
                ))}
              </SelectGroup>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* ── Sub-subtopic selector ──────────────────────────────────────── */}
      {subtopicId && relevantSubSubtopics.length > 0 && (
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Sub-subtopic:</span>
          <Select
            value={subSubtopicId ?? UNASSIGNED}
            onValueChange={handleSubSubtopicChange}
          >
            <SelectTrigger className="h-8 w-72 text-xs">
              {subSubtopicId
                ? (() => {
                    const s = allSubSubtopics.find((x) => x.id === subSubtopicId)
                    return s
                      ? <span className="truncate"><span className="font-mono text-muted-foreground mr-1">{s.ref}</span>{s.title}</span>
                      : <span className="text-muted-foreground truncate">— Unassigned —</span>
                  })()
                : <span className="text-muted-foreground">— Unassigned —</span>}
            </SelectTrigger>
            <SelectContent className="max-h-64" alignItemWithTrigger={false}>
              <SelectItem value={UNASSIGNED} label="— Unassigned —">
                <span className="text-muted-foreground">— Unassigned —</span>
              </SelectItem>
              <SelectSeparator />
              {relevantSubSubtopics.map((s) => (
                <SelectItem key={s.id} value={s.id} label={`${s.ref} – ${s.title}`}>
                  <span className="font-mono text-xs text-muted-foreground mr-1.5">{s.ref}</span>
                  {s.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* ── Also applies to (cross-board linking) ────────────────────────── */}
      {/* Only show for root originals — copies (source_question_id set) should not spawn more copies */}
      {status !== 'rejected' && !question.source_question_id && otherBoards.length > 0 && (
        <div className="space-y-2">
          <span className="text-sm text-muted-foreground">Also applies to:</span>
          <div className="flex flex-wrap gap-4">
            {otherBoards.map((board) => (
              <label key={board.id} className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-input accent-primary"
                  checked={linkedBoardIds.has(board.id)}
                  onChange={(e) => {
                    setLinkedBoardIds((prev) => {
                      const next = new Set(prev)
                      if (e.target.checked) next.add(board.id)
                      else next.delete(board.id)
                      return next
                    })
                  }}
                />
                <span className="text-sm">{board.name}</span>
              </label>
            ))}
          </div>
          {linkedBoardIds.size > 0 && (
            <p className="text-xs text-muted-foreground">
              Approved copies will be created for the checked boards when you click Approve.
            </p>
          )}
        </div>
      )}

      {/* ── Original text (read-only, KaTeX) ──────────────────────────────── */}
      <section className="space-y-2">
        <Label className="text-xs uppercase tracking-wide text-muted-foreground">
          Original Extracted Text
        </Label>
        <div className="rounded-lg border bg-muted/30 p-4 text-sm">
          <MathRenderer text={question.content_text} />
        </div>
      </section>

      {/* ── Editable content ──────────────────────────────────────────────── */}
      <section className="space-y-2">
        <Label htmlFor="content-text">Edit Question Text</Label>
        <Textarea
          id="content-text"
          value={contentText}
          onChange={(e) => setContentText(e.target.value)}
          rows={6}
          className="font-mono text-sm resize-y"
          placeholder="Question text (use $...$ for inline math, $$...$$ for display math)"
        />
      </section>

      {/* ── Image upload ──────────────────────────────────────────────────── */}
      <section className="space-y-2">
        <Label>Question Image <span className="text-muted-foreground font-normal">(optional)</span></Label>
        {imageUrl ? (
          <div className="relative inline-block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt="Question diagram"
              className="max-h-48 rounded-lg border"
              onError={() => setImageUrl(null)}
            />
            <button
              type="button"
              onClick={handleImageRemove}
              className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow hover:opacity-90"
              aria-label="Remove image"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ) : (
          <div className="space-y-1">
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              className="hidden"
              onChange={handleImageUpload}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isUploadingImage}
              onClick={() => fileInputRef.current?.click()}
              className="gap-2"
            >
              {isUploadingImage
                ? <Loader2 className="h-4 w-4 animate-spin" />
                : <Upload className="h-4 w-4" />}
              {isUploadingImage ? 'Uploading…' : 'Upload Image'}
            </Button>
            <p className="text-xs text-muted-foreground">JPG, PNG, or PDF</p>
          </div>
        )}
      </section>

      {/* ── Save prompt after image upload ───────────────────────────────── */}
      {imageJustUploaded && (
        <div className="flex items-center gap-3 rounded-md border border-yellow-300 bg-yellow-50 px-4 py-2.5 text-sm text-yellow-800">
          <span className="flex-1">Image uploaded — save to persist it with this question.</span>
          <Button size="sm" onClick={handleSaveDraft} disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : null}
            Save Changes
          </Button>
        </div>
      )}

      {/* ── Metadata row ──────────────────────────────────────────────────── */}
      <section className="grid grid-cols-1 gap-6 sm:grid-cols-3">

        {/* Difficulty stars */}
        <div className="space-y-2">
          <Label>
            Difficulty{' '}
            <span className="ml-1 font-semibold">{difficulty}/5</span>
          </Label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setDifficulty(n)}
                aria-label={`Set difficulty ${n}`}
                className="focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
              >
                <Star
                  className={cn(
                    'h-6 w-6 transition-colors',
                    n <= difficulty
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'fill-none text-muted-foreground/30 hover:text-yellow-300',
                  )}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Type */}
        <div className="space-y-2">
          <Label>Question Type</Label>
          <Select
            value={questionType}
            onValueChange={(v) => setQuestionType((v ?? 'structured') as QuestionType)}
          >
            <SelectTrigger>
              <span>{QUESTION_TYPES.find((t) => t.value === questionType)?.label}</span>
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={false}>
              {QUESTION_TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value} label={t.label}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Marks */}
        <div className="space-y-2">
          <Label htmlFor="marks">Marks</Label>
          <Input
            id="marks"
            type="number"
            min={1}
            max={20}
            value={marks}
            onChange={(e) => setMarks(Math.max(1, Number(e.target.value) || 1))}
            className="w-24"
          />
        </div>
      </section>

      {/* ── Action buttons ─────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-3 pt-2">
        <Button variant="outline" onClick={handleSaveDraft} disabled={isBusy}>
          {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Save Draft
        </Button>

        <Button
          onClick={handleApprove}
          disabled={isBusy}
          className="gap-2"
        >
          {isApproving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          {isApproving ? 'Approving + Generating…' : 'Approve & Generate Answer'}
        </Button>

        <RejectDialog onConfirm={handleReject} isLoading={isRejecting}>
          <Button variant="destructive" disabled={isBusy || status === 'rejected'}>
            {isRejecting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Reject
          </Button>
        </RejectDialog>

        <DeleteDialog onConfirm={handleDelete} isLoading={isDeleting}>
          <Button variant="destructive" disabled={isBusy} className="gap-2">
            {isDeleting
              ? <Loader2 className="h-4 w-4 animate-spin" />
              : <Trash2 className="h-4 w-4" />}
            Delete
          </Button>
        </DeleteDialog>
      </div>
    </div>
  )
}
