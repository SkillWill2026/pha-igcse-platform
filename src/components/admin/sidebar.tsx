'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { AlertTriangle, BookOpen, CalendarDays, CheckCircle2, Database, FileText, LayoutDashboard, Loader2, LogOut, Upload, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface NavLink {
  href:      string
  label:     string
  icon:      React.ElementType
  adminOnly: boolean
  tutorOnly?: boolean
}

type Subject = {
  id: string
  name: string
  code: string
  color: string
}

const SUBJECT_THEMES: Record<string, {
  sidebarStyle: React.CSSProperties
  borderColor: string
  activeBtnStyle: React.CSSProperties
  inactiveBtnClass: string
  isDark: boolean
}> = {
  '0580': {
    sidebarStyle: {},
    borderColor: '',
    activeBtnStyle: { background: '#2563eb', color: 'white' },
    inactiveBtnClass: 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800',
    isDark: false,
  },
  '0610': {
    sidebarStyle: { background: '#14532d' },
    borderColor: '#166534',
    activeBtnStyle: { background: '#22c55e', color: 'white' },
    inactiveBtnClass: 'text-white/60 hover:bg-white/10',
    isDark: true,
  },
  '0620': {
    sidebarStyle: { background: '#1e3a5f' },
    borderColor: '#1e40af',
    activeBtnStyle: { background: '#3b82f6', color: 'white' },
    inactiveBtnClass: 'text-white/60 hover:bg-white/10',
    isDark: true,
  },
}

