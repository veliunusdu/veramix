import { handlers } from '@/lib/auth'

// Wrap handlers to surface errors in production
export async function GET(...args: Parameters<typeof handlers.GET>) {
  try {
    return await handlers.GET(...args)
  } catch (error) {
    console.error('[auth] GET error:', error)
    return Response.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

export async function POST(...args: Parameters<typeof handlers.POST>) {
  try {
    return await handlers.POST(...args)
  } catch (error) {
    console.error('[auth] POST error:', error)
    return Response.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}