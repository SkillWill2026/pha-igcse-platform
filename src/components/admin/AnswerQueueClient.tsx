'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import remarkGfm from 'remark-gfm'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'

type QueueAnswer = {
  id: string
  serial_number: string
  content: string
  confidence_score: number | null
  status: string
  question_id: string
  questions: {
    id: string
    serial_number: string
    content_text: string
    status: string
    topics: { name: string; ref: string } | null
    subtopics: { title: string } | null
  } | null
}

type Props = {
  initialAnswers: unknown[]
  initialError: string | null
}

export function AnswerQueueClient({ initialAnswers, initialError }: Props) {
  const [answers, setAnswers] = useState<QueueAnswer[]>(initialAnswers as QueueAnswer[])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [editContent, setEditContent] = useState('')
  const [editMode, setEditMode] = useState(false)
  const [saving, setSaving] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [bulkLoading, setBulkLoading] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const selected = answers[selectedIndex] ?? null

  useEffect(() => {
    if (selected) setEditContent(selected.content ?? '')
    setEditMode(false)
  }, [selectedIndex, selected?.id])

  const removeAndAdvance = useCallback((id: string) => {
    setAnswers(prev => prev.filter(a => a.id !== id))
    setSelectedIndex(prev => Math.max(0, prev - 1))
    setEditMode(false)
    setSaving(false)
  }, [])

  const handleAction = useCallback(async (id: string, status: string) => {
    setSaving(true)
    try {
      await fetch(`/api/answer-queue/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editContent, status }),
      })
      removeAndAdvance(id)
    } catch {
      setSaving(false)
    }
  }, [editContent, removeAndAdvance])

  const handleBulk = async (status: string) => {
    if (!selectedIds.size) return
    setBulkLoading(true)
    try {
      await fetch('/api/answer-queue/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: Array.from(selectedIds), status }),
      })
      setAnswers(prev => prev.filter(a => !selectedIds.has(a.id)))
      setSelectedIds(new Set())
      setSelectedIndex(0)
    } finally {
      setBulkLoading(false)
    }
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (editMode) return
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'TEXTAREA' || tag === 'INPUT') return
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        setSelectedIndex(i => Math.min(i + 1, answers.length - 1))
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        setSelectedIndex(i => Math.max(i - 1, 0))
      } else if ((e.key === 'a' || e.key === 'A') && selected) {
        handleAction(selected.id, 'approved')
      } else if ((e.key === 'r' || e.key === 'R') && selected) {
        handleAction(selected.id, 'rejected')
      } else if (e.key === 'e' || e.key === 'E') {
        setEditMode(true)
        setTimeout(() => textareaRef.current?.focus(), 50)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [answers.length, selected, editMode, handleAction])

  const confidenceBadge = (score: number | null) => {
    if (score === null) return (
      <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
        No score
      </span>
    )
    const pct = Math.round(score * 100)
    const cls = score < 0.5
      ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
      : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
    return <span className={`px-2 py-0.5 rounded text-xs font-medium ${cls}`}>{pct}%</span>
  }

  if (initialError) return (
    <div className="p-6 text-red-600 text-sm">Error loading queue: {initialError}</div>
  )

  if (!answers.length) return (
    <div className="flex flex-col items-center justify-center h-64 gap-3">
      <div className="text-3xl">✅</div>
      <div className="font-medium text-gray-700 dark:text-gray-300">Answer queue is clear</div>
      <div className="text-sm text-gray-400">All answers have confidence ≥ 70%</div>
    </div>
  )

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">

      {/* ── Left panel ── */}
      <div className="w-80 border-r border-gray-200 dark:border-gray-800 flex flex-col shrink-0">

        {/* Header */}
        <div className="p-3 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">Answer Queue</div>
              <div className="text-xs text-gray-400 mt-0.5">
                {answers.length} flagged answer{answers.length !== 1 ? 's' : ''}
              </div>
            </div>
            {selectedIds.size > 0 && (
              <div className="flex gap-1.5">
                <button
                  onClick={() => handleBulk('approved')}
                  disabled={bulkLoading}
                  className="px-2 py-1 text-xs rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  ✓ {selectedIds.size}
                </button>
                <button
                  onClick={() => handleBulk('rejected')}
                  disabled={bulkLoading}
                  className="px-2 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                  ✗ {selectedIds.size}
                </button>
              </div>
            )}
          </div>
          <label className="flex items-center gap-2 mt-2 text-xs text-gray-500 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={selectedIds.size === answers.length && answers.length > 0}
              onChange={e => setSelectedIds(
                e.target.checked ? new Set(answers.map(a => a.id)) : new Set()
              )}
            />
            Select all
          </label>
        </div>

        {/* List */}
        <div className="overflow-y-auto flex-1">
          {answers.map((a, i) => (
            <div
              key={a.id}
              onClick={() => setSelectedIndex(i)}
              className={`p-3 border-b border-gray-100 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 flex gap-2 transition-colors ${
                i === selectedIndex
                  ? 'bg-blue-50 dark:bg-blue-950/40 border-l-2 border-l-blue-500'
                  : ''
              }`}
            >
              <input
                type="checkbox"
                checked={selectedIds.has(a.id)}
                onClick={e => e.stopPropagation()}
                onChange={e => {
                  setSelectedIds(prev => {
                    const next = new Set(prev)
                    e.target.checked ? next.add(a.id) : next.delete(a.id)
                    return next
                  })
                }}
                className="mt-0.5 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {confidenceBadge(a.confidence_score)}
                  <span className="text-xs text-gray-400 font-mono">{a.serial_number}</span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {a.questions?.topics?.ref} · {a.questions?.subtopics?.title ?? '—'}
                </div>
                <div className="text-xs text-gray-400 mt-0.5 line-clamp-2 leading-relaxed">
                  {a.questions?.content_text?.slice(0, 90)}…
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Keyboard hint */}
        <div className="p-2 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-xs text-gray-400 text-center">
          ← → navigate · A approve · R reject · E edit
        </div>
      </div>

      {/* ── Right panel ── */}
      {selected && (
        <div className="flex-1 overflow-y-auto p-6 space-y-5">

          {/* Question */}
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Question</span>
              {selected.questions?.topics?.ref && (
                <span className="text-xs px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                  {selected.questions.topics.ref}
                </span>
              )}
              {selected.questions?.subtopics?.title && (
                <span className="text-xs text-gray-400">{selected.questions.subtopics.title}</span>
              )}
            </div>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkMath, remarkGfm]} rehypePlugins={[rehypeKatex]}>
                {selected.questions?.content_text ?? ''}
              </ReactMarkdown>
            </div>
          </div>

          {/* Answer */}
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Answer</span>
                <span className="text-xs font-mono text-gray-400">{selected.serial_number}</span>
                {confidenceBadge(selected.confidence_score)}
              </div>
              <button
                onClick={() => {
                  const next = !editMode
                  setEditMode(next)
                  if (next) setTimeout(() => textareaRef.current?.focus(), 50)
                }}
                className="text-xs px-3 py-1 rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
              >
                {editMode ? 'Preview' : 'Edit (E)'}
              </button>
            </div>

            {editMode ? (
              <textarea
                ref={textareaRef}
                value={editContent}
                onChange={e => setEditContent(e.target.value)}
                onKeyDown={e => { if (e.key === 'Escape') setEditMode(false) }}
                className="w-full h-72 p-3 text-sm font-mono border border-gray-200 dark:border-gray-700 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100"
                placeholder="Markdown + LaTeX (e.g. $x^2 + 1$)"
              />
            ) : (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkMath, remarkGfm]} rehypePlugins={[rehypeKatex]}>
                  {editContent}
                </ReactMarkdown>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pb-6">
            <button
              onClick={() => handleAction(selected.id, 'approved')}
              disabled={saving}
              className="px-5 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
            >
              {saving ? 'Saving…' : '✓ Approve (A)'}
            </button>
            <button
              onClick={() => handleAction(selected.id, 'rejected')}
              disabled={saving}
              className="px-5 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
            >
              ✗ Reject (R)
            </button>
            <button
              onClick={() => {
                setAnswers(prev => prev.filter((_, i) => i !== selectedIndex))
                setSelectedIndex(prev => Math.max(0, prev - 1))
                setEditMode(false)
              }}
              className="px-5 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Skip
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
