'use client'

import { useRef, useState } from 'react'
import { setImageAsPrimary, deleteImage } from '@/lib/actions/image'

type ImageRecord = {
  id: string
  url: string
  isPrimary: boolean
  storagePath: string
}

type Props = {
  productId: string
  initialImages: ImageRecord[]
}

export default function ImageUploader({ productId, initialImages }: Props) {
  const [images, setImages] = useState<ImageRecord[]>(initialImages)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function uploadFile(file: File) {
    setError('')
    setUploading(true)

    const form = new FormData()
    form.append('file', file)
    form.append('productId', productId)

    const res = await fetch('/api/upload', { method: 'POST', body: form })
    const data = await res.json()

    if (!res.ok) {
      setError(data.error ?? 'Yükleme başarısız')
    } else {
      setImages((prev) => [...prev, data])
    }

    setUploading(false)
  }

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return
    for (const file of Array.from(files)) {
      await uploadFile(file)
    }
  }

  async function handleSetPrimary(imageId: string) {
    await setImageAsPrimary(imageId, productId)
    setImages((prev) =>
      prev.map((img) => ({ ...img, isPrimary: img.id === imageId }))
    )
  }

  async function handleDelete(image: ImageRecord) {
    if (!confirm('Bu görseli silmek istediğinize emin misiniz?')) return
    await deleteImage(image.id, productId)
    const remaining = images.filter((img) => img.id !== image.id)
    // Re-apply primary flag if needed
    if (image.isPrimary && remaining.length > 0) {
      remaining[0] = { ...remaining[0], isPrimary: true }
    }
    setImages(remaining)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-medium">Görseller</h2>

      {/* Existing images */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {images.map((img) => (
            <div key={img.id} className="relative group rounded-lg overflow-hidden border border-gray-200">
              <img src={img.url} alt="" className="w-full h-28 object-cover" />

              {/* Primary badge */}
              {img.isPrimary && (
                <span className="absolute top-1 left-1 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                  Ana
                </span>
              )}

              {/* Hover actions */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-2 gap-1">
                {!img.isPrimary && (
                  <button
                    type="button"
                    onClick={() => handleSetPrimary(img.id)}
                    className="flex-1 bg-white text-gray-800 text-xs py-1 rounded hover:bg-gray-100"
                  >
                    Ana yap
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleDelete(img)}
                  className="flex-1 bg-red-500 text-white text-xs py-1 rounded hover:bg-red-600"
                >
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files) }}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
        } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div className="text-gray-500 text-sm">
          {uploading ? (
            <span>Yükleniyor...</span>
          ) : (
            <>
              <span className="font-medium text-blue-600">Dosya seç</span>
              {' '}veya buraya sürükle
              <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP · Maks 5 MB</p>
            </>
          )}
        </div>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  )
}
