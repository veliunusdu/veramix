import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function AdminGuard({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session?.user) redirect('/login')
  if (session.user.role !== 'ADMIN') redirect('/unauthorized')

  return <>{children}</>
}