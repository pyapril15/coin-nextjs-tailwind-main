"use server"

import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { revalidatePath } from "next/cache"

export async function exportUserData() {
  const session = await getServerSession()
  if (!session?.user?.email) return { success: false, data: null }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        wallet: { include: { assets: true } },
        transactions: true,
        activityLogs: true,
        accounts: true,
      }
    })

    if (!user) return { success: false, data: null }

    const gdprPayload = {
      profile: {
        name: user.name,
        email: user.email,
        mfaEnabled: user.mfaEnabled,
        emailVerified: user.emailVerified
      },
      wallet: user.wallet || null,
      transactions: user.transactions,
      activity: user.activityLogs,
      connectedOAuth: user.accounts.map(a => a.provider),
      exportedAt: new Date().toISOString()
    }

    return { success: true, payload: JSON.stringify(gdprPayload, null, 2) }
  } catch (error) {
    return { success: false, data: null }
  }
}

export async function deleteAccountPermanently() {
  const session = await getServerSession()
  if (!session?.user?.email) return { success: false }

  try {
    // With cascading deletes, deleting the user instantly purges Wallet, Assets, and Logs
    await prisma.user.delete({
      where: { email: session.user.email }
    })
    return { success: true, message: "Account entirely erased." }
  } catch (e) {
    return { success: false, message: "Failure terminating account data." }
  }
}
