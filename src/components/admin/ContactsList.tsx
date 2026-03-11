'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import {
  Mail,
  Phone,
  MessageCircle,
  ChevronDown,
  ChevronRight,
  Eye,
  ExternalLink,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { formatDate } from '@/lib/utils/formatters'
import { markAsRead } from '@/lib/actions/contact-actions'
import { Button } from '@/components/ui/Button'
import type { ContactRequest, RequestType } from '@/types'
import toast from 'react-hot-toast'

interface ContactsListProps {
  contacts: ContactRequest[]
}

type TabFilter = 'tutti' | 'non_letti' | RequestType

const tabs: { value: TabFilter; label: string }[] = [
  { value: 'tutti', label: 'Tutti' },
  { value: 'non_letti', label: 'Non letti' },
  { value: 'info', label: 'Info' },
  { value: 'finanziamento', label: 'Finanziamento' },
  { value: 'garanzia', label: 'Garanzia' },
  { value: 'valutazione', label: 'Valutazione' },
  { value: 'generico', label: 'Generico' },
]

const requestTypeLabels: Record<RequestType, string> = {
  info: 'Informazioni',
  finanziamento: 'Finanziamento',
  garanzia: 'Garanzia',
  valutazione: 'Valutazione',
  generico: 'Generico',
}

const requestTypeBadge: Record<RequestType, string> = {
  info: 'bg-blue-50 text-blue-700',
  finanziamento: 'bg-green-50 text-green-700',
  garanzia: 'bg-purple-50 text-purple-700',
  valutazione: 'bg-amber-50 text-amber-700',
  generico: 'bg-gray-50 text-gray-700',
}

export function ContactsList({ contacts: initialContacts }: ContactsListProps) {
  const [contacts, setContacts] = useState(initialContacts)
  const [activeTab, setActiveTab] = useState<TabFilter>('tutti')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const filtered = contacts.filter((c) => {
    if (activeTab === 'tutti') return true
    if (activeTab === 'non_letti') return !c.is_read
    return c.request_type === activeTab
  })

  function handleMarkAsRead(id: string) {
    startTransition(async () => {
      const result = await markAsRead(id)
      if (result.success) {
        setContacts((prev) =>
          prev.map((c) => (c.id === id ? { ...c, is_read: true } : c))
        )
        toast.success('Segnato come letto')
      } else {
        toast.error(result.error ?? 'Errore')
      }
    })
  }

  function toggleExpand(id: string) {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  return (
    <div>
      {/* Tabs */}
      <div className="mb-4 flex flex-wrap gap-1 rounded-lg border border-border bg-white p-1">
        {tabs.map((tab) => {
          let count: number
          if (tab.value === 'tutti') {
            count = contacts.length
          } else if (tab.value === 'non_letti') {
            count = contacts.filter((c) => !c.is_read).length
          } else {
            count = contacts.filter(
              (c) => c.request_type === tab.value
            ).length
          }

          return (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={cn(
                'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
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

      {/* List */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-border bg-white py-12 text-center text-sm text-text-muted">
            Nessun contatto trovato
          </div>
        ) : (
          filtered.map((contact) => {
            const isExpanded = expandedId === contact.id
            const vehicleData = contact.vehicle as
              | { brand: string; model: string; slug: string }
              | null
              | undefined

            return (
              <div
                key={contact.id}
                className={cn(
                  'rounded-xl border bg-white transition-shadow',
                  !contact.is_read
                    ? 'border-primary/20 bg-red-50/30'
                    : 'border-border'
                )}
              >
                {/* Row header (clickable) */}
                <button
                  type="button"
                  onClick={() => toggleExpand(contact.id)}
                  className="flex w-full items-center gap-4 px-5 py-4 text-left"
                >
                  {/* Unread dot */}
                  <div className="w-2.5 shrink-0">
                    {!contact.is_read && (
                      <span className="block h-2.5 w-2.5 rounded-full bg-primary" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-text-primary">
                        {contact.name}
                      </span>
                      <span
                        className={cn(
                          'rounded-full px-2 py-0.5 text-xs font-medium',
                          requestTypeBadge[contact.request_type]
                        )}
                      >
                        {requestTypeLabels[contact.request_type]}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-xs text-text-muted">
                      {contact.email}
                      {vehicleData && (
                        <span>
                          {' '}
                          &middot; {vehicleData.brand} {vehicleData.model}
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Date + expand icon */}
                  <span className="shrink-0 text-xs text-text-muted">
                    {formatDate(contact.created_at)}
                  </span>
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 shrink-0 text-text-muted" />
                  ) : (
                    <ChevronRight className="h-4 w-4 shrink-0 text-text-muted" />
                  )}
                </button>

                {/* Expanded detail */}
                {isExpanded && (
                  <div className="border-t border-border px-5 py-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-3">
                        <div>
                          <span className="text-xs font-medium uppercase text-text-muted">
                            Nome
                          </span>
                          <p className="text-sm text-text-primary">
                            {contact.name}
                          </p>
                        </div>
                        <div>
                          <span className="text-xs font-medium uppercase text-text-muted">
                            Email
                          </span>
                          <p className="text-sm text-text-primary">
                            {contact.email}
                          </p>
                        </div>
                        {contact.phone && (
                          <div>
                            <span className="text-xs font-medium uppercase text-text-muted">
                              Telefono
                            </span>
                            <p className="text-sm text-text-primary">
                              {contact.phone}
                            </p>
                          </div>
                        )}
                        {vehicleData && (
                          <div>
                            <span className="text-xs font-medium uppercase text-text-muted">
                              Veicolo
                            </span>
                            <p className="text-sm">
                              <Link
                                href={`/auto/${vehicleData.slug}`}
                                target="_blank"
                                className="inline-flex items-center gap-1 text-primary hover:text-primary-light"
                              >
                                {vehicleData.brand} {vehicleData.model}
                                <ExternalLink className="h-3 w-3" />
                              </Link>
                            </p>
                          </div>
                        )}
                      </div>

                      {contact.message && (
                        <div>
                          <span className="text-xs font-medium uppercase text-text-muted">
                            Messaggio
                          </span>
                          <p className="mt-1 whitespace-pre-wrap rounded-lg bg-bg-alt p-3 text-sm text-text-primary">
                            {contact.message}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border pt-4">
                      {!contact.is_read && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleMarkAsRead(contact.id)}
                          loading={isPending}
                          disabled={isPending}
                        >
                          <Eye className="h-4 w-4" />
                          Segna come letto
                        </Button>
                      )}

                      <a
                        href={`mailto:${contact.email}`}
                        className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-gray-50"
                      >
                        <Mail className="h-4 w-4" />
                        Email
                      </a>

                      {contact.phone && (
                        <>
                          <a
                            href={`tel:${contact.phone}`}
                            className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-gray-50"
                          >
                            <Phone className="h-4 w-4" />
                            Chiama
                          </a>
                          <a
                            href={`https://wa.me/${contact.phone.replace(/[^0-9+]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-xl bg-whatsapp px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
                          >
                            <MessageCircle className="h-4 w-4" />
                            WhatsApp
                          </a>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
