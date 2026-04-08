'use client'

import { useEffect, useRef, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import { Button } from '@/components/ui/button'
import { Loader2, X } from 'lucide-react'
import * as pdfjsLib from 'pdfjs-dist'

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString()

interface Props {
  isOpen: boolean
  onClose: () => void
  onSave: (imageUrl: string) => void
  questionId: string
  batchId: string | null
  questionNumber: number | null
  imageType: 'question' | 'answer'
}

interface CropSelection {
  startX: number
  startY: number
  endX: number
  endY: number
}

export function PDFCropModal({
  isOpen,
  onClose,
  onSave,
  questionId,
  batchId,
  questionNumber,
  imageType
}: Props) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [numPages, setNumPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [selecting, setSelecting] = useState(false)
  const [selection, setSelection] = useState<CropSelection | null>(null)
  const [cropping, setCropping] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)
  const pageContainerRef = useRef<HTMLDivElement>(null)

  // Fetch PDF URL on mount
  useEffect(() => {
    if (!isOpen || !batchId) return

    setLoading(true)
    setError(null)
    setPdfUrl(null)

    const fetchUrl = async () => {
      try {
        const res = await fetch(`/api/upload-batches/${batchId}/pdf-url`)
        if (!res.ok) {
          const d = await res.json() as { error?: string }
          throw new Error(d.error ?? 'Failed to fetch PDF URL')
        }
        const { url } = await res.json() as { url: string }
        setPdfUrl(url)
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Failed to load PDF'
        setError(msg)
      } finally {
        setLoading(false)
      }
    }

    fetchUrl()
  }, [isOpen, batchId])

  if (!isOpen) return null

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
    // Default page = ceil(questionNumber / 2), IGCSE papers have ~2 questions per page
    const defaultPage = Math.ceil((questionNumber ?? 1) / 2)
    setCurrentPage(Math.min(defaultPage, numPages))
  }

  function handleOverlayMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    if (!overlayRef.current) return
    const rect = overlayRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setSelecting(true)
    setSelection({ startX: x, startY: y, endX: x, endY: y })
  }

  function handleOverlayMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!selecting || !overlayRef.current) return
    const rect = overlayRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setSelection(prev => prev ? { ...prev, endX: x, endY: y } : null)
  }

  function handleOverlayMouseUp() {
    setSelecting(false)
  }

  async function handleCrop() {
    if (!selection || !pdfUrl) return

    setCropping(true)
    try {
      // Fetch PDF and get the page
      const pdf = await pdfjsLib.getDocument(pdfUrl).promise
      const page = await pdf.getPage(currentPage)
      const viewport = page.getViewport({ scale: 2.0 })

      // Render page to canvas
      const canvas = document.createElement('canvas')
      canvas.width = viewport.width
      canvas.height = viewport.height
      const context = canvas.getContext('2d')
      if (!context) throw new Error('Could not get canvas context')

      await page.render({ canvasContext: context, viewport, canvas }).promise

      // Calculate crop bounds (convert from overlay space to canvas space)
      if (!overlayRef.current) throw new Error('Overlay ref missing')
      const overlayRect = overlayRef.current.getBoundingClientRect()
      const overlayWidth = overlayRect.width
      const overlayHeight = overlayRect.height

      const scale = viewport.width / overlayWidth
      const minX = Math.min(selection.startX, selection.endX) * scale
      const minY = Math.min(selection.startY, selection.endY) * scale
      const maxX = Math.max(selection.startX, selection.endX) * scale
      const maxY = Math.max(selection.startY, selection.endY) * scale
      const cropWidth = maxX - minX
      const cropHeight = maxY - minY

      // Create cropped canvas
      const croppedCanvas = document.createElement('canvas')
      croppedCanvas.width = cropWidth
      croppedCanvas.height = cropHeight
      const croppedContext = croppedCanvas.getContext('2d')
      if (!croppedContext) throw new Error('Could not get cropped canvas context')

      croppedContext.drawImage(
        canvas,
        minX, minY, cropWidth, cropHeight,
        0, 0, cropWidth, cropHeight
      )

      // Convert to blob and upload
      const blob = await new Promise<Blob>((resolve) => {
        croppedCanvas.toBlob((b) => {
          if (!b) throw new Error('Failed to create blob')
          resolve(b)
        }, 'image/png')
      })

      const formData = new FormData()
      formData.append('file', new File([blob], `crop-${Date.now()}.png`, { type: 'image/png' }))
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

      const { public_url: url } = await res.json() as { public_url: string }
      onSave(url)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Crop failed'
      alert(msg)
    } finally {
      setCropping(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="w-[95vw] max-w-2xl bg-white rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="border-b p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">📄 Crop from PDF</h2>
          <button
            onClick={onClose}
            disabled={cropping}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          {loading && (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400 mr-2" />
              Loading PDF...
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-300 rounded-lg p-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {pdfUrl && !error && (
            <div className="space-y-4">
              {/* PDF Viewer */}
              <div
                ref={pageContainerRef}
                className="flex justify-center bg-gray-100 rounded-lg p-4 relative"
              >
                <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
                  <Page pageNumber={currentPage} width={700} />
                </Document>

                {/* Crop selection overlay */}
                <div
                  ref={overlayRef}
                  onMouseDown={handleOverlayMouseDown}
                  onMouseMove={handleOverlayMouseMove}
                  onMouseUp={handleOverlayMouseUp}
                  onMouseLeave={handleOverlayMouseUp}
                  className="absolute inset-0 cursor-crosshair"
                  style={{ width: '700px', height: 'auto' }}
                >
                  {selection && (
                    <div
                      className="absolute border-2 border-dashed border-red-500 bg-red-500/10 pointer-events-none"
                      style={{
                        left: Math.min(selection.startX, selection.endX),
                        top: Math.min(selection.startY, selection.endY),
                        width: Math.abs(selection.endX - selection.startX),
                        height: Math.abs(selection.endY - selection.startY),
                      }}
                    />
                  )}
                </div>
              </div>

              {/* Page navigation */}
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  ← Prev Page
                </Button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {numPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(numPages, currentPage + 1))}
                  disabled={currentPage === numPages}
                >
                  Next Page →
                </Button>
              </div>

              {/* Crop button */}
              {selection && (
                <Button
                  onClick={handleCrop}
                  disabled={cropping}
                  className="w-full gap-2 bg-green-600 hover:bg-green-700"
                >
                  {cropping ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Cropping...
                    </>
                  ) : (
                    <>
                      ✂️ Crop This Region
                    </>
                  )}
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-4 flex items-center justify-end">
          <Button variant="outline" onClick={onClose} disabled={cropping}>
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}
