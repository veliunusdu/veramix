import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">Veramix</h1>
      <p className="text-gray-600 mb-8">Kaliteli ürünleri keşfet</p>
      <Link
        href="/products"
        className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700"
      >
        Ürünlere Göz At
      </Link>
    </div>
  )
}