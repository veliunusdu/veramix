import { getProductBySlug } from '@/lib/products'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return { title: 'Ürün Bulunamadı' }
  return {
    title: `${product.name} | Veramix`,
    description: product.description ?? undefined,
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) notFound()

  const price = typeof product.price === 'number'
    ? product.price
    : (product.price as { toNumber: () => number }).toNumber()

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Görsel */}
        <div className="bg-gray-100 rounded-lg h-80 flex items-center justify-center">
          {product.images[0] ? (
            <img
              src={product.images[0].url}
              alt={product.name}
              className="h-full w-full object-cover rounded-lg"
            />
          ) : (
            <span className="text-gray-400">Görsel yok</span>
          )}
        </div>

        {/* Bilgiler */}
        <div className="space-y-4">
          <p className="text-sm text-gray-400">
            {product.categories.map((c) => c.category.name).join(', ')}
          </p>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-2xl text-blue-600 font-bold">
            {price.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
          </p>
          <span className={`inline-block px-3 py-1 rounded-full text-sm ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {product.stock > 0 ? `Stokta (${product.stock} adet)` : 'Tükendi'}
          </span>
          {product.description && (
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          )}
        </div>
      </div>
    </div>
  )
}