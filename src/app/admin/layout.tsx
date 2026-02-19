import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/admin/Sidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session?.user) redirect('/login')
  if (session.user.role !== 'ADMIN') redirect('/unauthorized')

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#1e293b_0%,_#0f172a_35%,_#020617_100%)]">
      <div className="mx-auto flex min-h-screen w-full max-w-[1600px]">
        <Sidebar />
        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/60 px-5 py-4 backdrop-blur sm:px-8">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">Admin panel</p>
                <p className="text-sm font-medium text-slate-100">Hoş geldiniz</p>
              </div>
              <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-medium text-slate-100">
                {session.user.email}
              </span>
            </div>
          </header>
          <main className="flex-1 p-4 sm:p-8">{children}</main>
        </div>
      </div>
    </div>
  )
}
