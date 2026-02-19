import { prisma } from '@/lib/prisma'

export default async function DashboardPage() {
  const [total, published, draft] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { status: 'PUBLISHED' } }),
    prisma.product.count({ where: { status: 'DRAFT' } }),
  ])

  const stats = [
    { label: 'Toplam Ürün', value: total, color: 'bg-blue-500' },
    { label: 'Yayında', value: published, color: 'bg-green-500' },
    { label: 'Taslak', value: draft, color: 'bg-yellow-500' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg shadow p-6 flex items-center gap-4">
            <div className={`${stat.color} w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl`}>
              {stat.value}
            </div>
            <span className="text-gray-600 font-medium">{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}