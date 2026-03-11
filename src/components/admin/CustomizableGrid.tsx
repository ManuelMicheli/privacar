'use client'

import {
  useState,
  useRef,
  useCallback,
  useEffect,
  type ReactNode,
  type DragEvent,
} from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  GripVertical,
  ChevronDown,
  ChevronUp,
  Minimize2,
  Maximize2,
  RotateCcw,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'

/* ─── Types ──────────────────────────────────────────────────────────────────── */

export interface WidgetConfig {
  id: string
  title: string
  icon: ReactNode
  defaultColSpan: number
  content: ReactNode
}

interface LayoutState {
  order: string[]
  minimized: string[]
  colSpans: Record<string, number>
}

interface CustomizableGridProps {
  widgets: WidgetConfig[]
  storageKey: string
  cols?: number
  className?: string
}

/* ─── Helpers ────────────────────────────────────────────────────────────────── */

function getDefaultLayout(widgets: WidgetConfig[]): LayoutState {
  return {
    order: widgets.map((w) => w.id),
    minimized: [],
    colSpans: Object.fromEntries(widgets.map((w) => [w.id, w.defaultColSpan])),
  }
}

function loadLayout(key: string): LayoutState | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function saveLayout(key: string, state: LayoutState) {
  try {
    localStorage.setItem(key, JSON.stringify(state))
  } catch {
    /* noop */
  }
}

const spanClass: Record<number, string> = {
  1: 'lg:col-span-1',
  2: 'lg:col-span-2',
  3: 'lg:col-span-3',
}

/* ─── Component ──────────────────────────────────────────────────────────────── */

