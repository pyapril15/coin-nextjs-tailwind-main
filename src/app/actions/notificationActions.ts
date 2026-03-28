"use server"

import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth/next"

export async function getUnreadNotifications() {
  const session = await getServerSession()
  if (!session?.user?.email) return { success: false, count: 0, notifications: [] }

  try {
    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) return { success: false, count: 0, notifications: [] }

    const unread = await prisma.notification.findMany({
      where: { userId: user.id, read: false },
      orderBy: { createdAt: 'desc' },
      take: 5
    })

    return { success: true, count: unread.length, notifications: unread }
  } catch (error) {
    return { success: false, count: 0, notifications: [] }
  }
}

export async function markNotificationsAsRead() {
  const session = await getServerSession()
  if (!session?.user?.email) return { success: false }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return { success: false }

  await prisma.notification.updateMany({
    where: { userId: user.id, read: false },
    data: { read: true }
  })
  
  return { success: true }
}
