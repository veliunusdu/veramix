import Navbar from '@/components/public/Navbar'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">{children}</div>
    </>
  )
}
