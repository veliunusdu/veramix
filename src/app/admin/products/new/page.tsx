'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createProduct, type ProductFieldErrors } from '@/lib/actions/product'

export default function NewProductPage() {
  const router = useRouter()
  const [formError, setFormError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<ProductFieldErrors>({})
  const [loading, setLoading] = useState(false)

  function generateSlug(name: string) {
    return name
      .toLowerCase()
      .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
      .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFormError('')
    setFieldErrors({})
    setLoading(true)

    const result = await createProduct(new FormData(e.currentTarget))
    if (!result.ok) {
      setFieldErrors(result.fieldErrors)
      setFormError(result.formError)
      setLoading(false)
      return
    }

    if (!result.productId) {
      setFormError('Ürün oluşturuldu fakat yönlendirme bilgisi alınamadı.')
      setLoading(false)
      return
    }

    router.push(`/admin/products/${result.productId}/edit`)
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => router.back()} className="text-gray-500 hover:text-gray-700">← Geri</button>
        <h1 className="text-2xl font-bold">Yeni Ürün</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Ürün Adı</label>
          <input
            name="name"
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
            required
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
          />
          {fieldErrors.slug && <p className="text-red-500 text-xs mt-1">{fieldErrors.slug}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Açıklama</label>
          <textarea
            name="description"
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
              defaultValue="0"
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
          {loading ? 'Kaydediliyor...' : 'Ürün Ekle'}
        </button>
      </form>
    </div>
  )
}
