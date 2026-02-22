import type { NextAuthConfig } from 'next-auth'

export const authConfig: NextAuthConfig = {
  trustHost: true,
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role
        token.id = user.id
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string
        session.user.id = token.id as string
      }
      return session
    },
    authorized({ auth, request }) {
      const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
      if (isAdminRoute) {
        if (!auth?.user) return Response.redirect(new URL('/login', request.nextUrl))
        if (auth.user.role !== 'ADMIN') return Response.redirect(new URL('/unauthorized', request.nextUrl))
      }
      return true
    },
  },
  providers: [],
}