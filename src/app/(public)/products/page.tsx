import { getPublishedProducts, getAllCategories } from '@/lib/products'
import ProductCard from '@/components/public/ProductCard'
import Link from 'next/link'

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

      {/* Filtreler */}
      <div className="flex gap-3 flex-wrap mb-6">
        <Link
          href="/products"
          className={`px-4 py-2 rounded-full text-sm ${!category ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          Tümü
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/products?${new URLSearchParams({ ...(search ? { search } : {}), category: cat.slug })}`}
            className={`px-4 py-2 rounded-full text-sm ${category === cat.slug ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {/* Arama */}
      <form className="mb-6">
        {category && <input type="hidden" name="category" value={category} />}
        <input
          name="search"
          defaultValue={search}
          placeholder="Ürün ara..."
          className="w-full max-w-md border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </form>

      {/* Ürün Grid */}
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