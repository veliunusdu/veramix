import { signOut } from '@/lib/auth'

export default function DashboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p className="text-gray-600 mt-2">Hoş geldiniz!</p>
      <form
        action={async () => {
          'use server'
          await signOut({ redirectTo: '/login' })
        }}
      >
        <button type="submit" className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
          Çıkış Yap
        </button>
      </form>
    </div>
  )
}