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
import { Loader2 } from 'lucide-react'

interface DeleteDialogProps {
  onConfirm: () => void
  isLoading?: boolean
  message?: string
  children: React.ReactNode
}

export function DeleteDialog({ onConfirm, isLoading, message, children }: DeleteDialogProps) {
  const [open, setOpen] = useState(false)

  const handleConfirm = () => {
    onConfirm()
    setOpen(false)
  }

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
            <DialogTitle>Delete question</DialogTitle>
            <DialogDescription>
              {message ??
                'Are you sure you want to delete this question? This cannot be undone. Any linked copies on other boards will also be deleted.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirm} disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
