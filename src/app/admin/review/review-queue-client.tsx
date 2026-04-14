'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import remarkGfm from 'remark-gfm'
import rehypeKatex from 'rehype-katex'
import { ArrowLeft, ArrowRight, Check, Loader2, X, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MathRenderer } from '@/components/admin/math-renderer'
import { QuestionImageUpload } from '@/components/QuestionImageUpload'
import { SyllabusSelector } from '@/components/SyllabusSelector'
import { displayQuestionSerial, serialBadgeColor } from '@/lib/serial'
import type { QuestionWithRelations, AnswerRow } from '@/types/database'

const DrawingModal = dynamic(() => import('@/components/DrawingModal'), { ssr: false })
const PDFCropModal = dynamic(() => import('@/components/PDFCropModal'), { ssr: false })
const GraphModal = dynamic(() => import('@/components/admin/GraphModal'), { ssr: false })

interface SubSubtopic {
  id: string
  ext_num: number | null
  core_num: number | null
  outcome: string
  tier: string
  sort_order: number
}

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
  const [editedDifficulty, setEditedDifficulty] = useState<number>(3)
  const [isClassifying, setIsClassifying] = useState(false)
  const [autoClassifiedTopicId, setAutoClassifiedTopicId]       = useState<string | null>(null)
  const [autoClassifiedSubtopicId, setAutoClassifiedSubtopicId] = useState<string | null>(null)
  const [editSaving, setEditSaving] = useState(false)
  const [showDrawing, setShowDrawing] = useState(false)
  const [showCropper, setShowCropper] = useState(false)
  const [drawingTarget, setDrawingTarget] = useState<'question' | 'answer'>('answer')
  const [showGraphModal, setShowGraphModal] = useState(false)
  const [graphModalTarget, setGraphModalTarget] = useState<'question' | 'answer'>('question')
  const [subSubtopics, setSubSubtopics] = useState<SubSubtopic[]>([])
  const [selectedSubSubtopic, setSelectedSubSubtopic] = useState<string | null>(null)
  const [loadingSubSubtopics, setLoadingSubSubtopics] = useState(false)
  const [subSubtopicSearch, setSubSubtopicSearch] = useState('')
  const [subSubtopicOpen, setSubSubtopicOpen] = useState(false)
  const [bgAnswers, setBgAnswers] = useState<Map<string, AnswerRow>>(new Map())
  const [editTopicId, setEditTopicId] = useState<string | null>(null)
  const [editSubtopicId, setEditSubtopicId] = useState<string | null>(null)
  const [editSubSubtopicId, setEditSubSubtopicId] = useState<string | null>(null)
  const [editingAnswer, setEditingAnswer] = useState(false)
  const [editedAnswerContent, setEditedAnswerContent] = useState('')
  const [editAnswerSaving, setEditAnswerSaving] = useState(false)
  const [regeneratingAnswer, setRegeneratingAnswer] = useState(false)

  const pendingAutoSubSubId = useRef<string | null>(null)

  const remaining = drafts.length - currentIdx - 1

  // Split images by type for each section
  const questionImages = useMemo(() => {
    return currentQuestion?.question_images?.filter((img: any) => img.image_type === 'question') ?? []
  }, [currentQuestion?.id, currentQuestion?.question_images])

  const answerImages = useMemo(() => {
    return currentQuestion?.question_images?.filter((img: any) => img.image_type === 'answer') ?? []
  }, [currentQuestion?.id, currentQuestion?.question_images])

  const questionsWithoutAnswers = useMemo(() => {
    return drafts.filter(d => !d.answer && !bgAnswers.has(d.id))
  }, [drafts, bgAnswers])

  const canApprove = !!(
    (editTopicId || currentQuestion?.topic_id) &&
    (editSubtopicId || currentQuestion?.subtopic_id) &&
    (editSubSubtopicId || selectedSubSubtopic || currentQuestion?.sub_subtopic_id)
  )

  // Update currentQuestion when index changes (reset all edit states)
  useEffect(() => {
    const base = drafts[currentIdx] ?? null
    if (base && !base.answer && bgAnswers.has(base.id)) {
      setCurrentQuestion({ ...base, answer: bgAnswers.get(base.id)! })
    } else {
      setCurrentQuestion(base)
    }
    setEditing(false)
    setEditedText('')
    setEditingAnswer(false)
    setEditedAnswerContent('')
    setSelectedSubSubtopic(null)
    setSubSubtopicSearch('')
    setSubSubtopicOpen(false)
    setEditTopicId(null)
    setEditSubtopicId(null)
    setEditSubSubtopicId(null)
  }, [currentIdx, drafts])

  // Update currentQuestion with background answer (don't reset edit states)
  useEffect(() => {
    const base = drafts[currentIdx] ?? null
    if (base && !base.answer && bgAnswers.has(base.id)) {
      setCurrentQuestion((q) => q ? { ...q, answer: bgAnswers.get(base.id)! } : base)
    }
  }, [bgAnswers])

  // Close sub-subtopic dropdown when clicking outside
  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      const target = e.target as HTMLElement
      if (!target.closest('[data-subtopic-dropdown]')) {
        setSubSubtopicOpen(false)
      }
    }
    if (subSubtopicOpen) {
      document.addEventListener('mousedown', handleOutsideClick)
      return () => document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [subSubtopicOpen])

  // Fetch sub-subtopics when subtopic changes
  useEffect(() => {
    // Use editSubtopicId when in edit/auto-classify mode, otherwise use question's saved subtopic
    const activeSubtopicId = editSubtopicId || currentQuestion?.subtopic_id
    if (!activeSubtopicId) {
      setSubSubtopics([])
      setSelectedSubSubtopic(null)
      setSubSubtopicSearch('')
      setSubSubtopicOpen(false)
      return
    }

    setLoadingSubSubtopics(true)
    fetch(`/api/sub-subtopics?subtopic_id=${activeSubtopicId}`)
      .then((res) => res.json())
      .then((data) => {
        setSubSubtopics(data)
        if (pendingAutoSubSubId.current && data.some((s: SubSubtopic) => s.id === pendingAutoSubSubId.current)) {
          setEditSubSubtopicId(pendingAutoSubSubId.current)
          pendingAutoSubSubId.current = null
        } else if (currentQuestion?.sub_subtopic_id && data.some((s: SubSubtopic) => s.id === currentQuestion.sub_subtopic_id)) {
          setSelectedSubSubtopic(currentQuestion.sub_subtopic_id)
        }
      })
      .catch((err) => console.error('Failed to fetch sub-subtopics:', err))
      .finally(() => setLoadingSubSubtopics(false))
  }, [currentQuestion?.subtopic_id, currentQuestion?.sub_subtopic_id, editSubtopicId])

  // Load last used topic from localStorage when entering edit mode
  useEffect(() => {
    if (editing && !editTopicId) {
      try {
        const savedTopicId = localStorage.getItem('lastUsedTopicId')
        if (savedTopicId) {
          setEditTopicId(savedTopicId)
        }
      } catch (err) {
        console.error('Failed to load last used topic:', err)
      }
    }
  }, [editing])

  // Keyboard shortcuts (Arrow keys for navigation only)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable shortcuts when typing in any input/textarea/select
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      if (editing || editingAnswer) return

      if (e.key === 'ArrowRight') {
        e.preventDefault()
        handleNext()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        handlePrev()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentIdx, actionLoading, editing, editingAnswer])

  // Background answer generation
  useEffect(() => {
    const questionsToGenerate = drafts.filter(d => !d.answer)
    if (questionsToGenerate.length === 0) return

    let cancelled = false

    const generateSequentially = async () => {
      for (const q of questionsToGenerate) {
        if (cancelled) break
        // Skip if already generated in background
        if (bgAnswers.has(q.id)) continue
        try {
          const res = await fetch('/api/generate-answer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question_id: q.id }),
          })
          if (res.ok && !cancelled) {
            const data = await res.json()
            if (data.answer) {
              setBgAnswers(prev => new Map(prev).set(q.id, data.answer))
            }
          }
        } catch {
          // Non-fatal — tutor can still generate manually
        }
        // 2 second delay between calls to avoid rate limits
        if (!cancelled) {
          await new Promise(resolve => setTimeout(resolve, 2000))
        }
      }
    }

    generateSequentially()
    return () => { cancelled = true }
  }, []) // Run once on mount only

  async function updateQuestionStatus(
    questionId: string,
    status: 'approved' | 'rejected',
    answerId?: string,
    classificationUpdates?: { topic_id?: string; subtopic_id?: string; sub_subtopic_id?: string | null }
  ) {
    try {
      // Update question with status and any classification changes
      const updateBody: Record<string, unknown> = { status }
      if (classificationUpdates?.topic_id) updateBody.topic_id = classificationUpdates.topic_id
      if (classificationUpdates?.subtopic_id) updateBody.subtopic_id = classificationUpdates.subtopic_id
      if (classificationUpdates?.sub_subtopic_id !== undefined) updateBody.sub_subtopic_id = classificationUpdates.sub_subtopic_id

      const qRes = await fetch(`/api/questions/${questionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateBody),
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

    // Require all three classifications before approval
    const effectiveSubSubtopicId = editSubSubtopicId || selectedSubSubtopic || currentQuestion?.sub_subtopic_id
    if ((!editTopicId && !currentQuestion?.topic_id) || (!editSubtopicId && !currentQuestion?.subtopic_id) || !effectiveSubSubtopicId) {
      alert('Classification required — please select a Topic, Subtopic, and Sub-subtopic before approving.')
      return
    }

    setActionLoading(true)
    try {
      // Include classification updates if any were made in edit mode
      const classificationUpdates: Record<string, any> = {}
      if (editTopicId) {
        classificationUpdates.topic_id = editTopicId
        localStorage.setItem('lastUsedTopicId', editTopicId)
      }
      if (editSubtopicId) classificationUpdates.subtopic_id = editSubtopicId
      if (editSubSubtopicId !== null) classificationUpdates.sub_subtopic_id = editSubSubtopicId
      else if (selectedSubSubtopic) classificationUpdates.sub_subtopic_id = selectedSubSubtopic

      const ok = await updateQuestionStatus(
        currentQuestion.id,
        'approved',
        currentQuestion.answer?.id,
        Object.keys(classificationUpdates).length > 0 ? classificationUpdates : undefined
      )
      if (ok) {
        setStats((s) => ({ ...s, approved: s.approved + 1 }))
        toast.success(`Approved ${currentQuestion.serial_number}`)
        // Trigger sidebar count refresh
        localStorage.setItem('reviewQueueRefresh', Date.now().toString())
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
        // Trigger sidebar count refresh
        localStorage.setItem('reviewQueueRefresh', Date.now().toString())
        handleNext()
      }
    } finally {
      setActionLoading(false)
    }
  }

  function handleGraphSaved(savedImage: { image_url: string; display_url: string | null; image_id: string; storage_path: string; image_type: string }) {
    setCurrentQuestion((q) => {
      if (!q) return q
      const newImg = {
        id: savedImage.image_id,
        question_id: q.id,
        storage_path: savedImage.storage_path,
        image_type: savedImage.image_type,
        display_url: savedImage.display_url ?? null,
        sort_order: (q.question_images?.length ?? 0) + 1,
        created_at: new Date().toISOString(),
      }
      return {
        ...q,
        question_images: [...(q.question_images ?? []), newImg],
      }
    })
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
      setCurrentQuestion((q) => q ? { ...q, answer } : (q as any))
      toast.success('Answer generated successfully')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Generation failed'
      toast.error(msg)
    } finally {
      setGeneratingAnswer(false)
    }
  }

  async function handleSaveEdit() {
    if (!currentQuestion || editSaving) return
    setEditSaving(true)
    try {
      const textToSave = editedText.trim() || currentQuestion.content_text
      const updates: Record<string, unknown> = {
        content: textToSave,
        difficulty: editedDifficulty,
      }
      if (editTopicId) {
        updates.topic_id = editTopicId
        // Save last used topic to localStorage
        localStorage.setItem('lastUsedTopicId', editTopicId)
      }
      if (editSubtopicId) updates.subtopic_id = editSubtopicId
      if (editSubSubtopicId) updates.sub_subtopic_id = editSubSubtopicId

      const res = await fetch(`/api/questions/${currentQuestion.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })

      if (!res.ok) {
        const d = await res.json() as { error?: string }
        throw new Error(d.error ?? 'Save failed')
      }

      // Update current question with new content and classification
      setCurrentQuestion((q) =>
        q
          ? {
              ...q,
              content_text: textToSave,
              topic_id: editTopicId || q.topic_id,
              subtopic_id: editSubtopicId || q.subtopic_id,
              sub_subtopic_id: editSubSubtopicId || q.sub_subtopic_id,
            }
          : (q as any)
      )
      setEditing(false)
      setEditedText('')
      setEditTopicId(null)
      setEditSubtopicId(null)
      setEditSubSubtopicId(null)
      toast.success('Question updated')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Save failed'
      toast.error(msg)
    } finally {
      setEditSaving(false)
    }
  }

  async function handleAutoClassify() {
    if (!currentQuestion) return
    setIsClassifying(true)
    try {
      const res = await fetch('/api/classify-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question_id: currentQuestion.id,
          topic_id: editTopicId ?? null,
        }),
      })
      const data = await res.json() as {
        subtopic_id?: string
        topic_id?: string
        sub_subtopic_id?: string | null
        subtopic_title?: string
        error?: string
      }
      if (!res.ok) throw new Error(data.error ?? 'Classification failed')
      if (data.subtopic_id) {
        setEditSubtopicId(data.subtopic_id)
        if (data.sub_subtopic_id) {
          pendingAutoSubSubId.current = data.sub_subtopic_id
          setEditSubSubtopicId(data.sub_subtopic_id)
        }
        // Use topic_id directly from API response — no second fetch needed
        if (data.topic_id) {
          setAutoClassifiedTopicId(data.topic_id)
          setEditTopicId(data.topic_id)
        }
        setAutoClassifiedSubtopicId(data.subtopic_id)
        // Open sub-subtopic dropdown automatically so user can pick if none auto-selected
        setSubSubtopicOpen(true)
        toast.success(`Auto-classified: ${data.subtopic_title ?? data.subtopic_id}`)
        if (data.sub_subtopic_title) setSubSubtopicSearch(data.sub_subtopic_title)
      } else {
        toast.warning('Could not classify — no matching subtopic found')
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Classification failed')
    } finally {
      setIsClassifying(false)
    }
  }

  function handleCancelEdit() {
    setEditing(false)
    setEditedText('')
    setEditedDifficulty(3)
    setAutoClassifiedTopicId(null)
    setAutoClassifiedSubtopicId(null)
  }

  function handleStartEdit() {
    if (!currentQuestion) return
    setEditedText(currentQuestion.content_text ?? '')
    setEditedDifficulty(currentQuestion.difficulty ?? 3)
    setEditing(true)
  }

  function handleStartEditAnswer() {
    if (!currentQuestion?.answer) return
    setEditedAnswerContent(currentQuestion.answer.content ?? '')
    setEditingAnswer(true)
  }

  function handleCancelEditAnswer() {
    setEditingAnswer(false)
    setEditedAnswerContent('')
  }

  async function handleRegenerateAnswer() {
    if (!currentQuestion) return
    setRegeneratingAnswer(true)
    try {
      // Get question images (to send to Claude vision)
      const imageRes = await fetch(`/api/question-images?question_id=${currentQuestion.id}`)
      const images = await imageRes.json()
      const imageUrls = images.map((img: any) => img.display_url).filter(Boolean)

      const res = await fetch('/api/generate-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question_id: currentQuestion.id,
          force_regenerate: true,
          image_urls: imageUrls,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed to regenerate')

      // Update the current question with new answer
      setCurrentQuestion((q) => (q ? { ...q, answer: data.answer } : q))
      setDrafts((prev) =>
        prev.map((q) =>
          q.id === currentQuestion.id ? { ...q, answer: data.answer } : q
        )
      )
      toast.success('Answer regenerated')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Regeneration failed')
    } finally {
      setRegeneratingAnswer(false)
    }
  }

  async function handleSaveEditAnswer() {
    if (!currentQuestion?.answer || editAnswerSaving || !editedAnswerContent.trim()) return
    setEditAnswerSaving(true)
    try {
      const res = await fetch(`/api/answers/${currentQuestion.answer.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editedAnswerContent.trim() }),
      })

      if (!res.ok) {
        const d = await res.json() as { error?: string }
        throw new Error(d.error ?? 'Save failed')
      }

      // Update current question with new answer content
      setCurrentQuestion((q) =>
        q
          ? {
              ...q,
              answer: { ...q.answer!, content: editedAnswerContent.trim() },
            }
          : (q as any)
      )
      setEditingAnswer(false)
      setEditedAnswerContent('')
      toast.success('Answer updated')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Save failed'
      toast.error(msg)
    } finally {
      setEditAnswerSaving(false)
    }
  }

  async function handleSelectSubSubtopic(subSubtopicId: string) {
    if (!currentQuestion) return

    try {
      const res = await fetch(`/api/questions/${currentQuestion.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sub_subtopic_id: subSubtopicId }),
      })

      if (!res.ok) {
        const d = await res.json() as { error?: string }
        throw new Error(d.error ?? 'Failed to update sub-subtopic')
      }

      setSelectedSubSubtopic(subSubtopicId)
      setCurrentQuestion((q) => q ? { ...q, sub_subtopic_id: subSubtopicId } : (q as any))
      toast.success('Sub-subtopic updated')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Update failed'
      toast.error(msg)
    }
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
                <div className="border rounded-md p-3 bg-muted/20 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-muted-foreground">
                      Classification (optional — leave blank to keep existing)
                    </p>
                    <button
                      type="button"
                      onClick={handleAutoClassify}
                      disabled={isClassifying}
                      className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md border border-blue-300 text-blue-600 hover:bg-blue-50 disabled:opacity-50 transition-colors"
                    >
                      {isClassifying
                        ? <><Loader2 className="h-3 w-3 animate-spin" /> Classifying…</>
                        : <><Sparkles className="h-3 w-3" /> Auto-classify</>}
                    </button>
                  </div>
                  <SyllabusSelector
                    key={`${autoClassifiedTopicId}-${autoClassifiedSubtopicId}`}
                    onTopicChange={setEditTopicId}
                    onSubtopicChange={setEditSubtopicId}
                    onSubSubtopicChange={setEditSubSubtopicId}
                    showTierBadge={false}
                    subjectId={null}
                    initialTopicId={autoClassifiedTopicId}
                    initialSubtopicId={autoClassifiedSubtopicId}
                    hideSubSubtopic={true}
                  />

                  {/* Searchable sub-subtopic — inside Classification section */}
                  {subSubtopics.length > 0 && (
                    <div className="space-y-1 pt-1" data-subtopic-dropdown>
                      <p className="text-xs font-medium text-muted-foreground">Sub-subtopic</p>
                      <div className="relative">
                        <input
                          type="text"
                          value={(() => {
                            if (subSubtopicSearch !== '') return subSubtopicSearch
                            if (editSubSubtopicId) {
                              const found = subSubtopics.find(s => s.id === editSubSubtopicId)
                              return found ? found.outcome : ''
                            }
                            return ''
                          })()}
                          onChange={(e) => {
                            setSubSubtopicSearch(e.target.value)
                            setSubSubtopicOpen(true)
                          }}
                          onFocus={() => setSubSubtopicOpen(true)}
                          onClick={() => setSubSubtopicOpen(true)}
                          disabled={loadingSubSubtopics}
                          placeholder={loadingSubSubtopics ? 'Loading...' : 'Type to search...'}
                          className="w-full px-2 py-1 text-sm rounded-md border bg-white hover:bg-gray-50 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
                        />
                        {subSubtopicOpen && (
                          <div className="absolute z-50 mt-1 w-full max-h-72 overflow-y-auto rounded-md border bg-white shadow-lg">
                            {[...subSubtopics]
                              .filter(s => {
                                const q = subSubtopicSearch.toLowerCase()
                                return !q || s.outcome.toLowerCase().includes(q)
                              })
                              .sort((a, b) => {
                                if (!subSubtopicSearch) return 0
                                const q = subSubtopicSearch.toLowerCase()
                                const aStarts = a.outcome.toLowerCase().startsWith(q)
                                const bStarts = b.outcome.toLowerCase().startsWith(q)
                                if (aStarts && !bStarts) return -1
                                if (!aStarts && bStarts) return 1
                                return 0
                              })
                              .map(sub => (
                                <button
                                  key={sub.id}
                                  type="button"
                                  onMouseDown={() => {
                                    setEditSubSubtopicId(sub.id)
                                    setSubSubtopicSearch('')
                                    setSubSubtopicOpen(false)
                                  }}
                                  className={`w-full text-left px-3 py-2 text-sm hover:bg-blue-50 transition-colors ${
                                    editSubSubtopicId === sub.id ? 'bg-blue-100 text-blue-800 font-medium' : 'text-gray-800'
                                  }`}
                                >
                                  {sub.tier === 'extended' && (
                                    <span className="mr-1.5 text-[10px] text-purple-600 font-medium bg-purple-50 px-1 py-0.5 rounded">E</span>
                                  )}
                                  {sub.outcome}
                                </button>
                              ))
                            }
                            {subSubtopics.filter(s => {
                              const q = subSubtopicSearch.toLowerCase()
                              return !q || s.outcome.toLowerCase().includes(q)
                            }).length === 0 && subSubtopicSearch && (
                              <div className="px-3 py-2 text-sm text-gray-400">No results for "{subSubtopicSearch}"</div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="border rounded-md p-3 bg-muted/20 space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Difficulty</p>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setEditedDifficulty(star)}
                        className={`text-2xl transition-colors ${
                          star <= editedDifficulty
                            ? 'text-yellow-400 hover:text-yellow-500'
                            : 'text-gray-300 hover:text-yellow-300'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-muted-foreground self-center">
                      {editedDifficulty} / 5
                    </span>
                  </div>
                </div>

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
                    <div className="flex gap-2 mb-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setDrawingTarget('question')
                          setShowDrawing(true)
                        }}
                      >
                        ✏️ Draw
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setGraphModalTarget('question')
                          setShowGraphModal(true)
                        }}
                        className="border-blue-200 text-blue-700 hover:bg-blue-50"
                      >
                        📈 Graph
                      </Button>
                      {currentQuestion.batch_id && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setDrawingTarget('question')
                            setShowCropper(true)
                          }}
                        >
                          📄 Crop from PDF
                        </Button>
                      )}
                    </div>
                    <QuestionImageUpload
                      key={`question-${currentQuestion.id}-${questionImages.length}`}
                      questionId={currentQuestion.id}
                      imageType="question"
                      batchId={currentQuestion.batch_id ?? null}
                      questionNumber={currentQuestion.parent_question_ref ? parseInt(currentQuestion.parent_question_ref) : null}
                      initialImages={questionImages}
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
        <div className="flex-[2] rounded-lg border bg-muted/20 p-5 flex flex-col space-y-4">
          {currentQuestion.answer ? (
            <>
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">Answer</div>
                {!editingAnswer && (
                  <div className="flex gap-2">
                    <button
                      onClick={handleRegenerateAnswer}
                      disabled={regeneratingAnswer}
                      className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md bg-orange-100 text-orange-700 hover:bg-orange-200 transition-colors disabled:opacity-60"
                    >
                      {regeneratingAnswer ? <Loader2 className="h-3 w-3 animate-spin" /> : '🔄'}
                      {regeneratingAnswer ? 'Regenerating...' : 'Regenerate'}
                    </button>
                    <button
                      onClick={handleStartEditAnswer}
                      disabled={editAnswerSaving}
                      className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md hover:bg-muted transition-colors disabled:opacity-60"
                    >
                      ✏ Edit Answer
                    </button>
                  </div>
                )}
              </div>
              {editingAnswer ? (
                <div className="space-y-3">
                  <textarea
                    value={editedAnswerContent}
                    onChange={(e) => setEditedAnswerContent(e.target.value)}
                    className="w-full h-64 p-4 rounded-lg border bg-white text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Answer content..."
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveEditAnswer}
                      disabled={editAnswerSaving || !editedAnswerContent.trim()}
                      className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                    >
                      {editAnswerSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : '✓'}
                      Save Answer
                    </button>
                    <button
                      onClick={handleCancelEditAnswer}
                      disabled={editAnswerSaving}
                      className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md bg-gray-300 text-gray-800 hover:bg-gray-400 disabled:opacity-50"
                    >
                      ✗ Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="prose prose-sm max-w-none leading-relaxed">
                  <ReactMarkdown
                    remarkPlugins={[remarkMath, remarkGfm]}
                    rehypePlugins={[rehypeKatex]}
                  >
                    {currentQuestion.answer.content ?? ''}
                  </ReactMarkdown>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 space-y-4">
              <div className="text-muted-foreground">
                <p className="mb-2">No answer yet</p>
                <p className="text-xs">Generate one now or approve to generate later</p>
              </div>
              {questionsWithoutAnswers?.length > 0 && (
                <p className="text-xs text-blue-600 animate-pulse">
                  ⚡ Generating answers in background...
                </p>
              )}
              <div className="flex gap-2">
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
                <button
                  onClick={handleRegenerateAnswer}
                  disabled={regeneratingAnswer}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md bg-orange-100 text-orange-700 hover:bg-orange-200 disabled:opacity-50"
                >
                  {regeneratingAnswer ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Regenerating...
                    </>
                  ) : (
                    '🔄 Regenerate'
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Answer images - always visible */}
          {currentQuestion && (
            <div className="border-t pt-4">
              <h4 className="text-sm font-semibold mb-3">Answer Images</h4>
              <div className="flex gap-2 mb-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setDrawingTarget('answer')
                    setShowDrawing(true)
                  }}
                >
                  ✏️ Draw
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setGraphModalTarget('answer')
                    setShowGraphModal(true)
                  }}
                  className="border-blue-200 text-blue-700 hover:bg-blue-50"
                >
                  📈 Graph
                </Button>
                {currentQuestion.batch_id && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setDrawingTarget('answer')
                      setShowCropper(true)
                    }}
                  >
                    📄 Crop from PDF
                  </Button>
                )}
              </div>
              <QuestionImageUpload
                key={`answer-${currentQuestion.id}-${answerImages.length}`}
                questionId={currentQuestion.id}
                imageType="answer"
                batchId={currentQuestion.batch_id ?? null}
                questionNumber={currentQuestion.parent_question_ref ? parseInt(currentQuestion.parent_question_ref) : null}
                initialImages={answerImages}
              />
            </div>
          )}
        </div>
      </div>

      {/* Bottom action bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex flex-col items-center justify-center border-t bg-white shadow-lg">
        {!canApprove && (
          <p className="text-xs text-red-500 text-center p-2 w-full">
            Select Topic, Subtopic and Sub-subtopic to approve
          </p>
        )}
        <div className="flex items-center justify-center gap-3 p-4">
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
          Reject
        </Button>

        <Button
          variant="default"
          size="lg"
          onClick={handleApprove}
          disabled={actionLoading || !canApprove}
          className={`gap-2 ${canApprove ? 'bg-green-600 hover:bg-green-700 cursor-pointer' : 'bg-gray-300 cursor-not-allowed opacity-60'}`}
          title={canApprove ? 'Approve' : 'Classification required — select Topic, Subtopic, and Sub-subtopic to approve'}
        >
          {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
          Approve
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

      {/* Modals */}
      <DrawingModal
        isOpen={showDrawing}
        onClose={() => setShowDrawing(false)}
        onSave={() => {
          setShowDrawing(false)
        }}
        questionId={currentQuestion?.id ?? ''}
        imageType={drawingTarget}
      />
      {currentQuestion?.batch_id && (
        <PDFCropModal
          isOpen={showCropper}
          onClose={() => setShowCropper(false)}
          onSave={() => {
            setShowCropper(false)
          }}
          questionId={currentQuestion.id}
          batchId={currentQuestion.batch_id}
          questionNumber={currentQuestion.parent_question_ref ? parseInt(currentQuestion.parent_question_ref) : null}
          imageType={drawingTarget}
        />
      )}
      <GraphModal
        isOpen={showGraphModal}
        onClose={() => setShowGraphModal(false)}
        onSaved={handleGraphSaved}
        questionId={currentQuestion?.id ?? ''}
        imageType={graphModalTarget}
        prefillText={currentQuestion?.content_text ?? ''}
      />
    </div>
  )
}
