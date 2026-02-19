export function normalizeSearch(search?: string) {
  if (!search) return undefined
  const value = search.trim()
  if (!value) return undefined
  return value.slice(0, 100)
}

export function normalizeCategorySlug(slug?: string) {
  if (!slug) return undefined
  const value = slug.trim().toLowerCase()
  if (!/^[a-z0-9-]{1,64}$/.test(value)) return undefined
  return value
}

export function buildPublishedProductsWhere(params?: { search?: string; categorySlug?: string }) {
  const search = normalizeSearch(params?.search)
  const categorySlug = normalizeCategorySlug(params?.categorySlug)

  return {
    status: 'PUBLISHED' as const,
    ...(search && {
      OR: [
        { name: { contains: search, mode: 'insensitive' as const } },
        { description: { contains: search, mode: 'insensitive' as const } },
      ],
    }),
    ...(categorySlug && {
      categories: {
        some: {
          category: { slug: categorySlug },
        },
      },
    }),
  }
}
