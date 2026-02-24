import { getProductBySlug } from '@/lib/products'
import { Metadata } from 'next'
import Link from 'next/link'
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-400 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-blue-600 transition-colors">Ana Sayfa</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-blue-600 transition-colors">Ürünler</Link>
        <span>/</span>
        <span className="text-gray-600 font-medium">{product.name}</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image */}
          <div className="bg-gray-50 flex items-center justify-center min-h-72 md:min-h-96">
            {product.images[0] ? (
              <img
                src={product.images[0].url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center text-gray-300">
                <div className="text-6xl mb-2">🖼️</div>
                <p className="text-sm">Görsel yok</p>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-8 flex flex-col justify-center space-y-5">
            {product.categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.categories.map((c) => (
                  <span key={c.category.name} className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                    {c.category.name}
                  </span>
                ))}
              </div>
            )}
            <h1 className="text-3xl font-extrabold text-gray-900">{product.name}</h1>
            <p className="text-3xl font-bold text-blue-600">
              {price.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
            </p>
            <span className={`inline-flex items-center gap-1.5 w-fit px-4 py-1.5 rounded-full text-sm font-semibold ${
              product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              <span className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
              {product.stock > 0 ? `Stokta (${product.stock} adet)` : 'Tükendi'}
            </span>
            {product.description && (
              <p className="text-gray-600 leading-relaxed border-t pt-4">{product.description}</p>
            )}
            <div className="flex flex-col gap-3 pt-2">
              <a
                href="https://wa.me/905425129747?text=Merhaba%2C%20bu%20ürün%20hakkında%20bilgi%20almak%20istiyorum."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-green-500 text-white font-semibold px-6 py-3 rounded-full hover:bg-green-600 transition-colors"
              >
                💬 WhatsApp ile Sipariş Ver
              </a>
              <a
                href="tel:05425129747"
                className="flex items-center justify-center gap-2 border border-gray-200 text-gray-700 font-semibold px-6 py-3 rounded-full hover:bg-gray-50 transition-colors"
              >
                📞 Ara: 0542 512 9747
              </a>
            </div>
          </div>
        </div>

        {/* Image gallery */}
        {product.images.length > 1 && (
          <div className="border-t p-6">
            <p className="text-sm font-semibold text-gray-500 mb-4">Diğer Görseller</p>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, i) => (
                <img
                  key={img.id}
                  src={img.url}
                  alt={`${product.name} görsel ${i + 1}`}
                  className="w-20 h-20 object-cover rounded-lg border border-gray-200 shrink-0"
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Back */}
      <div className="mt-8">
        <Link href="/products" className="text-sm text-blue-600 hover:underline">← Ürün listesine dön</Link>
      </div>
    </div>
  )
}
