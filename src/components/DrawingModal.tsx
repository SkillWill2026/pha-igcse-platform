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
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column',
      background: 'white'
    }}>

      {/* Header - 60px */}
      <div style={{
        height: '60px',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        borderBottom: '1px solid #e5e7eb',
        background: 'white',
        zIndex: 10
      }}>
        <span style={{ fontSize: '18px', fontWeight: 600 }}>✏️ Draw Diagram</span>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={onClose} style={{ padding: '8px 16px', border: '1px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
          <button onClick={handleSave} disabled={saving} style={{ padding: '8px 16px', background: saving ? '#94a3b8' : '#1d4ed8', color: 'white', borderRadius: '8px', cursor: 'pointer', border: 'none' }}>
            {saving ? 'Saving...' : '💾 Save as Image'}
          </button>
        </div>
      </div>

      {/* Excalidraw fills everything below header */}
      <div style={{ flex: 1, position: 'relative' }}>
        <ExcalidrawComponent
          excalidrawAPI={(api: any) => setExcalidrawAPI(api)}
          gridModeEnabled={true}
          initialData={{ appState: { gridSize: 20 } }}
        />
      </div>

    </div>
  )
}
