'use server'

import { z } from "zod"
import { signUpSchema } from "@/lib/validations/auth"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { v4 as uuidv4 } from "uuid"
import { sendMail } from "@/lib/nodemailer"
import { getVerificationEmailTemplate, getResetPasswordEmailTemplate } from "@/lib/templates/emailTemplates"

export async function registerUser(data: z.infer<typeof signUpSchema>) {
  const result = signUpSchema.safeParse(data)
  
  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors, message: "Invalid data" }
  }

  const { name, email, password } = result.data

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return { success: false, message: "User with this email already exists." }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      }
    })
    
    // Generate UUID token strictly for verification
    const token = uuidv4()
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 Hour expiry
      }
    })

    const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/auth/verify?token=${token}`
    await sendMail(email, "Verify Your Account Action Required", getVerificationEmailTemplate(verifyUrl))

    return { success: true, message: "Account created! Please check your email for the verification link before logging in." }
  } catch (error: any) {
    console.error("Prisma Registration Error:", error)
    return { success: false, message: `An error occurred: ${error?.message || "Unknown error"}` }
  }
}

export async function requestPasswordReset(email: string) {
  try {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return { success: true, message: "If your email is registered, a reset link has been sent." }

    const token = uuidv4()
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires: new Date(Date.now() + 1000 * 60 * 60),
      }
    })

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/reset-password?token=${token}`
    await sendMail(email, "Password Reset Request", getResetPasswordEmailTemplate(resetUrl))

    return { success: true, message: "If your email is registered, a reset link has been sent." }
  } catch (error) {
    console.error("Password Reset Send Error:", error)
    return { success: false, message: "Internal server error occurred." }
  }
}

export async function completePasswordReset(token: string, newPassword: string) {
  try {
    const verificationToken = await prisma.verificationToken.findUnique({ where: { token } })
    if (!verificationToken || new Date() > verificationToken.expires) {
       return { success: false, message: "Security token is invalid or has expired." }
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)
    
    await prisma.user.update({
      where: { email: verificationToken.identifier },
      data: { password: hashedPassword }
    })

    await prisma.verificationToken.delete({ where: { token } })
    
    return { success: true, message: "Password updated successfully! You may now sign in." }
  } catch (error) {
    console.error("Password Update Error:", error)
    return { success: false, message: "Server error occurred while updating the password." }
  }
}
