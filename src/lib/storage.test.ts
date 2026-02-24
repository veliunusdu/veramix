import assert from 'node:assert/strict'
import test from 'node:test'
import { resolveSupabaseUrlFromEnv } from '@/lib/storage'

test('resolveSupabaseUrlFromEnv returns explicit SUPABASE_URL when present', () => {
  const url = resolveSupabaseUrlFromEnv({
    SUPABASE_URL: 'https://myproj.supabase.co',
    DATABASE_URL: 'postgresql://postgres.other:pass@host:6543/postgres',
  })
  assert.equal(url, 'https://myproj.supabase.co')
})

test('resolveSupabaseUrlFromEnv derives URL from Supabase DATABASE_URL username', () => {
  const url = resolveSupabaseUrlFromEnv({
    SUPABASE_URL: '',
    DATABASE_URL:
      'postgresql://postgres.zuybmtaggxzatvjkgkzn:secret@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true',
  })
  assert.equal(url, 'https://zuybmtaggxzatvjkgkzn.supabase.co')
})

test('resolveSupabaseUrlFromEnv returns null for non-Supabase DATABASE_URL', () => {
  const url = resolveSupabaseUrlFromEnv({
    SUPABASE_URL: '',
    DATABASE_URL: 'postgresql://app:secret@localhost:5432/app',
  })
  assert.equal(url, null)
})
