import { createAdminClient } from '@/lib/supabase/admin'

// ─── Types ──────────────────────────────────────────────────────────────────

export interface CalendarEvent {
  id: string
  summary: string
  description?: string
  location?: string
  start: { dateTime: string; timeZone?: string }
  end: { dateTime: string; timeZone?: string }
  status?: string
  htmlLink?: string
  colorId?: string
}

export interface CalendarEventInput {
  summary: string
  description?: string
  location?: string
  start: string // ISO datetime
  end: string   // ISO datetime
}

interface GoogleTokens {
  access_token: string
  refresh_token: string
  token_expiry: string
}

// ─── Token Management ───────────────────────────────────────────────────────

async function getTokensForUser(userId: string): Promise<GoogleTokens | null> {
  const admin = createAdminClient()
  const { data, error } = await admin
    .from('google_integrations')
    .select('access_token, refresh_token, token_expiry')
    .eq('user_id', userId)
    .single()

  if (error || !data) return null
  return data as GoogleTokens
}

async function refreshAccessToken(userId: string, refreshToken: string): Promise<string> {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  })

  if (!res.ok) {
    throw new Error('Failed to refresh Google access token')
  }

  const data = await res.json() as { access_token: string; expires_in: number }

  // Update token in DB
  const admin = createAdminClient()
  await admin
    .from('google_integrations')
    .update({
      access_token: data.access_token,
      token_expiry: new Date(Date.now() + data.expires_in * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)

  return data.access_token
}

async function getValidAccessToken(userId: string): Promise<string | null> {
  const tokens = await getTokensForUser(userId)
  if (!tokens) return null

  // Check if token is expired (with 60s margin)
  const expiry = new Date(tokens.token_expiry).getTime()
  if (Date.now() > expiry - 60_000) {
    return refreshAccessToken(userId, tokens.refresh_token)
  }

  return tokens.access_token
}

// ─── Calendar API ───────────────────────────────────────────────────────────

const CALENDAR_API = 'https://www.googleapis.com/calendar/v3'

async function calendarFetch(
  userId: string,
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = await getValidAccessToken(userId)
  if (!token) throw new Error('Google non connesso')

  return fetch(`${CALENDAR_API}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
}

export async function listEvents(
  userId: string,
  opts: { timeMin?: string; timeMax?: string; maxResults?: number } = {}
): Promise<CalendarEvent[]> {
  const params = new URLSearchParams({
    singleEvents: 'true',
    orderBy: 'startTime',
    timeZone: 'Europe/Rome',
    maxResults: String(opts.maxResults ?? 50),
  })

  if (opts.timeMin) params.set('timeMin', opts.timeMin)
  if (opts.timeMax) params.set('timeMax', opts.timeMax)

  const res = await calendarFetch(userId, `/calendars/primary/events?${params}`)
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Calendar list failed: ${err}`)
  }

  const data = await res.json() as { items?: CalendarEvent[] }
  return data.items ?? []
}

export async function createEvent(
  userId: string,
  event: CalendarEventInput
): Promise<CalendarEvent> {
  const body = {
    summary: event.summary,
    description: event.description,
    location: event.location,
    start: { dateTime: event.start, timeZone: 'Europe/Rome' },
    end: { dateTime: event.end, timeZone: 'Europe/Rome' },
  }

  const res = await calendarFetch(userId, '/calendars/primary/events', {
    method: 'POST',
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Calendar create failed: ${err}`)
  }

  return res.json() as Promise<CalendarEvent>
}

export async function updateEvent(
  userId: string,
  eventId: string,
  event: Partial<CalendarEventInput>
): Promise<CalendarEvent> {
  const body: Record<string, unknown> = {}

  if (event.summary !== undefined) body.summary = event.summary
  if (event.description !== undefined) body.description = event.description
  if (event.location !== undefined) body.location = event.location
  if (event.start) body.start = { dateTime: event.start, timeZone: 'Europe/Rome' }
  if (event.end) body.end = { dateTime: event.end, timeZone: 'Europe/Rome' }

  const res = await calendarFetch(userId, `/calendars/primary/events/${eventId}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Calendar update failed: ${err}`)
  }

  return res.json() as Promise<CalendarEvent>
}

export async function deleteEvent(userId: string, eventId: string): Promise<void> {
  const res = await calendarFetch(userId, `/calendars/primary/events/${eventId}`, {
    method: 'DELETE',
  })

  if (!res.ok && res.status !== 404) {
    const err = await res.text()
    throw new Error(`Calendar delete failed: ${err}`)
  }
}
