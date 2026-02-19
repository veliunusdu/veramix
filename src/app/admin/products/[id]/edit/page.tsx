'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { updateProduct, deleteProduct, toggleProductStatus } from '@/lib/actions/product'

const categoryOptions = [
  { slug: 'elektronik', label: 'Elektronik' },
  { slug: 'giyim', label: 'Giyim' },
  { slug: 'kitap', label: 'Kitap' },
]

type Product = {
  id: string
  name: string
  slug: string
  description: string | null
  price: string
  stock: number
  status: string
  categories: { category: { slug: string } }[]
}

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [product, setProduct] = useState<Product | null>(null)
  const [error, setError] = useState('')
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
    setError('')
    setLoading(true)
    try {
      await updateProduct(id, new FormData(e.currentTarget))
    } catch (err: unknown) {
      if (err instanceof Error && !err.message.includes('NEXT_REDIRECT')) {
        setError(err.message)
        setLoading(false)
      }
    }
  }

  async function handleDelete() {
    if (!confirm('Bu ürünü silmek istediğinize emin misiniz?')) return
    await deleteProduct(id)
  }

  async function handleToggle() {
    if (!product) return
    await toggleProductStatus(id, product.status)
  }

  if (!product) return <div className="p-8 text-gray-500">Yükleniyor...</div>

  const currentCategorySlug = product.categories[0]?.category.slug ?? ''

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="text-gray-500 hover:text-gray-700">← Geri</button>
          <h1 className="text-2xl font-bold">Ürünü Düzenle</h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleToggle}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              product.status === 'PUBLISHED'
                ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            {product.status === 'PUBLISHED' ? 'Taslağa Al' : 'Yayına Al'}
          </button>
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
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Açıklama</label>
          <textarea
            name="description"
            defaultValue={product.description ?? ''}
            rows={3}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Kategori</label>
          <select
            name="categoryId"
            defaultValue={currentCategorySlug}
            required
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Seç...</option>
            {categoryOptions.map((cat) => (
              <option key={cat.slug} value={cat.slug}>{cat.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Durum</label>
          <select
            name="status"
            defaultValue={product.status}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="DRAFT">Taslak</option>
            <option value="PUBLISHED">Yayında</option>
          </select>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Kaydediliyor...' : 'Kaydet'}
        </button>
      </form>
    </div>
  )
}
