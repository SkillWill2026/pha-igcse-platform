'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, X } from 'lucide-react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ExcalidrawImperativeAPI = any

const ExcalidrawComponent = dynamic(
  async () => {
    const mod = await import('@excalidraw/excalidraw')
    return { default: mod.Excalidraw }
  },
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-96 text-gray-400">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        Loading canvas...
      </div>
    ),
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
  imageType,
}: Props) {
  const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI | null>(null)
  const [saving, setSaving] = useState(false)

  if (!isOpen) return null

  async function handleSave() {
    if (!excalidrawAPI) {
      alert('Canvas not ready yet, please try again')
      return
    }

    setSaving(true)
    try {
      // Lazy-load exportToBlob to avoid build issues
      const { exportToBlob } = await import('@excalidraw/excalidraw')

      const blob = await exportToBlob({
        elements: excalidrawAPI.getSceneElements(),
        appState: {
          ...excalidrawAPI.getAppState(),
          exportBackground: true,
          exportWithDarkMode: false,
        },
        files: excalidrawAPI.getFiles(),
        mimeType: 'image/png',
      })

      // Upload to Supabase via existing endpoint
      const formData = new FormData()
      formData.append('file', new File([blob], `drawing-${Date.now()}.png`, { type: 'image/png' }))
      formData.append('question_id', questionId)
      formData.append('image_type', imageType)

      const res = await fetch('/api/question-images', {
        method: 'POST',
        body: formData,
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4">
      <div
        style={{
          position: 'relative',
          width: '95vw',
          minWidth: '900px',
          height: '90vh',
          background: 'white',
          borderRadius: '12px',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '60px',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 16px',
            zIndex: 10,
            background: 'white',
          }}
        >
          <span style={{ fontSize: '18px', fontWeight: 600 }}>✏️ Draw Diagram</span>
          <button
            onClick={onClose}
            disabled={saving}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#9ca3af',
              padding: '4px',
            }}
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Excalidraw fills middle */}
        <div style={{ position: 'absolute', top: '60px', left: 0, right: 0, bottom: '64px' }}>
          <ExcalidrawComponent
            excalidrawAPI={(api: ExcalidrawImperativeAPI) => setExcalidrawAPI(api)}
            gridModeEnabled={true}
            initialData={{ appState: { gridSize: 20 } }}
          />
        </div>

        {/* Footer */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '64px',
            borderTop: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '12px',
            padding: '0 16px',
            zIndex: 10,
            background: 'white',
          }}
        >
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
