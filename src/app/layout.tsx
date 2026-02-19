import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Veramix | Premium Su Armatürleri',
  description: 'Veramix — modern, dayanıklı ve şık su armatürü çözümleri.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <head>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning className={inter.className}>{children}</body>
    </html>
  )
}
