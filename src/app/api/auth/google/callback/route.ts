import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { createAdminClient } from '@/lib/supabase/admin'
import { exchangeCodeForTokens, getGoogleUserEmail, GOOGLE_SCOPES } from '@/lib/google/config'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

  const appUrl = process.env.NEXT_PUBLIC_APP_URL!
  const settingsUrl = `${appUrl}/admin/impostazioni`

  // User denied access
  if (error) {
    return NextResponse.redirect(`${settingsUrl}?error=google_denied`)
  }

  if (!code || !state) {
    return NextResponse.redirect(`${settingsUrl}?error=google_invalid`)
  }

  // Verify the user is authenticated and matches state
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
  if (!user || user.id !== state) {
    return NextResponse.redirect(`${settingsUrl}?error=google_auth`)
  }

  try {
    // Exchange code for tokens
    const tokens = await exchangeCodeForTokens(code)
    const googleEmail = await getGoogleUserEmail(tokens.access_token)

    // Store tokens in Supabase using admin client (bypasses RLS)
    const admin = createAdminClient()
    const { error: dbError } = await admin
      .from('google_integrations')
      .upsert({
        user_id: user.id,
        email: googleEmail,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        token_expiry: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
        scopes: GOOGLE_SCOPES,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id',
      })

    if (dbError) throw dbError

    return NextResponse.redirect(`${settingsUrl}?success=google_connected`)
  } catch (err) {
    console.error('Google OAuth callback error:', err)
    return NextResponse.redirect(`${settingsUrl}?error=google_failed`)
  }
}
