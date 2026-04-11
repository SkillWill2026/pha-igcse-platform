'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
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
import { DeleteDialog } from '@/components/admin/delete-dialog'
import { QuestionImageUpload } from '@/components/QuestionImageUpload'
import { displayQuestionSerial, displayAnswerSerial, serialBadgeColor } from '@/lib/serial'
import type { QuestionWithRelations, QuestionType, QuestionStatus, AnswerRow } from '@/types/database'

const QUESTION_TYPES: { value: QuestionType; label: string }[] = [
  { value: 'mcq',          label: 'MCQ' },
  { value: 'short_answer', label: 'Short Answer' },
  { value: 'structured',   label: 'Structured' },
  { value: 'extended',     label: 'Extended' },
]

const UNASSIGNED = '__unassigned__'

export function ReviewClient({
  question,
  answer: initialAnswer,
  allBoards,
  allSubtopics,
  allTopics,
  allSubSubtopics,
}: {
  question: QuestionWithRelations
  answer: AnswerRow | null
  allBoards: { id: string; name: string }[]
  allSubtopics: { id: string; ref: string; title: string; topic_id: string }[]
  allTopics: { id: string; ref: string; name: string }[]
  allSubSubtopics: { id: string; ref: string; title: string; subtopic_id: string }[]
}) {
  const router = useRouter()

  // ── Question state ─────────────────────────────────────────────────────────
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

  // ── Answer state ───────────────────────────────────────────────────────────
  const [answer,        setAnswer]        = useState<AnswerRow | null>(initialAnswer)
  const [answerContent, setAnswerContent] = useState(initialAnswer?.content ?? '')
  const [isSavingAnswer, setIsSavingAnswer] = useState(false)

  const relevantSubSubtopics = useMemo(() => {
    const list = subtopicId ? allSubSubtopics.filter((s) => s.subtopic_id === subtopicId) : []
    return [...list].sort((a, b) => a.ref.localeCompare(b.ref, undefined, { numeric: true }))
  }, [subtopicId, allSubSubtopics])

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
  const [isDeleting,       setIsDeleting]       = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [imageJustUploaded, setImageJustUploaded] = useState(false)
  const [statusActionLoading, setStatusActionLoading] = useState(false)
  const [isGeneratingAnswer, setIsGeneratingAnswer] = useState(false)
  const [isClassifying,      setIsClassifying]      = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const otherBoards = allBoards.filter((b) => b.id !== question.exam_board_id)

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

  // ── Question actions ───────────────────────────────────────────────────────
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

  // ── Status action bar ──────────────────────────────────────────────────────
  async function handleStatusAction(newStatus: 'approved' | 'rejected' | 'deleted') {
    setStatusActionLoading(true)
    try {
      const res = await fetch(`/api/questions/${question.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) {
        const d = await res.json() as { error?: string }
        throw new Error(d.error ?? 'Status update failed')
      }
      setStatus(newStatus)
      const label = newStatus === 'approved' ? 'Restored to active' : newStatus === 'rejected' ? 'Rejected' : 'Deleted'
      toast.success(label)
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Status update failed')
    } finally {
      setStatusActionLoading(false)
    }
  }

  // ── Answer actions ─────────────────────────────────────────────────────────
  async function handleSaveAnswer() {
    if (!answer) return
    setIsSavingAnswer(true)
    try {
      const res = await fetch(`/api/answers/${answer.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: answerContent }),
      })
      if (!res.ok) {
        const d = await res.json() as { error?: string }
        throw new Error(d.error ?? 'Save failed')
      }
      toast.success('Answer saved')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setIsSavingAnswer(false)
    }
  }

  async function handleClassify() {
    setIsClassifying(true)
    try {
      const res = await fetch('/api/classify-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question_id: question.id }),
      })
      const data = await res.json() as {
        subtopic_id?: string
        sub_subtopic_id?: string | null
        subtopic_title?: string
        error?: string
      }
      if (!res.ok) throw new Error(data.error ?? 'Classification failed')
      if (data.subtopic_id) {
        const matched = allSubtopics.find((s) => s.id === data.subtopic_id)
        setSubtopicId(data.subtopic_id)
        setSubSubtopicId(data.sub_subtopic_id ?? null)
        toast.success(`Classified as: ${matched ? `${matched.ref} – ${matched.title}` : data.subtopic_title ?? data.subtopic_id}`)
      } else {
        toast.warning('No classification returned')
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Classification failed')
    } finally {
      setIsClassifying(false)
    }
  }

  async function handleGenerateAnswer() {
    setIsGeneratingAnswer(true)
    try {
      const genRes = await fetch('/api/generate-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question_id: question.id }),
      })
      const genData = await genRes.json() as { answer?: AnswerRow; error?: string }
      if (!genRes.ok) throw new Error(genData.error ?? 'Answer generation failed')
      if (genData.answer) {
        setAnswer(genData.answer)
        setAnswerContent(genData.answer.content ?? '')
      }
      toast.success('Answer generated')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Generation failed')
    } finally {
      setIsGeneratingAnswer(false)
    }
  }

  const isBusy = isSaving || isApproving || isDeleting

  const answerStatus = answer?.status ?? status

  return (
    <div className="space-y-6">
      {/* ── Two-panel layout ─────────────────────────────────────────────── */}
      <div className="flex gap-6 items-start">

        {/* ── Left panel (60%) ─────────────────────────────────────────── */}
        <div className="flex-[3] min-w-0 space-y-5">

          {/* Serial + subtopic ref */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className={cn(
              'inline-flex items-center rounded px-2 py-0.5 font-mono text-xs font-semibold',
              serialBadgeColor(status),
            )}>
              {displayQuestionSerial(question.serial_number ?? null, status)}
            </span>
            {question.subtopics && (
              <span className="text-sm text-muted-foreground">
                <span className="font-mono">{question.subtopics.ref}</span>
                {' – '}
                {question.subtopics.name}
              </span>
            )}
          </div>

          {/* Subtopic selector */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground shrink-0">Subtopic:</span>
            <Select value={subtopicId ?? UNASSIGNED} onValueChange={handleSubtopicChange}>
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
            {question.status === 'draft' && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClassify}
                disabled={isClassifying}
                className="h-8 gap-1.5 text-xs"
              >
                {isClassifying
                  ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  : <Sparkles className="h-3.5 w-3.5" />}
                {isClassifying ? 'Classifying…' : 'Auto-classify'}
              </Button>
            )}
          </div>

          {/* Sub-subtopic selector */}
          {subtopicId && relevantSubSubtopics.length > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground shrink-0">Sub-subtopic:</span>
              <Select value={subSubtopicId ?? UNASSIGNED} onValueChange={handleSubSubtopicChange}>
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

          {/* Cross-board linking */}
          {status !== 'rejected' && status !== 'deleted' && !question.source_question_id && otherBoards.length > 0 && (
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

          {/* Original text (read-only, KaTeX) */}
          <section className="space-y-2">
            <Label className="text-xs uppercase tracking-wide text-muted-foreground">
              Original Extracted Text
            </Label>
            <div className="rounded-lg border bg-muted/30 p-4 text-sm">
              <MathRenderer text={question.content_text} />
            </div>
          </section>

          {/* Editable content */}
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

          {/* Question images */}
          <section className="space-y-2">
            <Label>Question images</Label>
            <QuestionImageUpload
              questionId={question.id}
              imageType="question"
              batchId={question.batch_id ?? null}
              questionNumber={question.parent_question_ref ? parseInt(question.parent_question_ref) : null}
            />
          </section>

          {/* Legacy single image upload */}
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

          {/* Save prompt after image upload */}
          {imageJustUploaded && (
            <div className="flex items-center gap-3 rounded-md border border-yellow-300 bg-yellow-50 px-4 py-2.5 text-sm text-yellow-800">
              <span className="flex-1">Image uploaded — save to persist it with this question.</span>
              <Button size="sm" onClick={handleSaveDraft} disabled={isSaving}>
                {isSaving ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : null}
                Save Changes
              </Button>
            </div>
          )}

          {/* Metadata row */}
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

          {/* Save / Approve buttons */}
          {(status === 'draft' || status === 'approved') && (
            <div className="flex flex-wrap gap-3 pt-2">
              <Button variant="outline" onClick={handleSaveDraft} disabled={isBusy}>
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save Draft
              </Button>

              <Button onClick={handleApprove} disabled={isBusy} className="gap-2">
                {isApproving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                {isApproving ? 'Approving + Generating…' : 'Approve & Generate Answer'}
              </Button>
            </div>
          )}
        </div>

        {/* ── Right panel (40%) ─────────────────────────────────────────── */}
        <div className="flex-[2] min-w-0 space-y-5 rounded-lg border bg-muted/20 p-5">
          {answer ? (
            <>
              {/* Answer serial badge */}
              <div className="flex items-center gap-3">
                <span className={cn(
                  'inline-flex items-center rounded px-2 py-0.5 font-mono text-xs font-semibold',
                  serialBadgeColor(answerStatus),
                )}>
                  {displayAnswerSerial(answer.serial_number ?? null, answerStatus)}
                </span>
                <span className="text-xs text-muted-foreground capitalize">
                  {answerStatus}
                </span>
              </div>

              {/* Answer content (editable) */}
              <section className="space-y-2">
                <Label htmlFor="answer-content">Answer Content</Label>
                <Textarea
                  id="answer-content"
                  value={answerContent}
                  onChange={(e) => setAnswerContent(e.target.value)}
                  rows={10}
                  className="font-mono text-sm resize-y"
                  placeholder="Answer content…"
                />
                {answerContent && (
                  <div className="rounded-lg border bg-muted/30 p-4">
                    <p className="text-xs text-muted-foreground mb-2 font-medium">Preview</p>
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                        {answerContent}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}
              </section>

              {/* Answer images */}
              <section className="space-y-2">
                <Label>Answer images</Label>
                <QuestionImageUpload
                  questionId={question.id}
                  imageType="answer"
                  batchId={question.batch_id ?? null}
                  questionNumber={question.parent_question_ref ? parseInt(question.parent_question_ref) : null}
                />
              </section>

              {/* AI confidence score */}
              {answer.confidence_score !== null && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">AI Confidence:</span>
                  <span className={cn(
                    'font-semibold',
                    answer.confidence_score >= 0.8 ? 'text-green-700'
                      : answer.confidence_score >= 0.5 ? 'text-amber-700'
                      : 'text-red-700',
                  )}>
                    {answer.confidence_score
                      ? `${Math.round(answer.confidence_score * 100)}%`
                      : '—'}
                  </span>
                </div>
              )}

              {/* Save answer button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveAnswer}
                disabled={isSavingAnswer}
              >
                {isSavingAnswer ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : null}
                Save Answer
              </Button>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
              <p className="text-sm text-muted-foreground">No answer linked to this question yet.</p>
              <Button
                onClick={handleGenerateAnswer}
                disabled={isGeneratingAnswer}
                className="gap-2"
              >
                {isGeneratingAnswer
                  ? <Loader2 className="h-4 w-4 animate-spin" />
                  : <Sparkles className="h-4 w-4" />}
                {isGeneratingAnswer ? 'Generating…' : 'Generate Answer'}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* ── Status action bar ─────────────────────────────────────────────── */}
      <div className="border-t pt-5 flex flex-wrap items-center gap-3">
        <span className="text-sm text-muted-foreground font-medium">Status actions:</span>

        {(status === 'draft' || status === 'approved') && (
          <>
            <Button
              variant="outline"
              onClick={() => handleStatusAction('rejected')}
              disabled={statusActionLoading}
              className="border-amber-300 text-amber-700 hover:bg-amber-50"
            >
              {statusActionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Reject
            </Button>
            <Button
              variant="outline"
              onClick={() => handleStatusAction('deleted')}
              disabled={statusActionLoading}
              className="border-red-300 text-red-700 hover:bg-red-50"
            >
              {statusActionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Delete
            </Button>
            <div className="ml-auto">
              <DeleteDialog onConfirm={handleDelete} isLoading={isDeleting}>
                <Button variant="destructive" disabled={isBusy} size="sm" className="gap-2">
                  {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  Hard Delete
                </Button>
              </DeleteDialog>
            </div>
          </>
        )}

        {status === 'rejected' && (
          <>
            <Button
              variant="outline"
              onClick={() => handleStatusAction('approved')}
              disabled={statusActionLoading}
              className="border-green-300 text-green-700 hover:bg-green-50"
            >
              {statusActionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Restore to Active
            </Button>
            <Button
              variant="outline"
              onClick={() => handleStatusAction('deleted')}
              disabled={statusActionLoading}
              className="border-red-300 text-red-700 hover:bg-red-50"
            >
              {statusActionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Delete
            </Button>
          </>
        )}

        {status === 'deleted' && (
          <>
            <Button
              variant="outline"
              onClick={() => handleStatusAction('approved')}
              disabled={statusActionLoading}
              className="border-green-300 text-green-700 hover:bg-green-50"
            >
              {statusActionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Restore to Active
            </Button>
            <Button
              variant="outline"
              onClick={() => handleStatusAction('rejected')}
              disabled={statusActionLoading}
              className="border-amber-300 text-amber-700 hover:bg-amber-50"
            >
              {statusActionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Restore to Rejected
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
