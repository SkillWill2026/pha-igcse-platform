import { redirect } from 'next/navigation'
import { unstable_noStore as noStore } from 'next/cache'
import { createServerClient } from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase'
import { CreateUserDialog } from './create-user-dialog'
import { UsersTable } from './users-table'

export const dynamic = 'force-dynamic'

export default async function UsersPage() {
  noStore()

  // Verify the current user is an admin
  const serverClient = createServerClient()
  const { data: { user: currentUser } } = await serverClient.auth.getUser()
  if (!currentUser) redirect('/login')

  const adminClient = createAdminClient()
  const { data: currentProfile } = await adminClient
    .from('profiles')
    .select('role')
    .eq('id', currentUser.id)
    .single()

  if (currentProfile?.role !== 'admin') redirect('/admin/questions')

  const isAdmin = true

  // Fetch all auth users + profiles in parallel
  const [{ data: { users: authUsers } }, { data: profiles }] = await Promise.all([
    adminClient.auth.admin.listUsers(),
    adminClient.from('profiles').select('id, full_name, role, created_at').order('created_at'),
  ])

  // Merge: profiles are source of truth for role; auth users provide email + ban status
  const rows = (profiles ?? []).map((p) => {
    const au = (authUsers ?? []).find((u) => u.id === p.id)
    return {
      id:           p.id,
      full_name:    p.full_name,
      email:        au?.email ?? '—',
      role:         p.role as 'admin' | 'tutor',
      created_at:   p.created_at,
      banned_until: (au as { banned_until?: string | null } | undefined)?.banned_until ?? null,
    }
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Users</h1>
          <p className="text-sm text-muted-foreground">Manage platform accounts and roles.</p>
        </div>
        <CreateUserDialog />
      </div>

      <UsersTable
        initialRows={rows}
        isAdmin={isAdmin}
        currentUserId={currentUser.id}
      />
    </div>
  )
}
