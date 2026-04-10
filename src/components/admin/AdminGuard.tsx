'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

const TUTOR_BLOCKED_PATHS = [
  '/admin/users',
  '/admin/databank',
  '/admin/answer-queue',
]

export function AdminGuard({ role }: { role: string }) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (role === 'tutor' && TUTOR_BLOCKED_PATHS.some(p => pathname.startsWith(p))) {
      router.replace('/admin/dashboard')
    }
  }, [role, pathname, router])

  return null
}
