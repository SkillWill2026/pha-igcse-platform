'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { SyllabusSelector } from '@/components/SyllabusSelector'

// ── Types ─────────────────────────────────────────────────────────────────────

interface ExamBoard {
  id: string
  name: string
}

interface ExtractedQuestion {
  id: string
  content_text: string
  difficulty: number
  question_type: string
  marks: number
  subtopic_ref: string
}

// ── Small display helpers ──────────────────────────────────────────────────────

function DifficultyDots({ value }: { value: number }) {
  return (
    <span className="flex gap-0.5" aria-label={`Difficulty ${value} of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={cn(
            'text-xs select-none',
            i < value ? 'text-primary' : 'text-muted-foreground/20',
          )}
        >
          ●
        </span>
      ))}
    </span>
  )
}

const TYPE_COLOURS: Record<string, string> = {
  mcq:          'bg-blue-100   text-blue-800',
  short_answer: 'bg-green-100  text-green-800',
  structured:   'bg-amber-100  text-amber-800',
  extended:     'bg-purple-100 text-purple-800',
}

function TypeBadge({ type }: { type: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded px-2 py-0.5 text-xs font-medium',
        TYPE_COLOURS[type] ?? 'bg-muted text-muted-foreground',
      )}
    >
      {type.replace('_', '\u00a0')}
    </span>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function UploadClient({ boards }: { boards: ExamBoard[] }) {
  const [file, setFile] = useState<File | null>(null)
  const [boardId, setBoardId] = useState('')
  const [subtopicId, setSubtopicId] = useState<string | null>(null)
  const [subSubtopicId, setSubSubtopicId] = useState<string | null>(null)

  const [isExtracting, setIsExtracting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [questions, setQuestions] = useState<ExtractedQuestion[]>([])
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  // ── Dropzone ────────────────────────────────────────────────────────────────
  const onDrop = useCallback((accepted: File[]) => {
    if (accepted[0]) {
      setFile(accepted[0])
      setQuestions([])
      setSaved(false)
      setError(null)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
  })

  // ── Extract ─────────────────────────────────────────────────────────────────
  const handleExtract = async () => {
    if (!file || !boardId || !subtopicId) return
    setIsExtracting(true)
    setError(null)
    setSaved(false)
    setQuestions([])

    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('exam_board_id', boardId)
      fd.append('subtopic_id', subtopicId!)
      if (subSubtopicId) fd.append('sub_subtopic_id', subSubtopicId)

      const res = await fetch('/api/ingest', { method: 'POST', body: fd })
      const data: { questions?: ExtractedQuestion[]; error?: string } = await res.json()

      if (!res.ok) throw new Error(data.error ?? `Server error ${res.status}`)
      setQuestions(data.questions ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsExtracting(false)
    }
  }

  // ── Confirm & Save ──────────────────────────────────────────────────────────
  const handleConfirm = async () => {
    if (questions.length === 0) return
    setIsSaving(true)
    setError(null)

    try {
      const res = await fetch('/api/questions/approve', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: questions.map((q) => q.id) }),
      })
      const data: { updated?: number; error?: string } = await res.json()
      if (!res.ok) throw new Error(data.error ?? `Server error ${res.status}`)
      setSaved(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsSaving(false)
    }
  }

  const canExtract = !!file && !!boardId && !!subtopicId && !isExtracting

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-8 max-w-4xl">
      {/* ── Upload card ──────────────────────────────────────────────────── */}
      <div className="rounded-lg border bg-card p-6 shadow-sm space-y-6">
        {/* Exam Board + Syllabus Selector */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
                    <SelectItem key={b.id} value={b.id} label={b.name}>
                      {b.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Syllabus</Label>
            <SyllabusSelector
              onSubSubtopicChange={setSubSubtopicId}
              onSubtopicChange={(id) => setSubtopicId(id)}
            />
          </div>
        </div>

        {/* Drop zone */}
        <div
          {...getRootProps()}
          className={cn(
            'flex flex-col items-center justify-center rounded-lg border-2 border-dashed px-8 py-12 text-center transition-colors cursor-pointer select-none',
            isDragActive
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30',
            file && !isDragActive && 'border-primary/50 bg-primary/5',
          )}
        >
          <input {...getInputProps()} />
          {file ? (
            <>
              <FileText className="mb-3 h-10 w-10 text-primary" />
              <p className="text-sm font-medium">{file.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {(file.size / 1024).toFixed(1)} KB &middot; click or drop to replace
              </p>
            </>
          ) : (
            <>
              <Upload className="mb-3 h-10 w-10 text-muted-foreground" />
              <p className="text-sm font-medium">
                {isDragActive ? 'Release to upload' : 'Drag & drop a PDF or DOCX'}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">or click to browse files</p>
            </>
          )}
        </div>

        {/* Error banner */}
        {error && (
          <div className="flex items-start gap-2 rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Submit */}
        <Button onClick={handleExtract} disabled={!canExtract} className="w-full" size="lg">
          {isExtracting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Extracting questions…
            </>
          ) : (
            'Extract Questions'
          )}
        </Button>
      </div>

      {/* ── Results panel ────────────────────────────────────────────────── */}
      {questions.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              Extracted Questions
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({questions.length})
              </span>
            </h2>
            {saved && (
              <span className="flex items-center gap-1.5 text-sm font-medium text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                {questions.length} question{questions.length !== 1 ? 's' : ''} approved
              </span>
            )}
          </div>

          <div className="rounded-lg border overflow-hidden shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-16">Ref</TableHead>
                  <TableHead>Question Preview</TableHead>
                  <TableHead className="w-32">Difficulty</TableHead>
                  <TableHead className="w-28">Type</TableHead>
                  <TableHead className="w-16 text-right">Marks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {questions.map((q) => (
                  <TableRow key={q.id} className="hover:bg-muted/30">
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {q.subtopic_ref}
                    </TableCell>
                    <TableCell>
                      <p className="text-sm leading-snug line-clamp-2">
                        {q.content_text.length > 80
                          ? q.content_text.slice(0, 80) + '…'
                          : q.content_text}
                      </p>
                    </TableCell>
                    <TableCell>
                      <DifficultyDots value={q.difficulty} />
                    </TableCell>
                    <TableCell>
                      <TypeBadge type={q.question_type} />
                    </TableCell>
                    <TableCell className="text-right text-sm font-semibold tabular-nums">
                      {q.marks}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {!saved && (
            <Button
              onClick={handleConfirm}
              disabled={isSaving}
              size="lg"
              className="w-full"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : (
                `Confirm & Save ${questions.length} Question${questions.length !== 1 ? 's' : ''}`
              )}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
