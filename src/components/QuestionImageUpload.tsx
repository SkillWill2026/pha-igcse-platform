'use client'

import dynamic from 'next/dynamic'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { ImageIcon, Loader2, Trash2, Upload } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { QuestionImage } from '@/types/database'

const DrawingModal = dynamic(() => import('@/components/DrawingModal'), { ssr: false })
const PDFCropModal = dynamic(() => import('@/components/PDFCropModal'), { ssr: false })

interface QuestionImageWithDisplay extends QuestionImage {
  display_url: string | null
}

interface Props {
  questionId: string
  imageType: 'question' | 'answer' | 'diagram'
  onUploadComplete?: () => void
  batchId?: string | null
  questionNumber?: number | null
  initialImages?: any[]
}

interface UploadingFile {
  name: string
  progress: 'uploading' | 'done' | 'error'
  error?: string
}

export function QuestionImageUpload({ questionId, imageType, onUploadComplete, batchId, questionNumber, initialImages }: Props) {
  const [images,    setImages]    = useState<QuestionImageWithDisplay[]>(initialImages ?? [])
  const [uploading, setUploading] = useState<UploadingFile[]>([])
  const [deleting,  setDeleting]  = useState<Set<string>>(new Set())
  const [showDrawing, setShowDrawing] = useState(false)
  const [showCropper, setShowCropper] = useState(false)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => { mountedRef.current = false }
  }, [])

  const fetchImages = useCallback(async () => {
    try {
      const res = await fetch(`/api/question-images?question_id=${questionId}&image_type=${imageType}`)
      if (!res.ok) return
      const data = await res.json() as QuestionImageWithDisplay[]
      if (mountedRef.current) setImages(data)
    } catch {
      // ignore
    }
  }, [questionId, imageType])

  useEffect(() => {
    if (!initialImages) fetchImages()
  }, [fetchImages, initialImages])

  const handleFiles = useCallback(async (files: File[]) => {
    if (files.length === 0) return

    setUploading(files.map((f) => ({ name: f.name, progress: 'uploading' as const })))

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      try {
        const fd = new FormData()
        fd.append('question_id', questionId)
        fd.append('image_type',  imageType)
        fd.append('file', file)

        const res = await fetch('/api/question-images', { method: 'POST', body: fd })
        if (!res.ok) {
          const d = await res.json() as { error?: string }
          if (mountedRef.current) {
            setUploading((prev) => prev.map((u, idx) =>
              idx === i ? { ...u, progress: 'error', error: d.error ?? 'Upload failed' } : u,
            ))
          }
          continue
        }
        if (mountedRef.current) {
          setUploading((prev) => prev.map((u, idx) =>
            idx === i ? { ...u, progress: 'done' } : u,
          ))
        }
      } catch {
        if (mountedRef.current) {
          setUploading((prev) => prev.map((u, idx) =>
            idx === i ? { ...u, progress: 'error', error: 'Network error' } : u,
          ))
        }
      }
    }

    await fetchImages()
    if (mountedRef.current) setUploading([])
    onUploadComplete?.()
  }, [questionId, imageType, fetchImages, onUploadComplete])

  // Clipboard paste support - explicit button only (not global)
  const handlePasteButton = useCallback(async () => {
    try {
      const clipboardItems = await navigator.clipboard.read()
      for (const item of clipboardItems) {
        const imageType_mime = item.types.find(t => t.startsWith('image/'))
        if (imageType_mime) {
          const blob = await item.getType(imageType_mime)
          const file = new File([blob], `paste-${Date.now()}.png`, { type: imageType_mime })
          await handleFiles([file])
          return
        }
      }
    } catch (err) {
      console.error('Failed to read clipboard:', err)
      alert('Could not paste from clipboard. Try dragging and dropping an image instead.')
    }
  }, [handleFiles])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleFiles,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png':  ['.png'],
      'image/gif':  ['.gif'],
      'image/webp': ['.webp'],
    },
    multiple: true,
  })

  async function handleDelete(id: string) {
    setDeleting((prev) => new Set([...prev, id]))
    try {
      const res = await fetch(`/api/question-images?id=${id}`, { method: 'DELETE' })
      if (res.ok && mountedRef.current) {
        setImages((prev) => prev.filter((img) => img.id !== id))
        onUploadComplete?.()
      }
    } finally {
      if (mountedRef.current) {
        setDeleting((prev) => { const s = new Set(prev); s.delete(id); return s })
      }
    }
  }

  return (
    <div className="space-y-3">
      {/* Action buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => setShowDrawing(true)}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors"
        >
          ✏️ Draw
        </button>
        {batchId && (
          <button
            onClick={() => setShowCropper(true)}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors"
          >
            📄 Crop from PDF
          </button>
        )}
        <button
          onClick={handlePasteButton}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors"
        >
          📋 Paste
        </button>
      </div>

      {/* Drop zone */}
      <div
        {...getRootProps()}
        className={cn(
          'flex flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-6 text-center cursor-pointer transition-colors select-none',
          isDragActive
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-primary/40 hover:bg-muted/30',
        )}
      >
        <input {...getInputProps()} />
        <Upload className="h-6 w-6 text-muted-foreground mb-2" />
        <p className="text-xs font-medium">
          {isDragActive ? 'Drop images here' : 'Drag & drop, click, or paste (Ctrl+V)'}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">JPG, PNG, GIF, WebP</p>
      </div>

      {/* Upload progress */}
      {uploading.length > 0 && (
        <div className="space-y-1">
          {uploading.map((u, i) => (
            <div key={i} className="flex items-center gap-2 text-xs">
              {u.progress === 'uploading' && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
              {u.progress === 'done'      && <span className="text-green-600">✓</span>}
              {u.progress === 'error'     && <span className="text-destructive">✕</span>}
              <span className={cn(
                'truncate',
                u.progress === 'error' && 'text-destructive',
                u.progress === 'done'  && 'text-muted-foreground',
              )}>
                {u.name}
                {u.error && <span className="ml-1 text-destructive">— {u.error}</span>}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Image grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {images.map((img) => (
            <div key={img.id} className="relative group rounded-lg border overflow-hidden bg-muted/30">
              {img.display_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={img.display_url}
                  alt={img.caption ?? 'Question image'}
                  className="w-full h-24 object-cover"
                />
              ) : (
                <div className="w-full h-24 flex items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-muted-foreground/40" />
                </div>
              )}
              <button
                type="button"
                onClick={() => handleDelete(img.id)}
                disabled={deleting.has(img.id)}
                className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity shadow"
                aria-label="Delete image"
              >
                {deleting.has(img.id)
                  ? <Loader2 className="h-3 w-3 animate-spin" />
                  : <Trash2 className="h-3 w-3" />}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <DrawingModal
        isOpen={showDrawing}
        onClose={() => setShowDrawing(false)}
        onSave={() => {
          fetchImages()
          setShowDrawing(false)
        }}
        questionId={questionId}
        imageType={imageType as 'question' | 'answer'}
      />
      {batchId && (
        <PDFCropModal
          isOpen={showCropper}
          onClose={() => setShowCropper(false)}
          onSave={() => {
            fetchImages()
            setShowCropper(false)
          }}
          questionId={questionId}
          batchId={batchId}
          questionNumber={questionNumber ?? null}
          imageType={imageType as 'question' | 'answer'}
        />
      )}
    </div>
  )
}
