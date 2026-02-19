import Link from 'next/link'
import { prisma } from '@/lib/prisma'

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

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-sky-600/25 via-indigo-500/10 to-slate-900/40 p-6 shadow-2xl shadow-slate-900/20 backdrop-blur sm:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-sky-300/30 bg-sky-400/10 px-3 py-1 text-xs font-semibold text-sky-100">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              Operasyon Merkezi
            </p>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">Yönetim Paneli</h1>
            <p className="mt-3 text-sm leading-6 text-slate-200 sm:text-base">
              Ürün performansını, stok riskini ve yayın durumunu tek ekran üzerinden takip edin. Hızlı aksiyonlar ile
              içerik ve katalog güncellemelerini anında yönetin.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/admin/products/new"
              className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:bg-slate-100"
            >
              + Yeni Ürün
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-xl border border-white/40 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/10"
            >
              Vitrini Gör
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: 'Toplam Ürün',
            value: totalProducts,
            detail: `${publishedProducts} yayında`,
            tone: 'from-sky-500/25 to-slate-900/30',
          },
          {
            label: 'Taslak Ürün',
            value: draftProducts,
            detail: pct(draftRate),
            tone: 'from-amber-500/25 to-slate-900/30',
          },
          {
            label: 'Tükenen Ürün',
            value: outOfStockProducts,
            detail: 'Acil yenileme önerilir',
            tone: 'from-rose-500/25 to-slate-900/30',
          },
          {
            label: 'Az Stok',
            value: lowStockProducts,
            detail: '5 adet ve altı',
            tone: 'from-violet-500/25 to-slate-900/30',
          },
        ].map((item) => (
          <article
            key={item.label}
            className={`rounded-2xl border border-white/10 bg-gradient-to-br ${item.tone} p-5 text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5`}
          >
            <p className="text-xs font-medium uppercase tracking-wide text-slate-200/80">{item.label}</p>
            <p className="mt-3 text-3xl font-extrabold">{item.value}</p>
            <p className="mt-2 text-sm text-slate-200">{item.detail}</p>
          </article>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr_1fr]">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Yeni Eklenen Ürünler</h2>
            <Link href="/admin/products" className="text-sm font-semibold text-blue-700 hover:text-blue-800">
              Tüm ürünler
            </Link>
          </div>

          <div className="space-y-3">
            {recentProducts.length === 0 ? (
              <p className="rounded-xl bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                Henüz ürün bulunmuyor.
              </p>
            ) : (
              recentProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/admin/products/${product.id}/edit`}
                  className="group flex items-center gap-3 rounded-xl border border-slate-100 p-3 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <div className="h-14 w-14 overflow-hidden rounded-lg bg-slate-100">
                    {product.images[0]?.url ? (
                      <img
                        src={product.images[0].url}
                        alt={product.name}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[10px] font-medium text-slate-500">
                        Görsel
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-slate-900">{product.name}</p>
                    <p className="truncate text-xs text-slate-500">
                      {product.categories[0]?.category.name ?? 'Kategori yok'}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900">{asCurrency(product.price as PriceLike)}</p>
                    <p
                      className={`text-xs font-medium ${
                        product.status === 'PUBLISHED' ? 'text-emerald-600' : 'text-amber-600'
                      }`}
                    >
                      {product.status === 'PUBLISHED' ? 'Yayında' : 'Taslak'}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </article>

        <article className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-base font-bold text-slate-900">Katalog Sağlığı</h3>
            <div className="mt-4 space-y-4">
              {[
                { label: 'Yayında', value: publishRate, color: 'bg-emerald-500' },
                { label: 'Taslak', value: draftRate, color: 'bg-amber-500' },
                { label: 'Stok Riski', value: stockRiskRate, color: 'bg-rose-500' },
              ].map((item) => (
                <div key={item.label}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">{item.label}</span>
                    <span className="font-semibold text-slate-900">{pct(item.value)}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className={`h-full ${item.color}`} style={{ width: `${Math.min(item.value, 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-base font-bold text-slate-900">Kategori Dağılımı</h3>
            <div className="mt-4 space-y-3">
              {topCategories.length === 0 ? (
                <p className="text-sm text-slate-500">Kategori verisi bulunmuyor.</p>
              ) : (
                topCategories.map((category) => (
                  <div key={category.id} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                    <span className="text-sm font-medium text-slate-700">{category.name}</span>
                    <span className="rounded-full bg-slate-900 px-2.5 py-0.5 text-xs font-semibold text-white">
                      {category._count.products}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </article>
      </section>
    </div>
  )
}
