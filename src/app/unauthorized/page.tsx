import Link from 'next/link'

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-500 mb-4">403</h1>
        <p className="text-gray-600 mb-6">Bu sayfaya erişim yetkiniz yok.</p>
        <Link href="/login" className="text-blue-600 hover:underline">
          Giriş sayfasına dön
        </Link>
      </div>
    </div>
  )
}