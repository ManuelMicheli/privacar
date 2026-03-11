import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function getSiteSettings() {
  try {
    const supabase = await createServerSupabaseClient()
    const { data } = await supabase.from('site_settings').select('*')
    // Transform to Record<string, any>
    const settings: Record<string, any> = {}
    data?.forEach((s) => {
      settings[s.key] = s.value
    })
    return settings
  } catch {
    return {
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
  }
}
