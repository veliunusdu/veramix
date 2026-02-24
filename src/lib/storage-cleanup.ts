type ProductImageStorageInput = {
  storagePath: string
  url: string
}

export function chunkStrings(values: string[], chunkSize: number): string[][] {
  if (chunkSize <= 0) throw new Error('chunkSize must be greater than 0')
  const chunks: string[][] = []
  for (let i = 0; i < values.length; i += chunkSize) {
    chunks.push(values.slice(i, i + chunkSize))
  }
  return chunks
}

export function normalizeStoragePaths(paths: Array<string | null | undefined>): string[] {
  return [...new Set(paths.map((path) => path?.trim()).filter((path): path is string => Boolean(path)))]
}

export function extractSupabasePathFromPublicUrl(url: string, bucket: string): string | null {
  const trimmed = url.trim()
  if (!trimmed) return null

  try {
    const parsed = new URL(trimmed)
    const prefix = `/storage/v1/object/public/${bucket}/`
    if (!parsed.pathname.startsWith(prefix)) return null
    const encoded = parsed.pathname.slice(prefix.length)
    const decoded = decodeURIComponent(encoded).trim()
    return decoded || null
  } catch {
    return null
  }
}

export function collectSupabaseCandidatePaths(images: ProductImageStorageInput[], bucket: string): string[] {
  return normalizeStoragePaths([
    ...images.map((image) => image.storagePath),
    ...images.map((image) => extractSupabasePathFromPublicUrl(image.url, bucket)),
  ])
}

export function mapListedObjectsToSupabasePaths(
  productId: string,
  objects: Array<{ name?: string | null }>,
): string[] {
  return normalizeStoragePaths(
    objects.map((object) => {
      const name = object.name?.trim()
      if (!name) return null
      return `${productId}/${name}`
    }),
  )
}
