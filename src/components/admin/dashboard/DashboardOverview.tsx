import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Package, FileText, AlertCircle, TrendingDown, Plus, ExternalLink, ArrowRight } from 'lucide-react'

type PriceLike = number | string | { toNumber: () => number }

function toNumber(value: PriceLike) {
  if (typeof value === 'number') return value
  if (typeof value === 'string') {
    const parsed = Number(value)
    return Number.isNaN(parsed) ? 0 : parsed
  }
  return value.toNumber()
}

function asCurrency(value: PriceLike) {
  return toNumber(value).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })
}

function pct(value: number) {
  return `${Math.round(value)}%`
}

export default async function DashboardOverview() {
  const [totalProducts, publishedProducts, draftProducts, outOfStockProducts, lowStockProducts, recentProducts, categories] =
    await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { status: 'PUBLISHED' } }),
      prisma.product.count({ where: { status: 'DRAFT' } }),
      prisma.product.count({ where: { stock: 0 } }),
      prisma.product.count({ where: { stock: { gt: 0, lte: 5 } } }),
      prisma.product.findMany({
        take: 6,
        orderBy: { createdAt: 'desc' },
        include: {
          images: { orderBy: [{ isPrimary: 'desc' }, { id: 'asc' }], take: 1 },
          categories: { include: { category: true } },
        },
      }),
      prisma.category.findMany({
        select: {
          id: true,
          name: true,
          _count: { select: { products: true } },
        },
      }),
    ])

  const publishRate = totalProducts > 0 ? (publishedProducts / totalProducts) * 100 : 0
  const draftRate = totalProducts > 0 ? (draftProducts / totalProducts) * 100 : 0
  const stockRiskRate = totalProducts > 0 ? ((outOfStockProducts + lowStockProducts) / totalProducts) * 100 : 0

  const topCategories = [...categories]
    .sort((a, b) => b._count.products - a._count.products)
    .slice(0, 4)

  const stats = [
    {
      title: 'Toplam Ürün',
      value: totalProducts,
      desc: `${publishedProducts} yayında`,
      icon: Package,
      color: 'text-zinc-900',
    },
    {
      title: 'Taslak',
      value: draftProducts,
      desc: pct(draftRate),
      icon: FileText,
      color: 'text-zinc-600',
    },
    {
      title: 'Tükenen Stok',
      value: outOfStockProducts,
      desc: 'Yenileme gerekiyor',
      icon: AlertCircle,
      color: 'text-red-600',
    },
    {
      title: 'Az Stok',
      value: lowStockProducts,
      desc: '5 adet ve altı',
      icon: TrendingDown,
      color: 'text-orange-600',
    },
  ]

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Dashboard</h1>
          <p className="mt-1 text-sm text-zinc-500">Katalog ve stok durumuna genel bakış</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/products"
            target="_blank"
            className="group flex h-10 items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-medium text-zinc-700 shadow-sm ring-1 ring-inset ring-black/5 transition-all hover:bg-zinc-50 hover:text-zinc-900"
          >
            <ExternalLink className="h-4 w-4 text-zinc-400 group-hover:text-zinc-600" />
            Vitrin
          </Link>
          <Link
            href="/admin/products/new"
            className="flex h-10 items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 text-sm font-medium text-white shadow-sm shadow-zinc-900/20 transition-all hover:bg-zinc-800 hover:shadow-md hover:shadow-zinc-900/20"
          >
            <Plus className="h-4 w-4" />
            Yeni Ürün
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon
          return (
            <div 
              key={item.title} 
              className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-zinc-500">{item.title}</p>
                <Icon className={`h-5 w-5 ${item.color} opacity-80`} />
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <p className="text-3xl font-bold tracking-tight text-zinc-900">{item.value}</p>
              </div>
              <p className="mt-1 text-sm text-zinc-500">{item.desc}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Products */}
        <div className="lg:col-span-2 flex flex-col rounded-2xl bg-white shadow-sm ring-1 ring-black/5 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-black/5">
            <h2 className="text-base font-semibold text-zinc-900">Son Eklenen Ürünler</h2>
            <Link 
              href="/admin/products" 
              className="group flex items-center gap-1 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900"
            >
              Tümünü gör
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
          <div className="flex-1 divide-y divide-black/5">
            {recentProducts.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center p-8 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-50">
                  <Package className="h-6 w-6 text-zinc-400" />
                </div>
                <p className="mt-4 text-sm font-medium text-zinc-900">Ürün bulunmuyor</p>
                <p className="mt-1 text-sm text-zinc-500">Henüz hiç ürün eklemediniz.</p>
              </div>
            ) : (
              recentProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/admin/products/${product.id}/edit`}
                  className="group flex items-center gap-4 px-6 py-4 transition-colors hover:bg-zinc-50/80"
                >
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-zinc-100 ring-1 ring-inset ring-black/5">
                    {product.images[0]?.url ? (
                      <img
                        src={product.images[0].url}
                        alt={product.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Package className="h-5 w-5 text-zinc-300" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-zinc-900">{product.name}</p>
                    <p className="mt-0.5 truncate text-xs text-zinc-500">
                      {product.categories[0]?.category.name ?? 'Kategori yok'}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-right">
                    <div className="hidden sm:block">
                      <p className="text-sm font-semibold text-zinc-900">{asCurrency(product.price as PriceLike)}</p>
                    </div>
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                        product.status === 'PUBLISHED'
                          ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/10'
                          : 'bg-zinc-50 text-zinc-600 ring-zinc-500/10'
                      }`}
                    >
                      {product.status === 'PUBLISHED' ? 'Yayında' : 'Taslak'}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Sidebar panels */}
        <div className="flex flex-col gap-6">
          {/* Catalog Health */}
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
            <h3 className="text-base font-semibold text-zinc-900">Katalog Sağlığı</h3>
            <div className="mt-6 space-y-5">
              {[
                { label: 'Yayında', value: publishRate, bg: 'bg-emerald-500' },
                { label: 'Taslak', value: draftRate, bg: 'bg-zinc-400' },
                { label: 'Stok Riski', value: stockRiskRate, bg: 'bg-red-500' },
              ].map((item) => (
                <div key={item.label}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-zinc-600">{item.label}</span>
                    <span className="text-sm font-semibold text-zinc-900">{pct(item.value)}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-zinc-100">
                    <div 
                      className={`h-full rounded-full ${item.bg} transition-all duration-500`} 
                      style={{ width: `${Math.max(0, Math.min(item.value, 100))}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
            <h3 className="text-base font-semibold text-zinc-900">Popüler Kategoriler</h3>
            <div className="mt-6 space-y-4">
              {topCategories.length === 0 ? (
                <p className="text-sm text-zinc-500">Kategori bulunamadı.</p>
              ) : (
                topCategories.map((category) => (
                  <div key={category.id} className="group flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-zinc-300 transition-colors group-hover:bg-zinc-900" />
                      <span className="text-sm font-medium text-zinc-600 transition-colors group-hover:text-zinc-900">
                        {category.name}
                      </span>
                    </div>
                    <span className="inline-flex min-w-8 items-center justify-center rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-700">
                      {category._count.products}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
