'use client'

import { useState, useEffect, useTransition } from 'react'
import { useSearchParams } from 'next/navigation'
import { AdminTopBar } from '@/components/layout/AdminTopBar'
import { Button } from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'
import { updateSetting } from '@/lib/actions/settings-actions'
import {
  getGoogleIntegrationStatus,
  disconnectGoogle,
  type GoogleIntegrationStatus,
} from '@/lib/actions/google-actions'
import { Save, Loader2, Calendar, Mail, CheckCircle, AlertCircle, Unplug } from 'lucide-react'
import toast from 'react-hot-toast'

// ─── Types ──────────────────────────────────────────────────────────────────

interface SettingsData {
  contact_info: {
    phone: string
    whatsapp: string
    email: string
    address: string
  }
  opening_hours: Record<string, string>
  social_links: {
    facebook: string
    instagram: string
  }
  stats: {
    cars_sold: number
    happy_clients: number
    years_experience: number
  }
}

const defaultSettings: SettingsData = {
  contact_info: {
    phone: '+39 02 9309876',
    whatsapp: '+39 345 1234567',
    email: 'rho@privacar.com',
    address: 'Via Madonna, 23, 20017 Rho (MI)',
  },
  opening_hours: {
    lunedi: '9:00-12:30 / 15:00-19:00',
    martedi: '9:00-12:30 / 15:00-19:00',
    mercoledi: '9:00-12:30 / 15:00-19:00',
    giovedi: '9:00-12:30 / 15:00-19:00',
    venerdi: '9:00-12:30 / 15:00-19:00',
    sabato: '9:00-12:30',
    domenica: 'Chiuso',
  },
  social_links: { facebook: '', instagram: '' },
  stats: { cars_sold: 200, happy_clients: 180, years_experience: 1 },
}

const days = [
  'lunedi',
  'martedi',
  'mercoledi',
  'giovedi',
  'venerdi',
  'sabato',
  'domenica',
]

