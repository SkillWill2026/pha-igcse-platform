import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase'
import { TutorAssignmentsClient } from '@/components/admin/TutorAssignmentsClient'

export const dynamic = 'force-dynamic'

export default async function TutorAssignmentsPage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const adminClient = createAdminClient()

  const [profileRes, usersRes, assignmentsRes, topicsRes, subjectsRes, progressRes] = await Promise.all([
    adminClient.from('profiles').select('role').eq('id', user.id).single(),
    adminClient.from('profiles').select('id, full_name, role').eq('role', 'tutor').order('full_name'),
    adminClient.from('tutor_topic_assignments').select('id, user_id, topic_id, subject_id'),
    adminClient.from('topics').select('id, name, ref, subject_id').order('ref'),
    adminClient.from('subjects').select('id, name, code, color').eq('active', true).order('sort_order'),
    adminClient.from('production_topic_targets').select('topic_id, target'),
  ])

  if (profileRes.data?.role !== 'admin') redirect('/admin/questions')

  return (
    <TutorAssignmentsClient
      initialTutors={usersRes.data ?? []}
      initialAssignments={assignmentsRes.data ?? []}
      initialTopics={topicsRes.data ?? []}
      initialSubjects={subjectsRes.data ?? []}
      initialTargets={progressRes.data ?? []}
    />
  )
}
