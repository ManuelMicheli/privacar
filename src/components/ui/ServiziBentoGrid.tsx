"use client"

import React from "react"
import { cn } from "@/lib/utils/cn"

export interface BentoItem {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
}

const PlusIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    width={24}
    height={24}
    strokeWidth="1"
    stroke="currentColor"
    className={cn("size-6 text-primary/30", className)}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
  </svg>
)

const CornerPlusIcons = () => (
  <>
    <PlusIcon className="absolute -top-3 -left-3" />
    <PlusIcon className="absolute -top-3 -right-3" />
    <PlusIcon className="absolute -bottom-3 -left-3" />
    <PlusIcon className="absolute -bottom-3 -right-3" />
  </>
)

const BentoCard: React.FC<{
  className?: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
}> = ({ className = "", title, description, icon: Icon }) => {
  return (
    <div
      className={cn(
        "relative border border-dashed border-primary-200 rounded-2xl p-6 bg-white min-h-[200px]",
        "flex flex-col justify-between gap-4",
        "transition-shadow duration-300 hover:shadow-[0_8px_30px_rgba(6,95,70,.08)]",
        className
      )}
    >
      <CornerPlusIcons />

      <div className="relative z-10 space-y-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <h3 className="font-heading text-xl font-bold text-text-primary">
          {title}
        </h3>
        <p className="text-text-secondary leading-relaxed">{description}</p>
      </div>
    </div>
  )
}

/**
 * Layout presets per numero di items.
 * Ogni preset definisce le classi col/row-span per la griglia a 6 colonne.
 */
const layoutPresets: Record<number, string[]> = {
  4: [
    "lg:col-span-3 lg:row-span-2",
    "lg:col-span-3 lg:row-span-1",
    "lg:col-span-3 lg:row-span-1",
    "lg:col-span-3 lg:row-span-2",
  ],
  5: [
    "lg:col-span-3 lg:row-span-2",
    "lg:col-span-3 lg:row-span-2",
    "lg:col-span-4 lg:row-span-1",
    "lg:col-span-2 lg:row-span-1",
    "lg:col-span-2 lg:row-span-1",
  ],
  6: [
    "lg:col-span-4 lg:row-span-1",
    "lg:col-span-2 lg:row-span-1",
    "lg:col-span-2 lg:row-span-1",
    "lg:col-span-2 lg:row-span-1",
    "lg:col-span-2 lg:row-span-1",
    "lg:col-span-2 lg:row-span-1",
  ],
}

export default function ServiziBentoGrid({
  items,
  className,
}: {
  items: BentoItem[]
  className?: string
}) {
  const preset = layoutPresets[items.length]

  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 auto-rows-auto gap-5",
        className
      )}
    >
      {items.map((item, i) => (
        <BentoCard
          key={item.title}
          {...item}
          className={preset?.[i] ?? "lg:col-span-2"}
        />
      ))}
    </div>
  )
}
