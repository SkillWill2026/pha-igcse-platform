'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface DrawingModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (imageUrl: string) => void
  questionId: string
  imageType: 'question' | 'answer'
}

export default function DrawingModal({ isOpen, onClose }: DrawingModalProps) {
  if (!isOpen) return null

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'white', borderRadius: '12px', padding: '24px', maxWidth: '400px', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '16px', fontWeight: 600 }}>✏️ Draw Diagram</h2>
        <p style={{ color: '#6b7280', marginBottom: '20px' }}>Drawing tool temporarily unavailable. Please use Upload or Paste to add images.</p>
        <Button onClick={onClose}>Close</Button>
      </div>
    </div>
  )
}
