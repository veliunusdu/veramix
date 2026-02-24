export function normalizeSearch(search?: string) {
  if (!search) return undefined
  const value = search.trim()
  if (!value) return undefined
  return value.slice(0, 100)
}

export function buildProductsWhere(params?: { search?: string }) {
  const search = normalizeSearch(params?.search)

  return {
    ...(search && {
      OR: [
        { name: { contains: search, mode: 'insensitive' as const } },
        { description: { contains: search, mode: 'insensitive' as const } },
      ],
    }),
  }
}
