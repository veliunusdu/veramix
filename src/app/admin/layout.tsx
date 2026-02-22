import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/admin/Sidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session?.user) redirect('/login')
  if (session.user.role !== 'ADMIN') redirect('/unauthorized')

  return (
    <div className="flex min-h-screen bg-[#fcfcfc]">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-black/4 bg-white/50 backdrop-blur-xl px-8">
          <p className="text-sm font-medium text-zinc-500">Hoş Geldiniz, <span className="text-zinc-900 font-semibold">{session.user.name || session.user.email?.split('@')[0] || 'Admin'}</span></p>
          <div className="flex items-center gap-3">
             <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-xs font-semibold text-zinc-600 ring-1 ring-inset ring-black/5">
                {session.user.email?.[0]?.toUpperCase() || 'A'}
             </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto w-full">
            <div className="mx-auto max-w-6xl p-8">
              {children}
            </div>
        </main>
      </div>
    </div>
  )
}
