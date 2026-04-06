import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })

  // Inline Supabase client — cannot import from lib/supabase*.ts here because
  // middleware runs in the Edge runtime (no Node.js modules like path/dotenv).
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

  // Validates the session JWT with Supabase — also refreshes token if needed.
  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Unauthenticated users cannot access /admin/*
  if (!user && pathname.startsWith('/admin')) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Authenticated users are bounced away from /login
  if (user && pathname === '/login') {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/questions'
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: [
    // Match everything except Next.js internals and static assets
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
