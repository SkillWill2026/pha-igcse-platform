'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'

export function CreateUserDialog() {
  const router = useRouter()
  const [open,      setOpen]      = useState(false)
  const [fullName,  setFullName]  = useState('')
  const [email,     setEmail]     = useState('')
  const [password,  setPassword]  = useState('')
  const [role,      setRole]      = useState<'admin' | 'tutor'>('tutor')
  const [isLoading, setIsLoading] = useState(false)

  function resetForm() {
    setFullName(''); setEmail(''); setPassword(''); setRole('tutor')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: fullName, email, password, role }),
      })
      const data = await res.json() as { ok?: boolean; error?: string }
      if (!res.ok) throw new Error(data.error ?? 'Failed to create user')
      toast.success(`User ${email} created`)
      setOpen(false)
      resetForm()
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create user')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} className="gap-2">
        <Plus className="h-4 w-4" /> Create User
      </Button>

      <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm() }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create User</DialogTitle>
          </DialogHeader>

          <form id="create-user-form" onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="full-name">Full Name</Label>
              <Input
                id="full-name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Jane Smith"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="user-email">Email <span className="text-destructive">*</span></Label>
              <Input
                id="user-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@pha-igcse.com"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="user-password">Password <span className="text-destructive">*</span></Label>
              <Input
                id="user-password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label>Role <span className="text-destructive">*</span></Label>
              <Select
                value={role}
                onValueChange={(v) => setRole((v ?? 'tutor') as 'admin' | 'tutor')}
              >
                <SelectTrigger>
                  <span>{role === 'admin' ? 'Admin' : 'Tutor'}</span>
                </SelectTrigger>
                <SelectContent alignItemWithTrigger={false}>
                  <SelectItem value="tutor" label="Tutor">Tutor</SelectItem>
                  <SelectItem value="admin" label="Admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </form>

          <DialogFooter>
            <Button variant="outline" onClick={() => { setOpen(false); resetForm() }} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" form="create-user-form" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Create User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
