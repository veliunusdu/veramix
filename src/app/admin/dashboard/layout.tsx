import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session?.user) redirect('/login')
  if (session.user.role !== 'ADMIN') redirect('/unauthorized')

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
        <span className="font-bold text-lg">Veramix Admin</span>
        <span className="text-sm text-gray-500">{session.user.email}</span>
      </nav>
      <main className="p-8">{children}</main>
    </div>
  )
}