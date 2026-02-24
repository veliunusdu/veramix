'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/main_logo.png" alt="Veramix" width={864} height={1184} className="h-14 w-auto" priority />
          <span className="text-xl font-bold text-slate-900 tracking-tight">Veramix</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
          <Link href="/products" className="hover:text-blue-600 transition-colors">Ürünler</Link>
          <Link href="/#about" className="hover:text-blue-600 transition-colors">Hakkımızda</Link>
          <Link href="/#contact" className="hover:text-blue-600 transition-colors">İletişim</Link>
          <a
            href="https://wa.me/905425129747?text=Merhaba%20Veramix%2C%20bilgi%20almak%20istiyorum."
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 text-white px-4 py-1.5 rounded-full hover:bg-green-600 transition-colors"
          >
            WhatsApp
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-gray-600 hover:text-blue-600"
          onClick={() => setOpen(!open)}
          aria-label="Menüyü aç"
        >
          <span className="block w-5 h-0.5 bg-current mb-1" />
          <span className="block w-5 h-0.5 bg-current mb-1" />
          <span className="block w-5 h-0.5 bg-current" />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pb-4 space-y-2 text-sm font-medium text-gray-700">
          <Link href="/products" className="block py-2 hover:text-blue-600" onClick={() => setOpen(false)}>Ürünler</Link>
          <Link href="/#about" className="block py-2 hover:text-blue-600" onClick={() => setOpen(false)}>Hakkımızda</Link>
          <Link href="/#contact" className="block py-2 hover:text-blue-600" onClick={() => setOpen(false)}>İletişim</Link>
          <a
            href="https://wa.me/905425129747?text=Merhaba%20Veramix%2C%20bilgi%20almak%20istiyorum."
            target="_blank"
            rel="noopener noreferrer"
            className="block py-2 text-green-600 font-semibold"
            onClick={() => setOpen(false)}
          >
            WhatsApp ile Yaz
          </a>
        </div>
      )}
    </nav>
  )
}
