import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "@/lib/prisma"

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ user, account }) {
      const existingUser = await prisma.user.findUnique({ where: { email: user.email! } })
      
      if (account?.provider === "credentials" && !existingUser?.emailVerified) {
        throw new Error("Please verify your email address to log in.")
      }

      // Enterprise IP Logging
      if (existingUser) {
        try {
          const { headers } = await import('next/headers')
          const headersList = await headers()
          await prisma.activityLog.create({
            data: {
              userId: existingUser.id,
              action: `LOGIN_EVENT_${account?.provider?.toUpperCase() || 'SYS'}`,
              ipAddress: headersList.get('x-forwarded-for') || "127.0.0.1",
              userAgent: headersList.get('user-agent') || "Unknown Client"
            }
          })
        } catch(e) {}
      }

      return true
    }
  },
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
      allowDangerousEmailAccountLinking: true,
    }),
    Google({
      clientId: process.env.GOOGLE_ID || '',
      clientSecret: process.env.GOOGLE_SECRET || '',
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email", placeholder: "test@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }
        
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user || !user.password) {
          return null
        }

        const bcrypt = require('bcryptjs')
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

        if (!isPasswordValid) {
          return null
        }

        return { id: user.id, name: user.name, email: user.email }
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }
