import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const idSchema = z
  .string()
  .trim()
  .min(8)
  .max(64)
  .regex(/^[a-zA-Z0-9_-]+$/)

export function sanitizeEntityId(value: string | null | undefined) {
  const parsed = idSchema.safeParse(value)
  if (!parsed.success) return null
  return parsed.data
}

function getExpectedOrigin(req: NextRequest) {
  const host = req.headers.get('x-forwarded-host') ?? req.headers.get('host')
  const proto = req.headers.get('x-forwarded-proto') ?? 'http'
  if (!host) return null
  return `${proto}://${host}`
}

// NextAuth has built-in CSRF protection for /api/auth routes.
// This check protects custom mutating API routes.
export function verifySameOriginCsrf(req: NextRequest) {
  const method = req.method.toUpperCase()
  if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') return null

  const origin = req.headers.get('origin')
  const expectedOrigin = getExpectedOrigin(req)
  if (!origin || !expectedOrigin) {
    return NextResponse.json({ error: 'CSRF doğrulaması başarısız (origin eksik)' }, { status: 403 })
  }

  try {
    if (new URL(origin).origin !== expectedOrigin) {
      return NextResponse.json({ error: 'CSRF doğrulaması başarısız (origin uyuşmuyor)' }, { status: 403 })
    }
  } catch {
    return NextResponse.json({ error: 'CSRF doğrulaması başarısız (origin geçersiz)' }, { status: 403 })
  }

  return null
}
