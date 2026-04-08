'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { ArrowLeft, ArrowRight, Check, Loader2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MathRenderer } from '@/components/admin/math-renderer'
import { QuestionImageUpload } from '@/components/QuestionImageUpload'
import { displayQuestionSerial, serialBadgeColor } from '@/lib/serial'
import type { QuestionWithRelations, AnswerRow } from '@/types/database'

interface DraftQuestion extends QuestionWithRelations {
  answer: AnswerRow | null
}

interface Props {
  drafts: DraftQuestion[]
  initialError: string | null
}

export function ReviewQueueClient({ drafts, initialError }: Props) {
  const router = useRouter()
  const [currentIdx, setCurrentIdx] = useState(0)
  const [stats, setStats] = useState({ approved: 0, rejected: 0 })
  const [actionLoading, setActionLoading] = useState(false)
  const [generatingAnswer, setGeneratingAnswer] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(drafts[currentIdx] ?? null)
  const [editing, setEditing] = useState(false)
  const [editedText, setEditedText] = useState('')
  const [editSaving, setEditSaving] = useState(false)

  const remaining = drafts.length - currentIdx - 1

  // Update currentQuestion when index changes
  useEffect(() => {
    setCurrentQuestion(drafts[currentIdx] ?? null)
    setEditing(false)
    setEditedText('')
  }, [currentIdx, drafts])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'a') {
        e.preventDefault()
        handleApprove()
      } else if (e.key.toLowerCase() === 'r') {
        e.preventDefault()
        handleReject()
      } else if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
        handleNext()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        handlePrev()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentIdx, actionLoading])

  async function updateQuestionStatus(questionId: string, status: 'approved' | 'rejected', answerId?: string) {
    try {
      // Update question
      const qRes = await fetch(`/api/questions/${questionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })

      if (!qRes.ok) {
        const d = await qRes.json() as { error?: string }
        throw new Error(d.error ?? 'Question update failed')
      }

      // Update answer if it exists and status is approved
      if (answerId && status === 'approved') {
        const aRes = await fetch(`/api/answers/${answerId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'approved' }),
        })

        if (!aRes.ok) {
          console.warn('Answer update failed (non-fatal):', aRes.status)
        }
      }

      return true
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Action failed'
      toast.error(msg)
      return false
    }
  }

  async function handleApprove() {
    if (!currentQuestion || actionLoading) return
    setActionLoading(true)
    try {
      const ok = await updateQuestionStatus(currentQuestion.id, 'approved', currentQuestion.answer?.id)
      if (ok) {
        setStats((s) => ({ ...s, approved: s.approved + 1 }))
        toast.success(`Approved ${currentQuestion.serial_number}`)
        handleNext()
      }
    } finally {
      setActionLoading(false)
    }
  }

  async function handleReject() {
    if (!currentQuestion || actionLoading) return
    setActionLoading(true)
    try {
      const ok = await updateQuestionStatus(currentQuestion.id, 'rejected')
      if (ok) {
        setStats((s) => ({ ...s, rejected: s.rejected + 1 }))
        toast.success(`Rejected ${currentQuestion.serial_number}`)
        handleNext()
      }
    } finally {
      setActionLoading(false)
    }
  }

  async function handleGenerateAnswer() {
    if (!currentQuestion || generatingAnswer) return
    setGeneratingAnswer(true)
    try {
      const res = await fetch('/api/generate-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question_id: currentQuestion.id }),
      })

      if (!res.ok) {
        const d = await res.json() as { error?: string }
        throw new Error(d.error ?? 'Answer generation failed')
      }

      const { answer } = await res.json() as { answer: AnswerRow }
      // Update current question with the new answer
      setCurrentQuestion((q) => q ? { ...q, answer } : null)
      toast.success('Answer generated successfully')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Generation failed'
      toast.error(msg)
    } finally {
      setGeneratingAnswer(false)
    }
  }

  async function handleSaveEdit() {
    if (!currentQuestion || editSaving || !editedText.trim()) return
    setEditSaving(true)
    try {
      const res = await fetch(`/api/questions/${currentQuestion.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editedText.trim() }),
      })

      if (!res.ok) {
        const d = await res.json() as { error?: string }
        throw new Error(d.error ?? 'Save failed')
      }

      // Update current question with new content
      setCurrentQuestion((q) => q ? { ...q, content_text: editedText.trim() } : null)
      setEditing(false)
      setEditedText('')
      toast.success('Question updated')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Save failed'
      toast.error(msg)
    } finally {
      setEditSaving(false)
    }
  }

  function handleCancelEdit() {
    setEditing(false)
    setEditedText('')
  }

  function handleStartEdit() {
    if (!currentQuestion) return
    setEditedText(currentQuestion.content_text)
    setEditing(true)
  }

  function handleNext() {
    if (currentIdx < drafts.length - 1) {
      setCurrentIdx(currentIdx + 1)
    }
  }

  function handlePrev() {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1)
    }
  }

  if (initialError) {
    return (
      <div className="p-8 rounded-lg border border-red-300 bg-red-50">
        <h2 className="text-lg font-semibold text-red-900 mb-2">Error Loading Review Queue</h2>
        <p className="text-sm text-red-700 mb-4">{initialError}</p>
        <Button onClick={() => router.push('/admin/questions')}>
          Back to Questions
        </Button>
      </div>
    )
  }

  if (drafts.length === 0) {
    return (
      <div className="text-center py-16 space-y-4">
        <h2 className="text-2xl font-bold">All Questions Reviewed! 🎉</h2>
        <p className="text-lg text-muted-foreground">
          Approved: <span className="font-semibold text-green-700">{stats.approved}</span>{' '}
          | Rejected: <span className="font-semibold text-red-700">{stats.rejected}</span>
        </p>
        <Button onClick={() => router.push('/admin/questions')}>
          Back to Questions Library
        </Button>
      </div>
    )
  }

  if (!currentQuestion) {
    return null
  }

  return (
    <div className="space-y-4 pb-32">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">Review Queue</h2>
          <p className="text-sm text-muted-foreground">
            {currentIdx + 1} / {drafts.length} remaining ({remaining} after this)
          </p>
          <p className="text-xs text-muted-foreground">
            Approved: <span className="text-green-700 font-semibold">{stats.approved}</span> |
            Rejected: <span className="text-red-700 font-semibold">{stats.rejected}</span>
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push('/admin/questions')}
          className="gap-2"
        >
          Exit → Questions
        </Button>
      </div>

      {/* Two-panel layout */}
      <div className="flex gap-6 items-start min-h-screen">
        {/* Left panel - Question */}
        <div className="flex-[3] space-y-4">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center rounded px-2 py-0.5 font-mono text-xs font-semibold ${serialBadgeColor(currentQuestion.status)}`}>
              {displayQuestionSerial(currentQuestion.serial_number, currentQuestion.status)}
            </span>
            <button
              onClick={handleStartEdit}
              disabled={editing}
              className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md hover:bg-muted transition-colors disabled:opacity-60"
            >
              ✏ {editing ? 'Editing...' : 'Edit'}
            </button>
          </div>

          {/* Breadcrumb */}
          <div className="text-sm text-muted-foreground">
            {currentQuestion.topics?.ref && <span className="font-mono">{currentQuestion.topics.ref}</span>}
            {currentQuestion.topics?.ref && currentQuestion.topics.name && ' – '}
            {currentQuestion.topics?.name}
            {currentQuestion.subtopics && ' / '}
            {currentQuestion.subtopics?.ref && <span className="font-mono">{currentQuestion.subtopics.ref}</span>}
            {currentQuestion.subtopics?.ref && currentQuestion.subtopics.name && ' – '}
            {currentQuestion.subtopics?.name}
          </div>

          {/* Question content */}
          <section className="space-y-3">
            <h3 className="font-semibold">Question</h3>
            {editing ? (
              <div className="space-y-4">
                <textarea
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  className="w-full h-48 p-4 rounded-lg border bg-white text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Question content..."
                />

                {/* Image upload in edit mode */}
                {currentQuestion && (
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-semibold mb-3">Question Images</h4>
                    <QuestionImageUpload
                      questionId={currentQuestion.id}
                      imageType="question"
                    />
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={handleSaveEdit}
                    disabled={editSaving || !editedText.trim()}
                    className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                  >
                    {editSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : '✓'}
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    disabled={editSaving}
                    className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md bg-gray-300 text-gray-800 hover:bg-gray-400 disabled:opacity-50"
                  >
                    ✗ Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-lg border bg-muted/30 p-4">
                <MathRenderer text={currentQuestion.content_text} />
              </div>
            )}
          </section>

          {/* Metadata */}
          <div className="grid grid-cols-4 gap-2 text-sm text-muted-foreground">
            <div>
              <span className="font-semibold">Type:</span> {currentQuestion.question_type}
            </div>
            <div>
              <span className="font-semibold">Marks:</span> {currentQuestion.marks}
            </div>
            <div>
              <span className="font-semibold">Difficulty:</span> {currentQuestion.difficulty}/5
            </div>
            <div>
              <span className="font-semibold">Board:</span> {currentQuestion.exam_boards?.name ?? '—'}
            </div>
          </div>
        </div>

        {/* Right panel - Answer */}
        <div className="flex-[2] rounded-lg border bg-muted/20 p-5">
          {currentQuestion.answer ? (
            <div className="space-y-4">
              <div className="text-sm font-semibold">Answer</div>
              <div className="prose prose-sm max-w-none leading-relaxed">
                <ReactMarkdown
                  remarkPlugins={[remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                >
                  {currentQuestion.answer.content ?? ''}
                </ReactMarkdown>
              </div>

              {/* Answer images */}
              {currentQuestion && (
                <div className="border-t pt-4">
                  <h4 className="text-sm font-semibold mb-3">Answer Images</h4>
                  <QuestionImageUpload
                    questionId={currentQuestion.id}
                    imageType="answer"
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 space-y-4">
              <div className="text-muted-foreground">
                <p className="mb-2">No answer yet</p>
                <p className="text-xs">Generate one now or approve to generate later</p>
              </div>
              <button
                onClick={handleGenerateAnswer}
                disabled={generatingAnswer}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {generatingAnswer ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  '✨ Generate Answer'
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom action bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center gap-3 border-t bg-white p-4 shadow-lg">
        <Button
          variant="outline"
          size="lg"
          onClick={handlePrev}
          disabled={currentIdx === 0 || actionLoading}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Prev
        </Button>

        <Button
          variant="destructive"
          size="lg"
          onClick={handleReject}
          disabled={actionLoading}
          className="gap-2"
        >
          {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
          Reject (R)
        </Button>

        <Button
          variant="default"
          size="lg"
          onClick={handleApprove}
          disabled={actionLoading}
          className="gap-2 bg-green-600 hover:bg-green-700"
        >
          {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
          Approve (A)
        </Button>

        <Button
          variant="outline"
          size="lg"
          onClick={handleNext}
          disabled={currentIdx === drafts.length - 1 || actionLoading}
          className="gap-2"
        >
          Next <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
