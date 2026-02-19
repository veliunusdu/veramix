import { handlers } from '@/lib/auth'

// NextAuth handles CSRF token validation for its own auth endpoints.
export const { GET, POST } = handlers
