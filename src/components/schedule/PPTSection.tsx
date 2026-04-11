'use client'

import { useState } from 'react'
import { ExternalLink, Loader2, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { PPTDeck, Subtopic } from '@/types/schedule'

interface Props {
  subtopic:  Subtopic
  topicRef:  string
  isAdmin:   boolean
  onUpdate:  (updated: Subtopic) => void
}

export function PPTSection({ subtopic, isAdmin, onUpdate }: Props) {
  const [pptRequired,  setPptRequired]  = useState(subtopic.ppt_required)
  const [togglingReq,  setTogglingReq]  = useState(false)
  const [generating,   setGenerating]   = useState(false)
  const [genError,     setGenError]     = useState<string | null>(null)

  const decks: PPTDeck[] = subtopic.ppt_decks ?? []
  const latestDeck = decks[0] ?? null
  const uploaded = !!latestDeck

  // ── Toggle ppt_required ───────────────────────────────────────────────────
  async function handleToggleRequired() {
    if (!isAdmin) return
    setTogglingReq(true)
    try {
      const next = !pptRequired
      const res  = await fetch(`/api/schedule/subtopics/${subtopic.id}`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ ppt_required: next }),
      })
      if (!res.ok) throw new Error('Failed to update')
      setPptRequired(next)
      onUpdate({ ...subtopic, ppt_required: next })
    } catch {
      // silently ignore
    } finally {
      setTogglingReq(false)
    }
  }

  // ── Quick-generate from Schedule ─────────────────────────────────────────
  async function handleGenerate() {
    if (!subtopic.topic_id) return
    setGenerating(true)
    setGenError(null)

    // Resolve subject_id from topic
    try {
      const topicRes = await fetch(`/api/topics?id=${subtopic.topic_id}`)
      const topicData = await topicRes.json()
      const subjectId = Array.isArray(topicData)
        ? topicData[0]?.subject_id
        : topicData.topic?.subject_id ?? topicData.subject_id

      if (!subjectId) throw new Error('Could not resolve subject')

      const res = await fetch('/api/ppt/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subtopic_id: subtopic.id, subject_id: subjectId }),
      })
      const data = await res.json()
      if (!res.ok) {
        if (data.code === 'NO_DATABANK_DATA') {
          setGenError('No data in Databank for this subtopic.')
        } else {
          setGenError(data.error ?? 'Generation failed')
        }
        return
      }
      // Add new deck to local state
      onUpdate({ ...subtopic, ppt_decks: [data.deck, ...decks] })
    } catch (err) {
      setGenError(err instanceof Error ? err.message : 'Generation failed')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <h4 className="text-sm font-semibold">PPT Deck</h4>
        <div className="flex items-center gap-2">
          <span className={cn(
            'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
            !pptRequired
              ? 'bg-gray-100 text-gray-500'
              : uploaded
                ? latestDeck?.status === 'approved'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-amber-100 text-amber-700'
                : 'bg-red-100 text-red-700',
          )}>
            {!pptRequired
              ? 'N/A'
              : !uploaded
                ? '0 / 1'
                : latestDeck?.status === 'approved'
                  ? 'Approved'
                  : 'Draft'}
          </span>

          {/* Required toggle — admin only */}
          {isAdmin ? (
            <button
              type="button"
              role="switch"
              aria-checked={pptRequired}
              onClick={handleToggleRequired}
              disabled={togglingReq}
              title={pptRequired ? 'Mark as not required' : 'Mark as required'}
              className={cn(
                'relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors focus-visible:outline-none disabled:opacity-50',
                pptRequired ? 'bg-primary' : 'bg-muted-foreground/30',
              )}
            >
              <span className={cn(
                'inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform',
                pptRequired ? 'translate-x-4' : 'translate-x-0.5',
              )} />
            </button>
          ) : (
            <span className="text-xs text-muted-foreground">
              {pptRequired ? 'Required' : 'Not required'}
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      {!pptRequired ? (
        <p className="text-xs text-muted-foreground">Not required for this subtopic.</p>
      ) : !uploaded ? (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">No PPT generated yet.</p>
          {isAdmin && (
            <>
              {genError && (
                <p className="text-xs text-red-500">{genError}</p>
              )}
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="flex items-center gap-1.5 rounded-md border border-[#28A0E1] px-2.5 py-1.5 text-xs font-medium text-[#145087] hover:bg-blue-50 dark:hover:bg-blue-900/20 disabled:opacity-50 transition-colors"
              >
                {generating
                  ? <><Loader2 className="h-3 w-3 animate-spin" /> Generating…</>
                  : <><Sparkles className="h-3 w-3" /> Generate PPT</>}
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {decks.map((deck) => (
            <div
              key={deck.id}
              className="rounded-md border bg-muted/30 px-3 py-2 flex items-center justify-between gap-2"
            >
              <div className="min-w-0">
                <p className="text-xs font-medium truncate">{deck.title}</p>
                <p className="text-xs text-muted-foreground">
                  {Array.isArray(deck.slides) ? deck.slides.length : 0} slides
                  {' · '}
                  {new Date(deck.created_at).toLocaleDateString('en-GB', {
                    day: '2-digit', month: 'short', year: 'numeric'
                  })}
                </p>
              </div>
              <Link
                href={`/admin/ppt/${deck.id}`}
                className="flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium hover:bg-accent transition-colors shrink-0"
              >
                <ExternalLink className="h-3 w-3" />
                {deck.status === 'approved' ? 'View' : 'Review'}
              </Link>
            </div>
          ))}

          {/* Generate another deck — admin only */}
          {isAdmin && (
            <div className="pt-1">
              {genError && <p className="text-xs text-red-500 mb-1">{genError}</p>}
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-[#145087] disabled:opacity-50 transition-colors"
              >
                {generating
                  ? <><Loader2 className="h-3 w-3 animate-spin" /> Generating…</>
                  : <><Sparkles className="h-3 w-3" /> Regenerate</>}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
