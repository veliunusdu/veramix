import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl mb-6">🔍</div>
        <h1 className="text-5xl font-extrabold text-gray-800 mb-3">Sayfa Bulunamadı</h1>
        <p className="text-gray-500 mb-8">Aradığınız sayfa taşınmış, silinmiş veya hiç var olmamış olabilir.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-full hover:bg-blue-700 transition-colors"
          >
            Ana Sayfaya Dön
          </Link>
          <Link
            href="/products"
            className="border border-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-full hover:bg-gray-100 transition-colors"
          >
            Ürünleri İncele
          </Link>
        </div>
      </div>
    </div>
  )
}