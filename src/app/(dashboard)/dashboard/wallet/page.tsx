import { getServerSession } from "next-auth/next"
import prisma from "@/lib/prisma"
import { initializeWallet } from "@/app/actions/walletActions"
import TradeWidget from "./TradeWidget"

export const metadata = {
  title: 'Wallet & Assets | Enterprise CoinPlatform',
}

export default async function WalletPage() {
  const session = await getServerSession()
  if (!session?.user?.email) return null;

  // Ensure Wallet Exists upon navigation naturally
  await initializeWallet();

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      wallet: {
        include: { assets: true }
      }
    }
  })

  if (!user) return null;

  const wallet = user.wallet
  const assets = wallet?.assets || []

  return (
    <div className="flex flex-col gap-8 pb-12 w-full">
       
       {/* UI for USD Balance */}
       <div className="bg-darkmode p-8 rounded-2xl border border-border shadow-xl">
         <h2 className="text-white/50 mb-2">Fiat Purchasing Power (USD)</h2>
         <h1 className="text-5xl font-bold text-green-400">
           ${wallet?.balance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) || "0.00"}
         </h1>
       </div>
       
       {/* Trade Widget AND Asset Grid */}
       <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
         
         {/* Assets Table */}
         <div className="xl:col-span-2 bg-darkmode p-8 rounded-2xl border border-border shadow-xl h-fit overflow-hidden">
           <h2 className="text-xl font-bold text-white mb-6">Your Crypto Portfolio</h2>
           {assets.length === 0 ? (
             <div className="p-12 border-2 border-dashed border-border rounded-xl text-center text-white/50">
               No assets currently owned. Use your USD balance to start trading!
             </div>
           ) : (
             <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                 <thead>
                   <tr className="text-white/50 border-b border-border">
                     <th className="pb-4 font-normal px-2">Asset</th>
                     <th className="pb-4 font-normal px-2 text-right">Amount Held</th>
                     <th className="pb-4 font-normal px-2 text-right">Avg. Buy Price</th>
                     <th className="pb-4 font-normal px-2 text-right">Total Invested</th>
                   </tr>
                 </thead>
                 <tbody>
                   {assets.map((asset) => (
                     <tr key={asset.id} className="border-b border-border/50 hover:bg-white/5 transition">
                       <td className="py-4 px-2 font-bold text-primary uppercase">{asset.symbol}</td>
                       <td className="py-4 px-2 text-white text-right">{asset.amount.toFixed(6)}</td>
                       <td className="py-4 px-2 text-white text-right">${asset.avgPrice.toLocaleString()}</td>
                       <td className="py-4 px-2 text-white text-right font-medium">${(asset.amount * asset.avgPrice).toLocaleString()}</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           )}
         </div>

         {/* Interactive Buy Sidebar */}
         <div className="xl:col-span-1">
           <TradeWidget maxUsd={wallet?.balance || 0} />
         </div>

       </div>
    </div>
  )
}
