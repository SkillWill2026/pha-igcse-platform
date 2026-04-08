'use client'

import dynamic from 'next/dynamic'
import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, X } from 'lucide-react'
import { exportToBlob } from '@excalidraw/excalidraw'
import type { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types/types'

const Excalidraw = dynamic(
  () => import('@excalidraw/excalidraw').then(m => m.Excalidraw),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full text-gray-400">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        Loading canvas...
      </div>
    )
  }
)

interface Props {
  isOpen: boolean
  onClose: () => void
  onSave: (imageUrl: string, storagePath: string) => void
  questionId: string
  imageType: 'question' | 'answer'
}

export function DrawingModal({
  isOpen,
  onClose,
  onSave,
  questionId,
  imageType
}: Props) {
  const excalidrawAPI = useRef<ExcalidrawImperativeAPI | null>(null)
  const [saving, setSaving] = useState(false)

  if (!isOpen) return null

  async function handleSave() {
    if (!excalidrawAPI.current) {
      alert('Canvas not ready yet, please try again')
      return
    }

    setSaving(true)
    try {
      const blob = await exportToBlob({
        elements: excalidrawAPI.current.getSceneElements(),
        appState: {
          ...excalidrawAPI.current.getAppState(),
          exportBackground: true,
          exportWithDarkMode: false,
        },
        files: excalidrawAPI.current.getFiles(),
        mimeType: 'image/png',
      })

      // Upload to Supabase via existing endpoint
      const formData = new FormData()
      formData.append('file', new File([blob], `drawing-${Date.now()}.png`, { type: 'image/png' }))
      formData.append('question_id', questionId)
      formData.append('image_type', imageType)

      const res = await fetch('/api/question-images', {
        method: 'POST',
        body: formData
      })

      if (!res.ok) {
        const d = await res.json() as { error?: string }
        throw new Error(d.error ?? 'Upload failed')
      }

      const { public_url: url, storage_path: path } = await res.json() as { public_url: string; storage_path: string }
      onSave(url, path)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Save failed'
      alert(msg)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="w-[95vw] h-[92vh] bg-white rounded-xl shadow-2xl flex flex-col">
        {/* Header */}
        <div className="border-b p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">✏️ Draw Diagram</h2>
          <button
            onClick={onClose}
            disabled={saving}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Excalidraw canvas */}
        <div className="flex-1 overflow-hidden">
          <Excalidraw
            onChange={() => {}}
            onPointerUpdate={() => {}}
            onScrollChange={() => {}}
            ref={excalidrawAPI}
            UIOptions={{
              canvasMenu: { defaultItems: [] },
            }}
            gridModeEnabled={true}
          />
        </div>

        {/* Footer */}
        <div className="border-t p-4 flex items-center justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="gap-2 bg-green-600 hover:bg-green-700"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                💾 Save as Image
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
