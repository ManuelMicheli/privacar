'use client'

import { useState, useRef, useCallback, useTransition } from 'react'
import Image from 'next/image'
import {
  Upload,
  X,
  Star,
  ArrowUp,
  ArrowDown,
  Loader2,
  ImagePlus,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import {
  uploadVehicleImage,
  deleteVehicleImage,
  reorderImages,
} from '@/lib/actions/vehicle-actions'
import type { VehicleImage } from '@/types'
import toast from 'react-hot-toast'

// ─── Local image type for new uploads ───────────────────────────────────────

export interface LocalImage {
  id: string
  file: File
  previewUrl: string
  is_cover: boolean
  position: number
  uploading?: boolean
}

interface ImageUploaderProps {
  vehicleId?: string
  existingImages?: VehicleImage[]
  onImagesChange: (images: LocalImage[]) => void
  localImages: LocalImage[]
}

// ─── Client-side image compression ──────────────────────────────────────────

async function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new window.Image()
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    img.onload = () => {
      const maxWidth = 1920
      let { width, height } = img

      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width)
        width = maxWidth
      }

      canvas.width = width
      canvas.height = height

      if (!ctx) {
        reject(new Error('Canvas context not available'))
        return
      }

      ctx.drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error('Failed to compress image'))
          }
        },
        'image/jpeg',
        0.85
      )
    }

    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = URL.createObjectURL(file)
  })
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function fileToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      // Remove data:xxx;base64, prefix
      const base64 = result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

// ─── Component ──────────────────────────────────────────────────────────────

