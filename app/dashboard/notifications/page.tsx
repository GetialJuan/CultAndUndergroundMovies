'use client';

import NotificationCenter from './notification-center';
import type { Notification } from '@/types/notification';
import { useEffect, useState } from 'react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const response = await fetch('/api/notifications');
        const data = await response.json();
  
        if (!data.notifications || !Array.isArray(data.notifications)) {
          console.error("La respuesta de la API no contiene un array:", data);
          return;
        }
  
        // Transformar las notificaciones antes de establecerlas en el estado
        const formattedNotifications: Notification[] = data.notifications.map(
          (notification: Notification) => ({
            ...notification,
            referenceId: notification.referenceId || undefined, // Convertir null a undefined
            createdAt: new Date(notification.createdAt).toISOString(),
          })
        );
  
        setNotifications(formattedNotifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    }
  
    fetchNotifications();
  }, []);
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-white">
        Centro de Notificaciones
      </h1>

      {loading ? (
        <p className="text-white">Cargando notificaciones...</p>
      ) : (
        <NotificationCenter initialNotifications={notifications} />
      )}
    </div>
  );
}

