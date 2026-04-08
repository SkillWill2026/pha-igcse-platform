'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { BookOpen, CalendarDays, CheckCircle2, FileText, Loader2, LogOut, Upload, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavLink {
  href:      string
  label:     string
  icon:      React.ElementType
  adminOnly: boolean
}

const NAV_LINKS: NavLink[] = [
  { href: '/admin/upload',    label: 'Upload',            icon: Upload,         adminOnly: false },
  { href: '/admin/review',    label: 'Review Queue',      icon: CheckCircle2,   adminOnly: false },
  { href: '/admin/questions', label: 'Questions Library', icon: BookOpen,       adminOnly: false },
  { href: '/admin/answers',   label: 'Answers Library',   icon: FileText,       adminOnly: false },
  { href: '/admin/schedule',  label: 'Schedule',          icon: CalendarDays,   adminOnly: false },
  { href: '/admin/users',     label: 'Users',             icon: Users,          adminOnly: true  },
]

interface SidebarProps {
  role:     'admin' | 'tutor'
  fullName: string
}

export function Sidebar({ role, fullName }: SidebarProps) {
  const pathname    = usePathname()
  const router      = useRouter()
  const [signingOut, setSigningOut] = useState(false)
  const [counts, setCounts] = useState<{ rejected: number; deleted: number; draft: number } | null>(null)

  const visibleLinks = NAV_LINKS.filter((l) => !l.adminOnly || role === 'admin')

  useEffect(() => {
    Promise.all([
      fetch('/api/questions/counts').then((r) => r.json()),
      fetch('/api/questions?status=draft').then((r) => r.json()).then((qs) => ({ draft: Array.isArray(qs) ? qs.length : 0 })),
    ])
      .then(([qCounts, draftCount]) => setCounts({ ...qCounts, ...draftCount }))
      .catch(() => {})
  }, [pathname])

  async function handleSignOut() {
    setSigningOut(true)
    try {
      await fetch('/api/auth/signout', { method: 'POST' })
      router.push('/login')
      router.refresh()
    } finally {
      setSigningOut(false)
    }
  }

  const questionsActive = pathname.startsWith('/admin/questions')

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r bg-muted/40 min-h-screen">
      <div className="px-5 py-6 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          PHA IGCSE
        </p>
        <div>
          <p className="text-sm font-semibold leading-tight">
            {fullName || 'Unnamed User'}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5 capitalize">{role}</p>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-0.5">
        {visibleLinks.map(({ href, label, icon: Icon }) => {
          // For the questions link, use exact match so sub-pages don't double-highlight
          const active = href === '/admin/questions'
            ? pathname === '/admin/questions'
            : pathname.startsWith(href)

          return (
            <div key={href}>
              <Link
                href={href}
                className={cn(
                  'flex items-center justify-between gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  active
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4 shrink-0" />
                  {label}
                </div>
                {href === '/admin/review' && counts !== null && counts.draft > 0 && (
                  <span className="rounded-full bg-blue-100 text-blue-800 px-1.5 py-0.5 text-[10px] font-bold tabular-nums">
                    {counts.draft}
                  </span>
                )}
              </Link>

              {/* Questions sub-links — always visible */}
              {href === '/admin/questions' && (
                <div className="ml-7 mt-0.5 space-y-0.5">
                  <Link
                    href="/admin/questions/rejected"
                    className={cn(
                      'flex items-center justify-between rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                      pathname.startsWith('/admin/questions/rejected')
                        ? 'bg-amber-100 text-amber-800'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                    )}
                  >
                    <span>Rejected</span>
                    {counts !== null && counts.rejected > 0 && (
                      <span className="rounded-full bg-amber-200 text-amber-800 px-1.5 py-0.5 text-[10px] font-bold tabular-nums">
                        {counts.rejected}
                      </span>
                    )}
                  </Link>
                  <Link
                    href="/admin/questions/deleted"
                    className={cn(
                      'flex items-center justify-between rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                      pathname.startsWith('/admin/questions/deleted')
                        ? 'bg-red-100 text-red-800'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                    )}
                  >
                    <span>Deleted</span>
                    {counts !== null && counts.deleted > 0 && (
                      <span className="rounded-full bg-red-200 text-red-800 px-1.5 py-0.5 text-[10px] font-bold tabular-nums">
                        {counts.deleted}
                      </span>
                    )}
                  </Link>
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Sign-out footer */}
      <div className="border-t px-3 py-4 space-y-1">
        <button
          onClick={handleSignOut}
          disabled={signingOut}
          className={cn(
            'flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
            'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
          )}
        >
          {signingOut
            ? <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
            : <LogOut className="h-4 w-4 shrink-0" />}
          Sign Out
        </button>
      </div>
    </aside>
  )
}
