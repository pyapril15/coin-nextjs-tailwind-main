"use server"

import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { revalidatePath } from "next/cache"

export async function updateProfileName(newName: string) {
  const session = await getServerSession()
  if (!session?.user?.email) return { success: false, message: "Unauthorized" }

  if (!newName || newName.length < 2) {
    return { success: false, message: "Name must be at least 2 characters string." }
  }

  try {
    await prisma.user.update({
      where: { email: session.user.email },
      data: { name: newName }
    })
    
    // Purge the nextjs dashboard cache dynamically
    revalidatePath("/dashboard")
    revalidatePath("/dashboard/settings")
    
    return { success: true, message: "Profile successfully updated!" }
  } catch (error) {
    console.error("Profile Update Error:", error)
    return { success: false, message: "Failed to update profile to database." }
  }
}
