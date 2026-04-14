——import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  const { data: { user } } = await supabase.auth.getUser()
  const { pathname } = request.nextUrl

  // Unauthenticated users cannot access /admin/*
  if (!user && pathname.startsWith('/admin')) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (user) {
    // Fetch role — uses anon key + user session (RLS: user can read own profile)
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const role = profile?.role ?? 'tutor'

    // Tutor-blocked pages
    const tutorBlocked = ['/admin/users', '/admin/databank', '/admin/answer-queue']
    if (role === 'tutor' && tutorBlocked.some(p => pathname.startsWith(p))) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/dashboard'
      return NextResponse.redirect(url)
    }
    // Uploader role — can only access upload page, dashboard, and databank documents
    const uploaderAllowed = ['/admin/upload', '/admin/dashboard', '/admin/databank/documents']
    if (role === 'uploader' && !uploaderAllowed.some(p => pathname.startsWith(p))) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/upload'
      return NextResponse.redirect(url)
    }

    // Bounce authenticated users away from /login
    if (pathname === '/login') {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/dashboard'
      return NextResponse.redirect(url)
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
