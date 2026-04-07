'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Loader2, CheckCircle2, AlertCircle, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'
import { SyllabusSelector } from '@/components/SyllabusSelector'

// ── Types ─────────────────────────────────────────────────────────────────────

interface ExamBoard {
  id: string
  name: string
}

type FileStatus = 'queued' | 'processing' | 'done' | 'failed'

interface QueuedFile {
  id: string
  file: File
  status: FileStatus
  questionsExtracted?: number
  error?: string
}

interface Summary {
  total: number
  done: number
  failed: number
  questions: number
}

// ── Helpers ───────────────────────────────────────────────────────────────────

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
          Processing…
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
        <span className="shrink-0 text-xs text-destructive bg-destructive/10 px-2 py-0.5 rounded-full max-w-[200px] truncate" title={item.error}>
          Failed — {item.error ?? 'Unknown error'}
        </span>
      )
  }
}

// ── Main component ────────────────────────────────────────────────────────────

export function UploadClient({ boards }: { boards: ExamBoard[] }) {
  const [boardId,       setBoardId]       = useState('')
  const [topicId,       setTopicId]       = useState<string | null>(null)
  const [subtopicId,    setSubtopicId]    = useState<string | null>(null)
  const [subSubtopicId, setSubSubtopicId] = useState<string | null>(null)

  const [queue,       setQueue]       = useState<QueuedFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [summary,     setSummary]     = useState<Summary | null>(null)

  // ── Drop zone ───────────────────────────────────────────────────────────────
  const onDrop = useCallback((accepted: File[]) => {
    setQueue((prev) => [
      ...prev,
      ...accepted.map((f) => ({
        id:     crypto.randomUUID(),
        file:   f,
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

  // ── Upload ──────────────────────────────────────────────────────────────────
  const queued = queue.filter((f) => f.status === 'queued')
  const canStart = queued.length > 0 && !!boardId && !!subtopicId && !isUploading

  async function handleStartUpload() {
    if (!canStart) return
    setIsUploading(true)
    setSummary(null)

    // Create batch record
    let batchId: string | null = null
    try {
      const batchRes = await fetch('/api/upload-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic_id:        topicId,
          subtopic_id:     subtopicId,
          sub_subtopic_id: subSubtopicId,
          total_files:     queued.length,
        }),
      })
      const batchData = await batchRes.json() as { id?: string }
      batchId = batchData.id ?? null
    } catch {
      // Continue without batch tracking if creation fails
    }

    let done = 0, failed = 0, questions = 0

    for (const item of queue) {
      if (item.status !== 'queued') continue

      setQueue((prev) => prev.map((f) =>
        f.id === item.id ? { ...f, status: 'processing' } : f,
      ))

      try {
        const fd = new FormData()
        fd.append('file',          item.file)
        fd.append('exam_board_id', boardId)
        fd.append('subtopic_id',   subtopicId!)
        if (subSubtopicId) fd.append('sub_subtopic_id', subSubtopicId)
        if (batchId)       fd.append('batch_id',        batchId)

        const res  = await fetch('/api/ingest', { method: 'POST', body: fd })
        const data = await res.json() as { count?: number; questions?: unknown[]; error?: string }

        if (!res.ok) {
          const msg = data.error === 'AI returned malformed JSON'
            ? 'document too complex, try a shorter file'
            : (data.error ?? `Server error ${res.status}`)
          throw new Error(msg)
        }

        const count = data.count ?? (data.questions as unknown[])?.length ?? 0
        setQueue((prev) => prev.map((f) =>
          f.id === item.id ? { ...f, status: 'done', questionsExtracted: count } : f,
        ))
        done++
        questions += count
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Unknown error'
        setQueue((prev) => prev.map((f) =>
          f.id === item.id ? { ...f, status: 'failed', error: msg } : f,
        ))
        failed++
      }
    }

    // Update batch record with final counts
    if (batchId) {
      const finalStatus = failed === 0 ? 'completed' : done === 0 ? 'failed' : 'partial'
      try {
        await fetch('/api/upload-batch', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            batch_id:                   batchId,
            completed_files:            done,
            failed_files:               failed,
            total_questions_extracted:  questions,
            status:                     finalStatus,
          }),
        })
      } catch { /* ignore */ }
    }

    setSummary({ total: queued.length, done, failed, questions })
    setIsUploading(false)
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 max-w-3xl">

      {/* ── Section 1: Syllabus tagging ──────────────────────────────────── */}
      <div className="rounded-lg border bg-card p-6 shadow-sm space-y-4">
        <div>
          <h2 className="text-sm font-semibold">Syllabus Tagging</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            These tags apply to all files in the batch.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Exam Board</Label>
            <Select value={boardId} onValueChange={(v) => setBoardId(v ?? '')}>
              <SelectTrigger>
                {boardId
                  ? <span>{boards.find((b) => b.id === boardId)?.name}</span>
                  : <span className="text-muted-foreground">Select board…</span>}
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false}>
                {boards.length === 0 ? (
                  <div className="px-3 py-2 text-xs text-muted-foreground">
                    No boards found — run SQL migrations first
                  </div>
                ) : (
                  boards.map((b) => (
                    <SelectItem key={b.id} value={b.id} label={b.name}>{b.name}</SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Syllabus</Label>
            <SyllabusSelector
              onTopicChange={setTopicId}
              onSubtopicChange={setSubtopicId}
              onSubSubtopicChange={setSubSubtopicId}
              showTierBadge={false}
            />
          </div>
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
              : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30',
          )}
        >
          <input {...getInputProps()} />
          <Upload className="mb-3 h-8 w-8 text-muted-foreground" />
          <p className="text-sm font-medium">
            {isDragActive ? 'Release to add files' : 'Drag & drop PDF or DOCX files'}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">or click to browse — multiple files supported</p>
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
      </div>

      {/* ── Section 3: Start + summary ─────────────────────────────────────── */}
      <div className="space-y-4">
        <Button
          onClick={handleStartUpload}
          disabled={!canStart}
          size="lg"
          className="w-full"
        >
          {isUploading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Uploading…</>
          ) : (
            `Start Upload${queued.length > 0 ? ` (${queued.length} file${queued.length !== 1 ? 's' : ''})` : ''}`
          )}
        </Button>

        {summary && (
          <div className={cn(
            'flex items-start gap-3 rounded-md border px-4 py-3 text-sm',
            summary.failed === 0
              ? 'border-green-200 bg-green-50 text-green-800'
              : summary.done === 0
                ? 'border-destructive/30 bg-destructive/10 text-destructive'
                : 'border-yellow-200 bg-yellow-50 text-yellow-800',
          )}>
            {summary.failed === 0
              ? <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
              : <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />}
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
