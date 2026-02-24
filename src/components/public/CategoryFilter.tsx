'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

type Category = { id: string; name: string; slug: string }

export default function CategoryFilter({ categories }: { categories: Category[] }) {
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get('category')
  const currentSearch = searchParams.get('search')

  function buildHref(slug?: string) {
    const params = new URLSearchParams()
    if (currentSearch) params.set('search', currentSearch)
    if (slug) params.set('category', slug)
    return `/products?${params.toString()}`
  }

  return (
    <div className="flex gap-3 flex-wrap mb-6">
      <Link
        href={buildHref()}
        className={`px-4 py-2 rounded-full text-sm ${!currentCategory ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
      >
        Tümü
      </Link>
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={buildHref(cat.slug)}
          className={`px-4 py-2 rounded-full text-sm ${currentCategory === cat.slug ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          <div className="inline-flex items-center gap-2">
            {cat.slug === 'aksesuarlar' ? (
              <span className="material-icons text-sm">towel</span>
            ) : null}
            <span>{cat.name}</span>
          </div>
        </Link>
      ))}
    </div>
  )
}