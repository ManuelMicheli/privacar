import { cn } from '@/lib/utils/cn'
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

export type BadgeVariant = FuelType | VehicleStatus

export interface BadgeProps {
  variant: BadgeVariant
  children: React.ReactNode
  className?: string
}

function isFuelType(variant: BadgeVariant): variant is FuelType {
  return variant in fuelStyles
}

export function Badge({ variant, children, className }: BadgeProps) {
  const styles = isFuelType(variant)
    ? fuelStyles[variant]
    : statusStyles[variant]

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium uppercase',
        styles,
        className
      )}
    >
      {children}
    </span>
  )
}
