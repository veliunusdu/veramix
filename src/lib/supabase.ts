import { createClient } from '@supabase/supabase-js'

// Server-only client using service_role key — never expose to the browser
export function createAdminStorageClient() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error('SUPABASE_URL veya SUPABASE_SERVICE_ROLE_KEY eksik')
  }

  return createClient(url, key, {
    auth: { persistSession: false },
  })
}

export const STORAGE_BUCKET = 'product-images'
