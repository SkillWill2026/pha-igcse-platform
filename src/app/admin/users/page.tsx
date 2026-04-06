import { redirect } from 'next/navigation'
import { unstable_noStore as noStore } from 'next/cache'
import { createServerClient } from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { CreateUserDialog } from './create-user-dialog'

export const dynamic = 'force-dynamic'

function RoleBadge({ role }: { role: string }) {
  return (
    <span
      className={
        role === 'admin'
          ? 'inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700'
          : 'inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600'
      }
    >
      {role === 'admin' ? 'Admin' : 'Tutor'}
    </span>
  )
}

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

  // Fetch all auth users + profiles
  const [{ data: { users: authUsers } }, { data: profiles }] = await Promise.all([
    adminClient.auth.admin.listUsers(),
    adminClient.from('profiles').select('id, full_name, role, created_at').order('created_at'),
  ])

  // Merge: profiles are the source of truth for role; auth users provide email
  const rows = (profiles ?? []).map((p) => {
    const au = authUsers?.find((u) => u.id === p.id)
    return {
      id:         p.id,
      full_name:  p.full_name,
      email:      au?.email ?? '—',
      role:       p.role,
      created_at: p.created_at,
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

      <div className="rounded-lg border overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Full Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="w-24">Role</TableHead>
              <TableHead className="w-40">Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-12">
                  No users yet — create the first one above.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.id} className="hover:bg-muted/30">
                  <TableCell className="font-medium">
                    {row.full_name || <span className="text-muted-foreground italic">—</span>}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{row.email}</TableCell>
                  <TableCell><RoleBadge role={row.role} /></TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(row.created_at).toLocaleDateString('en-GB', {
                      day:   '2-digit',
                      month: 'short',
                      year:  'numeric',
                    })}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
