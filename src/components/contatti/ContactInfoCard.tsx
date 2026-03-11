import { MapPin, Phone, WhatsApp, Email, Clock } from '@/components/icons'

const hours = [
  { day: 'Lunedì - Venerdì', time: '9:00-12:30 / 15:00-19:00' },
  { day: 'Sabato', time: '9:00-12:30' },
  { day: 'Domenica', time: 'Chiuso' },
] as const

export function ContactInfoCard() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h3 className="mb-6 font-heading text-2xl font-bold text-text-primary">
        Informazioni di Contatto
      </h3>

      <div className="space-y-5">
        {/* Address */}
        <a
          href="https://maps.google.com/?q=Via+Madonna+23+20017+Rho+MI"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-start gap-3 transition-colors"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/5 transition-colors group-hover:bg-primary/10">
            <MapPin className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-text-primary group-hover:text-primary">
              Indirizzo
            </p>
            <p className="text-sm text-text-secondary group-hover:text-primary-light">
              Via Madonna, 23, 20017 Rho (MI)
            </p>
          </div>
        </a>

        {/* Phone */}
        <a
          href="tel:+39029309876"
          className="group flex items-start gap-3 transition-colors"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/5 transition-colors group-hover:bg-primary/10">
            <Phone className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-text-primary group-hover:text-primary">
              Telefono
            </p>
            <p className="text-sm text-text-secondary group-hover:text-primary-light">
              +39 02 9309876
            </p>
          </div>
        </a>

        {/* WhatsApp */}
        <a
          href="https://wa.me/393451234567"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-start gap-3 transition-colors"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-whatsapp/5 transition-colors group-hover:bg-whatsapp/10">
            <WhatsApp className="h-5 w-5 text-whatsapp" />
          </div>
          <div>
            <p className="text-sm font-medium text-text-primary group-hover:text-whatsapp">
              WhatsApp
            </p>
            <p className="text-sm text-text-secondary group-hover:text-whatsapp">
              +39 345 1234567
            </p>
          </div>
        </a>

        {/* Email */}
        <a
          href="mailto:rho@privacar.com"
          className="group flex items-start gap-3 transition-colors"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/5 transition-colors group-hover:bg-primary/10">
            <Email className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-text-primary group-hover:text-primary">
              Email
            </p>
            <p className="text-sm text-text-secondary group-hover:text-primary-light">
              rho@privacar.com
            </p>
          </div>
        </a>

        {/* Divider */}
        <hr className="border-border" />

        {/* Opening Hours */}
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/5">
            <Clock className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="mb-3 text-sm font-medium text-text-primary">
              Orari di Apertura
            </p>
            <table className="w-full">
              <tbody>
                {hours.map((row) => (
                  <tr key={row.day}>
                    <td className="py-1 text-sm text-text-secondary">{row.day}</td>
                    <td className="py-1 text-right text-sm font-medium text-text-primary">
                      {row.time === 'Chiuso' ? (
                        <span className="text-primary">{row.time}</span>
                      ) : (
                        row.time
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
