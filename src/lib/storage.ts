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

export function getCloudinaryFolder(productId: string): string {
  loadStorageEnv()
  const base = process.env.CLOUDINARY_FOLDER?.trim() || DEFAULT_CLOUDINARY_FOLDER
  return `${base}/${productId}`.replace(/\/+/g, '/')
}

export function assertSupabaseStorageEnv() {
  loadStorageEnv()
  const url = process.env.SUPABASE_URL?.trim()
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()

  if (!url || !key) {
    throw new Error('SUPABASE_URL veya SUPABASE_SERVICE_ROLE_KEY eksik')
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
