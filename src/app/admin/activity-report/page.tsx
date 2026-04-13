import { createAdminClient } from '@/lib/supabase'
import { createServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import ActivityReportClient from './ActivityReportClient'

export const dynamic = 'force-dynamic'

export default async function ActivityReportPage() {
  const serverClient = createServerClient()
  const { data: { user } } = await serverClient.auth.getUser()
  if (!user) redirect('/login')

  const adminClient = createAdminClient()
  const { data: profile } = await adminClient.from('profiles').select('role, full_name').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/admin/dashboard')

  return <ActivityReportClient />
}
