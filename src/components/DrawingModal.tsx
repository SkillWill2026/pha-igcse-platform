'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, X } from 'lucide-react'

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
  const [saving, setSaving] = useState(false)

  if (!isOpen) return null

  async function handleSave() {
    setSaving(true)
    try {
      // Placeholder: create a simple colored canvas as proof of concept
      const canvas = document.createElement('canvas')
      canvas.width = 800
      canvas.height = 600
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('Could not get canvas context')

      // Draw a simple placeholder
      ctx.fillStyle = '#f0f0f0'
      ctx.fillRect(0, 0, 800, 600)
      ctx.fillStyle = '#333'
      ctx.font = '24px Arial'
      ctx.fillText('Drawing placeholder', 250, 300)

      canvas.toBlob(async (blob) => {
        if (!blob) throw new Error('Failed to create blob')

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
      }, 'image/png')
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

        {/* Canvas placeholder */}
        <div className="flex-1 overflow-hidden bg-gray-100 flex items-center justify-center">
          <div className="text-center space-y-4">
            <p className="text-lg text-gray-600">Drawing canvas placeholder</p>
            <p className="text-sm text-gray-500">Full Excalidraw integration coming soon</p>
            <p className="text-xs text-gray-400">Click Save to upload placeholder image</p>
          </div>
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
