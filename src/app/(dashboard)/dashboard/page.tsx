import { getServerSession } from "next-auth/next"
import prisma from "@/lib/prisma"

export const metadata = {
  title: 'Dashboard Overview | Enterprise CoinPlatform',
}

export default async function DashboardPage() {
  const session = await getServerSession()
  if (!session?.user?.email) return null;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      wallet: { include: { assets: true } },
      transactions: { orderBy: { createdAt: "desc" }, take: 5 }
    }
  })

  // Derived Financial Metrics
  const rawBalance = user?.wallet?.balance || 0;
  const assets = user?.wallet?.assets || [];
  const transactions = user?.transactions || [];

  const portfolioCryptoValue = assets.reduce((sum, asset) => sum + (asset.amount * asset.avgPrice), 0);
  const totalBalance = rawBalance + portfolioCryptoValue;

  return (
    <div className="pb-12">
      <h1 className="text-4xl font-bold mb-8">Welcome back, <span className="text-primary">{session?.user?.name || session?.user?.email?.split('@')[0]}</span>!</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-darkmode p-8 rounded-2xl border border-border shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 bg-primary w-32 h-32 rounded-full -mr-10 -mt-10 blur-2xl"></div>
          <h3 className="text-white/50 text-sm font-medium mb-3 relative z-10">Total Net Worth</h3>
          <p className="text-4xl font-bold text-green-400 relative z-10">${totalBalance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
        </div>
        
        <div className="bg-darkmode p-8 rounded-2xl border border-border shadow-xl">
          <h3 className="text-white/50 text-sm font-medium mb-3">Active Assets Held</h3>
          <p className="text-4xl font-bold text-white">{assets.length} Coins</p>
        </div>
        
        <div className="bg-darkmode p-8 rounded-2xl border border-border shadow-xl">
          <h3 className="text-white/50 text-sm font-medium mb-3">Fiat Purchasing Power</h3>
          <p className="text-4xl font-bold text-blue-400">${rawBalance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
        </div>
      </div>

      <div className="bg-darkmode p-8 rounded-2xl border border-border shadow-xl">
        <h2 className="text-xl font-bold mb-6">Recent Transactions</h2>
        {transactions.length === 0 ? (
          <div className="flex items-center justify-center p-12 border-2 border-dashed border-border rounded-xl">
            <p className="text-white/50">No recent transactions detected in your ledger.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-white/50 border-b border-border">
                  <th className="pb-4 font-normal px-2">Type</th>
                  <th className="pb-4 font-normal px-2">Asset</th>
                  <th className="pb-4 font-normal px-2 text-right">Amount</th>
                  <th className="pb-4 font-normal px-2 text-right">Total USD</th>
                  <th className="pb-4 font-normal px-2 text-right">Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-border/50 hover:bg-white/5 transition">
                    <td className={`py-4 px-2 font-bold ${tx.type === 'BUY' ? 'text-green-500' : 'text-primary'}`}>{tx.type}</td>
                    <td className="py-4 px-2 text-white uppercase">{tx.coinId || "USD"}</td>
                    <td className="py-4 px-2 text-white text-right">{tx.amount.toFixed(4)}</td>
                    <td className="py-4 px-2 text-white text-right font-medium">${tx.total.toLocaleString()}</td>
                    <td className="py-4 px-2 text-white/50 text-right text-sm">{tx.createdAt.toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
