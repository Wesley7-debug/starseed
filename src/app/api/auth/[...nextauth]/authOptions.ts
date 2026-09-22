import connectDb from '@/lib/ConnectDb'
import User, { Role } from '@/models/User'
import type { NextAuthOptions, User as NextAuthUser } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import type { JWT } from 'next-auth/jwt'
import type { Session } from 'next-auth'

const RATE_LIMIT = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 10;
const WINDOW_MS = 60_000;

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const entry = RATE_LIMIT.get(key);

  if (!entry || now > entry.resetAt) {
    RATE_LIMIT.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  if (entry.count >= MAX_ATTEMPTS) return false;

  entry.count++;
  return true;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        RegNo: { label: 'RegNo', type: 'text' },
      },
      async authorize(
        credentials: { RegNo?: string } | undefined
      ): Promise<NextAuthUser | null> {
        if (!credentials?.RegNo) {
          throw new Error('Missing RegNo')
        }

        const normalizedRegNo = credentials.RegNo.trim();

        if (!checkRateLimit(normalizedRegNo)) {
          throw new Error('Too many attempts. Please try again later.')
        }

        await connectDb()

        const user = await User.findOne({ RegNo: normalizedRegNo }).select(
          'name RegNo role avatarUrl'
        )

        if (!user) {
          return null
        }

        return {
          id: (user._id as string).toString(),
          name: user.name,
          RegNo: user.RegNo,
          role: user.role,
          avatarUrl: user.avatarUrl,
        }
      },
    }),
  ],

  pages: {
    signIn: '/Login',
  },

  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60,
  },

  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: NextAuthUser }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.RegNo = user.RegNo
        token.name = user.name
        token.avatarUrl = user.avatarUrl
      }
      return token
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as Role
        session.user.RegNo = token.RegNo as string
        session.user.name = token.name as string
        session.user.avatarUrl = token.avatarUrl as string
      }
      return session
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
}
