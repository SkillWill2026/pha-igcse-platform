import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase'
import TutorDashboard from '@/components/admin/TutorDashboard'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const adminClient = createAdminClient()
  const { data: profile } = await adminClient
    .from('profiles')
    .select('full_name, role')
    .eq('id', user.id)
    .single()

  const role = profile?.role ?? 'tutor'

  // Admins don't need the tutor dashboard — send them to the questions library
  if (role === 'admin') {
    redirect('/admin/questions')
  }

  return (
    <TutorDashboard
      fullName={profile?.full_name ?? 'Tutor'}
      role={role}
    />
  )
}
