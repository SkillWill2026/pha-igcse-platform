'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle2, Clock } from 'lucide-react'

interface Stats {
  qApproved: number
  qPending: number
  aApproved: number
  aPending: number
}

function Stat({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <span className="text-sm">
        <span className="font-semibold tabular-nums">{value}</span>
        <span className="ml-1 text-muted-foreground">{label}</span>
      </span>
    </div>
  )
}

export function StatsBar() {
  const searchParams = useSearchParams()
  const subjectCode = searchParams.get('subject') ?? '0580'
  const [stats, setStats] = useState<Stats>({ qApproved: 0, qPending: 0, aApproved: 0, aPending: 0 })
  const [subjectId, setSubjectId] = useState<string | null>(null)

  // Resolve subject code → UUID
  useEffect(() => {
    fetch('/api/subjects')
      .then(r => r.json())
      .then((d: { subjects?: { id: string; code: string }[] }) => {
        const match = (d.subjects ?? []).find(s => s.code === subjectCode)
        setSubjectId(match?.id ?? null)
      })
      .catch(() => {})
  }, [subjectCode])

  // Fetch stats when subjectId resolves
  useEffect(() => {
    if (subjectId === null) return
    const url = `/api/stats?subject_id=${subjectId}`
    fetch(url)
      .then(r => r.json())
      .then(setStats)
      .catch(() => {})
  }, [subjectId])

  return (
    <header className="border-b bg-background px-8 py-3">
      <div className="flex flex-wrap items-center gap-6 text-sm">
        <span className="font-medium text-muted-foreground uppercase tracking-wide text-xs">
          Questions
        </span>
        <Stat label="approved" value={stats.qApproved} icon={<CheckCircle2 className="h-3.5 w-3.5 text-green-600" />} />
        <Stat label="pending"  value={stats.qPending}  icon={<Clock className="h-3.5 w-3.5 text-amber-500" />} />
        <span className="h-4 w-px bg-border" />
        <span className="font-medium text-muted-foreground uppercase tracking-wide text-xs">
          Answers
        </span>
        <Stat label="approved" value={stats.aApproved} icon={<CheckCircle2 className="h-3.5 w-3.5 text-green-600" />} />
        <Stat label="pending"  value={stats.aPending}  icon={<Clock className="h-3.5 w-3.5 text-amber-500" />} />
      </div>
    </header>
  )
}
