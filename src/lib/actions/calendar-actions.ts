'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import {
  listEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  type CalendarEvent,
  type CalendarEventInput,
} from '@/lib/google/calendar'

async function getUserId(): Promise<string | null> {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user?.id ?? null
}

// ─── List Events ────────────────────────────────────────────────────────────

export async function getCalendarEvents(opts: {
  timeMin?: string
  timeMax?: string
}): Promise<{ events: CalendarEvent[]; error?: string }> {
  try {
    const userId = await getUserId()
    if (!userId) return { events: [], error: 'Non autenticato' }

    const events = await listEvents(userId, opts)
    return { events }
  } catch (err) {
    return { events: [], error: (err as Error).message }
  }
}

// ─── Create Event ───────────────────────────────────────────────────────────

export async function createCalendarEvent(
  input: CalendarEventInput
): Promise<{ event?: CalendarEvent; error?: string }> {
  try {
    const userId = await getUserId()
    if (!userId) return { error: 'Non autenticato' }

    const event = await createEvent(userId, input)
    return { event }
  } catch (err) {
    return { error: (err as Error).message }
  }
}

// ─── Update Event ───────────────────────────────────────────────────────────

export async function updateCalendarEvent(
  eventId: string,
  input: Partial<CalendarEventInput>
): Promise<{ event?: CalendarEvent; error?: string }> {
  try {
    const userId = await getUserId()
    if (!userId) return { error: 'Non autenticato' }

    const event = await updateEvent(userId, eventId, input)
    return { event }
  } catch (err) {
    return { error: (err as Error).message }
  }
}

// ─── Delete Event ───────────────────────────────────────────────────────────

export async function deleteCalendarEvent(
  eventId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const userId = await getUserId()
    if (!userId) return { success: false, error: 'Non autenticato' }

    await deleteEvent(userId, eventId)
    return { success: true }
  } catch (err) {
    return { success: false, error: (err as Error).message }
  }
}
