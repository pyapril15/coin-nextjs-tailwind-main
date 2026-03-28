import { getServerSession } from "next-auth/next"
import prisma from "@/lib/prisma"
import SettingsClient from "./SettingsClient"
import SecurityClient from "./SecurityClient"
import GdprClient from "./GdprClient"

export const metadata = {
  title: 'Data & Privacy Settings | Enterprise CoinPlatform',
}

export default async function SettingsPage() {
  const session = await getServerSession()
  if (!session?.user?.email) return null;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { activityLogs: { orderBy: { createdAt: 'desc' }, take: 10 } }
  })

  return (
    <div className="pb-12">
      <h1 className="text-4xl font-bold mb-8">Account Protocol <span className="text-primary">Settings</span></h1>
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
        {/* Data Configuration & Deletion */}
        <div className="flex flex-col">
          <SettingsClient currentName={user?.name || ""} currentEmail={session.user.email!} />
          <GdprClient />
        </div>

        {/* Security & Access Logs */}
        <div className="flex flex-col">
           <SecurityClient mfaEnabled={user?.mfaEnabled || false} activityLogs={user?.activityLogs || []} />
        </div>
      </div>
    </div>
  )
}
