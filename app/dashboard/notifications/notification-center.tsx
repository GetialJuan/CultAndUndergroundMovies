"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import NotificationItem from "@/components/ui/notification-item"
import type { Notification } from "@/types/notification"

interface NotificationCenterProps {
  initialNotifications: Notification[]
}

export default function NotificationCenter({ initialNotifications }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)
  const [activeTab, setActiveTab] = useState<string>("all")

  const unreadNotifications = notifications.filter((n) => !n.isRead)
  const readNotifications = notifications.filter((n) => n.isRead)

  // Handle notifications read
  const handleNotificationRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true } 
          : notification
      )
    );
  };
  // const handleAllNotificationsRead = (ids: string[]) => {
  //   setNotifications(prev => 
  //     prev.map(notification => 
  //       ids.includes(notification.id) 
  //         ? { ...notification, isRead: true } 
  //         : notification
  //     )
  //   );
  // }; 

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

  const getFilteredNotifications = () => {
    switch (activeTab) {
      case "unread":
        return unreadNotifications
      case "read":
        return readNotifications
      default:
        return notifications
    }
  }

  const filteredNotifications = getFilteredNotifications()

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-md overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="bg-gray-800">
            <TabsTrigger value="all" className="data-[state=active]:bg-red-600">
              Todas
            </TabsTrigger>
            <TabsTrigger value="unread" className="data-[state=active]:bg-red-600">
              No leídas ({unreadNotifications.length})
            </TabsTrigger>
            <TabsTrigger value="read" className="data-[state=active]:bg-red-600">
              Leídas
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {unreadNotifications.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={markAllAsRead}
            className="ml-4 text-xs border-gray-700 hover:bg-gray-800 hover:text-white"
          >
            <Check className="h-3 w-3 mr-1" />
            Marcar todo como leído
          </Button>
        )}
      </div>

      <div className="divide-y divide-gray-800">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <NotificationItem 
              key={notification.id} 
              notification={notification} 
              onNotificationRead={handleNotificationRead} 
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <p>No hay notificaciones {activeTab === "unread" ? "sin leer" : activeTab === "read" ? "leídas" : ""}</p>
          </div>
        )}
      </div>
    </div>
  )
}

