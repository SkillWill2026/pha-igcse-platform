import { createServerClient as createSSRServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const supabaseUrl     = process.env['NEXT_PUBLIC_SUPABASE_URL']!
const supabaseAnonKey = process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY']!

/**
 * Cookie-based Supabase client for server components and route handlers.
 * Use this to read the authenticated user's session server-side.
 */
export function createServerClient() {
  const cookieStore = cookies()
  return createSSRServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          )
        } catch {
          // setAll is called from Server Components where cookies are read-only.
          // The session will be refreshed by middleware on the next request.
        }
      },
    },
  })
}
