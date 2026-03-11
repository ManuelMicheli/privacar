import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { getGoogleOAuthURL } from '@/lib/google/config'

export async function GET() {
  // Verify the user is authenticated
  const cookieStore = await cookies()
  const supabase = createServerClient(
    (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').trim(),
    (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '').trim(),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll() {},
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'not_authenticated' }, { status: 401 })
  }

  // Check that Google credentials are configured
  if (!(process.env.GOOGLE_CLIENT_ID ?? '').trim() || !(process.env.GOOGLE_CLIENT_SECRET ?? '').trim()) {
    return NextResponse.json({ error: 'google_not_configured' }, { status: 500 })
  }

  // Use user ID as state for CSRF protection
  const state = user.id
  const url = getGoogleOAuthURL(state)

  return NextResponse.json({ url })
}
