"use client"

import { Icon } from '@iconify/react/dist/iconify.js'
import { useState, useEffect } from 'react'
import { getUnreadNotifications, markNotificationsAsRead } from '@/app/actions/notificationActions'

export default function NotificationBell() {
  const [count, setCount] = useState(0)
  const [notifications, setNotifications] = useState<any[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const fetchNotifications = async () => {
    const res = await getUnreadNotifications()
    if (res.success) {
      setCount(res.count)
      setNotifications(res.notifications)
    }
  }

  useEffect(() => {
    fetchNotifications()
    // Poll every 30 seconds
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleOpen = async () => {
    setIsOpen(!isOpen)
    if (!isOpen && count > 0) {
      // Mark as read immediately in DB when opened
      await markNotificationsAsRead()
      setCount(0)
    }
  }

  return (
    <div className="relative">
      <button onClick={handleOpen} className="relative p-2 text-white hover:text-primary transition duration-300">
        <Icon icon="tabler:bell" className="text-2xl" />
        {count > 0 && (
           <span className=" абсолюте absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center font-bold animate-pulse">
             {count}
           </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-darkmode border border-border rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="p-4 border-b border-border bg-body-bg flex justify-between items-center">
            <h3 className="text-white font-bold">Notifications</h3>
            {count > 0 && <span className="text-xs text-primary font-bold">{count} New</span>}
          </div>
          <div className="max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-white/50 text-sm">
                You're all caught up!
              </div>
            ) : (
              notifications.map((n) => (
                <div key={n.id} className="p-4 border-b border-border/50 hover:bg-white/5 transition flex flex-col gap-1">
                  <span className="text-sm font-bold text-white">{n.title}</span>
                  <p className="text-xs text-white/50">{n.message}</p>
                  <span className="text-[10px] text-white/30 text-right mt-2">{new Date(n.createdAt).toLocaleTimeString()}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
