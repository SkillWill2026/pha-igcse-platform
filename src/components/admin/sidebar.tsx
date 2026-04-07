'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { BookOpen, CalendarDays, FileText, Loader2, LogOut, Upload, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavLink {
  href:      string
  label:     string
  icon:      React.ElementType
  adminOnly: boolean
}

const NAV_LINKS: NavLink[] = [
  { href: '/admin/upload',    label: 'Upload',            icon: Upload,       adminOnly: false },
  { href: '/admin/questions', label: 'Questions Library', icon: BookOpen,     adminOnly: false },
  { href: '/admin/answers',   label: 'Answers Library',   icon: FileText,     adminOnly: false },
  { href: '/admin/schedule',  label: 'Schedule',          icon: CalendarDays, adminOnly: false },
  { href: '/admin/users',     label: 'Users',             icon: Users,        adminOnly: true  },
]

interface SidebarProps {
  role:     'admin' | 'tutor'
  fullName: string
}

export function Sidebar({ role, fullName }: SidebarProps) {
  const pathname    = usePathname()
  const router      = useRouter()
  const [signingOut, setSigningOut] = useState(false)

  const visibleLinks = NAV_LINKS.filter((l) => !l.adminOnly || role === 'admin')

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
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                active
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
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
