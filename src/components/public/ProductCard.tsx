import Link from 'next/link'

type Product = {
  id: string
  name: string
  slug: string
  price: number | { toNumber: () => number }
  stock: number
  images: { url: string }[]
  categories: { category: { name: string } }[]
}

export default function ProductCard({ product }: { product: Product }) {
  const price = typeof product.price === 'number'
    ? product.price
    : product.price.toNumber()

  return (
    <Link href={`/products/${product.slug}`}>
      <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-4 cursor-pointer">
        <div className="w-full h-48 bg-gray-100 rounded-md mb-3 flex items-center justify-center">
          {product.images[0] ? (
            <img src={product.images[0].url} alt={product.name} className="h-full w-full object-cover rounded-md" />
          ) : (
            <span className="text-gray-400 text-sm">Görsel yok</span>
          )}
        </div>
        <div className="space-y-1">
          <p className="text-xs text-gray-400">
            {product.categories[0]?.category.name}
          </p>
          <h3 className="font-semibold text-gray-800">{product.name}</h3>
          <div className="flex justify-between items-center">
            <span className="text-blue-600 font-bold">
              {price.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
            </span>
            <span className={`text-xs px-2 py-1 rounded-full ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {product.stock > 0 ? 'Stokta' : 'Tükendi'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}