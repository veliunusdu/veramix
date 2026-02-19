import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/admin/Sidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session?.user) redirect('/login')
  if (session.user.role !== 'ADMIN') redirect('/unauthorized')

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b px-8 py-4 flex justify-between items-center">
          <span className="text-sm text-gray-500">Hoş geldiniz</span>
          <span className="text-sm font-medium">{session.user.email}</span>
        </header>
        <main className="flex-1 p-8 bg-gray-50">{children}</main>
      </div>
    </div>
  )
}