export function ImageUploader({
  vehicleId,
  existingImages = [],
  onImagesChange,
  localImages,
}: ImageUploaderProps) {
  const [dbImages, setDbImages] = useState<VehicleImage[]>(existingImages)
  const [isPending, startTransition] = useTransition()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)

  // ── Handle file selection ─────────────────────────────────────────────

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files).filter((f) =>
        f.type.startsWith('image/')
      )
      if (fileArray.length === 0) return

      const currentCount = dbImages.length + localImages.length
      const noCoverYet = currentCount === 0

      const newLocals: LocalImage[] = await Promise.all(
        fileArray.map(async (file, i) => {
          const previewUrl = URL.createObjectURL(file)
          return {
            id: `local-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 6)}`,
            file,
            previewUrl,
            is_cover: noCoverYet && i === 0,
            position: currentCount + i,
          }
        })
      )

      onImagesChange([...localImages, ...newLocals])

      // If vehicleId exists (edit mode), upload immediately
      if (vehicleId) {
        for (const local of newLocals) {
          startTransition(async () => {
            try {
              const compressed = await compressImage(local.file)
              const base64 = await fileToBase64(compressed)
              const result = await uploadVehicleImage(
                vehicleId,
                base64,
                local.file.name,
                'image/jpeg',
                local.position,
                local.is_cover
              )

              if (result.success && result.image) {
                setDbImages((prev) => [...prev, result.image as VehicleImage])
                onImagesChange(
                  localImages.filter((img) => img.id !== local.id)
                )
                toast.success('Immagine caricata')
              } else {
                toast.error(result.error ?? 'Errore nel caricamento')
              }
            } catch {
              toast.error('Errore nel caricamento dell\'immagine')
            }
          })
        }
      }
    },
    [vehicleId, dbImages.length, localImages, onImagesChange, startTransition]
  )

  // ── Drag & drop ───────────────────────────────────────────────────────

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(true)
  }

  // ── Delete DB image ───────────────────────────────────────────────────

  function handleDeleteDbImage(image: VehicleImage) {
    startTransition(async () => {
      const result = await deleteVehicleImage(image.id, image.url)
      if (result.success) {
        setDbImages((prev) => prev.filter((img) => img.id !== image.id))
        toast.success('Immagine eliminata')
      } else {
        toast.error(result.error ?? 'Errore')
      }
    })
  }

  // ── Delete local image ────────────────────────────────────────────────

  function handleDeleteLocal(id: string) {
    URL.revokeObjectURL(localImages.find((img) => img.id === id)?.previewUrl ?? '')
    onImagesChange(localImages.filter((img) => img.id !== id))
  }

  // ── Set cover (DB) ────────────────────────────────────────────────────

  function handleSetCoverDb(imageId: string) {
    setDbImages((prev) =>
      prev.map((img) => ({
        ...img,
        is_cover: img.id === imageId,
      }))
    )
    // Also unset cover on local images
    onImagesChange(localImages.map((img) => ({ ...img, is_cover: false })))
  }

  // ── Set cover (local) ─────────────────────────────────────────────────

  function handleSetCoverLocal(localId: string) {
    // Unset cover on DB images
    setDbImages((prev) => prev.map((img) => ({ ...img, is_cover: false })))
    onImagesChange(
      localImages.map((img) => ({
        ...img,
        is_cover: img.id === localId,
      }))
    )
  }

  // ── Reorder DB images ─────────────────────────────────────────────────

  function moveDbImage(index: number, direction: 'up' | 'down') {
    const newImages = [...dbImages]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= newImages.length) return

    ;[newImages[index], newImages[targetIndex]] = [
      newImages[targetIndex],
      newImages[index],
    ]

    setDbImages(newImages)

    if (vehicleId) {
      startTransition(async () => {
        await reorderImages(
          vehicleId,
          newImages.map((img) => img.id)
        )
      })
    }
  }

  // ── Reorder local images ──────────────────────────────────────────────

  function moveLocalImage(index: number, direction: 'up' | 'down') {
    const newImages = [...localImages]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= newImages.length) return

    ;[newImages[index], newImages[targetIndex]] = [
      newImages[targetIndex],
      newImages[index],
    ]

    onImagesChange(
      newImages.map((img, i) => ({ ...img, position: dbImages.length + i }))
    )
  }

  const allImagesCount = dbImages.length + localImages.length

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={() => setDragOver(false)}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 transition-colors',
          dragOver
            ? 'border-primary bg-primary/5'
            : 'border-border bg-gray-50 hover:border-primary-light hover:bg-gray-100'
        )}
      >
        <ImagePlus
          className={cn(
            'mb-3 h-10 w-10',
            dragOver ? 'text-primary' : 'text-text-muted'
          )}
        />
        <p className="text-sm font-medium text-text-primary">
          Trascina le immagini qui o{' '}
          <span className="text-primary underline">sfoglia</span>
        </p>
        <p className="mt-1 text-xs text-text-muted">
          JPG, PNG, WebP — max 10MB per file
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files) handleFiles(e.target.files)
          e.target.value = ''
        }}
      />

      {/* Image previews */}
      {allImagesCount > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {/* Existing DB images */}
          {dbImages.map((image, index) => (
            <div
              key={image.id}
              className={cn(
                'group relative aspect-[4/3] overflow-hidden rounded-xl border-2 bg-gray-100',
                image.is_cover ? 'border-amber-400' : 'border-border'
              )}
            >
              <Image
                src={image.url}
                alt={`Immagine ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
              />

              {/* Cover badge */}
              {image.is_cover && (
                <div className="absolute left-2 top-2 rounded-md bg-amber-400 px-2 py-0.5 text-xs font-bold text-white shadow">
                  Copertina
                </div>
              )}

              {/* Overlay controls */}
              <div className="absolute inset-0 flex items-center justify-center gap-1.5 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                {/* Set as cover */}
                {!image.is_cover && (
                  <button
                    type="button"
                    onClick={() => handleSetCoverDb(image.id)}
                    className="rounded-lg bg-white/90 p-1.5 text-amber-600 transition-colors hover:bg-white"
                    title="Imposta come copertina"
                  >
                    <Star className="h-4 w-4" />
                  </button>
                )}

                {/* Move up */}
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => moveDbImage(index, 'up')}
                    className="rounded-lg bg-white/90 p-1.5 text-text-secondary transition-colors hover:bg-white"
                    title="Sposta su"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                )}

                {/* Move down */}
                {index < dbImages.length - 1 && (
                  <button
                    type="button"
                    onClick={() => moveDbImage(index, 'down')}
                    className="rounded-lg bg-white/90 p-1.5 text-text-secondary transition-colors hover:bg-white"
                    title="Sposta giù"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                )}

                {/* Delete */}
                <button
                  type="button"
                  onClick={() => handleDeleteDbImage(image)}
                  disabled={isPending}
                  className="rounded-lg bg-white/90 p-1.5 text-red-600 transition-colors hover:bg-white"
                  title="Elimina"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Local (not yet uploaded) images */}
          {localImages.map((image, index) => (
            <div
              key={image.id}
              className={cn(
                'group relative aspect-[4/3] overflow-hidden rounded-xl border-2 bg-gray-100',
                image.is_cover ? 'border-amber-400' : 'border-border'
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.previewUrl}
                alt={`Nuova immagine ${index + 1}`}
                className="h-full w-full object-cover"
              />

              {/* Cover badge */}
              {image.is_cover && (
                <div className="absolute left-2 top-2 rounded-md bg-amber-400 px-2 py-0.5 text-xs font-bold text-white shadow">
                  Copertina
                </div>
              )}

              {/* Upload indicator */}
              {image.uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <Loader2 className="h-8 w-8 animate-spin text-white" />
                </div>
              )}

              {/* Overlay controls */}
              {!image.uploading && (
                <div className="absolute inset-0 flex items-center justify-center gap-1.5 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                  {/* Set as cover */}
                  {!image.is_cover && (
                    <button
                      type="button"
                      onClick={() => handleSetCoverLocal(image.id)}
                      className="rounded-lg bg-white/90 p-1.5 text-amber-600 transition-colors hover:bg-white"
                      title="Imposta come copertina"
                    >
                      <Star className="h-4 w-4" />
                    </button>
                  )}

                  {/* Move up */}
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => moveLocalImage(index, 'up')}
                      className="rounded-lg bg-white/90 p-1.5 text-text-secondary transition-colors hover:bg-white"
                      title="Sposta su"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                  )}

                  {/* Move down */}
                  {index < localImages.length - 1 && (
                    <button
                      type="button"
                      onClick={() => moveLocalImage(index, 'down')}
                      className="rounded-lg bg-white/90 p-1.5 text-text-secondary transition-colors hover:bg-white"
                      title="Sposta giù"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </button>
                  )}

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => handleDeleteLocal(image.id)}
                    className="rounded-lg bg-white/90 p-1.5 text-red-600 transition-colors hover:bg-white"
                    title="Elimina"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {isPending && (
        <div className="flex items-center gap-2 text-sm text-text-muted">
          <Loader2 className="h-4 w-4 animate-spin" />
          Elaborazione in corso...
        </div>
      )}
    </div>
  )
}
