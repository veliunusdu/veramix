'use client'

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16 text-center">
      <h2 className="text-2xl font-bold text-red-500 mb-4">Bir hata oluştu</h2>
      <p className="text-gray-600 mb-6">Ürünler yüklenirken bir sorun çıktı.</p>
      <button
        onClick={reset}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
      >
        Tekrar Dene
      </button>
    </div>
  )
}