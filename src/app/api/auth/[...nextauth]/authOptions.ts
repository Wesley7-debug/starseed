import connectDb from '@/app/libs/ConnectDb'
import User, { Role } from '@/app/models/User'
import type { NextAuthOptions, User as NextAuthUser } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import type { JWT } from 'next-auth/jwt'
import type { Session } from 'next-auth'

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
        await connectDb()
console.log("RegNo received:", credentials?.RegNo)

        if (!credentials?.RegNo) {
          throw new Error('Missing RegNo')
        }

        const user = await User.findOne({ RegNo: credentials.RegNo })

        if (!user) {
          return null
        }

        return {
          id: user._id.toString(),
          name: user.name,
          RegNo: user.RegNo,
          role: user.role,
          avatarUrl: user.avatarUrl

        }
      },
    }),
  ],

  pages: {
    signIn: '/Login',
  },

  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: NextAuthUser }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.RegNo = user.RegNo
        token.name = user.name
        token.avatarUrl= user.avatarUrl
  

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
