'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type View = 'login' | 'forgot'

export default function LoginPage() {
  const router = useRouter()

  // Login state
  const [email,     setEmail]     = useState('')
  const [password,  setPassword]  = useState('')
  const [error,     setError]     = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Forgot password state
  const [view,          setView]          = useState<View>('login')
  const [resetEmail,    setResetEmail]    = useState('')
  const [resetSent,     setResetSent]     = useState(false)
  const [resetLoading,  setResetLoading]  = useState(false)
  const [resetError,    setResetError]    = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      const supabase = createSupabaseBrowserClient()
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
      if (authError) {
        setError(authError.message)
        return
      }
      router.push('/admin/questions')
      router.refresh()
    } catch {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault()
    setResetError('')
    setResetLoading(true)
    try {
      const supabase = createSupabaseBrowserClient()
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: 'https://pha-igcse-platform.vercel.app/reset-password',
      })
      if (error) {
        setResetError(error.message)
      } else {
        setResetSent(true)
      }
    } catch {
      setResetError('An unexpected error occurred. Please try again.')
    } finally {
      setResetLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <div className="w-full max-w-sm">
        {/* Branding */}
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            PHA IGCSE
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">Admin Platform</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {view === 'login' ? 'Sign in to your account' : 'Reset your password'}
          </p>
        </div>

        <div className="rounded-lg border bg-card shadow-sm">
          {view === 'login' ? (
            <form onSubmit={handleSubmit} className="space-y-5 p-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
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
                {isLoading ? 'Signing in…' : 'Sign In'}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => { setView('forgot'); setError('') }}
                  className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            </form>
          ) : (
            <div className="p-6">
              {resetSent ? (
                <div className="space-y-4">
                  <p className="rounded-md bg-green-50 px-3 py-3 text-sm text-green-700">
                    Check your email for a password reset link.
                  </p>
                  <button
                    type="button"
                    onClick={() => { setView('login'); setResetSent(false); setResetEmail('') }}
                    className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
                  >
                    ← Back to sign in
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="reset-email">Email address</Label>
                    <Input
                      id="reset-email"
                      type="email"
                      required
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="you@example.com"
                      disabled={resetLoading}
                    />
                  </div>

                  {resetError && (
                    <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                      {resetError}
                    </p>
                  )}

                  <Button type="submit" className="w-full" disabled={resetLoading}>
                    {resetLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {resetLoading ? 'Sending…' : 'Send Reset Email'}
                  </Button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => { setView('login'); setResetError('') }}
                      className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
                    >
                      ← Back to sign in
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
