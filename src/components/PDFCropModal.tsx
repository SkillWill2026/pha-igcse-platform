'use client'
import { useState, useEffect } from 'react'
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
  isOpen, onClose, batchId, questionId, imageType, questionNumber, onSave
}: PDFCropModalProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen || !batchId) return
    setLoading(true)
    setError(null)
    fetch(`/api/upload-batches/${batchId}/pdf-url`)
      .then(r => r.json())
      .then(data => {
        if (data.url) setPdfUrl(data.url)
        else setError('PDF not available for this batch')
      })
      .catch(() => setError('Failed to load PDF'))
      .finally(() => setLoading(false))
  }, [isOpen, batchId])

  if (!isOpen) return null

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', flexDirection: 'column', background: 'white' }}>

      {/* Header */}
      <div style={{ height: '60px', flexShrink: 0, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', padding: '0 20px', borderBottom: '1px solid #e5e7eb',
        background: 'white' }}>
        <div>
          <span style={{ fontSize: '18px', fontWeight: 600 }}>📄 PDF Viewer</span>
          <span style={{ marginLeft: '12px', fontSize: '13px', color: '#6b7280' }}>
            Navigate to your diagram, then screenshot and paste below (Ctrl+V)
          </span>
        </div>
        <Button variant="outline" onClick={onClose}>Close</Button>
      </div>

      {/* Instructions bar */}
      <div style={{ padding: '10px 20px', background: '#eff6ff', borderBottom: '1px solid #bfdbfe',
        fontSize: '13px', color: '#1d4ed8', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span>💡</span>
        <span>
          <strong>How to extract a diagram:</strong> Find the diagram in the PDF →
          Take a screenshot (Windows: <kbd>Win+Shift+S</kbd> · Mac: <kbd>Cmd+Shift+4</kbd>) →
          Paste with <kbd>Ctrl+V</kbd> in the image section below the PDF
        </span>
      </div>

      {/* PDF iframe - browser native viewer */}
      <div style={{ flex: 1, position: 'relative' }}>
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#6b7280' }}>
            Loading PDF...
          </div>
        )}
        {error && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', height: '100%', gap: '12px' }}>
            <span style={{ color: '#dc2626' }}>{error}</span>
            <span style={{ color: '#6b7280', fontSize: '13px' }}>
              Re-upload the exam paper to enable PDF viewing
            </span>
          </div>
        )}
        {pdfUrl && !loading && (
          <iframe
            src={`${pdfUrl}#page=${questionNumber ?? 1}`}
            style={{ width: '100%', height: '100%', border: 'none' }}
            title="Exam Paper PDF"
          />
        )}
      </div>

    </div>
  )
}
