"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Check, ChevronRight } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import NotificationItem from "./notification-item"
import type { Notification } from "@/types/notification"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"

interface NotificationDropdownProps {
  onClose: () => void
}

export default function NotificationDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true)
      try {
        const response = await fetch("/api/notifications?limit=4")
        if (response.ok) {
          const data = await response.json()
          setNotifications(data.notifications)
        }
      } catch (error) {
        console.error("Error fetching notifications:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [])

  const handleNotificationRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true } 
          : notification
      )
    );
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch("/api/notifications/read-all", {
        method: "POST",
      })

      if (response.ok) {
        setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })))
        
      }
    } catch (error) {
      console.error("Error marking notifications as read:", error)
    }
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <h3 className="font-medium text-lg">Notifications</h3>
        {/* <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs text-gray-400 hover:text-white">
          <Check className="h-3 w-3 mr-1" />
          Marcar todo como leído
        </Button> */}
      </div>

      <ScrollArea className="h-[380px]">
        {loading ? (
          <div className="flex justify-center items-center h-20">
            <div className="animate-spin h-5 w-5 border-2 border-red-600 rounded-full border-t-transparent"></div>
          </div>
        ) : notifications.length > 0 ? (
          <div className="py-1">
            {notifications.map((notification) => (
              <NotificationItem key={notification.id} notification={notification}  onNotificationRead={handleNotificationRead} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-20 text-gray-500 text-sm">
            <p>No notifications available</p>
          </div>
        )}
      </ScrollArea>

      <div className="p-2 border-t border-gray-800">
        <Link
          href="/dashboard/notifications"
          className="flex items-center justify-center p-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors"
          
        >
          View all notifications
          <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      </div>
    </div>
  )
}

