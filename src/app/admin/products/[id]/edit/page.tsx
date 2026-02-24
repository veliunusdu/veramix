'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import {
  updateProduct,
  deleteProduct,
  type ProductFieldErrors,
} from '@/lib/actions/product'
import ImageUploader from '@/components/admin/ImageUploader'
import FeaturedToggle from '@/components/admin/FeaturedToggle'

type ImageRecord = {
  id: string
  url: string
  isPrimary: boolean
  storagePath: string
}

type Product = {
  id: string
  name: string
  slug: string
  description: string | null
  price: string
  stock: number
  isFeatured: boolean
  images: ImageRecord[]
}

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [product, setProduct] = useState<Product | null>(null)
  const [formError, setFormError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<ProductFieldErrors>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch(`/api/admin/products/${id}`)
      .then((r) => r.json())
      .then(setProduct)
  }, [id])

  function generateSlug(name: string) {
    return name
      .toLowerCase()
      .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
      .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFormError('')
    setFieldErrors({})
    setLoading(true)

    const result = await updateProduct(id, new FormData(e.currentTarget))
    if (!result.ok) {
      setFormError(result.formError)
      setFieldErrors(result.fieldErrors)
      setLoading(false)
      return
    }

    router.push('/admin/products')
  }

  async function handleDelete() {
    if (!confirm('Bu ürünü silmek istediğinize emin misiniz?')) return

    setFormError('')
    const result = await deleteProduct(id)
    if (!result.ok) {
      setFormError(result.formError)
      return
    }

    router.push('/admin/products')
  }

  if (!product) return <div className="p-8 text-gray-500">Yükleniyor...</div>

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="text-gray-500 hover:text-gray-700">← Geri</button>
          <h1 className="text-2xl font-bold">Ürünü Düzenle</h1>
        </div>
        <div className="flex gap-2">
          <FeaturedToggle id={id} isFeatured={product.isFeatured} />
          <button
            onClick={handleDelete}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200"
          >
            Sil
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Ürün Adı</label>
          <input
            name="name"
            defaultValue={product.name}
            required
            onChange={(e) => {
              const slug = document.getElementById('slug') as HTMLInputElement
              if (slug) slug.value = generateSlug(e.target.value)
            }}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {fieldErrors.name && <p className="text-red-500 text-xs mt-1">{fieldErrors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Slug</label>
          <input
            id="slug"
            name="slug"
            defaultValue={product.slug}
            required
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
          />
          {fieldErrors.slug && <p className="text-red-500 text-xs mt-1">{fieldErrors.slug}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Açıklama</label>
          <textarea
            name="description"
            defaultValue={product.description ?? ''}
            rows={3}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {fieldErrors.description && <p className="text-red-500 text-xs mt-1">{fieldErrors.description}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Fiyat (₺)</label>
            <input
              name="price"
              type="number"
              step="0.01"
              min="0"
              defaultValue={product.price}
              required
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {fieldErrors.price && <p className="text-red-500 text-xs mt-1">{fieldErrors.price}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Stok</label>
            <input
              name="stock"
              type="number"
              min="0"
              defaultValue={product.stock}
              required
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {fieldErrors.stock && <p className="text-red-500 text-xs mt-1">{fieldErrors.stock}</p>}
          </div>
        </div>

        {formError && <p className="text-red-500 text-sm">{formError}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Kaydediliyor...' : 'Kaydet'}
        </button>
      </form>

      {/* Image management — separate from form submit */}
      <div className="bg-white rounded-lg shadow p-6 mt-6">
        <ImageUploader productId={id} initialImages={product.images} />
      </div>
    </div>
  )
}
