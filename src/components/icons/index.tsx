// =============================================
// PRIVACAR RHO — Custom Icon Set
// 30+ SVG icons, emerald palette, Lucide-compatible API
// Usage: <IconName className="h-5 w-5 text-primary" />
// =============================================

import { type SVGProps } from 'react'

export interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number | string
}

// === BRAND / LOGO ===

export const PrivacarLogo = ({ size = 40, color, className, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} {...props}>
    <rect x="2" y="2" width="44" height="44" rx="10" stroke={color || 'currentColor'} strokeWidth="2.5" />
    <path d="M14 34V14h8c5 0 8 2.5 8 7s-3 7-8 7h-4" stroke={color || 'currentColor'} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="35" cy="34" r="3" fill={color || 'currentColor'} opacity="0.4" />
  </svg>
)

export const PrivacarLogoFull = ({ size = 160, color, className, ...props }: IconProps) => (
  <svg width={size} height={Number(size) * 0.3} viewBox="0 0 200 60" fill="none" className={className} {...props}>
    <rect x="2" y="8" width="44" height="44" rx="10" stroke={color || 'currentColor'} strokeWidth="2.5" />
    <path d="M14 42V22h8c5 0 8 2.5 8 7s-3 7-8 7h-4" stroke={color || 'currentColor'} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="37" cy="42" r="2.5" fill={color || 'currentColor'} opacity="0.4" />
    <text x="56" y="40" fontFamily="var(--font-heading), sans-serif" fontWeight="800" fontSize="24" fill={color || 'currentColor'} letterSpacing="1">PRIVACAR</text>
    <text x="56" y="52" fontFamily="var(--font-mono), monospace" fontWeight="500" fontSize="10" fill={color || 'currentColor'} opacity="0.5" letterSpacing="3">RHO</text>
  </svg>
)

// === NAVIGAZIONE / UI ===

export const Search = ({ size = 24, className, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className} {...props}>
    <circle cx="10.5" cy="10.5" r="7" />
    <path d="M15.5 15.5L21 21" />
  </svg>
)

export const Menu = ({ size = 24, className, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className} {...props}>
    <path d="M3 7h18M3 12h12M3 17h18" />
  </svg>
)

export const Close = ({ size = 24, className, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className} {...props}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
)

