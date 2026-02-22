import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import { loginSchema } from '@/lib/validation'
import { authConfig } from '@/lib/auth.config'
import bcrypt from 'bcryptjs'

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials)
          if (!parsed.success) {
            if (process.env.AUTH_DEBUG) console.log('Auth: invalid credentials payload', { credentials })
            return null
          }

          if (process.env.AUTH_DEBUG) console.log('Auth: authorize attempt', { email: parsed.data.email })

          const user = await prisma.user.findUnique({
            where: { email: parsed.data.email },
          })
          if (!user) {
            if (process.env.AUTH_DEBUG) console.log('Auth: user not found', { email: parsed.data.email })
            return null
          }

          if (process.env.AUTH_DEBUG) console.log('Auth: user found', { id: user.id, role: user.role })

          const passwordMatch = await bcrypt.compare(parsed.data.password, user.password)
          if (!passwordMatch) {
            if (process.env.AUTH_DEBUG) console.log('Auth: password mismatch', { id: user.id })
            return null
          }

          if (process.env.AUTH_DEBUG) console.log('Auth: successful login', { id: user.id, role: user.role })

          return { id: user.id, email: user.email, role: user.role }
      },
    }),
  ],
})

export async function getSession() {
  return await auth()
}

export async function requireAdmin() {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')
  if (session.user.role !== 'ADMIN') throw new Error('Forbidden')
  return session
}