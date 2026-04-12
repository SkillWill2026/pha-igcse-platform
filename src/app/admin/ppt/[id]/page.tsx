'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, CheckCircle2, ChevronLeft, ChevronRight,
  Loader2, RefreshCw, Save, Sparkles, Clock
} from 'lucide-react'
import type { PptDeck, Slide, YouchiPose, SlideType } from '@/types/ppt'
import { YOUCHI_POSE_LABELS, YOUCHI_POSES } from '@/lib/youchi'
import { SlidePreview } from '@/components/admin/SlidePreview'

const SLIDE_TYPE_LABELS: Record<SlideType, string> = {
  title:    'Title',
  overview: 'Overview',
  section:  'Section',
  concept:  'Concept',
  question: 'Question',
  answer:   'Answer',
  summary:  'Summary',
}

const SLIDE_TYPE_COLORS: Record<SlideType, string> = {
  title:    'bg-[#145087] text-white',
  overview: 'bg-[#28A0E1] text-white',
  section:  'bg-[#145087] text-white',
  concept:  'bg-[#28A0E1] text-white',
  question: 'bg-amber-100 text-amber-800',
  answer:   'bg-green-100 text-green-800',
  summary:  'bg-purple-100 text-purple-800',
}

export default function PptEditorPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [deck, setDeck]               = useState<PptDeck | null>(null)
  const [slides, setSlides]           = useState<Slide[]>([])
  const [currentIdx, setCurrentIdx]   = useState(0)
  const [loading, setLoading]         = useState(true)
  const [saving, setSaving]           = useState(false)
  const [approving, setApproving]     = useState(false)
  const [regenerating, setRegenerating] = useState(false)
  const [regenNotes, setRegenNotes]   = useState('')
  const [savedMsg, setSavedMsg]       = useState('')
  const [error, setError]             = useState<string | null>(null)

  // Load deck
  const loadDeck = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/ppt/${id}`)
      const data = await res.json()
      if (!res.ok) { setError('Deck not found'); return }
      setDeck(data.deck)
      setSlides(data.deck.slides ?? [])
    } catch {
      setError('Failed to load deck')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => { loadDeck() }, [loadDeck])

  const currentSlide = slides[currentIdx] ?? null

  // Jump to the section slide matching the clicked overview bullet
  function handleSectionClick(sectionTitle: string) {
    const idx = slides.findIndex(
      s => s.type === 'section' && s.title.trim().toLowerCase() === sectionTitle.trim().toLowerCase()
    )
    if (idx !== -1) setCurrentIdx(idx)
  }

  // Update a field on the current slide
  function updateSlide(field: keyof Slide, value: unknown) {
    setSlides(prev => prev.map((s, i) =>
      i === currentIdx ? { ...s, [field]: value } : s
    ))
  }

  // Update bullets from textarea (one per line)
  function updateBullets(raw: string) {
    updateSlide('bullets', raw.split('\n').filter(b => b.trim()))
  }

  // Update answer_working from textarea (one step per line)
  function updateWorking(raw: string) {
    updateSlide('answer_working', raw.split('\n').filter(s => s.trim()))
  }

  // Save all slides
  async function handleSave() {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`/api/ppt/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slides }),
      })
      if (!res.ok) { setError('Save failed'); return }
      setSavedMsg('Saved!')
      setTimeout(() => setSavedMsg(''), 2500)
    } catch {
      setError('Save failed')
    } finally {
      setSaving(false)
    }
  }

  // Approve deck
  async function handleApprove() {
    setApproving(true)
    setError(null)
    try {
      // Save slides first then approve
      await fetch(`/api/ppt/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slides, status: 'approved' }),
      })
      router.push('/admin/ppt')
    } catch {
      setError('Approve failed')
    } finally {
      setApproving(false)
    }
  }

  // Regenerate entire deck with notes
  async function handleRegenerate() {
    if (!deck) return
    if (!confirm('This will replace all current slides with a new AI-generated version. Continue?')) return
    setRegenerating(true)
    setError(null)
    try {
      const res = await fetch('/api/ppt/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subtopic_id: deck.subtopic_id,
          subject_id: deck.subject_id,
          tutor_notes: regenNotes || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        if (data.code === 'NO_DATABANK_DATA') {
          setError('Data not available in Databank.')
        } else {
          setError(data.error ?? 'Regeneration failed')
        }
        return
      }
      // Delete old deck, redirect to new one
      await fetch(`/api/ppt/${id}`, { method: 'DELETE' })
      router.push(`/admin/ppt/${data.deck.id}`)
    } catch {
      setError('Regeneration failed')
    } finally {
      setRegenerating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error && !deck) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Link href="/admin/ppt" className="text-sm text-muted-foreground hover:underline">← Back to PPT Slides</Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full min-h-screen">

      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b bg-background sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Link href="/admin/ppt" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> PPT Slides
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm font-medium truncate max-w-xs">{deck?.title}</span>
          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
            deck?.status === 'approved'
              ? 'bg-green-100 text-green-700'
              : 'bg-amber-100 text-amber-700'
          }`}>
            {deck?.status === 'approved'
              ? <><CheckCircle2 className="h-3 w-3" /> Approved</>
              : <><Clock className="h-3 w-3" /> Draft</>}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {savedMsg && <span className="text-xs text-green-600 font-medium">{savedMsg}</span>}
          {error && <span className="text-xs text-red-500">{error}</span>}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-accent disabled:opacity-50 transition-colors"
          >
            {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
            Save
          </button>
          {deck?.status !== 'approved' && (
            <button
              onClick={handleApprove}
              disabled={approving}
              className="flex items-center gap-1.5 rounded-lg bg-[#145087] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#28A0E1] disabled:opacity-50 transition-colors"
            >
              {approving ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle2 className="h-3 w-3" />}
              Approve
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">

        {/* Left panel — slide list */}
        <div className="w-48 shrink-0 border-r bg-muted/20 overflow-y-auto flex flex-col">
          <div className="p-2 space-y-1">
            {slides.map((slide, i) => (
              <button
                key={slide.id}
                onClick={() => setCurrentIdx(i)}
                className={`w-full flex items-center gap-2 rounded-lg px-2 py-2 text-left transition-colors ${
                  i === currentIdx
                    ? 'bg-[#145087] text-white'
                    : 'hover:bg-accent text-muted-foreground hover:text-foreground'
                }`}
              >
                <span className={`text-xs font-bold shrink-0 w-5 text-center rounded ${i === currentIdx ? 'text-white/70' : 'text-muted-foreground'}`}>
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <span className={`inline-block rounded px-1 text-[9px] font-semibold mb-0.5 ${
                    i === currentIdx ? 'bg-white/20 text-white' : SLIDE_TYPE_COLORS[slide.type as SlideType]
                  }`}>
                    {SLIDE_TYPE_LABELS[slide.type as SlideType] ?? slide.type}
                  </span>
                  <p className={`text-xs truncate ${i === currentIdx ? 'text-white/90' : ''}`}>
                    {slide.title}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main area */}
        <div className="flex-1 overflow-y-auto">
          {currentSlide && (
            <div className="p-6 max-w-3xl mx-auto space-y-6">

              {/* Slide preview */}
              <SlidePreview
                slide={currentSlide}
                slideNumber={currentIdx + 1}
                totalSlides={slides.length}
                onSectionClick={currentSlide.type === 'overview' ? handleSectionClick : undefined}
              />

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setCurrentIdx(i => Math.max(0, i - 1))}
                  disabled={currentIdx === 0}
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" /> Previous
                </button>
                <span className="text-xs text-muted-foreground font-medium">
                  Slide {currentIdx + 1} of {slides.length}
                </span>
                <button
                  onClick={() => setCurrentIdx(i => Math.min(slides.length - 1, i + 1))}
                  disabled={currentIdx === slides.length - 1}
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              {/* Slide edit form */}
              <div className="rounded-xl border bg-card p-5 space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Edit Slide {currentIdx + 1}
                </h3>

                {/* Title */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Slide Title</label>
                  <input
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                    value={currentSlide.title}
                    onChange={e => updateSlide('title', e.target.value)}
                  />
                </div>

                {/* Subtitle — title slides only */}
                {currentSlide.type === 'title' && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Subtitle</label>
                    <input
                      className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                      value={currentSlide.subtitle ?? ''}
                      onChange={e => updateSlide('subtitle', e.target.value)}
                    />
                  </div>
                )}

                {/* Bullets — concept + summary */}
                {(currentSlide.type === 'concept' || currentSlide.type === 'summary') && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Bullet Points (one per line)</label>
                    <textarea
                      className="w-full rounded-md border bg-background px-3 py-2 text-sm resize-none font-mono"
                      rows={5}
                      value={(currentSlide.bullets ?? []).join('\n')}
                      onChange={e => updateBullets(e.target.value)}
                    />
                  </div>
                )}

                {/* Key concept — concept slides */}
                {currentSlide.type === 'concept' && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Key Concept Box</label>
                    <input
                      className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                      value={currentSlide.key_concept ?? ''}
                      onChange={e => updateSlide('key_concept', e.target.value)}
                    />
                  </div>
                )}

                {/* Question content */}
                {currentSlide.type === 'question' && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Question</label>
                    <textarea
                      className="w-full rounded-md border bg-background px-3 py-2 text-sm resize-none"
                      rows={3}
                      value={currentSlide.question_content ?? ''}
                      onChange={e => updateSlide('question_content', e.target.value)}
                    />
                  </div>
                )}

                {/* Answer working + content */}
                {currentSlide.type === 'answer' && (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">Working Steps (one per line)</label>
                      <textarea
                        className="w-full rounded-md border bg-background px-3 py-2 text-sm resize-none font-mono"
                        rows={4}
                        value={(currentSlide.answer_working ?? []).join('\n')}
                        onChange={e => updateWorking(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">Final Answer</label>
                      <input
                        className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                        value={currentSlide.answer_content ?? ''}
                        onChange={e => updateSlide('answer_content', e.target.value)}
                      />
                    </div>
                  </>
                )}

                {/* Speaker notes — ALL slides */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">
                    Speaker Notes <span className="text-[#28A0E1]">(TTS narration — write in full sentences)</span>
                  </label>
                  <textarea
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm resize-none"
                    rows={4}
                    value={currentSlide.speaker_notes}
                    onChange={e => updateSlide('speaker_notes', e.target.value)}
                    placeholder="Write the full narration text for this slide as it will be spoken aloud..."
                  />
                </div>

                {/* Youchi pose selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Youchi Pose</label>
                  <div className="flex flex-wrap gap-2">
                    {(Object.entries(YOUCHI_POSES) as [YouchiPose, string][]).map(([pose, src]) => (
                      <button
                        key={pose}
                        onClick={() => updateSlide('youchi_pose', pose)}
                        className={`flex flex-col items-center gap-1 rounded-lg border p-2 transition-colors ${
                          currentSlide.youchi_pose === pose
                            ? 'border-[#145087] bg-blue-50 dark:bg-blue-900/20'
                            : 'border-transparent hover:border-gray-300'
                        }`}
                        title={YOUCHI_POSE_LABELS[pose]}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={src} alt={pose} className="w-10 h-10 object-contain" />
                        <span className="text-[10px] text-muted-foreground">{YOUCHI_POSE_LABELS[pose]}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Regenerate section */}
              {deck?.status !== 'approved' && (
                <div className="rounded-xl border border-dashed p-5 space-y-3">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 text-[#28A0E1]" />
                    Regenerate Entire PPT
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    AI will regenerate all slides from the Databank using your feedback notes.
                    Current slides will be replaced.
                  </p>
                  <textarea
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm resize-none"
                    rows={3}
                    placeholder="e.g. Make concept explanations simpler. Add more worked examples. Focus on common exam mistakes."
                    value={regenNotes}
                    onChange={e => setRegenNotes(e.target.value)}
                  />
                  <button
                    onClick={handleRegenerate}
                    disabled={regenerating}
                    className="flex items-center gap-2 rounded-lg border border-[#28A0E1] px-4 py-2 text-sm font-medium text-[#145087] hover:bg-blue-50 dark:hover:bg-blue-900/20 disabled:opacity-50 transition-colors"
                  >
                    {regenerating
                      ? <><Loader2 className="h-4 w-4 animate-spin" /> Regenerating…</>
                      : <><Sparkles className="h-4 w-4" /> Regenerate with Notes</>}
                  </button>
                </div>
              )}

            </div>
          )}
        </div>
      </div>
    </div>
  )
}
