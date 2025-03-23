"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { Check } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import type { Notification } from "@/types/notification"

// Añade un prop onNotificationRead para notificar al padre
interface NotificationItemProps {
  notification: Notification;
  onClose?: () => void;
  onNotificationRead?: (id: string) => void; // Añadir este prop
  onAllNotificationsRead?: (ids: string[]) => void; // Añadir este prop
}

export default function NotificationItem({ notification, onClose, onNotificationRead, onAllNotificationsRead }: NotificationItemProps) {
  const [isRead, setIsRead] = useState(notification.isRead)

  const markAsRead = async (e: React.MouseEvent) => {
    e.stopPropagation()

    if (isRead) return

    try {
      const response = await fetch(`/api/notifications/${notification.id}/read`, {
        method: "POST",
      })

      if (response.ok) {
        setIsRead(true)
        // Notificar al componente padre que esta notificación ha sido leída
        onNotificationRead?.(notification.id);
      }
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  // Determinar la URL de destino según el tipo de notificación
  const getDestinationUrl = () => {
    const referenceId = notification.referenceId

    switch (notification.type) {
      case "REVIEW":
      case "REVIEW_LIKE":
      case "REVIEW_COMMENT":
        return `/movies/${notification.metadata?.movieId}/reviews/${referenceId}`
      case "FOLLOW":
        return `/profile/${notification.metadata?.followerId}`
      case "LIST":
        return `/lists/${referenceId}`
      case "RECOMMENDATION":
        return `/movies/${notification.metadata?.movieId}`
      default:
        return "#"
    }
  }

  // Obtener avatar según el tipo de notificación
  const getAvatar = () => {
    // Si es una notificación de usuario (seguidor, etc.)
    if (notification.metadata?.userImage) {
      return notification.metadata.userImage
    }

    // Si es una notificación de película
    if (notification.metadata?.moviePoster) {
      return notification.metadata.moviePoster
    }

    return null
  }

  // Obtener iniciales para el avatar fallback
  const getAvatarFallback = () => {
    if (notification.metadata?.userName) {
      return notification.metadata.userName.substring(0, 2).toUpperCase()
    }

    if (notification.metadata?.movieTitle) {
      return notification.metadata.movieTitle.substring(0, 2).toUpperCase()
    }

    return "NU"
  }

  const handleClick = () => {
    if (!isRead) {
      markAsRead({ stopPropagation: () => {} } as React.MouseEvent)
    }
    onClose?.()
  }

  return (
    <Link
      href={getDestinationUrl()}
      onClick={handleClick}
      className={`flex items-start p-3 hover:bg-gray-800 transition-colors ${!isRead ? "bg-gray-800/50" : ""}`}
    >
      <Avatar className="h-10 w-10 mr-3 flex-shrink-0">
        <AvatarImage src={getAvatar() || ""} alt="Avatar" />
        <AvatarFallback className="bg-gray-700">{getAvatarFallback()}</AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <p className="text-sm text-white">{notification.content}</p>
        <p className="text-xs text-gray-400 mt-1">
          {formatDistanceToNow(new Date(notification.createdAt), {
            addSuffix: true,
            locale: es,
          })}
        </p>
      </div>

      {!isRead && (
        <Button
          variant="ghost"
          size="sm"
          className="ml-2 h-6 w-6 p-0 rounded-full bg-gray-700 hover:bg-gray-600"
          onClick={markAsRead}
        >
          <Check className="h-3 w-3" />
          <span className="sr-only">Marcar como leída</span>
        </Button>
      )}
    </Link>
  )
}