export function CustomizableGrid({
  widgets,
  storageKey,
  cols = 2,
  className,
}: CustomizableGridProps) {
  const [layout, setLayout] = useState<LayoutState>(() => {
    const defaults = getDefaultLayout(widgets)
    const saved = loadLayout(storageKey)
    if (!saved) return defaults

    const validIds = new Set(widgets.map((w) => w.id))
    const validOrder = saved.order.filter((id) => validIds.has(id))
    const missingIds = widgets
      .filter((w) => !validOrder.includes(w.id))
      .map((w) => w.id)

    return {
      order: [...validOrder, ...missingIds],
      minimized: saved.minimized.filter((id) => validIds.has(id)),
      colSpans: {
        ...defaults.colSpans,
        ...Object.fromEntries(
          Object.entries(saved.colSpans).filter(([id]) => validIds.has(id))
        ),
      },
    }
  })

  // Check if layout has been customised (differs from default)
  const defaults = getDefaultLayout(widgets)
  const isCustomised =
    JSON.stringify(layout.order) !== JSON.stringify(defaults.order) ||
    layout.minimized.length > 0 ||
    JSON.stringify(layout.colSpans) !== JSON.stringify(defaults.colSpans)

  // Persist
  useEffect(() => {
    saveLayout(storageKey, layout)
  }, [layout, storageKey])

  // ── Drag state ──────────────────────────────────────────────────────────────
  const draggedRef = useRef<string | null>(null)
  const [dragOverId, setDragOverId] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  // ── Callbacks ───────────────────────────────────────────────────────────────

  const toggleMinimize = useCallback((id: string) => {
    setLayout((prev) => ({
      ...prev,
      minimized: prev.minimized.includes(id)
        ? prev.minimized.filter((x) => x !== id)
        : [...prev.minimized, id],
    }))
  }, [])

  const changeColSpan = useCallback(
    (id: string, delta: number) => {
      setLayout((prev) => {
        const current = prev.colSpans[id] ?? 1
        const next = Math.max(1, Math.min(cols, current + delta))
        if (next === current) return prev
        return { ...prev, colSpans: { ...prev.colSpans, [id]: next } }
      })
    },
    [cols]
  )

  const resetLayout = useCallback(() => {
    setLayout(getDefaultLayout(widgets))
  }, [widgets])

  // ── Drag handlers ─────────────────────────────────────────────────────────

  const onDragStart = useCallback(
    (e: DragEvent<HTMLDivElement>, id: string) => {
      draggedRef.current = id
      e.dataTransfer.effectAllowed = 'move'
      setIsDragging(true)
      if (e.currentTarget) {
        e.currentTarget.style.opacity = '0.4'
      }
    },
    []
  )

  const onDragEnd = useCallback((e: DragEvent<HTMLDivElement>) => {
    draggedRef.current = null
    setDragOverId(null)
    setIsDragging(false)
    if (e.currentTarget) {
      e.currentTarget.style.opacity = '1'
    }
  }, [])

  const onDragOver = useCallback(
    (e: DragEvent<HTMLDivElement>, id: string) => {
      e.preventDefault()
      e.dataTransfer.dropEffect = 'move'
      if (draggedRef.current && draggedRef.current !== id) {
        setDragOverId(id)
      }
    },
    []
  )

  const onDragLeave = useCallback(() => {
    setDragOverId(null)
  }, [])

  const onDrop = useCallback(
    (e: DragEvent<HTMLDivElement>, targetId: string) => {
      e.preventDefault()
      setDragOverId(null)
      const sourceId = draggedRef.current
      if (!sourceId || sourceId === targetId) return

      setLayout((prev) => {
        const newOrder = [...prev.order]
        const srcIdx = newOrder.indexOf(sourceId)
        const tgtIdx = newOrder.indexOf(targetId)
        if (srcIdx === -1 || tgtIdx === -1) return prev
        newOrder.splice(srcIdx, 1)
        newOrder.splice(tgtIdx, 0, sourceId)
        return { ...prev, order: newOrder }
      })
    },
    []
  )

  // ── Build ordered widgets ─────────────────────────────────────────────────

  const widgetMap = new Map(widgets.map((w) => [w.id, w]))
  const orderedWidgets = layout.order
    .map((id) => widgetMap.get(id))
    .filter((w): w is WidgetConfig => !!w)

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className={className}>
      {/* Reset button — only visible when layout is customised */}
      {isCustomised && (
        <div className="mb-3 flex justify-end">
          <button
            onClick={resetLayout}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-text-muted transition-colors hover:bg-white hover:text-text-secondary"
          >
            <RotateCcw className="h-3 w-3" />
            Ripristina layout
          </button>
        </div>
      )}

      {/* Grid */}
      <div
        className={cn(
          'grid grid-cols-1 gap-6',
          cols === 2 && 'lg:grid-cols-2',
          cols === 3 && 'lg:grid-cols-3'
        )}
      >
        {orderedWidgets.map((widget) => {
          const isMinimized = layout.minimized.includes(widget.id)
          const colSpan = layout.colSpans[widget.id] ?? widget.defaultColSpan
          const isDragOver = dragOverId === widget.id
          const canShrink = colSpan > 1
          const canExpand = colSpan < cols

          return (
            <div
              key={widget.id}
              className={cn(
                'group/widget relative col-span-1',
                spanClass[colSpan] ?? 'lg:col-span-1',
                isDragging && isDragOver && 'rounded-2xl bg-primary-50/40 ring-2 ring-primary/30',
              )}
              onDragOver={(e) => onDragOver(e, widget.id)}
              onDragLeave={onDragLeave}
              onDrop={(e) => onDrop(e, widget.id)}
            >
              {/* ── Minimized bar ─────────────────────────────────────── */}
              {isMinimized && (
                <div className="flex items-center gap-2 rounded-2xl border border-gray-100 bg-white px-4 py-3">
                  {/* Drag handle */}
                  <div
                    draggable
                    onDragStart={(e) => onDragStart(e, widget.id)}
                    onDragEnd={onDragEnd}
                    className="cursor-grab text-text-muted/60 transition-colors hover:text-text-muted active:cursor-grabbing"
                  >
                    <GripVertical className="h-4 w-4" />
                  </div>
                  <span className="flex items-center gap-1.5 text-text-secondary">
                    {widget.icon}
                  </span>
                  <span className="text-sm font-semibold text-text-secondary">
                    {widget.title}
                  </span>

                  <div className="ml-auto flex items-center gap-0.5">
                    {/* Resize controls */}
                    {canShrink && (
                      <button
                        onClick={() => changeColSpan(widget.id, -1)}
                        className="rounded-lg p-1.5 text-text-muted/60 transition-colors hover:bg-gray-50 hover:text-text-secondary"
                        title="Riduci larghezza"
                      >
                        <Minimize2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                    {canExpand && (
                      <button
                        onClick={() => changeColSpan(widget.id, 1)}
                        className="rounded-lg p-1.5 text-text-muted/60 transition-colors hover:bg-gray-50 hover:text-text-secondary"
                        title="Aumenta larghezza"
                      >
                        <Maximize2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                    {/* Expand */}
                    <button
                      onClick={() => toggleMinimize(widget.id)}
                      className="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-gray-50 hover:text-text-secondary"
                      title="Espandi"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* ── Expanded state ────────────────────────────────────── */}
              <AnimatePresence initial={false}>
                {!isMinimized && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    style={{ overflow: 'hidden' }}
                  >
                    {/* Floating control strip — appears on hover */}
                    <div
                      className={cn(
                        'absolute -top-1 left-1/2 z-20 -translate-x-1/2 -translate-y-full',
                        'flex items-center gap-1 rounded-xl border border-gray-200/80 bg-white px-2 py-1 shadow-lg shadow-black/5',
                        'opacity-0 transition-all duration-200',
                        'group-hover/widget:opacity-100 group-hover/widget:translate-y-0',
                        'pointer-events-none group-hover/widget:pointer-events-auto'
                      )}
                    >
                      {/* Drag handle */}
                      <div
                        draggable
                        onDragStart={(e) => onDragStart(e, widget.id)}
                        onDragEnd={onDragEnd}
                        className="cursor-grab rounded-md p-1 text-text-muted/60 transition-colors hover:bg-gray-50 hover:text-text-muted active:cursor-grabbing"
                        title="Trascina per riordinare"
                      >
                        <GripVertical className="h-3.5 w-3.5" />
                      </div>

                      <div className="mx-0.5 h-4 w-px bg-gray-100" />

                      {/* Resize */}
                      {canShrink && (
                        <button
                          onClick={() => changeColSpan(widget.id, -1)}
                          className="rounded-md p-1 text-text-muted/60 transition-colors hover:bg-gray-50 hover:text-text-secondary"
                          title="Riduci larghezza"
                        >
                          <Minimize2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                      {canExpand && (
                        <button
                          onClick={() => changeColSpan(widget.id, 1)}
                          className="rounded-md p-1 text-text-muted/60 transition-colors hover:bg-gray-50 hover:text-text-secondary"
                          title="Aumenta larghezza"
                        >
                          <Maximize2 className="h-3.5 w-3.5" />
                        </button>
                      )}

                      {(canShrink || canExpand) && (
                        <div className="mx-0.5 h-4 w-px bg-gray-100" />
                      )}

                      {/* Minimize */}
                      <button
                        onClick={() => toggleMinimize(widget.id)}
                        className="rounded-md p-1 text-text-muted/60 transition-colors hover:bg-gray-50 hover:text-text-secondary"
                        title="Minimizza"
                      >
                        <ChevronUp className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {widget.content}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </div>
  )
}
