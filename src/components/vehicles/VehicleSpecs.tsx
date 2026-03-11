'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils/cn'
import { formatMileage } from '@/lib/utils/formatters'
import { VehicleFeatures } from './VehicleFeatures'
import type { Vehicle } from '@/types'

export interface VehicleSpecsProps {
  vehicle: Vehicle
}

const TABS = [
  { id: 'specifiche', label: 'Specifiche' },
  { id: 'descrizione', label: 'Descrizione' },
  { id: 'dotazioni', label: 'Dotazioni' },
] as const

type TabId = (typeof TABS)[number]['id']

export function VehicleSpecs({ vehicle }: VehicleSpecsProps) {
  const [activeTab, setActiveTab] = useState<TabId>('specifiche')

  const specRows: { label: string; value: string | number | null | undefined }[] = [
    { label: 'Anno', value: vehicle.year },
    { label: 'Chilometraggio', value: formatMileage(vehicle.mileage) },
    {
      label: 'Alimentazione',
      value:
        vehicle.fuel_type.charAt(0).toUpperCase() + vehicle.fuel_type.slice(1),
    },
    {
      label: 'Cilindrata',
      value: vehicle.engine_cc
        ? `${new Intl.NumberFormat('it-IT').format(vehicle.engine_cc)} cc`
        : null,
    },
    {
      label: 'Potenza CV',
      value: vehicle.power_hp ? `${vehicle.power_hp} CV` : null,
    },
    {
      label: 'Potenza kW',
      value: vehicle.power_kw ? `${vehicle.power_kw} kW` : null,
    },
    {
      label: 'Cambio',
      value:
        vehicle.transmission === 'automatico' ? 'Automatico' : 'Manuale',
    },
    { label: 'Trazione', value: vehicle.drive_type },
    { label: 'Carrozzeria', value: vehicle.body_type },
    { label: 'Colore esterno', value: vehicle.color_exterior },
    { label: 'Colore interni', value: vehicle.color_interior },
    { label: 'Porte', value: vehicle.doors },
    { label: 'Posti', value: vehicle.seats },
    { label: 'Classe emissioni', value: vehicle.emission_class },
    {
      label: 'Neopatentati',
      value: vehicle.new_driver_ok ? 'Si' : 'No',
    },
  ].filter((row) => row.value != null && row.value !== '')

  const hasFeatures =
    vehicle.features &&
    Object.values(vehicle.features).some(
      (arr) => Array.isArray(arr) && arr.length > 0
    )

  return (
    <div className="rounded-2xl bg-white shadow-[0_4px_20px_rgba(0,0,0,0.06)] ring-1 ring-gray-100">
      {/* Tab bar */}
      <div
        className="flex border-b border-gray-100"
        role="tablist"
        aria-label="Dettagli veicolo"
      >
        {TABS.map((tab) => {
          // Hide dotazioni tab if there are no features
          if (tab.id === 'dotazioni' && !hasFeatures) return null
          // Hide descrizione tab if there is no description
          if (tab.id === 'descrizione' && !vehicle.description) return null

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'relative px-6 py-4 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary',
                activeTab === tab.id
                  ? 'text-primary'
                  : 'text-text-muted hover:text-text-primary'
              )}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="specs-tab-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
            </button>
          )
        })}
      </div>

      {/* Tab content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          {activeTab === 'specifiche' && (
            <motion.div
              key="specifiche"
              id="panel-specifiche"
              role="tabpanel"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <div className="overflow-hidden rounded-xl border border-gray-100">
                <table className="w-full text-sm">
                  <tbody>
                    {specRows.map((row, index) => (
                      <tr
                        key={row.label}
                        className={cn(
                          index % 2 === 0 ? 'bg-bg-alt' : 'bg-white'
                        )}
                      >
                        <td className="px-5 py-3 font-medium text-text-secondary">
                          {row.label}
                        </td>
                        <td className="px-5 py-3 text-right font-medium text-text-primary">
                          {row.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'descrizione' && vehicle.description && (
            <motion.div
              key="descrizione"
              id="panel-descrizione"
              role="tabpanel"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <div className="prose prose-sm max-w-none text-text-secondary">
                {vehicle.description.split('\n').map((paragraph, i) => {
                  if (!paragraph.trim()) return null
                  return (
                    <p key={i} className="mb-3 leading-relaxed">
                      {paragraph}
                    </p>
                  )
                })}
              </div>
            </motion.div>
          )}

          {activeTab === 'dotazioni' && hasFeatures && (
            <motion.div
              key="dotazioni"
              id="panel-dotazioni"
              role="tabpanel"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <VehicleFeatures features={vehicle.features} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
