import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) return NextResponse.redirect(new URL("/?error=MissingToken", req.url));

  try {
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token }
    });

    if (!verificationToken) {
      return NextResponse.redirect(new URL("/?error=InvalidToken", req.url));
    }

    if (new Date() > verificationToken.expires) {
      return NextResponse.redirect(new URL("/?error=ExpiredToken", req.url));
    }

    await prisma.user.update({
      where: { email: verificationToken.identifier },
      data: { emailVerified: new Date() }
    });

    await prisma.verificationToken.delete({
      where: { token }
    });

    return NextResponse.redirect(new URL("/?verified=true", req.url));
  } catch (error) {
    console.error("Token Verification Database Error:", error);
    return NextResponse.redirect(new URL("/?error=DatabaseError", req.url));
  }
}
