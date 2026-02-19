'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useTransition } from 'react'

export default function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const search = (form.elements.namedItem('search') as HTMLInputElement).value
    const category = searchParams.get('category')

    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (category) params.set('category', category)

    startTransition(() => {
      router.push(`/products?${params.toString()}`)
    })
  }

  return (
    <form onSubmit={handleSearch} className="mb-6">
      <input
        name="search"
        defaultValue={searchParams.get('search') ?? ''}
        placeholder="Ürün ara..."
        className={`w-full max-w-md border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isPending ? 'opacity-50' : ''}`}
      />
    </form>
  )
}