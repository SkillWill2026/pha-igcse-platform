'use client'

import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

interface RejectDialogProps {
  onConfirm: (note: string) => void
  isLoading?: boolean
  children: React.ReactNode
}

export function RejectDialog({ onConfirm, isLoading, children }: RejectDialogProps) {
  const [open, setOpen] = useState(false)
  const [note, setNote] = useState('')

  const handleConfirm = () => {
    onConfirm(note)
    setOpen(false)
    setNote('')
  }

  // Inject onClick on the trigger child to open the dialog
  const trigger = React.isValidElement(children)
    ? React.cloneElement(children as React.ReactElement<{ onClick?: () => void }>, {
        onClick: () => setOpen(true),
      })
    : <span onClick={() => setOpen(true)}>{children}</span>

  return (
    <>
      {trigger}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reject this item</DialogTitle>
            <DialogDescription>
              Optionally add a note explaining why it was rejected.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-2">
            <Label htmlFor="reject-note">Rejection note (optional)</Label>
            <Textarea
              id="reject-note"
              placeholder="e.g. Question is ambiguous, marks don't align with difficulty…"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirm} disabled={isLoading}>
              Confirm Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
