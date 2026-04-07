'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [ready,     setReady]     = useState(false)
  const [initError, setInitError] = useState('')
  const [password,  setPassword]  = useState('')
  const [confirm,   setConfirm]   = useState('')
  const [error,     setError]     = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [success,   setSuccess]   = useState(false)

  // Exchange the code from the email link for a session
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code')
    if (!code) {
      setInitError('Invalid or expired reset link. Please request a new one.')
      return
    }
    const supabase = createSupabaseBrowserClient()
    supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
      if (error) setInitError(error.message)
      else setReady(true)
    })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    setError('')
    setIsLoading(true)
    try {
      const supabase = createSupabaseBrowserClient()
      const { error: updateError } = await supabase.auth.updateUser({ password })
      if (updateError) {
        setError(updateError.message)
        return
      }
      setSuccess(true)
      setTimeout(() => router.push('/login'), 1500)
    } catch {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            PHA IGCSE
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">Set New Password</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Enter your new password below.
          </p>
        </div>

        <div className="rounded-lg border bg-card shadow-sm p-6">
          {success ? (
            <p className="rounded-md bg-green-50 px-3 py-3 text-sm text-green-700 text-center">
              Password updated! Redirecting to sign in…
            </p>
          ) : initError ? (
            <div className="space-y-4">
              <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {initError}
              </p>
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => router.push('/login')}
                  className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
                >
                  ← Back to sign in
                </button>
              </div>
            </div>
          ) : !ready ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              Verifying reset link…
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
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
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Repeat password"
                  disabled={isLoading}
                />
              </div>

              {error && (
                <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </p>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isLoading ? 'Updating…' : 'Update Password'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
