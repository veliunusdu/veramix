type LimitOptions = {
  max: number
  windowMs: number
}

type Bucket = {
  count: number
  resetAt: number
}

type GlobalWithRateLimit = typeof globalThis & {
  __veramixRateLimitStore?: Map<string, Bucket>
}

const globalStore = globalThis as GlobalWithRateLimit
const store = globalStore.__veramixRateLimitStore ?? new Map<string, Bucket>()

if (!globalStore.__veramixRateLimitStore) {
  globalStore.__veramixRateLimitStore = store
}

function pruneExpired(now: number) {
  for (const [key, bucket] of store.entries()) {
    if (bucket.resetAt <= now) store.delete(key)
  }
}

export function consumeRateLimit(key: string, options: LimitOptions) {
  const now = Date.now()
  pruneExpired(now)

  const existing = store.get(key)
  if (!existing || existing.resetAt <= now) {
    const next = { count: 1, resetAt: now + options.windowMs }
    store.set(key, next)
    return {
      allowed: true,
      remaining: Math.max(options.max - 1, 0),
      resetAt: next.resetAt,
    }
  }

  existing.count += 1
  store.set(key, existing)

  const allowed = existing.count <= options.max
  const remaining = Math.max(options.max - existing.count, 0)

  return {
    allowed,
    remaining,
    resetAt: existing.resetAt,
  }
}
