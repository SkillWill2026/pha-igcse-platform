'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface PDFCropModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (imageUrl: string) => void
  questionId: string
  batchId: string | null
  questionNumber: number | null
  imageType: 'question' | 'answer'
}

export default function PDFCropModal({
  isOpen, onClose, batchId, questionNumber
}: PDFCropModalProps) {
  const [loading, setLoading] = useState(false)
  const [opened, setOpened] = useState(false)

  const handleOpenPDF = async () => {
    if (!batchId) return
    setLoading(true)
    try {
      const res = await fetch(`/api/upload-batches/${batchId}/pdf-url`)
      const data = await res.json()
      if (data.url) {
        // Open PDF in new browser tab with page hint
        const url = questionNumber ? `${data.url}#page=${questionNumber}` : data.url
        window.open(url, '_blank')
        setOpened(true)
      }
    } catch (e) {
      console.error('Failed to get PDF URL:', e)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'white', borderRadius: '12px', padding: '32px', maxWidth: '480px', width: '90%', textAlign: 'center' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '12px' }}>📄 Open Exam Paper</h2>
        <p style={{ color: '#6b7280', marginBottom: '24px', lineHeight: '1.6' }}>
          The PDF will open in a new browser tab.<br/>
          Find your diagram, take a screenshot<br/>
          <strong>(Windows: Win+Shift+S · Mac: Cmd+Shift+4)</strong><br/>
          then paste it below with <strong>Ctrl+V</strong>
        </p>
        {!opened ? (
          <Button onClick={handleOpenPDF} disabled={loading} style={{ marginRight: '12px' }}>
            {loading ? 'Loading...' : '📄 Open PDF in New Tab'}
          </Button>
        ) : (
          <p style={{ color: '#16a34a', marginBottom: '16px', fontWeight: 500 }}>
            ✅ PDF opened! Screenshot and paste your diagram below.
          </p>
        )}
        <Button variant="outline" onClick={onClose}>Close</Button>
      </div>
    </div>
  )
}