const NAV_LINKS: NavLink[] = [
  { href: '/admin/dashboard', label: 'My Dashboard', icon: LayoutDashboard, adminOnly: false, tutorOnly: true },
  { href: '/admin/upload',    label: 'Upload',            icon: Upload,         adminOnly: false },
  { href: '/admin/review',        label: 'Review Queue',      icon: CheckCircle2,   adminOnly: false },
  { href: '/admin/answer-queue',       label: 'Answer Queue',      icon: AlertTriangle,  adminOnly: true  },
  { href: '/admin/databank/dashboard', label: 'Databank',          icon: Database,       adminOnly: true  },
  { href: '/admin/questions',          label: 'Questions Library', icon: BookOpen,       adminOnly: false },
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
  const searchParams = useSearchParams()
  const activeSubject = searchParams.get('subject') ?? '0580'
  const theme = SUBJECT_THEMES[activeSubject] ?? SUBJECT_THEMES['0580']
  const supabase = createClientComponentClient()
  const [signingOut, setSigningOut] = useState(false)
  const [counts, setCounts] = useState<{ rejected: number; deleted: number; draft: number } | null>(null)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const visibleLinks = NAV_LINKS.filter((l) => {
    if (l.tutorOnly && role !== 'tutor') return false
    if (l.adminOnly && role !== 'admin') return false
    return true
  })

  const navTextColor = theme.isDark
    ? 'text-white/80 hover:text-white hover:bg-white/10'
    : ''

  useEffect(() => {
    const fetchCounts = async () => {
      const activeSubjectObj = subjects.find(s => s.code === activeSubject)
      const subjectId = activeSubjectObj?.id

      if (!subjectId) {
        setCounts(prev => prev ? { ...prev, draft: 0 } : null)
        return
      }

      try {
        // Fetch rejected and deleted counts
        const { count: rejectedCount } = await supabase
          .from('questions')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'rejected')

        const { count: deletedCount } = await supabase
          .from('questions')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'deleted')

        // Get topic IDs for this subject
        const { data: topicData } = await supabase
          .from('topics')
          .select('id')
          .eq('subject_id', subjectId)

        const topicIds = (topicData ?? []).map(t => t.id)

        // Count draft questions: topic in subject OR unclassified (null)
        let query = supabase
          .from('questions')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'draft')

        if (topicIds.length > 0) {
          query = query.or(`topic_id.in.(${topicIds.join(',')}),topic_id.is.null`)
        } else {
          query = query.is('topic_id', null)
        }

        const { count } = await query

        setCounts({
          rejected: rejectedCount ?? 0,
          deleted: deletedCount ?? 0,
          draft: count ?? 0,
        })
      } catch (err) {
        console.error('[Sidebar] Error fetching counts:', err)
      }
    }

    fetchCounts()
  }, [pathname, activeSubject, subjects, refreshTrigger, supabase])

  useEffect(() => {
    fetch('/api/subjects')
      .then(r => r.json())
      .then(d => setSubjects(d.subjects ?? []))
      .catch(() => {})
  }, [])

  // Listen for question approval/rejection events to refresh the count
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'reviewQueueRefresh') {
        setRefreshTrigger(prev => prev + 1)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const switchSubject = (code: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('subject', code)
    router.push(`${pathname}?${params.toString()}`)
  }

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

  return (
    <aside
      className="flex w-56 shrink-0 flex-col border-r min-h-screen bg-muted/40"
      style={theme.sidebarStyle}
    >
      <div className="px-5 py-6 space-y-3">
        <p className={`text-xs font-semibold uppercase tracking-widest ${theme.isDark ? 'text-white/50' : 'text-muted-foreground'}`}>
          PHA IGCSE
        </p>
        <div>
          <p className={`text-sm font-semibold leading-tight ${theme.isDark ? 'text-white' : ''}`}>
            {fullName || 'Unnamed User'}
          </p>
          <p className={`text-xs mt-0.5 capitalize ${theme.isDark ? 'text-white/60' : 'text-muted-foreground'}`}>{role}</p>
        </div>
      </div>

      {subjects.length > 1 && (
        <div className="px-3 mb-3">
          <div
            className="flex rounded-lg overflow-hidden border"
            style={theme.borderColor ? { borderColor: theme.borderColor } : {}}
          >
            {subjects.map(s => (
              <button
                key={s.code}
                onClick={() => switchSubject(s.code)}
                style={activeSubject === s.code ? theme.activeBtnStyle : {}}
                className={`flex-1 py-1.5 text-xs font-medium transition-colors ${
                  activeSubject === s.code
                    ? ''
                    : theme.inactiveBtnClass
                }`}
              >
                {s.code}
              </button>
            ))}
          </div>
        </div>
      )}

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
                prefetch={false}
                className={cn(
                  'flex items-center justify-between gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  active
                    ? 'bg-primary text-primary-foreground'
                    : navTextColor || 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
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
                        : navTextColor || 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
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
                        : navTextColor || 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
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

              {/* Users sub-links */}
              {href === '/admin/users' && (
                <div className="ml-7 mt-0.5 space-y-0.5">
                  <Link
                    href="/admin/users/assignments"
                    className={cn(
                      'flex items-center justify-between rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                      pathname.startsWith('/admin/users/assignments')
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                        : `text-muted-foreground hover:bg-accent hover:text-accent-foreground ${navTextColor}`,
                    )}
                  >
                    <span>Assignments</span>
                  </Link>
                </div>
              )}

              {/* Databank sub-links */}
              {href === '/admin/databank/dashboard' && (
                <div className="ml-7 mt-0.5 space-y-0.5">
                  <Link
                    href="/admin/databank/dashboard"
                    className={cn(
                      'flex items-center justify-between rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                      pathname === '/admin/databank/dashboard'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                        : navTextColor || 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                    )}
                  >
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    href="/admin/databank/documents"
                    className={cn(
                      'flex items-center justify-between rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                      pathname.startsWith('/admin/databank/documents')
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                        : navTextColor || 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                    )}
                  >
                    <span>Documents</span>
                  </Link>
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Sign-out footer */}
      <div className={`border-t px-3 py-4 space-y-1 ${theme.isDark ? 'border-white/10' : ''}`}>
        <button
          onClick={handleSignOut}
          disabled={signingOut}
          className={cn(
            'flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
            navTextColor || 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
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
