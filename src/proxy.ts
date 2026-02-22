import { getToken } from 'next-auth/jwt'
import { NextResponse, type NextRequest } from 'next/server'
import { consumeRateLimit } from '@/lib/rate-limit'

function getClientIp(req: NextRequest) {
  const forwardedFor = req.headers.get('x-forwarded-for')
  if (forwardedFor) return forwardedFor.split(',')[0].trim()
  return req.headers.get('x-real-ip') ?? 'unknown'
}

export default async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname
  const isApiRoute = pathname.startsWith('/api')
  const isAuthApi = pathname.startsWith('/api/auth')
  const isAdminPage = pathname.startsWith('/admin')
  const isAdminApi = pathname.startsWith('/api/admin') || pathname === '/api/upload'

  if (isApiRoute) {
    const ip = getClientIp(req)
    const key = `${ip}:${pathname}`
    const limit = isAuthApi ? { max: 20, windowMs: 60_000 } : { max: 60, windowMs: 60_000 }
    const result = consumeRateLimit(key, limit)

    if (!result.allowed) {
      return NextResponse.json(
        { error: 'Çok fazla istek gönderildi. Lütfen biraz sonra tekrar deneyin.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((result.resetAt - Date.now()) / 1000)),
            'X-RateLimit-Limit': String(limit.max),
            'X-RateLimit-Remaining': String(result.remaining),
          },
        }
      )
    }
  }

  if (isAdminPage || isAdminApi) {
    const secret = process.env.AUTH_SECRET
    if (!secret) {
      // AUTH_SECRET not configured — block access rather than crash
      if (isAdminApi) return NextResponse.json({ error: 'Server misconfiguration' }, { status: 503 })
      return NextResponse.redirect(new URL('/login', req.nextUrl))
    }

    const token = await getToken({
      req,
      secret,
      secureCookie: process.env.NODE_ENV === 'production',
    })

    if (!token) {
      if (isAdminApi) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      return NextResponse.redirect(new URL('/login', req.nextUrl))
    }

    if (token.role !== 'ADMIN') {
      if (isAdminApi) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      return NextResponse.redirect(new URL('/unauthorized', req.nextUrl))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*'],
}