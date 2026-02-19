'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toggleFeatured } from '@/lib/actions/product'

interface Props {
  id: string
  isFeatured: boolean
}

export default function FeaturedToggle({ id, isFeatured }: Props) {
  const router = useRouter()
  const [current, setCurrent] = useState(isFeatured)
  const [loading, setLoading] = useState(false)

  async function handle() {
    setLoading(true)
    const result = await toggleFeatured(id, current)
    if (result.ok) {
      setCurrent(!current)
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <button
      onClick={handle}
      disabled={loading}
      title={current ? 'Öne çıkandan kaldır' : 'Anasayfada öne çıkar'}
      className={`text-2xl leading-none transition-all ${loading ? 'opacity-40' : 'hover:scale-110'} ${
        current ? 'text-amber-400' : 'text-slate-300 hover:text-amber-400'
      }`}
    >
      ★
    </button>
  )
}
