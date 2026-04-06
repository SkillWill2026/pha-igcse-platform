import { redirect } from 'next/navigation'

// Root redirects to the admin area; middleware handles auth gating.
export default function HomePage() {
  redirect('/admin/questions')
}
