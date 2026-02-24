import { createClient } from '@supabase/supabase-js'
import {
  assertSupabaseStorageEnv,
  getSupabaseBucket,
  getSupabaseUrl,
  loadStorageEnv,
} from '@/lib/storage'

// Server-only client using service_role key — never expose to the browser
export function createAdminStorageClient() {
  loadStorageEnv()
  assertSupabaseStorageEnv()
  const url = getSupabaseUrl()
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()

  if (!url || !key) {
    throw new Error('SUPABASE_URL (veya Supabase DATABASE_URL) veya SUPABASE_SERVICE_ROLE_KEY eksik')
  }

  return createClient(url, key, {
    auth: { persistSession: false },
  })
}

export const STORAGE_BUCKET = getSupabaseBucket()
