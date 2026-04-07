'use client'

import { useRef, useState } from 'react'
import { Download, Loader2, Trash2, Upload } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { PPTDeck, Subtopic } from '@/types/schedule'

interface Props {
  subtopic:  Subtopic
  topicRef:  string
  isAdmin:   boolean
  onUpdate:  (updated: Subtopic) => void
}

function formatBytes(bytes: number | null): string {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function PPTSection({ subtopic, topicRef, isAdmin, onUpdate }: Props) {
  const [decks,          setDecks]          = useState<PPTDeck[]>(subtopic.ppt_decks ?? [])
  const [pptRequired,    setPptRequired]    = useState(subtopic.ppt_required)
  const [uploading,      setUploading]      = useState(false)
  const [togglingReq,    setTogglingReq]    = useState(false)
  const [deleteTarget,   setDeleteTarget]   = useState<PPTDeck | null>(null)
  const [deleteLoading,  setDeleteLoading]  = useState(false)
  const [downloadingId,  setDownloadingId]  = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const uploaded = decks.length > 0

  // ── Toggle ppt_required ────────────────────────────────────────────────────
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
      const data = await res.json() as { subtopic?: Subtopic; error?: string }
      if (!res.ok) throw new Error(data.error ?? 'Failed to update')
      setPptRequired(next)
      onUpdate({ ...subtopic, ppt_required: next, ppt_decks: decks })
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update')
    } finally {
      setTogglingReq(false)
    }
  }

  // ── Upload ─────────────────────────────────────────────────────────────────
  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!e.target.files) return
    e.target.value = ''
    if (!file) return
    if (!file.name.toLowerCase().endsWith('.pptx')) {
      toast.error('Only .pptx files are accepted')
      return
    }
    if (file.size > 50 * 1024 * 1024) {
      toast.error('File exceeds 50 MB limit')
      return
    }
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('subtopic_id', subtopic.id)
      fd.append('topic_ref', topicRef)
      fd.append('subtopic_ref', subtopic.ref)
      const res  = await fetch('/api/schedule/ppt', { method: 'POST', body: fd })
      const data = await res.json() as { ppt_deck?: PPTDeck; error?: string }
      if (!res.ok) throw new Error(data.error ?? 'Upload failed')
      const newDecks = [...decks, data.ppt_deck!]
      setDecks(newDecks)
      onUpdate({ ...subtopic, ppt_decks: newDecks })
      toast.success(`${file.name} uploaded`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  // ── Download ───────────────────────────────────────────────────────────────
  async function handleDownload(deck: PPTDeck) {
    setDownloadingId(deck.id)
    try {
      const res  = await fetch(`/api/schedule/ppt/${deck.id}`)
      const data = await res.json() as { url?: string; filename?: string; error?: string }
      if (!res.ok) throw new Error(data.error ?? 'Failed to get download URL')
      const a        = document.createElement('a')
      a.href         = data.url!
      a.download     = data.filename ?? deck.filename
      a.target       = '_blank'
      a.rel          = 'noopener noreferrer'
      a.click()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Download failed')
    } finally {
      setDownloadingId(null)
    }
  }

  // ── Delete ─────────────────────────────────────────────────────────────────
  async function handleDelete() {
    if (!deleteTarget) return
    setDeleteLoading(true)
    try {
      const res  = await fetch(`/api/schedule/ppt/${deleteTarget.id}`, { method: 'DELETE' })
      const data = await res.json() as { ok?: boolean; error?: string }
      if (!res.ok) throw new Error(data.error ?? 'Delete failed')
      const newDecks = decks.filter((d) => d.id !== deleteTarget.id)
      setDecks(newDecks)
      onUpdate({ ...subtopic, ppt_decks: newDecks })
      toast.success(`${deleteTarget.filename} deleted`)
      setDeleteTarget(null)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Delete failed')
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <h4 className="text-sm font-semibold">PPT Deck</h4>
        <div className="flex items-center gap-2">
          {/* Upload count badge */}
          <span
            className={cn(
              'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
              !pptRequired
                ? 'bg-gray-100 text-gray-500'
                : uploaded
                  ? 'bg-green-100 text-green-800'
                  : 'bg-amber-100 text-amber-700',
            )}
          >
            {!pptRequired ? 'N/A' : uploaded ? '1 / 1' : '0 / 1'}
          </span>
          {/* Required toggle */}
          {isAdmin ? (
            <button
              type="button"
              role="switch"
              aria-checked={pptRequired}
              onClick={handleToggleRequired}
              disabled={togglingReq}
              title={pptRequired ? 'Mark as not required' : 'Mark as required'}
              className={cn(
                'relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50',
                pptRequired ? 'bg-primary' : 'bg-muted-foreground/30',
              )}
            >
              <span
                className={cn(
                  'inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform',
                  pptRequired ? 'translate-x-4' : 'translate-x-0.5',
                )}
              />
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
      ) : decks.length === 0 ? (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">No file uploaded yet.</p>
          {isAdmin && (
            <>
              <input
                ref={fileRef}
                type="file"
                accept=".pptx"
                className="hidden"
                onChange={handleFileChange}
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="gap-2 text-xs"
              >
                {uploading
                  ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  : <Upload className="h-3.5 w-3.5" />}
                {uploading ? 'Uploading…' : 'Upload .pptx'}
              </Button>
            </>
          )}
        </div>
      ) : (
        decks.map((deck) => (
          <div
            key={deck.id}
            className="rounded-md border bg-muted/30 px-3 py-2 flex items-center gap-2"
          >
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{deck.filename}</p>
              <p className="text-xs text-muted-foreground">
                {formatBytes(deck.file_size)}
                {deck.created_at
                  ? ` · ${new Date(deck.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}`
                  : ''}
              </p>
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 shrink-0"
              onClick={() => handleDownload(deck)}
              disabled={downloadingId === deck.id}
              title="Download"
            >
              {downloadingId === deck.id
                ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                : <Download className="h-3.5 w-3.5" />}
            </Button>
            {isAdmin && (
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => setDeleteTarget(deck)}
                title="Delete"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        ))
      )}

      {/* Delete confirmation */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete PPT Deck</DialogTitle>
            <DialogDescription>
              Delete <strong>{deleteTarget?.filename}</strong>? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={deleteLoading}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteLoading}>
              {deleteLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
