import { createBrowserClient } from '@supabase/ssr'

/**
 * Cookie-based Supabase client for use in client components.
 * Stores the session in cookies so middleware and server components can read it.
 */
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}
