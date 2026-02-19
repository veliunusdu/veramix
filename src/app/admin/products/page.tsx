import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import FeaturedToggle from '@/components/admin/FeaturedToggle'

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      categories: { include: { category: true } },
    },
    orderBy: { createdAt: 'desc' },
  })


  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Ürünler</h1>
        <Link
          href="/admin/products/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
        >
          + Yeni Ürün
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-6 py-3 font-medium text-gray-500">Ürün</th>
              <th className="text-left px-6 py-3 font-medium text-gray-500">Kategori</th>
              <th className="text-left px-6 py-3 font-medium text-gray-500">Fiyat</th>
              <th className="text-left px-6 py-3 font-medium text-gray-500">Stok</th>
              <th className="text-left px-6 py-3 font-medium text-gray-500">Durum</th>
              <th className="text-center px-6 py-3 font-medium text-gray-500" title="Anasayfa öne çıkan">★ Öne Çıkan</th>
              <th className="text-left px-6 py-3 font-medium text-gray-500">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product) => {
              const price = (product.price as { toNumber: () => number }).toNumber()
              return (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{product.name}</td>
                  <td className="px-6 py-4 text-gray-500">
                    {product.categories.map((c) => c.category.name).join(', ') || '—'}
                  </td>
                  <td className="px-6 py-4">
                    {price.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                  </td>
                  <td className="px-6 py-4">{product.stock}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      product.status === 'PUBLISHED'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {product.status === 'PUBLISHED' ? 'Yayında' : 'Taslak'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <FeaturedToggle id={product.id} isFeatured={product.isFeatured} />
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="text-blue-600 hover:underline"
                    >
                      Düzenle
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}