'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Loader2, MoreHorizontal, KeyRound, ShieldOff, ShieldCheck, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export interface UserRow {
  id:           string
  full_name:    string
  email:        string
  role:         'admin' | 'tutor'
  created_at:   string
  banned_until: string | null
}

interface Props {
  initialRows:   UserRow[]
  isAdmin:       boolean
  currentUserId: string
}

function isBlocked(bannedUntil: string | null): boolean {
  if (!bannedUntil) return false
  return new Date(bannedUntil) > new Date()
}

function RoleBadge({ role }: { role: string }) {
  return (
    <span
      className={
        role === 'admin'
          ? 'inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700'
          : 'inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600'
      }
    >
      {role === 'admin' ? 'Admin' : 'Tutor'}
    </span>
  )
}

export function UsersTable({ initialRows, isAdmin, currentUserId }: Props) {
  const [rows,         setRows]         = useState<UserRow[]>(initialRows)
  const [loadingId,    setLoadingId]    = useState<string | null>(null)
  const [resetTarget,  setResetTarget]  = useState<UserRow | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<UserRow | null>(null)

  async function handleResetPassword() {
    if (!resetTarget) return
    setLoadingId(resetTarget.id)
    try {
      const res = await fetch(`/api/users/${resetTarget.id}/reset-password`, { method: 'POST' })
      const data = await res.json() as { ok?: boolean; error?: string }
      if (!res.ok) throw new Error(data.error ?? 'Failed to send reset email')
      toast.success(`Reset email sent to ${resetTarget.email}`)
      setResetTarget(null)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to send reset email')
    } finally {
      setLoadingId(null)
    }
  }

  async function handleBlock(row: UserRow) {
    const blocked = isBlocked(row.banned_until)
    setLoadingId(row.id)
    try {
      const res = await fetch(`/api/users/${row.id}/block`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ block: !blocked }),
      })
      const data = await res.json() as { ok?: boolean; banned_until?: string | null; error?: string }
      if (!res.ok) throw new Error(data.error ?? 'Action failed')
      setRows((prev) =>
        prev.map((r) => r.id === row.id ? { ...r, banned_until: data.banned_until ?? null } : r),
      )
      const name = row.full_name || row.email
      toast.success(blocked ? `${name} unblocked` : `${name} blocked`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Action failed')
    } finally {
      setLoadingId(null)
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setLoadingId(deleteTarget.id)
    try {
      const res = await fetch(`/api/users/${deleteTarget.id}`, { method: 'DELETE' })
      const data = await res.json() as { ok?: boolean; error?: string }
      if (!res.ok) throw new Error(data.error ?? 'Failed to delete user')
      setRows((prev) => prev.filter((r) => r.id !== deleteTarget.id))
      toast.success(`User ${deleteTarget.email} deleted`)
      setDeleteTarget(null)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete user')
    } finally {
      setLoadingId(null)
    }
  }

  const colSpan = isAdmin ? 5 : 4

  return (
    <>
      <div className="rounded-lg border overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Full Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="w-24">Role</TableHead>
              <TableHead className="w-40">Created</TableHead>
              {isAdmin && <TableHead className="w-12" />}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={colSpan} className="text-center text-muted-foreground py-12">
                  No users yet — create the first one above.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => {
                const blocked = isBlocked(row.banned_until)
                const isSelf  = row.id === currentUserId
                const busy    = loadingId === row.id

                return (
                  <TableRow key={row.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium">
                      <span className="flex items-center gap-2 flex-wrap">
                        {row.full_name || <span className="text-muted-foreground italic">—</span>}
                        {blocked && (
                          <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                            Blocked
                          </span>
                        )}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{row.email}</TableCell>
                    <TableCell><RoleBadge role={row.role} /></TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(row.created_at).toLocaleDateString('en-GB', {
                        day: '2-digit', month: 'short', year: 'numeric',
                      })}
                    </TableCell>

                    {isAdmin && (
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" disabled={busy} className="h-8 w-8">
                              {busy
                                ? <Loader2 className="h-4 w-4 animate-spin" />
                                : <MoreHorizontal className="h-4 w-4" />}
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setResetTarget(row)}>
                              <KeyRound className="h-4 w-4" />
                              Reset Password
                            </DropdownMenuItem>

                            {!isSelf && (
                              <>
                                <DropdownMenuItem onClick={() => handleBlock(row)}>
                                  {blocked ? (
                                    <>
                                      <ShieldCheck className="h-4 w-4 text-green-600" />
                                      Unblock User
                                    </>
                                  ) : (
                                    <>
                                      <ShieldOff className="h-4 w-4 text-amber-600" />
                                      Block User
                                    </>
                                  )}
                                </DropdownMenuItem>

                                <DropdownMenuSeparator />

                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => setDeleteTarget(row)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Delete User
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Reset password confirmation */}
      <Dialog open={!!resetTarget} onOpenChange={(open) => { if (!open) setResetTarget(null) }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Send Password Reset Email</DialogTitle>
            <DialogDescription>
              Send a password reset email to <strong>{resetTarget?.email}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResetTarget(null)} disabled={!!loadingId}>
              Cancel
            </Button>
            <Button onClick={handleResetPassword} disabled={!!loadingId}>
              {loadingId ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Permanently delete{' '}
              <strong>{deleteTarget?.full_name || deleteTarget?.email}</strong>?{' '}
              This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={!!loadingId}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={!!loadingId}>
              {loadingId ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
