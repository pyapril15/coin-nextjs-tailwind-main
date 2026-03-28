"use server"

import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth/next"

export async function initializeWallet() {
  const session = await getServerSession()
  if (!session?.user?.email) return { success: false, message: "Unauthorized" }
  
  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return { success: false }

  const wallet = await prisma.wallet.findUnique({ where: { userId: user.id } })
  if (!wallet) {
    await prisma.wallet.create({
      data: {
        userId: user.id,
        balance: 10000.0, // Start users with $10k mock USD for trading
      }
    })
    return { success: true, message: "$10,000 USD Wallet Initialized" }
  }
  return { success: true, message: "Wallet active" }
}

export async function buyCryptoAsset(coinId: string, symbol: string, currentPrice: number, usdAmount: number) {
  const session = await getServerSession()
  if (!session?.user?.email) return { success: false, message: "Unauthorized" }

  if (usdAmount <= 0) return { success: false, message: "Invalid amount." }

  try {
    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) return { success: false, message: "User not found" }

    const wallet = await prisma.wallet.findUnique({ where: { userId: user.id } })
    
    if (!wallet || wallet.balance < usdAmount) {
      return { success: false, message: "Insufficient USD balance." }
    }

    const coinAmount = usdAmount / currentPrice

    // Full Acid Transaction to ensure database safety during trades
    await prisma.$transaction(async (tx) => {
      // 1. Deduct USD from wallet
      await tx.wallet.update({
        where: { id: wallet.id },
        data: { balance: wallet.balance - usdAmount }
      })

      // 2. Upsert Asset
      const existingAsset = await tx.asset.findUnique({
        where: { walletId_coinId: { walletId: wallet.id, coinId } }
      })

      if (existingAsset) {
        const totalValue = (existingAsset.amount * existingAsset.avgPrice) + usdAmount
        const newAmount = existingAsset.amount + coinAmount
        const newAvg = totalValue / newAmount

        await tx.asset.update({
          where: { id: existingAsset.id },
          data: { amount: newAmount, avgPrice: newAvg }
        })
      } else {
        await tx.asset.create({
          data: {
            walletId: wallet.id,
            coinId,
            symbol,
            amount: coinAmount,
            avgPrice: currentPrice
          }
        })
      }

      // 3. Write Immutable Ledger Entry
      await tx.transaction.create({
        data: {
          userId: user.id,
          type: "BUY",
          coinId,
          amount: coinAmount,
          price: currentPrice,
          total: usdAmount
        }
      })
    })

    return { success: true, message: `Successfully purchased ${coinAmount.toFixed(4)} ${symbol.toUpperCase()}!` }
  } catch (error) {
    console.error("Trade Error:", error)
    return { success: false, message: "Server encountered an error during the transaction." }
  }
}
