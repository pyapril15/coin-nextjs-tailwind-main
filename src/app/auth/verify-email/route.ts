import { NextResponse } from 'next/server'
import prisma from "@/lib/prisma"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')

  if (!token) {
    return NextResponse.redirect(new URL('/?error=MissingToken', request.url))
  }

  try {
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token }
    })

    if (!verificationToken) {
      return NextResponse.redirect(new URL('/?error=InvalidToken', request.url))
    }

    if (verificationToken.expires < new Date()) {
      return NextResponse.redirect(new URL('/?error=TokenExpired', request.url))
    }

    // Atomically verify the user and delete the used token
    await prisma.$transaction(async (tx) => {
      const user = await tx.user.update({
        where: { email: verificationToken.identifier },
        data: { emailVerified: new Date() }
      })

      await tx.verificationToken.delete({
        where: { identifier_token: { identifier: verificationToken.identifier, token: verificationToken.token } }
      })

      // Push a Welcome notification into their dashboard center natively!
      await tx.notification.create({
        data: {
          userId: user.id,
          title: "Email Verified",
          message: "Welcome to the Enterprise Platform! Your account is now fully secured."
        }
      })
    })

    return NextResponse.redirect(new URL('/?verified=true', request.url))
  } catch (error) {
    console.error("Verification error", error)
    return NextResponse.redirect(new URL('/?error=ServerError', request.url))
  }
}