const dayLabels: Record<string, string> = {
  lunedi: 'Lunedi',
  martedi: 'Martedi',
  mercoledi: 'Mercoledi',
  giovedi: 'Giovedi',
  venerdi: 'Venerdi',
  sabato: 'Sabato',
  domenica: 'Domenica',
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function AdminImpostazioniPage() {
  const [settings, setSettings] = useState<SettingsData>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [isPending, startTransition] = useTransition()
  const [googleStatus, setGoogleStatus] = useState<GoogleIntegrationStatus>({
    connected: false,
    email: null,
    scopes: [],
  })
  const [googleLoading, setGoogleLoading] = useState(false)
  const searchParams = useSearchParams()

  // Show toast for Google OAuth redirects
  useEffect(() => {
    const success = searchParams.get('success')
    const error = searchParams.get('error')

    if (success === 'google_connected') {
      toast.success('Google connesso con successo!')
      // Refresh status
      getGoogleIntegrationStatus().then(setGoogleStatus)
    } else if (error === 'google_denied') {
      toast.error('Accesso Google negato')
    } else if (error === 'google_not_configured') {
      toast.error('Credenziali Google non configurate nel server')
    } else if (error) {
      toast.error('Errore durante la connessione Google')
    }

    // Clean URL params
    if (success || error) {
      window.history.replaceState({}, '', '/admin/impostazioni')
    }
  }, [searchParams])

  // Fetch current settings + Google status on mount
  useEffect(() => {
    async function loadAll() {
      const [, googleResult] = await Promise.all([
        loadSettings(),
        getGoogleIntegrationStatus(),
      ])
      setGoogleStatus(googleResult)
    }

    async function loadSettings() {
      try {
        const supabase = createClient()
        const { data } = await supabase.from('site_settings').select('*')

        if (data && data.length > 0) {
          const s = { ...defaultSettings }
          data.forEach((row: { key: string; value: unknown }) => {
            if (row.key in s) {
              ;(s as Record<string, unknown>)[row.key] = row.value
            }
          })
          setSettings(s)
        }
      } catch {
        // Use defaults
      }
      setLoading(false)
    }

    loadAll()
  }, [])

  function handleSave() {
    startTransition(async () => {
      try {
        await Promise.all([
          updateSetting('contact_info', settings.contact_info),
          updateSetting('opening_hours', settings.opening_hours),
          updateSetting('social_links', settings.social_links),
          updateSetting('stats', settings.stats),
        ])
        toast.success('Impostazioni salvate con successo')
      } catch {
        toast.error('Errore durante il salvataggio')
      }
    })
  }

  async function handleDisconnectGoogle() {
    setGoogleLoading(true)
    const result = await disconnectGoogle()
    if (result.success) {
      setGoogleStatus({ connected: false, email: null, scopes: [] })
      toast.success('Google disconnesso')
    } else {
      toast.error(result.error ?? 'Errore')
    }
    setGoogleLoading(false)
  }

  const inputBase =
    'w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted transition-colors focus:border-primary-light focus:outline-none focus:ring-2 focus:ring-primary/10'
  const labelBase = 'mb-1.5 block text-sm font-medium text-text-primary'

  if (loading) {
    return (
      <>
        <AdminTopBar title="Impostazioni" />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-text-muted" />
        </div>
      </>
    )
  }

  return (
    <>
      <AdminTopBar title="Impostazioni">
        <Button
          variant="primary"
          size="sm"
          onClick={handleSave}
          loading={isPending}
          disabled={isPending}
        >
          <Save className="h-4 w-4" />
          Salva Impostazioni
        </Button>
      </AdminTopBar>

      <div className="max-w-3xl space-y-8">
        {/* ── Contact Info ──────────────────────────────────────────────── */}
        <section className="rounded-xl border border-border bg-white p-6">
          <h2 className="mb-5 font-heading text-lg font-bold text-text-primary">
            Informazioni di Contatto
          </h2>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="settings-phone" className={labelBase}>
                Telefono
              </label>
              <input
                id="settings-phone"
                type="tel"
                value={settings.contact_info.phone}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    contact_info: {
                      ...settings.contact_info,
                      phone: e.target.value,
                    },
                  })
                }
                className={inputBase}
              />
            </div>

            <div>
              <label htmlFor="settings-whatsapp" className={labelBase}>
                WhatsApp
              </label>
              <input
                id="settings-whatsapp"
                type="tel"
                value={settings.contact_info.whatsapp}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    contact_info: {
                      ...settings.contact_info,
                      whatsapp: e.target.value,
                    },
                  })
                }
                className={inputBase}
              />
            </div>

            <div>
              <label htmlFor="settings-email" className={labelBase}>
                Email
              </label>
              <input
                id="settings-email"
                type="email"
                value={settings.contact_info.email}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    contact_info: {
                      ...settings.contact_info,
                      email: e.target.value,
                    },
                  })
                }
                className={inputBase}
              />
            </div>

            <div>
              <label htmlFor="settings-address" className={labelBase}>
                Indirizzo
              </label>
              <input
                id="settings-address"
                type="text"
                value={settings.contact_info.address}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    contact_info: {
                      ...settings.contact_info,
                      address: e.target.value,
                    },
                  })
                }
                className={inputBase}
              />
            </div>
          </div>
        </section>

        {/* ── Opening Hours ─────────────────────────────────────────────── */}
        <section className="rounded-xl border border-border bg-white p-6">
          <h2 className="mb-5 font-heading text-lg font-bold text-text-primary">
            Orari di Apertura
          </h2>

          <div className="space-y-3">
            {days.map((day) => (
              <div
                key={day}
                className="flex items-center gap-4"
              >
                <label
                  htmlFor={`hours-${day}`}
                  className="w-24 shrink-0 text-sm font-medium text-text-primary"
                >
                  {dayLabels[day]}
                </label>
                <input
                  id={`hours-${day}`}
                  type="text"
                  value={settings.opening_hours[day] ?? ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      opening_hours: {
                        ...settings.opening_hours,
                        [day]: e.target.value,
                      },
                    })
                  }
                  className={inputBase}
                  placeholder="es. 9:00-12:30 / 15:00-19:00"
                />
              </div>
            ))}
          </div>
        </section>

        {/* ── Social Links ──────────────────────────────────────────────── */}
        <section className="rounded-xl border border-border bg-white p-6">
          <h2 className="mb-5 font-heading text-lg font-bold text-text-primary">
            Link Social
          </h2>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="settings-facebook" className={labelBase}>
                Facebook
              </label>
              <input
                id="settings-facebook"
                type="url"
                value={settings.social_links.facebook}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    social_links: {
                      ...settings.social_links,
                      facebook: e.target.value,
                    },
                  })
                }
                placeholder="https://facebook.com/..."
                className={inputBase}
              />
            </div>

            <div>
              <label htmlFor="settings-instagram" className={labelBase}>
                Instagram
              </label>
              <input
                id="settings-instagram"
                type="url"
                value={settings.social_links.instagram}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    social_links: {
                      ...settings.social_links,
                      instagram: e.target.value,
                    },
                  })
                }
                placeholder="https://instagram.com/..."
                className={inputBase}
              />
            </div>
          </div>
        </section>

        {/* ── Google Integrations ─────────────────────────────────────── */}
        <section className="rounded-xl border border-border bg-white p-6">
          <h2 className="mb-2 font-heading text-lg font-bold text-text-primary">
            Integrazioni Google
          </h2>
          <p className="mb-5 text-sm text-text-muted">
            Collega il tuo account Google per sincronizzare calendario e email
            con la dashboard.
          </p>

          <div className="space-y-4">
            {/* Connection status */}
            {googleStatus.connected ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                    <div>
                      <p className="text-sm font-semibold text-emerald-900">
                        Account Google connesso
                      </p>
                      <p className="mt-0.5 text-sm text-emerald-700">
                        {googleStatus.email}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleDisconnectGoogle}
                    disabled={googleLoading}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-xs font-medium text-emerald-700 transition-colors hover:bg-emerald-50 disabled:opacity-50"
                  >
                    {googleLoading ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Unplug className="h-3 w-3" />
                    )}
                    Disconnetti
                  </button>
                </div>

                {/* Active integrations */}
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="flex items-center gap-3 rounded-lg bg-white p-3 ring-1 ring-emerald-200">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
                      <Calendar className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">
                        Google Calendar
                      </p>
                      <p className="text-xs text-emerald-600">Sincronizzato</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg bg-white p-3 ring-1 ring-emerald-200">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-50">
                      <Mail className="h-4 w-4 text-rose-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">
                        Gmail
                      </p>
                      <p className="text-xs text-emerald-600">Sincronizzato</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-text-muted" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-text-primary">
                      Nessun account Google connesso
                    </p>
                    <p className="mt-1 text-xs text-text-muted">
                      Collega il tuo account per sincronizzare appuntamenti con Google
                      Calendar e ricevere notifiche via Gmail.
                    </p>
                  </div>
                </div>

                {/* Features preview */}
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="flex items-center gap-3 rounded-lg bg-white p-3 ring-1 ring-gray-200">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
                      <Calendar className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">
                        Google Calendar
                      </p>
                      <p className="text-xs text-text-muted">
                        Sincronizza appuntamenti
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg bg-white p-3 ring-1 ring-gray-200">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-50">
                      <Mail className="h-4 w-4 text-rose-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">
                        Gmail
                      </p>
                      <p className="text-xs text-text-muted">
                        Notifiche via email
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={async () => {
                    setGoogleLoading(true)
                    try {
                      const res = await fetch('/api/auth/google')
                      const data = await res.json()
                      if (data.url) {
                        window.location.href = data.url
                      } else {
                        toast.error(data.error === 'google_not_configured'
                          ? 'Credenziali Google non configurate nel server'
                          : 'Errore durante la connessione')
                      }
                    } catch {
                      toast.error('Errore di rete')
                    }
                    setGoogleLoading(false)
                  }}
                  disabled={googleLoading}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-text-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-text-primary/90 disabled:opacity-50"
                >
                  {googleLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <svg className="h-4 w-4" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  )}
                  Connetti Account Google
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ── Stats Counters ────────────────────────────────────────────── */}
        <section className="rounded-xl border border-border bg-white p-6">
          <h2 className="mb-5 font-heading text-lg font-bold text-text-primary">
            Contatori Homepage
          </h2>
          <p className="mb-5 text-sm text-text-muted">
            Questi valori vengono mostrati nella sezione statistiche della
            homepage.
          </p>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div>
              <label htmlFor="stats-cars-sold" className={labelBase}>
                Auto Vendute
              </label>
              <input
                id="stats-cars-sold"
                type="number"
                value={settings.stats.cars_sold}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    stats: {
                      ...settings.stats,
                      cars_sold: Number(e.target.value),
                    },
                  })
                }
                min={0}
                className={inputBase}
              />
            </div>

            <div>
              <label htmlFor="stats-happy-clients" className={labelBase}>
                Clienti Soddisfatti
              </label>
              <input
                id="stats-happy-clients"
                type="number"
                value={settings.stats.happy_clients}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    stats: {
                      ...settings.stats,
                      happy_clients: Number(e.target.value),
                    },
                  })
                }
                min={0}
                className={inputBase}
              />
            </div>

            <div>
              <label htmlFor="stats-years" className={labelBase}>
                Anni di Esperienza
              </label>
              <input
                id="stats-years"
                type="number"
                value={settings.stats.years_experience}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    stats: {
                      ...settings.stats,
                      years_experience: Number(e.target.value),
                    },
                  })
                }
                min={0}
                className={inputBase}
              />
            </div>
          </div>
        </section>

        {/* Bottom save button (mobile convenience) */}
        <div className="pb-8">
          <Button
            variant="primary"
            onClick={handleSave}
            loading={isPending}
            disabled={isPending}
            className="w-full sm:w-auto"
          >
            <Save className="h-4 w-4" />
            Salva Impostazioni
          </Button>
        </div>
      </div>
    </>
  )
}
