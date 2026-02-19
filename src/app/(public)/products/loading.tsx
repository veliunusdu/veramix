export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="h-8 w-32 bg-gray-200 rounded mb-6 animate-pulse" />
      <div className="flex gap-3 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-9 w-24 bg-gray-200 rounded-full animate-pulse" />
        ))}
      </div>
      <div className="h-10 w-96 bg-gray-200 rounded-lg mb-6 animate-pulse" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow p-4">
            <div className="h-48 bg-gray-200 rounded-md mb-3 animate-pulse" />
            <div className="h-3 w-16 bg-gray-200 rounded mb-2 animate-pulse" />
            <div className="h-5 w-32 bg-gray-200 rounded mb-2 animate-pulse" />
            <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  )
}