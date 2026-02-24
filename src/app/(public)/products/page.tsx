import { Suspense } from 'react'
import Link from 'next/link'
import { getProducts } from '@/lib/products'
import ProductCard from '@/components/public/ProductCard'
import SearchBar from '@/components/public/SearchBar'

type Props = {
  searchParams: Promise<{ search?: string }>
}

export default async function ProductsPage({ searchParams }: Props) {
  const { search } = await searchParams

  const products = await getProducts({ search })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Ürünlerimiz</h1>
        <p className="text-gray-500 mt-1 text-sm">Tüm ürünleri inceleyin, filtreleyin ve detaylarını görüntüleyin.</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-8">
        <Suspense>
          <SearchBar />
        </Suspense>
      </div>

      {/* Grid */}
      {products.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Ürün bulunamadı</h2>
          <p className="text-gray-400 mb-6">Farklı bir arama veya filtre deneyin.</p>
          <Link href="/products" className="inline-block bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors">Filtreleri Temizle</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
