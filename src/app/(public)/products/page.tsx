import { Suspense } from 'react'
import { getPublishedProducts, getAllCategories } from '@/lib/products'
import ProductCard from '@/components/public/ProductCard'
import SearchBar from '@/components/public/SearchBar'
import CategoryFilter from '@/components/public/CategoryFilter'

type Props = {
  searchParams: Promise<{ search?: string; category?: string }>
}

export default async function ProductsPage({ searchParams }: Props) {
  const { search, category } = await searchParams

  const [products, categories] = await Promise.all([
    getPublishedProducts({ search, categorySlug: category }),
    getAllCategories(),
  ])

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Ürünler</h1>
      <Suspense>
        <CategoryFilter categories={categories} />
        <SearchBar />
      </Suspense>
      {products.length === 0 ? (
        <p className="text-gray-500 text-center py-16">Ürün bulunamadı.</p>
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