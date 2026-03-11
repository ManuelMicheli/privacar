'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Pencil, Trash2, Star, StarOff } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { formatPrice } from '@/lib/utils/formatters'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { toggleFeatured, deleteVehicle } from '@/lib/actions/vehicle-actions'
import type { Vehicle, VehicleStatus } from '@/types'
import toast from 'react-hot-toast'

interface VehicleTableProps {
  vehicles: Vehicle[]
}

type TabFilter = 'tutti' | VehicleStatus

const tabs: { value: TabFilter; label: string }[] = [
  { value: 'tutti', label: 'Tutti' },
  { value: 'disponibile', label: 'Disponibili' },
  { value: 'riservata', label: 'Riservate' },
  { value: 'venduta', label: 'Vendute' },
]

const statusLabels: Record<VehicleStatus, string> = {
  disponibile: 'Disponibile',
  riservata: 'Riservata',
  venduta: 'Venduta',
}

export function VehicleTable({ vehicles }: VehicleTableProps) {
  const [activeTab, setActiveTab] = useState<TabFilter>('tutti')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const filtered =
    activeTab === 'tutti'
      ? vehicles
      : vehicles.filter((v) => v.status === activeTab)

  function handleToggleFeatured(id: string, current: boolean) {
    startTransition(async () => {
      const result = await toggleFeatured(id, !current)
      if (result.success) {
        toast.success(
          !current ? 'Veicolo in evidenza' : 'Veicolo rimosso dalla vetrina'
        )
      } else {
        toast.error(result.error ?? 'Errore')
      }
    })
  }

  function handleDelete() {
    if (!deleteId) return
    startTransition(async () => {
      const result = await deleteVehicle(deleteId)
      if (result.success) {
        toast.success('Veicolo eliminato')
        setDeleteId(null)
      } else {
        toast.error(result.error ?? 'Errore durante l\'eliminazione')
      }
    })
  }

  const vehicleToDelete = deleteId
    ? vehicles.find((v) => v.id === deleteId)
    : null

  return (
    <div>
      {/* Status tabs */}
      <div className="mb-4 flex gap-1 rounded-lg border border-border bg-white p-1">
        {tabs.map((tab) => {
          const count =
            tab.value === 'tutti'
              ? vehicles.length
              : vehicles.filter((v) => v.status === tab.value).length

          return (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={cn(
                'flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors',
                activeTab === tab.value
                  ? 'bg-primary text-white'
                  : 'text-text-secondary hover:bg-gray-100'
              )}
            >
              {tab.label}
              <span
                className={cn(
                  'inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-medium',
                  activeTab === tab.value
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-100 text-text-muted'
                )}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-gray-50/50">
              <th className="px-4 py-3 text-left font-medium text-text-secondary">
                Foto
              </th>
              <th className="px-4 py-3 text-left font-medium text-text-secondary">
                Marca / Modello
              </th>
              <th className="hidden px-4 py-3 text-left font-medium text-text-secondary md:table-cell">
                Anno
              </th>
              <th className="px-4 py-3 text-left font-medium text-text-secondary">
                Prezzo
              </th>
              <th className="hidden px-4 py-3 text-left font-medium text-text-secondary sm:table-cell">
                Stato
              </th>
              <th className="hidden px-4 py-3 text-center font-medium text-text-secondary lg:table-cell">
                In Evidenza
              </th>
              <th className="px-4 py-3 text-right font-medium text-text-secondary">
                Azioni
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-12 text-center text-text-muted"
                >
                  Nessun veicolo trovato
                </td>
              </tr>
            ) : (
              filtered.map((vehicle) => {
                const coverImage = vehicle.images?.find((img) => img.is_cover)
                const firstImage = vehicle.images?.[0]
                const thumbnail = coverImage?.url ?? firstImage?.url

                return (
                  <tr
                    key={vehicle.id}
                    className="transition-colors hover:bg-gray-50/50"
                  >
                    {/* Thumbnail */}
                    <td className="px-4 py-3">
                      <div className="relative h-12 w-16 overflow-hidden rounded-lg bg-gray-100">
                        {thumbnail ? (
                          <Image
                            src={thumbnail}
                            alt={`${vehicle.brand} ${vehicle.model}`}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-text-muted">
                            <svg
                              className="h-6 w-6"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Brand / Model */}
                    <td className="px-4 py-3">
                      <p className="font-medium text-text-primary">
                        {vehicle.brand} {vehicle.model}
                      </p>
                      {vehicle.version && (
                        <p className="text-xs text-text-muted">
                          {vehicle.version}
                        </p>
                      )}
                    </td>

                    {/* Year */}
                    <td className="hidden px-4 py-3 text-text-secondary md:table-cell">
                      {vehicle.year}
                    </td>

                    {/* Price */}
                    <td className="px-4 py-3 font-semibold text-text-primary">
                      {formatPrice(vehicle.price)}
                    </td>

                    {/* Status */}
                    <td className="hidden px-4 py-3 sm:table-cell">
                      <Badge variant={vehicle.status}>
                        {statusLabels[vehicle.status]}
                      </Badge>
                    </td>

                    {/* Featured Toggle */}
                    <td className="hidden px-4 py-3 text-center lg:table-cell">
                      <button
                        type="button"
                        onClick={() =>
                          handleToggleFeatured(vehicle.id, vehicle.is_featured)
                        }
                        disabled={isPending}
                        className={cn(
                          'inline-flex h-8 w-8 items-center justify-center rounded-lg transition-colors',
                          vehicle.is_featured
                            ? 'bg-amber-50 text-amber-500 hover:bg-amber-100'
                            : 'text-gray-300 hover:bg-gray-100 hover:text-gray-400'
                        )}
                        title={
                          vehicle.is_featured
                            ? 'Rimuovi da evidenza'
                            : 'Metti in evidenza'
                        }
                      >
                        {vehicle.is_featured ? (
                          <Star className="h-4 w-4 fill-current" />
                        ) : (
                          <StarOff className="h-4 w-4" />
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/veicoli/${vehicle.id}`}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-blue-50 hover:text-blue-600"
                          title="Modifica"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeleteId(vehicle.id)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-red-50 hover:text-red-600"
                          title="Elimina"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Delete confirmation modal */}
      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Conferma eliminazione"
        size="sm"
      >
        <p className="mb-6 text-sm text-text-secondary">
          Sei sicuro di voler eliminare{' '}
          <strong className="text-text-primary">
            {vehicleToDelete
              ? `${vehicleToDelete.brand} ${vehicleToDelete.model}`
              : 'questo veicolo'}
          </strong>
          ? Questa azione non può essere annullata e tutte le immagini
          associate verranno rimosse.
        </p>
        <div className="flex justify-end gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDeleteId(null)}
            disabled={isPending}
          >
            Annulla
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleDelete}
            loading={isPending}
            disabled={isPending}
            className="bg-red-600 hover:bg-red-700"
          >
            Elimina
          </Button>
        </div>
      </Modal>
    </div>
  )
}
