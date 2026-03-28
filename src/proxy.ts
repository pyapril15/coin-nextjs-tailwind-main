import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

// NextAuth Middleware protects the /dashboard matching routes automatically at the Edge
export default withAuth(
  function middleware(req) {
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // Only allow if session token exists
    },
    pages: {
      signIn: '/', // Redirect unauthorized users to the homepage gracefully
    }
  }
)

export const config = {
  matcher: ["/dashboard/:path*"]
}
