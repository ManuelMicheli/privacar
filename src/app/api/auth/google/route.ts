import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { getGoogleOAuthURL } from '@/lib/google/config'

export async function GET() {
  // Verify the user is authenticated
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
    return NextResponse.redirect(new URL('/admin/login', process.env.NEXT_PUBLIC_APP_URL))
  }

  // Check that Google credentials are configured
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return NextResponse.redirect(
      new URL('/admin/impostazioni?error=google_not_configured', process.env.NEXT_PUBLIC_APP_URL)
    )
  }

  // Use user ID as state for CSRF protection
  const state = user.id
  const url = getGoogleOAuthURL(state)

  return NextResponse.redirect(url)
}
