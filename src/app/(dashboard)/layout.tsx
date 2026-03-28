import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession()

  // Double layer protection: Server-side check
  if (!session) {
    redirect("/")
  }

  return (
    <section className="relative pt-32 pb-20">
      <div className="bg-banner-image absolute w-full h-[600px] top-0 blur-390 pointer-events-none -z-10"></div>
      <main className="w-full min-h-[70vh] container relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Responsive Sidebar (Horizontal on Mobile, Vertical on Desktop) */}
        <aside className="w-full lg:w-72 bg-darkmode p-6 rounded-2xl border border-border shadow-xl h-fit shrink-0">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center font-bold text-lg text-white">
              {session.user?.name?.[0]?.toUpperCase() || session.user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="truncate">
              <p className="font-semibold text-white truncate">{session.user?.name || 'User'}</p>
              <p className="text-sm text-white/50 truncate w-40">{session.user?.email}</p>
            </div>
          </div>
          
          <nav className="flex lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide">
            <Link href="/dashboard" className="px-5 py-3 hover:bg-white/5 text-white/70 rounded-xl whitespace-nowrap text-center lg:text-left font-medium transition">Dashboard Overview</Link>
            <Link href="/dashboard/wallet" className="px-5 py-3 hover:bg-white/5 text-white/70 rounded-xl whitespace-nowrap text-center lg:text-left font-medium transition">Wallet & Assets</Link>
            <Link href="/dashboard/settings" className="px-5 py-3 hover:bg-white/5 text-white/70 rounded-xl whitespace-nowrap text-center lg:text-left font-medium transition">Account Settings</Link>
          </nav>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 w-full overflow-hidden">
          {children}
        </div>

        </div>
      </main>
    </section>
  )
}
