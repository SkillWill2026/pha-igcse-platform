'use client'
import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'

interface DrawingModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (imageUrl: string) => void
  questionId: string
  imageType: 'question' | 'answer'
}

export default function DrawingModal({
  isOpen, onClose, onSave, questionId, imageType
}: DrawingModalProps) {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  if (!isOpen) return null

  const handleSave = async () => {
    setSaving(true)
    setError(null)

    const timeout = setTimeout(() => {
      setSaving(false)
      setError('Export timed out — please try again')
    }, 15000)

    const handler = async (event: MessageEvent) => {
      if (event.data?.type !== 'EXPORT_RESULT') return
      clearTimeout(timeout)
      window.removeEventListener('message', handler)

      try {
        const res = await fetch(event.data.dataUrl)
        const blob = await res.blob()
        const file = new File([blob], `drawing-${Date.now()}.png`, { type: 'image/png' })

        const formData = new FormData()
        formData.append('file', file)
        formData.append('question_id', questionId)
        formData.append('image_type', imageType)

        const uploadRes = await fetch('/api/question-images', { method: 'POST', body: formData })
        const data = await uploadRes.json()

        if (data.url || data.path) {
          onSave(data.url || data.path)
          onClose()
        } else {
          setError('Upload failed — please try again')
        }
      } catch (err) {
        setError('Failed to save drawing')
      } finally {
        setSaving(false)
      }
    }

    window.addEventListener('message', handler)
    iframeRef.current?.contentWindow?.postMessage({ type: 'EXPORT_PNG' }, '*')
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      display: 'flex', flexDirection: 'column', background: 'white'
    }}>
      {/* Header */}
      <div style={{
        height: '60px', flexShrink: 0, display: 'flex',
        alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px', borderBottom: '1px solid #e5e7eb', background: 'white'
      }}>
        <span style={{ fontSize: '18px', fontWeight: 600 }}>✏️ Draw Diagram</span>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {error && <span style={{ color: '#dc2626', fontSize: '13px' }}>{error}</span>}
          <Button variant="outline" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : '💾 Save as Image'}
          </Button>
        </div>
      </div>

      {/* Excalidraw in isolated iframe - clean document for correct positioning */}
      <iframe
        ref={iframeRef}
        src="/excalidraw-embed"
        style={{ flex: 1, border: 'none', width: '100%' }}
        title="Drawing Canvas"
        allow="clipboard-read; clipboard-write"
      />
    </div>
  )
}
