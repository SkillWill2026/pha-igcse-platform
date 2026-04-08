'use client'
import { useState, useRef } from 'react'

interface DrawingModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (imageUrl: string) => void
  questionId: string
  imageType: 'question' | 'answer'
}

export default function DrawingModal({ isOpen, onClose, onSave, questionId, imageType }: DrawingModalProps) {
  const [saving, setSaving] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  if (!isOpen) return null

  const handleSave = async () => {
    setSaving(true)
    try {
      // Tell the iframe to export
      iframeRef.current?.contentWindow?.postMessage({ type: 'EXPORT_PNG' }, '*')

      // Listen for the exported blob from iframe
      const handleMessage = async (event: MessageEvent) => {
        if (event.data.type !== 'EXPORT_RESULT') return
        window.removeEventListener('message', handleMessage)

        const base64 = event.data.dataUrl // data:image/png;base64,...
        const res = await fetch(base64)
        const blob = await res.blob()
        const file = new File([blob], `drawing-${Date.now()}.png`, { type: 'image/png' })

        const formData = new FormData()
        formData.append('file', file)
        formData.append('question_id', questionId)
        formData.append('image_type', imageType)

        const uploadRes = await fetch('/api/question-images', { method: 'POST', body: formData })
        const { url } = await uploadRes.json()
        onSave(url)
        onClose()
      }
      window.addEventListener('message', handleMessage)
    } catch (err) {
      console.error('Save failed:', err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', flexDirection: 'column', background: 'white' }}>
      {/* Header */}
      <div style={{ height: '60px', flexShrink: 0, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', padding: '0 20px', borderBottom: '1px solid #e5e7eb', background: 'white' }}>
        <span style={{ fontSize: '18px', fontWeight: 600 }}>✏️ Draw Diagram</span>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={onClose} style={{ padding: '8px 16px', border: '1px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer', background: 'white' }}>Cancel</button>
          <button onClick={handleSave} disabled={saving} style={{ padding: '8px 16px', background: saving ? '#94a3b8' : '#1d4ed8', color: 'white', borderRadius: '8px', cursor: 'pointer', border: 'none' }}>
            {saving ? 'Saving...' : '💾 Save as Image'}
          </button>
        </div>
      </div>

      {/* Iframe fills rest of screen */}
      <iframe
        ref={iframeRef}
        src="/excalidraw-embed"
        style={{ flex: 1, border: 'none', width: '100%' }}
        title="Drawing Canvas"
      />
    </div>
  )
}
