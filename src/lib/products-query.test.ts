import assert from 'node:assert/strict'
import test from 'node:test'
import {
  buildPublishedProductsWhere,
  normalizeCategorySlug,
  normalizeSearch,
} from '@/lib/products-query'

test('published filter always enforces PUBLISHED status', () => {
  const where = buildPublishedProductsWhere()
  assert.equal(where.status, 'PUBLISHED')
})

test('search input is trimmed and capped', () => {
  const search = normalizeSearch(`  ${'a'.repeat(150)}  `)
  assert.equal(search?.length, 100)
})

test('invalid category slug is ignored', () => {
  const slug = normalizeCategorySlug('kitap;DROP TABLE')
  assert.equal(slug, undefined)
})

test('where filter includes search OR and category condition when valid', () => {
  const where = buildPublishedProductsWhere({ search: 'musluk', categorySlug: 'elektronik' })
  assert.ok(Array.isArray(where.OR))
  assert.equal(where.categories?.some.category.slug, 'elektronik')
})
