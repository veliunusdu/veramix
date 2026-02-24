'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { LayoutDashboard, Package, LogOut } from 'lucide-react'

const links = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Ürünler', icon: Package },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex w-64 flex-col border-r border-black/4 bg-white">
      <div className="flex h-16 shrink-0 items-center gap-3 px-6">
        <Image src="/logo.png" alt="Veramix" width={585} height={594} className="h-9 w-auto" />
        <p className="text-sm font-semibold tracking-tight text-zinc-900">Admin</p>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {links.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-zinc-900 text-white shadow-md shadow-zinc-900/10'
                  : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'
              }`}
            >
              <Icon
                className={`h-[18px] w-[18px] transition-colors ${
                  isActive ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-900'
                }`}
              />
              {link.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-black/4">
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-500 transition-all duration-200 hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-[18px] w-[18px] text-zinc-400 group-hover:text-red-500" />
          Çıkış Yap
        </button>
      </div>
    </aside>
  )
}
