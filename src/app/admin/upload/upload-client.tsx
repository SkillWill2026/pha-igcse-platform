'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Loader2, CheckCircle2, AlertCircle, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'

// ── Types ────────────────────────────────────────────────────────────────────
interface ExamBoard { id: string; name: string }
interface Topic { id: string; ref: string; name: string }
type FileStatus = 'queued' | 'processing' | 'done' | 'failed'

interface QueuedFile {
  id: string
  file: File
  status: FileStatus
  batchId?: string           // populated after Phase 1 ingest call
  questionsExtracted?: number // live count from polling
  error?: string
}

interface Summary {
  total: number
  done: number
  failed: number
  questions: number
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function FileStatusBadge({ item }: { item: QueuedFile }) {
  switch (item.status) {
    case 'queued':
      return (
        <span className="shrink-0 text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
          Queued
        </span>
      )
    case 'processing':
      return (
        <span className="shrink-0 flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
          <Loader2 className="h-3 w-3 animate-spin" />
          {(item.questionsExtracted ?? 0) > 0
            ? `${item.questionsExtracted} found…`
            : 'Processing…'}
        </span>
      )
    case 'done':
      return (
        <span className="shrink-0 text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
          Done — {item.questionsExtracted ?? 0} question{item.questionsExtracted !== 1 ? 's' : ''}
        </span>
      )
    case 'failed':
      return (
        <span
          className="shrink-0 text-xs text-destructive bg-destructive/10 px-2 py-0.5 rounded-full max-w-[200px] truncate"
          title={item.error}
        >
          Failed — {item.error ?? 'Unknown error'}
        </span>
      )
  }
}

// ── Main component ────────────────────────────────────────────────────────────
export function UploadClient({
  boards,
  topics,
  subjectId,
  subjectName,
}: {
  boards: ExamBoard[]
  topics: Topic[]
  subjectId: string | null
  subjectName: string
}) {
  const [boardId, setBoardId] = useState('')
  const [topicId, setTopicId] = useState('mixed')
  const [queue, setQueue] = useState<QueuedFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [summary, setSummary] = useState<Summary | null>(null)

  // ── Drop zone ────────────────────────────────────────────────────────────────
  const onDrop = useCallback((accepted: File[]) => {
    setQueue((prev) => [
      ...prev,
      ...accepted.map((f) => ({
        id: crypto.randomUUID(),
        file: f,
        status: 'queued' as const,
      })),
    ])
    setSummary(null)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    multiple: true,
  })

  function removeFile(id: string) {
    if (isUploading) return
    setQueue((prev) => prev.filter((f) => f.id !== id))
  }

  // ── Upload (2-phase async) ────────────────────────────────────────────────────
  const queued = queue.filter((f) => f.status === 'queued')
  const canStart = queued.length > 0 && !!boardId && !!topicId && !isUploading

  async function handleStartUpload() {
    if (!canStart) return
    setIsUploading(true)
    setSummary(null)

    const filesToProcess = queue.filter((f) => f.status === 'queued')

    // Process all files — Phase 1 runs sequentially, polling runs in parallel
    const results = await Promise.all(
      filesToProcess.map(async (item) => {
        // Mark as processing
        setQueue((prev) =>
          prev.map((f) => (f.id === item.id ? { ...f, status: 'processing' as FileStatus } : f))
        )

        try {
          // ── Phase 1: Submit file (fast, returns batch_id in ~3s) ──────────────
          const fd = new FormData()
          fd.append('file', item.file)
          fd.append('exam_board_id', boardId)
          fd.append('topic_id', topicId)

          const res = await fetch('/api/ingest', { method: 'POST', body: fd })
          const data = (await res.json()) as { batch_id?: string; status?: string; error?: string }

          if (!res.ok || !data.batch_id) {
            throw new Error(data.error ?? `Server error ${res.status}`)
          }

          const batchId = data.batch_id

          // Store batch_id in queue state
          setQueue((prev) =>
            prev.map((f) => (f.id === item.id ? { ...f, batchId } : f))
          )

          // ── Phase 2: Poll until done (background processing by Edge Function) ──
          const MAX_POLLS = 80 // 80 × 3s = 4 minutes max
          for (let i = 0; i < MAX_POLLS; i++) {
            await new Promise((r) => setTimeout(r, 3000))

            try {
              const statusRes = await fetch(`/api/ingest/status?batch_id=${batchId}`)
              const statusData = (await statusRes.json()) as {
                status: string
                questions_extracted?: number
                error_message?: string
              }

              if (statusData.status === 'done' || statusData.status === 'completed') {
                const count = statusData.questions_extracted ?? 0
                setQueue((prev) =>
                  prev.map((f) =>
                    f.id === item.id
                      ? { ...f, status: 'done' as FileStatus, questionsExtracted: count }
                      : f
                  )
                )
                return { success: true, count }
              }

              if (statusData.status === 'error' || statusData.status === 'failed') {
                const msg = statusData.error_message ?? 'Processing failed'
                setQueue((prev) =>
                  prev.map((f) =>
                    f.id === item.id ? { ...f, status: 'failed' as FileStatus, error: msg } : f
                  )
                )
                return { success: false, count: 0 }
              }

              // Still processing — show live question count
              if ((statusData.questions_extracted ?? 0) > 0) {
                setQueue((prev) =>
                  prev.map((f) =>
                    f.id === item.id
                      ? { ...f, questionsExtracted: statusData.questions_extracted }
                      : f
                  )
                )
              }
            } catch {
              // Network blip on poll — just retry next cycle
            }
          }

          // Timeout after MAX_POLLS
          setQueue((prev) =>
            prev.map((f) =>
              f.id === item.id
                ? { ...f, status: 'failed' as FileStatus, error: 'Timed out after 4 minutes' }
                : f
            )
          )
          return { success: false, count: 0 }

        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Unknown error'
          setQueue((prev) =>
            prev.map((f) =>
              f.id === item.id ? { ...f, status: 'failed' as FileStatus, error: msg } : f
            )
          )
          return { success: false, count: 0 }
        }
      })
    )

    const done = results.filter((r) => r.success).length
    const failed = results.filter((r) => !r.success).length
    const questions = results.reduce((sum, r) => sum + r.count, 0)

    setSummary({ total: filesToProcess.length, done, failed, questions })
    setIsUploading(false)
  }

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 max-w-3xl">
      {/* ── Section 1: Syllabus tagging ─────────────────────────────────── */}
      <div className="rounded-lg border bg-card p-6 shadow-sm space-y-4">
        <div>
          <h2 className="text-sm font-semibold">Syllabus Tagging</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Select a topic to auto-classify subtopics. Choose Mix Topics to assign classification
            manually in Review Queue.
          </p>
        </div>

        <div className="space-y-1.5">
          <Label>Exam Board</Label>
          <Select value={boardId} onValueChange={(v) => setBoardId(v ?? '')}>
            <SelectTrigger>
              {boardId ? (
                <span>{boards.find((b) => b.id === boardId)?.name}</span>
              ) : (
                <span className="text-muted-foreground">Select board…</span>
              )}
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={false}>
              {boards.length === 0 ? (
                <div className="px-3 py-2 text-xs text-muted-foreground">
                  No boards found — run SQL migrations first
                </div>
              ) : (
                boards.map((b) => (
                  <SelectItem key={b.id} value={b.id} label={b.name}>
                    {b.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Topic</Label>
          <Select value={topicId} onValueChange={(v) => setTopicId(v ?? 'mixed')}>
            <SelectTrigger>
              {topicId === 'mixed' ? (
                <span className="text-muted-foreground">Mix Topics (no auto-classification)</span>
              ) : (
                <span>
                  {topics.find((t) => t.id === topicId)?.ref} —{' '}
                  {topics.find((t) => t.id === topicId)?.name}
                </span>
              )}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mixed">Mix Topics (no auto-classification)</SelectItem>
              {topics.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.ref} — {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {topicId !== 'mixed' && (
            <p className="text-xs text-muted-foreground">
              AI will auto-assign subtopic per question. You assign sub-subtopic in Review Queue.
            </p>
          )}
        </div>
      </div>

      {/* ── Section 2: File drop zone + queue ────────────────────────────── */}
      <div className="rounded-lg border bg-card p-6 shadow-sm space-y-4">
        <div>
          <h2 className="text-sm font-semibold">Files</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {queue.length === 0
              ? 'Add PDF or DOCX files to the queue.'
              : `${queue.length} file${queue.length !== 1 ? 's' : ''} in queue`}
          </p>
        </div>

        {/* Drop zone */}
        <div
          {...getRootProps()}
          className={cn(
            'flex flex-col items-center justify-center rounded-lg border-2 border-dashed px-8 py-10 text-center transition-colors cursor-pointer select-none',
            isDragActive
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30'
          )}
        >
          <input {...getInputProps()} />
          <Upload className="mb-3 h-8 w-8 text-muted-foreground" />
          <p className="text-sm font-medium">
            {isDragActive ? 'Release to add files' : 'Drag & drop PDF or DOCX files'}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            or click to browse — multiple files supported
          </p>
        </div>

        {/* File queue */}
        {queue.length > 0 && (
          <div className="space-y-1.5">
            {queue.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 rounded-md border px-3 py-2 bg-muted/20"
              >
                <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="flex-1 text-sm truncate min-w-0" title={item.file.name}>
                  {item.file.name}
                </span>
                <span className="text-xs text-muted-foreground shrink-0 tabular-nums">
                  {formatSize(item.file.size)}
                </span>
                <FileStatusBadge item={item} />
                <button
                  type="button"
                  onClick={() => removeFile(item.id)}
                  disabled={isUploading || item.status === 'processing'}
                  aria-label="Remove file"
                  className="shrink-0 text-muted-foreground hover:text-destructive disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Processing note */}
        {isUploading && (
          <p className="text-xs text-muted-foreground text-center">
            Files are being processed in the background. This page will update automatically.
            Large scanned papers may take 2–3 minutes.
          </p>
        )}
      </div>

      {/* ── Section 3: Start + summary ──────────────────────────────────────── */}
      <div className="space-y-4">
        <Button
          onClick={handleStartUpload}
          disabled={!canStart}
          size="lg"
          className="w-full"
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing…
            </>
          ) : (
            `Start Upload${queued.length > 0 ? ` (${queued.length} file${queued.length !== 1 ? 's' : ''})` : ''}`
          )}
        </Button>

        {summary && (
          <div
            className={cn(
              'flex items-start gap-3 rounded-md border px-4 py-3 text-sm',
              summary.failed === 0
                ? 'border-green-200 bg-green-50 text-green-800'
                : summary.done === 0
                  ? 'border-destructive/30 bg-destructive/10 text-destructive'
                  : 'border-yellow-200 bg-yellow-50 text-yellow-800'
            )}
          >
            {summary.failed === 0 ? (
              <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            )}
            <span>
              Batch complete — {summary.done} file{summary.done !== 1 ? 's' : ''} processed,{' '}
              {summary.questions} question{summary.questions !== 1 ? 's' : ''} extracted
              {summary.failed > 0 && `, ${summary.failed} failed`}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
