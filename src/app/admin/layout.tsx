import { redirect } from 'next/navigation'
import 'katex/dist/katex.min.css'
import { createServerClient } from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase'
import { Sidebar } from '@/components/admin/sidebar'
import { AdminGuard } from '@/components/admin/AdminGuard'
import { StatsBar } from '@/components/admin/stats-bar'
import { Toaster } from '@/components/ui/sonner'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const adminClient = createAdminClient()
  const { data: profile } = await adminClient
    .from('profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .single()

  const role = (profile?.role as 'admin' | 'tutor') ?? 'tutor'

  return (
    <div className="flex min-h-screen">
      <AdminGuard role={role} />
      <Sidebar role={role} fullName={profile?.full_name ?? ''} />
      <div className="flex flex-1 flex-col min-h-screen">
        <StatsBar />
        <main className="flex-1 overflow-auto p-8">
          {children}
        </main>
      </div>
      <Toaster richColors position="bottom-right" />
    </div>
  )
}
