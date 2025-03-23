import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import NotificationCenter from "./notification-center"

export const metadata: Metadata = {
  title: "Notificaciones | CULT & UNDERGROUND",
  description: "Centro de notificaciones de CULT & UNDERGROUND",
}

export default async function NotificationsPage() {
  // Obtener todas las notificaciones del usuario
  const notifications = await prisma.notification.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  // Transformar los datos para el cliente
  const formattedNotifications = await Promise.all(
    notifications.map(async (notification) => {
      const metadata: Record<string, any> = {}

      // Añadir metadatos según el tipo de notificación
      if (
        notification.type === "REVIEW" ||
        notification.type === "REVIEW_LIKE" ||
        notification.type === "REVIEW_COMMENT"
      ) {
        // Si es una notificación relacionada con una reseña, obtener datos de la reseña y película
        if (notification.referenceId) {
          const review = await prisma.review.findUnique({
            where: { id: notification.referenceId },
            include: {
              movie: true,
              user: true,
            },
          })

          if (review) {
            metadata.movieId = review.movieId
            metadata.movieTitle = review.movie.title
            metadata.moviePoster = review.movie.posterImage
            metadata.userName = review.user.username
            metadata.userImage = review.user.profilePicture
          }
        }
      } else if (notification.type === "FOLLOW") {
        // Si es una notificación de seguimiento, obtener datos del seguidor
        const followerInfo = await prisma.follower.findUnique({
          where: {
            id: notification.referenceId,
          },
          include: {
            follower: true,
          },
        })

        if (followerInfo) {
          metadata.followerId = followerInfo.followerId
          metadata.userName = followerInfo.follower.username
          metadata.userImage = followerInfo.follower.profilePicture
        }
      } else if (notification.type === "LIST") {
        // Si es una notificación de lista, obtener datos de la lista
        const list = await prisma.movieList.findUnique({
          where: { id: notification.referenceId },
          include: {
            user: true,
          },
        })

        if (list) {
          metadata.userName = list.user.username
          metadata.userImage = list.user.profilePicture
        }
      } else if (notification.type === "RECOMMENDATION") {
        // Si es una recomendación, obtener datos de la película
        const recommendation = await prisma.movieRecommendation.findUnique({
          where: { id: notification.referenceId },
          include: {
            movie: true,
          },
        })

        if (recommendation) {
          metadata.movieId = recommendation.movieId
          metadata.movieTitle = recommendation.movie.title
          metadata.moviePoster = recommendation.movie.posterImage
        }
      }

      return {
        id: notification.id,
        type: notification.type,
        content: notification.content,
        referenceId: notification.referenceId,
        isRead: notification.isRead,
        createdAt: notification.createdAt.toISOString(),
        userId: notification.userId,
        metadata,
      }
    }),
  )

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-white">Centro de Notificaciones</h1>
      <NotificationCenter initialNotifications={formattedNotifications} />
    </div>
  )
}

