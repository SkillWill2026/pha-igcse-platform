'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Loader2, Sparkles, AlertCircle, Clock, CheckCircle2, Trash2, RefreshCw } from 'lucide-react'
import type { PptDeck } from '@/types/ppt'

interface Topic { id: string; name: string; ref: string }
interface Subtopic { id: string; title: string; ref: string; topic_id: string }

export default function PptPage() {
  const searchParams = useSearchParams()
  const subjectCode = searchParams.get('subject') ?? '0580'

  const [subjectId, setSubjectId]     = useState<string | null>(null)
  const [topics, setTopics]           = useState<Topic[]>([])
  const [subtopics, setSubtopics]     = useState<Subtopic[]>([])
  const [selectedTopic, setSelectedTopic]     = useState('')
  const [selectedSubtopic, setSelectedSubtopic] = useState('')
  const [decks, setDecks]             = useState<PptDeck[]>([])
  const [generating, setGenerating]   = useState(false)
  const [loadingDecks, setLoadingDecks] = useState(false)
  const [error, setError]             = useState<string | null>(null)
  const [genNotes, setGenNotes]       = useState('')
  const [deletingId, setDeletingId]   = useState<string | null>(null)

  // Load subject ID
  useEffect(() => {
    fetch('/api/subjects')
      .then(r => r.json())
      .then(d => {
        const s = (d.subjects ?? []).find((s: { code: string; id: string }) => s.code === subjectCode)
        if (s) setSubjectId(s.id)
      })
  }, [subjectCode])

  // Load topics when subject changes
  useEffect(() => {
    if (!subjectId) return
    fetch(`/api/topics?subject_id=${subjectId}`)
      .then(r => r.json())
      .then(d => { setTopics(Array.isArray(d) ? d : (d.topics ?? [])); setSelectedTopic(''); setSelectedSubtopic('') })
  }, [subjectId])

  // Load subtopics when topic changes
  useEffect(() => {
    if (!selectedTopic) { setSubtopics([]); setSelectedSubtopic(''); return }
    fetch(`/api/subtopics?topic_id=${selectedTopic}`)
      .then(r => r.json())
      .then(d => { setSubtopics(Array.isArray(d) ? d : (d.subtopics ?? [])); setSelectedSubtopic('') })
  }, [selectedTopic])

  // Load existing decks
  const loadDecks = useCallback(() => {
    if (!subjectId) return
    setLoadingDecks(true)
    fetch(`/api/ppt?subject_id=${subjectId}`)
      .then(r => r.json())
      .then(d => setDecks(d.decks ?? []))
      .catch(() => {})
      .finally(() => setLoadingDecks(false))
  }, [subjectId])

  useEffect(() => { loadDecks() }, [loadDecks])

  async function handleGenerate() {
    if (!selectedSubtopic || !subjectId) return
    setGenerating(true)
    setError(null)
    try {
      const res = await fetch('/api/ppt/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subtopic_id: selectedSubtopic,
          subject_id: subjectId,
          tutor_notes: genNotes || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        if (data.code === 'NO_DATABANK_DATA') {
          setError('Data not available in Databank. Please add relevant content to the Databank before generating a PPT for this subtopic.')
        } else {
          setError(data.error ?? 'Generation failed')
        }
        return
      }
      setGenNotes('')
      loadDecks()
    } catch {
      setError('Failed to connect to server')
    } finally {
      setGenerating(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this PPT deck? This cannot be undone.')) return
    setDeletingId(id)
    try {
      await fetch(`/api/ppt/${id}`, { method: 'DELETE' })
      setDecks(prev => prev.filter(d => d.id !== id))
    } finally {
      setDeletingId(null)
    }
  }

  const filteredSubtopics = subtopics.filter(s => s.topic_id === selectedTopic)

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">PPT Slides</h1>
        <p className="text-sm text-muted-foreground mt-1">
          AI-generated lesson presentations from your Databank — subject {subjectCode}
        </p>
      </div>

      {/* Generator card */}
      <div className="rounded-xl border bg-card p-6 space-y-4">
        <h2 className="text-base font-semibold flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-blue-500" />
          Generate New PPT
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Topic</label>
            <select
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              value={selectedTopic}
              onChange={e => setSelectedTopic(e.target.value)}
            >
              <option value="">Select topic…</option>
              {topics.map(t => (
                <option key={t.id} value={t.id}>{t.ref} — {t.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Subtopic</label>
            <select
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              value={selectedSubtopic}
              onChange={e => setSelectedSubtopic(e.target.value)}
              disabled={!selectedTopic}
            >
              <option value="">Select subtopic…</option>
              {filteredSubtopics.map(s => (
                <option key={s.id} value={s.id}>{s.ref} — {s.title}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Notes for AI (optional — extra instructions or focus areas)
          </label>
          <textarea
            className="w-full rounded-md border bg-background px-3 py-2 text-sm resize-none"
            rows={2}
            placeholder="e.g. Focus on common misconceptions. Include worked examples for harder questions only."
            value={genNotes}
            onChange={e => setGenNotes(e.target.value)}
          />
        </div>

        {error && (
          <div className="flex items-start gap-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={!selectedSubtopic || generating}
          className="flex items-center gap-2 rounded-lg bg-[#145087] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#28A0E1] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {generating ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Generating from Databank…</>
          ) : (
            <><Sparkles className="h-4 w-4" /> Generate PPT</>
          )}
        </button>
      </div>

      {/* Existing decks */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">Existing Decks</h2>
          <button
            onClick={loadDecks}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <RefreshCw className="h-3 w-3" /> Refresh
          </button>
        </div>

        {loadingDecks ? (
          <div className="flex items-center gap-2 py-8 text-muted-foreground text-sm">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading decks…
          </div>
        ) : decks.length === 0 ? (
          <div className="rounded-xl border border-dashed py-12 text-center text-sm text-muted-foreground">
            No PPT decks yet for {subjectCode}. Generate your first one above.
          </div>
        ) : (
          <div className="space-y-2">
            {decks.map(deck => (
              <div
                key={deck.id}
                className="flex items-center justify-between rounded-xl border bg-card px-5 py-4 hover:border-[#28A0E1] transition-colors"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{deck.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {Array.isArray(deck.slides) ? deck.slides.length : 0} slides
                      {' · '}
                      {new Date(deck.created_at).toLocaleDateString('en-GB', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </p>
                  </div>
                  <span className={`shrink-0 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    deck.status === 'approved'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                  }`}>
                    {deck.status === 'approved'
                      ? <><CheckCircle2 className="h-3 w-3" /> Approved</>
                      : <><Clock className="h-3 w-3" /> Draft</>}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/admin/ppt/${deck.id}`}
                    className="rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-accent transition-colors"
                  >
                    {deck.status === 'draft' ? 'Review & Edit' : 'View'}
                  </Link>
                  <button
                    onClick={() => handleDelete(deck.id)}
                    disabled={deletingId === deck.id}
                    className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 transition-colors"
                  >
                    {deletingId === deck.id
                      ? <Loader2 className="h-3 w-3 animate-spin" />
                      : <Trash2 className="h-3 w-3" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
