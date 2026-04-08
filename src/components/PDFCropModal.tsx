'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

interface Props {
  isOpen: boolean
  onClose: () => void
  onSave: (imageUrl: string) => void
  questionId: string
  batchId: string | null
  questionNumber: number | null
  imageType: 'question' | 'answer'
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
  if (!isOpen || !batchId) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="w-[95vw] max-w-2xl bg-white rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="border-b p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">📄 Crop from PDF</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <div className="bg-gray-100 rounded-lg p-8 text-center">
            <p className="text-gray-600 mb-4">PDF cropping feature coming soon</p>
            <p className="text-sm text-gray-500">This feature requires additional libraries and will be available in a future update.</p>
          </div>
        </div>

        <div className="border-t p-4 flex items-center justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}