export const ChevronDown = ({ size = 24, className, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M6 9l6 6 6-6" />
  </svg>
)

export const ArrowRight = ({ size = 24, className, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

// === AUTO / VEICOLI ===

export const Car = ({ size = 24, className, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M5 17h14M3 17l1.5-5.5L6 7h12l1.5 4.5L21 17" />
    <circle cx="7.5" cy="17" r="2" fill="currentColor" opacity="0.2" stroke="currentColor" />
    <circle cx="16.5" cy="17" r="2" fill="currentColor" opacity="0.2" stroke="currentColor" />
    <path d="M6 11h12" opacity="0.4" />
  </svg>
)

export const CarFront = ({ size = 24, className, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <rect x="3" y="11" width="18" height="8" rx="2" />
    <path d="M5 11l2-5h10l2 5" />
    <circle cx="7" cy="15" r="1.5" fill="currentColor" />
    <circle cx="17" cy="15" r="1.5" fill="currentColor" />
    <path d="M10 11V8M14 11V8" opacity="0.3" />
  </svg>
)

export const Steering = ({ size = 24, className, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className={className} {...props}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="2" fill="currentColor" opacity="0.3" />
    <path d="M12 5v5M6.3 17.5L10.5 14M17.7 17.5L13.5 14" />
  </svg>
)

export const Key = ({ size = 24, className, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <circle cx="8" cy="15" r="5" />
    <circle cx="8" cy="15" r="2" fill="currentColor" opacity="0.15" />
    <path d="M12 11l8-8M17 3l3 3M15 6l2 2" />
  </svg>
)

export const Speedometer = ({ size = 24, className, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className={className} {...props}>
    <path d="M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18z" />
    <path d="M12 12l3.5-5.5" strokeWidth="2.2" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    <path d="M5.5 17h13" opacity="0.3" />
  </svg>
)

// === ALIMENTAZIONE ===

export const FuelBenzina = ({ size = 24, color = '#DC2626', className, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <rect x="4" y="4" width="10" height="16" rx="1.5" />
    <path d="M14 8l2.5-2 1.5 1v7a1.5 1.5 0 0 1-3 0V12" />
    <rect x="6.5" y="7" width="5" height="3.5" rx="0.5" fill={color} opacity="0.15" />
  </svg>
)

export const FuelDiesel = ({ size = 24, color = '#1E40AF', className, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" className={className} {...props}>
    <rect x="4" y="4" width="10" height="16" rx="1.5" />
    <path d="M14 8l2.5-2 1.5 1v7a1.5 1.5 0 0 1-3 0V12" />
    <text x="6.5" y="14" fontFamily="monospace" fontSize="5" fontWeight="700" fill={color}>D</text>
  </svg>
)

export const FuelElettrica = ({ size = 24, color = '#6D28D9', className, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" fill={color} opacity="0.1" />
    <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />
  </svg>
)

export const FuelIbrida = ({ size = 24, color = '#065F46', className, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" className={className} {...props}>
    <path d="M7 17a5 5 0 0 1 0-10" />
    <path d="M17 7a5 5 0 0 1 0 10" />
    <circle cx="7" cy="12" r="1.5" fill={color} opacity="0.3" />
    <path d="M13 10l-2 4h3l-2 4" strokeWidth="1.5" />
  </svg>
)

// === SERVIZI ===

export const Shield = ({ size = 24, className, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M12 3l8 4v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V7l8-4z" fill="currentColor" opacity="0.06" />
    <path d="M12 3l8 4v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V7l8-4z" />
    <path d="M9 12l2 2 4-4" strokeWidth="2" />
  </svg>
)

export const Finance = ({ size = 24, className, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <rect x="2" y="5" width="20" height="14" rx="2" fill="currentColor" opacity="0.06" />
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <path d="M2 10h20" opacity="0.3" />
    <circle cx="17" cy="15" r="2" fill="currentColor" opacity="0.2" stroke="currentColor" />
    <path d="M6 15h4" opacity="0.4" />
  </svg>
)

export const Warranty = ({ size = 24, className, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M12 3l8 4v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V7l8-4z" fill="currentColor" opacity="0.06" />
    <path d="M12 3l8 4v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V7l8-4z" />
    <path d="M8 12h8M12 8v8" strokeWidth="1.5" opacity="0.6" />
  </svg>
)

export const Inspection = ({ size = 24, className, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className={className} {...props}>
    <rect x="4" y="3" width="16" height="18" rx="2" fill="currentColor" opacity="0.06" />
    <rect x="4" y="3" width="16" height="18" rx="2" />
    <path d="M8 8h8M8 12h5M8 16h8" opacity="0.4" />
    <circle cx="17" cy="12" r="3" fill="currentColor" opacity="0.15" stroke="currentColor" />
    <path d="M16 12l1 1 2-2.5" strokeWidth="1.5" />
  </svg>
)

// === TRUST / VALUE PROPS ===

export const CheckCircle = ({ size = 24, className, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <circle cx="12" cy="12" r="9" fill="currentColor" opacity="0.08" />
    <circle cx="12" cy="12" r="9" />
    <path d="M8 12l3 3 5-6" strokeWidth="2" />
  </svg>
)

export const PriceTag = ({ size = 24, className, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M20.6 11.5L12.5 3.4a2 2 0 0 0-1.4-.6H5a2 2 0 0 0-2 2v6.1a2 2 0 0 0 .6 1.4l8.1 8.1a2 2 0 0 0 2.8 0l6.1-6.1a2 2 0 0 0 0-2.8z" fill="currentColor" opacity="0.06" />
    <path d="M20.6 11.5L12.5 3.4a2 2 0 0 0-1.4-.6H5a2 2 0 0 0-2 2v6.1a2 2 0 0 0 .6 1.4l8.1 8.1a2 2 0 0 0 2.8 0l6.1-6.1a2 2 0 0 0 0-2.8z" />
    <circle cx="7.5" cy="7.5" r="1.5" fill="currentColor" />
  </svg>
)

export const Handshake = ({ size = 24, className, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M2 14l4-4 3 2 5-5 4 2 4-4" />
    <path d="M8 12l-3 3 5 5 3-3" fill="currentColor" opacity="0.08" />
    <path d="M16 10l3 3-5 5-3-3" fill="currentColor" opacity="0.08" />
    <circle cx="12" cy="15" r="1" fill="currentColor" />
  </svg>
)

export const Clock = ({ size = 24, className, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className={className} {...props}>
    <circle cx="12" cy="12" r="9" fill="currentColor" opacity="0.06" />
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 3" strokeWidth="2" />
  </svg>
)

// === CONTATTI / COMUNICAZIONE ===

export const Phone = ({ size = 24, className, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 3 5.2 2 2 0 0 1 5 3h3a2 2 0 0 1 2 1.7c.1.8.4 1.6.7 2.3a2 2 0 0 1-.4 2.1L9 10.4a16 16 0 0 0 6.6 6.6l1.3-1.3a2 2 0 0 1 2.1-.4c.7.3 1.5.5 2.3.7a2 2 0 0 1 1.7 2z" />
  </svg>
)

export const WhatsApp = ({ size = 24, className, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
    <path d="M17.5 14.4c-.3-.1-1.6-.8-1.9-.9-.3-.1-.5-.1-.7.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.8-.8-1.4-1.7-1.6-2-.2-.3 0-.4.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.3 0-.5 0-.1-.7-1.6-.9-2.2-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.3-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.6-.7 1.9-1.3.2-.6.2-1.2.2-1.3 0-.1-.2-.2-.5-.3zM12 21.8c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.5.9.9-3.4-.2-.4A9.8 9.8 0 1 1 12 21.8zM12 2a10 10 0 0 0-8.5 15.3L2 22l4.8-1.5A10 10 0 1 0 12 2z" />
  </svg>
)

export const Email = ({ size = 24, className, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <rect x="3" y="5" width="18" height="14" rx="2" fill="currentColor" opacity="0.06" />
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 7l9 6 9-6" />
  </svg>
)

export const MapPin = ({ size = 24, className, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M12 21s-7-5.5-7-11a7 7 0 1 1 14 0c0 5.5-7 11-7 11z" fill="currentColor" opacity="0.08" />
    <path d="M12 21s-7-5.5-7-11a7 7 0 1 1 14 0c0 5.5-7 11-7 11z" />
    <circle cx="12" cy="10" r="2.5" fill="currentColor" opacity="0.3" />
  </svg>
)

export const Calendar = ({ size = 24, className, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <rect x="3" y="5" width="18" height="16" rx="2" fill="currentColor" opacity="0.06" />
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 10h18" />
    <path d="M8 3v4M16 3v4" />
    <circle cx="8" cy="15" r="1" fill="currentColor" />
  </svg>
)

// === SOCIAL ===

export const Instagram = ({ size = 24, className, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
  </svg>
)

export const Facebook = ({ size = 24, className, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3V2z" />
  </svg>
)

// === STATI AUTO ===

export const Available = ({ size = 24, className, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} {...props}>
    <circle cx="12" cy="12" r="8" fill="#065F46" opacity="0.1" stroke="#065F46" strokeWidth="1.8" />
    <path d="M8 12l3 3 5-6" stroke="#065F46" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const Reserved = ({ size = 24, className, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} {...props}>
    <circle cx="12" cy="12" r="8" fill="#D97706" opacity="0.1" stroke="#D97706" strokeWidth="1.8" />
    <circle cx="12" cy="12" r="1.5" fill="#D97706" />
    <path d="M12 7v3" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

export const Sold = ({ size = 24, className, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} {...props}>
    <circle cx="12" cy="12" r="8" fill="#6B7280" opacity="0.1" stroke="#6B7280" strokeWidth="1.8" />
    <path d="M9 9l6 6M15 9l-6 6" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

// === MISC / UI ===

export const Star = ({ size = 24, className, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" className={className} {...props}>
    <path d="M12 2l3 6.2 6.8 1-5 4.8 1.2 6.8L12 17.8l-6 3.2 1.2-6.8-5-4.8 6.8-1L12 2z" />
  </svg>
)

export const Filter = ({ size = 24, className, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className={className} {...props}>
    <path d="M3 6h18M6 12h12M9 18h6" />
  </svg>
)

export const Sort = ({ size = 24, className, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className={className} {...props}>
    <path d="M3 8h10M3 12h7M3 16h4M17 4v16M14 17l3 3 3-3" />
  </svg>
)

export const Gallery = ({ size = 24, className, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <rect x="3" y="3" width="18" height="18" rx="2" fill="currentColor" opacity="0.06" />
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M3 16l5-5 4 4 3-3 6 6" />
    <circle cx="15" cy="8" r="2" fill="currentColor" opacity="0.2" />
  </svg>
)

export const Expand = ({ size = 24, className, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
  </svg>
)
