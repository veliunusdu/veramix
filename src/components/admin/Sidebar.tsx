'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'

const links = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/products', label: 'Ürünler' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-72 border-r border-white/10 bg-slate-950/70 text-white backdrop-blur">
      <div className="flex min-h-screen flex-col">
        <div className="p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Veramix</p>
          <h1 className="mt-2 text-xl font-black tracking-tight">Admin Studio</h1>
          <p className="mt-1 text-xs text-slate-400">Catalog + Operations</p>
        </div>
        <nav className="flex-1 space-y-2 px-4 py-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                pathname === link.href
                  ? 'bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-lg shadow-sky-900/30'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-white/10 p-4">
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
          >
            Çıkış Yap
          </button>
        </div>
      </div>
    </aside>
  )
}
