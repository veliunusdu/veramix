import assert from 'node:assert/strict'
import test from 'node:test'
import { authConfig } from '@/lib/auth.config'

const authorized = authConfig.callbacks?.authorized

function requestFor(pathname: string) {
  return {
    nextUrl: new URL(`http://localhost:3000${pathname}`),
  } as never
}

test('unauthorized user is redirected to login on admin routes', () => {
  assert.ok(authorized, 'authorized callback should be defined')
  const result = authorized!({ auth: null, request: requestFor('/admin/products') })
  assert.ok(result instanceof Response)
  assert.equal(result.headers.get('location'), 'http://localhost:3000/login')
})

test('non-admin user is redirected to unauthorized page', () => {
  assert.ok(authorized, 'authorized callback should be defined')
  const result = authorized!({
    auth: { user: { role: 'VIEWER' } } as never,
    request: requestFor('/admin/products'),
  })
  assert.ok(result instanceof Response)
  assert.equal(result.headers.get('location'), 'http://localhost:3000/unauthorized')
})

test('public routes stay accessible', () => {
  assert.ok(authorized, 'authorized callback should be defined')
  const result = authorized!({ auth: null, request: requestFor('/products') })
  assert.equal(result, true)
})
