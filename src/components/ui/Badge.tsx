import { cn } from '@/lib/utils/cn'
import {
  FuelBenzina,
  FuelDiesel,
  FuelElettrica,
  FuelIbrida,
  Available,
  Reserved,
  Sold,
} from '@/components/icons'
import type { FuelType, VehicleStatus } from '@/types'

const fuelStyles: Record<FuelType, string> = {
  benzina: 'bg-red-50 text-red-700 border-red-200',
  diesel: 'bg-[#EFF6FF] text-[#1E40AF] border-[#BFDBFE]',
  gpl: 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]',
  metano: 'bg-teal-50 text-teal-700 border-teal-200',
  ibrida: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  elettrica: 'bg-violet-50 text-violet-700 border-violet-200',
}

const statusStyles: Record<VehicleStatus, string> = {
  disponibile: 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]',
  riservata: 'bg-amber-50 text-amber-700 border-amber-200',
  venduta: 'bg-gray-50 text-gray-700 border-gray-200',
}

const fuelIcons: Partial<Record<FuelType, React.ComponentType<{ size?: number | string; className?: string }>>> = {
  benzina: FuelBenzina,
  diesel: FuelDiesel,
  elettrica: FuelElettrica,
  ibrida: FuelIbrida,
}

const statusIcons: Record<VehicleStatus, React.ComponentType<{ size?: number | string; className?: string }>> = {
  disponibile: Available,
  riservata: Reserved,
  venduta: Sold,
}

export type BadgeVariant = FuelType | VehicleStatus

export interface BadgeProps {
  variant: BadgeVariant
  children: React.ReactNode
  className?: string
  showIcon?: boolean
}

function isFuelType(variant: BadgeVariant): variant is FuelType {
  return variant in fuelStyles
}

export function Badge({ variant, children, className, showIcon = false }: BadgeProps) {
  const styles = isFuelType(variant)
    ? fuelStyles[variant]
    : statusStyles[variant]

  const IconComponent = isFuelType(variant)
    ? fuelIcons[variant]
    : statusIcons[variant]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium uppercase',
        styles,
        className
      )}
    >
      {showIcon && IconComponent && <IconComponent size={14} />}
      {children}
    </span>
  )
}
