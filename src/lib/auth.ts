import type { NextAuthOptions, User as NextAuthUser } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'
import { adminAuth, adminDb } from '@/lib/firebase/admin'
import { Timestamp } from 'firebase-admin/firestore'
import type { UserRole } from '@/types'

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },

  providers: [
    GoogleProvider({
      clientId:     process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId:     process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Email',
      credentials: {
        email:    { label: 'Email',    type: 'email'    },
        password: { label: 'Password', type: 'password' },
        role:     { label: 'Role',     type: 'text'     },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        try {
          // Verify Firebase ID token issued from client-side sign-in
          // (client sends idToken, we verify server-side)
          const decoded = await adminAuth.verifyIdToken(credentials.password)
          const uid = decoded.uid

          // Fetch or create user doc in Firestore
          const userRef = adminDb.collection('users').doc(uid)
          const snap = await userRef.get()

          if (!snap.exists) {
            // First login — create user document
            const role = (credentials.role as UserRole) || 'buyer'
            await userRef.set({
              uid,
              email: decoded.email || credentials.email,
              displayName: decoded.name || credentials.email.split('@')[0],
              photoURL: decoded.picture || null,
              role,
              verified: false,
              createdAt: Timestamp.now(),
              updatedAt: Timestamp.now(),
              stats: { totalSales: 0, totalRevenue: 0, totalListings: 0, rating: 0, reviewCount: 0 },
            })
            return {
              id: uid,
              email: credentials.email,
              name: decoded.name || credentials.email.split('@')[0],
              image: decoded.picture,
              role,
            } as NextAuthUser & { role: UserRole }
          }

          const data = snap.data()!
          return {
            id:    uid,
            email: data.email,
            name:  data.displayName,
            image: data.photoURL,
            role:  data.role,
          } as NextAuthUser & { role: UserRole }
        } catch {
          return null
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.uid  = user.id
        token.role = (user as NextAuthUser & { role: UserRole }).role
      }
      // Allow role update from client
      if (trigger === 'update' && session?.role) {
        token.role = session.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id   = token.uid as string
        session.user.role = token.role as UserRole
      }
      return session
    },
    async signIn({ user, account }) {
      if (!account || account.provider === 'credentials') return true
      // OAuth sign-in: upsert user doc
      try {
        const uid = user.id
        const userRef = adminDb.collection('users').doc(uid)
        const snap = await userRef.get()
        if (!snap.exists) {
          await userRef.set({
            uid,
            email: user.email || '',
            displayName: user.name || '',
            photoURL: user.image || null,
            role: 'buyer',
            verified: false,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
            stats: { totalSales: 0, totalRevenue: 0, totalListings: 0, rating: 0, reviewCount: 0 },
          })
        }
        return true
      } catch {
        return false
      }
    },
  },

  pages: {
    signIn:  '/auth/login',
    error:   '/auth/error',
  },

  secret: process.env.NEXTAUTH_SECRET,
}

// Augment next-auth types
declare module 'next-auth' {
  interface User { role?: UserRole }
  interface Session {
    user: {
      id: string
      role: UserRole
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}
declare module 'next-auth/jwt' {
  interface JWT { uid?: string; role?: UserRole }
}
