import assert from 'node:assert/strict'
import test from 'node:test'
import {
  chunkStrings,
  collectSupabaseCandidatePaths,
  extractSupabasePathFromPublicUrl,
  mapListedObjectsToSupabasePaths,
} from '@/lib/storage-cleanup'

test('extractSupabasePathFromPublicUrl parses public object path', () => {
  const bucket = 'product-images'
  const url = 'https://example.supabase.co/storage/v1/object/public/product-images/abc123/image-1.jpg'
  const path = extractSupabasePathFromPublicUrl(url, bucket)
  assert.equal(path, 'abc123/image-1.jpg')
})

test('extractSupabasePathFromPublicUrl returns null for unrelated URL', () => {
  const path = extractSupabasePathFromPublicUrl('https://example.com/photo.jpg', 'product-images')
  assert.equal(path, null)
})

test('collectSupabaseCandidatePaths includes storagePath and fallback url path', () => {
  const paths = collectSupabaseCandidatePaths(
    [
      {
        storagePath: '',
        url: 'https://example.supabase.co/storage/v1/object/public/product-images/p1/fallback.jpg',
      },
      {
        storagePath: 'p1/from-db.jpg',
        url: 'https://example.supabase.co/storage/v1/object/public/product-images/p1/from-db.jpg',
      },
    ],
    'product-images',
  )

  assert.deepEqual([...paths].sort(), ['p1/fallback.jpg', 'p1/from-db.jpg'])
})

test('mapListedObjectsToSupabasePaths maps bucket list entries into full object paths', () => {
  const mapped = mapListedObjectsToSupabasePaths('product-1', [
    { name: 'a.jpg' },
    { name: 'b.jpg' },
    { name: '' },
    {},
  ])

  assert.deepEqual(mapped, ['product-1/a.jpg', 'product-1/b.jpg'])
})

test('chunkStrings splits string arrays by chunk size', () => {
  const chunks = chunkStrings(['a', 'b', 'c', 'd', 'e'], 2)
  assert.deepEqual(chunks, [['a', 'b'], ['c', 'd'], ['e']])
})
