import { createAdminClient } from '@/lib/supabase'
import { CheckCircle2, Clock } from 'lucide-react'

async function fetchStats() {
  try {
    const supabase = createAdminClient()
    const [qRes, aRes] = await Promise.all([
      supabase.from('questions').select('status'),
      supabase.from('answers').select('status'),
    ])
    const q = qRes.data ?? []
    const a = aRes.data ?? []
    return {
      qApproved: q.filter((r) => r.status === 'approved').length,
      qPending:  q.filter((r) => r.status === 'draft').length,
      aApproved: a.filter((r) => r.status === 'approved').length,
      aPending:  a.filter((r) => r.status === 'draft').length,
    }
  } catch {
    return { qApproved: 0, qPending: 0, aApproved: 0, aPending: 0 }
  }
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

export async function StatsBar() {
  const { qApproved, qPending, aApproved, aPending } = await fetchStats()

  return (
    <header className="border-b bg-background px-8 py-3">
      <div className="flex flex-wrap items-center gap-6 text-sm">
        <span className="font-medium text-muted-foreground uppercase tracking-wide text-xs">
          Questions
        </span>
        <Stat
          label="approved"
          value={qApproved}
          icon={<CheckCircle2 className="h-3.5 w-3.5 text-green-600" />}
        />
        <Stat
          label="pending"
          value={qPending}
          icon={<Clock className="h-3.5 w-3.5 text-amber-500" />}
        />

        <span className="h-4 w-px bg-border" />

        <span className="font-medium text-muted-foreground uppercase tracking-wide text-xs">
          Answers
        </span>
        <Stat
          label="approved"
          value={aApproved}
          icon={<CheckCircle2 className="h-3.5 w-3.5 text-green-600" />}
        />
        <Stat
          label="pending"
          value={aPending}
          icon={<Clock className="h-3.5 w-3.5 text-amber-500" />}
        />
      </div>
    </header>
  )
}
