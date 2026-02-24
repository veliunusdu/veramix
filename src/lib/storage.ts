import dotenv from 'dotenv'

const DEFAULT_SUPABASE_BUCKET = 'product-images'
const DEFAULT_CLOUDINARY_FOLDER = 'veramix/products'
let envLoaded = false

export type StorageProvider = 'supabase' | 'cloudinary'

export function loadStorageEnv() {
  if (envLoaded) return
  dotenv.config({ path: '.env.local', override: true })
  dotenv.config({ path: '.env' })
  envLoaded = true
}

function normalizeProvider(value: string | undefined): StorageProvider {
  if (value === 'cloudinary') return 'cloudinary'
  return 'supabase'
}

export function getStorageProvider(): StorageProvider {
  loadStorageEnv()
  return normalizeProvider(process.env.IMAGE_STORAGE_PROVIDER)
}

export function getSupabaseBucket(): string {
  loadStorageEnv()
  const raw = process.env.SUPABASE_STORAGE_BUCKET?.trim()
  return raw || DEFAULT_SUPABASE_BUCKET
}

function getProjectRefFromDatabaseUrl(databaseUrl: string): string | null {
  try {
    const parsed = new URL(databaseUrl)
    const username = decodeURIComponent(parsed.username || '')
    const match = username.match(/^postgres\.([a-z0-9-]+)$/i)
    if (match) return match[1]
  } catch {
    // noop: fall back to regex parsing below
  }

  const fallback = databaseUrl.match(/postgres\.([a-z0-9-]+):/i)
  return fallback?.[1] ?? null
}

export function resolveSupabaseUrlFromEnv(
  env: Pick<NodeJS.ProcessEnv, 'SUPABASE_URL' | 'DATABASE_URL'>,
): string | null {
  const explicit = env.SUPABASE_URL?.trim()
  if (explicit) return explicit

  const databaseUrl = env.DATABASE_URL?.trim()
  if (!databaseUrl) return null

  const projectRef = getProjectRefFromDatabaseUrl(databaseUrl)
  if (!projectRef) return null
  return `https://${projectRef}.supabase.co`
}

export function getSupabaseUrl(): string | null {
  loadStorageEnv()
  return resolveSupabaseUrlFromEnv({
    SUPABASE_URL: process.env.SUPABASE_URL,
    DATABASE_URL: process.env.DATABASE_URL,
  })
}

export function getCloudinaryFolder(productId: string): string {
  loadStorageEnv()
  const base = process.env.CLOUDINARY_FOLDER?.trim() || DEFAULT_CLOUDINARY_FOLDER
  return `${base}/${productId}`.replace(/\/+/g, '/')
}

export function assertSupabaseStorageEnv() {
  loadStorageEnv()
  const url = getSupabaseUrl()
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()

  if (!url || !key) {
    throw new Error(
      'SUPABASE_URL (veya Supabase DATABASE_URL) veya SUPABASE_SERVICE_ROLE_KEY eksik',
    )
  }

  try {
    const parsed = new URL(url)
    if (!/^https?:$/.test(parsed.protocol)) {
      throw new Error('SUPABASE_URL http/https ile başlamalı')
    }
  } catch {
    throw new Error(`SUPABASE_URL geçersiz formatta: ${JSON.stringify(url)}`)
  }
}

export function assertCloudinaryEnv() {
  loadStorageEnv()
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    throw new Error('CLOUDINARY_CLOUD_NAME eksik')
  }
  if (!process.env.CLOUDINARY_API_KEY) {
    throw new Error('CLOUDINARY_API_KEY eksik')
  }
  if (!process.env.CLOUDINARY_API_SECRET) {
    throw new Error('CLOUDINARY_API_SECRET eksik')
  }
}
