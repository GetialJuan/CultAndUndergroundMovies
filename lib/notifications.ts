import { prisma } from "@/lib/prisma";

// Crear una notificación
export async function createNotification(
  userId: string,
  type: string,
  content: string,
  referenceId?: string
) {
  return await prisma.notification.create({
    data: {
      userId,
      type,
      content,
      referenceId,
    },
  });
}

// Obtener notificaciones de un usuario
export async function getUserNotifications(userId: string) {
  return await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

// Marcar una notificación como leída
export async function markNotificationAsRead(notificationId: string) {
  return await prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true },
  });
}
