"use client"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Activity, ChevronRight } from "lucide-react"

// Datos simulados para actividad reciente
const recentActivities = [
  {
    id: 1,
    type: "follow",
    user: {
      name: "FilmNoir42",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    timestamp: "Hace 2 horas",
  },
  {
    id: 2,
    type: "like",
    user: {
      name: "CinematicDreamer",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    content: "tu reseña de 'Eraserhead'",
    timestamp: "Hace 5 horas",
  },
  {
    id: 3,
    type: "comment",
    user: {
      name: "HorrorFanatic",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    content: "tu discusión sobre 'El cine de Cronenberg'",
    timestamp: "Hace 1 día",
  },
  {
    id: 4,
    type: "mention",
    user: {
      name: "AsianCinemaFan",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    content: "una publicación",
    timestamp: "Hace 2 días",
  },
]

export default function RecentActivity() {
  return (
    <section className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-red-500" />
          <h2 className="text-xl font-bold">Actividad Reciente</h2>
        </div>
        <Link href="/notifications" className="text-sm text-zinc-400 hover:text-white flex items-center">
          Ver todo <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      </div>

      <div className="space-y-3">
        {recentActivities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex gap-3 p-2 rounded-md hover:bg-zinc-800/50 transition-colors"
          >
            <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-full">
              <Image
                src={activity.user.avatar || "/placeholder.svg"}
                alt={activity.user.name}
                width={32}
                height={32}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="text-sm">
                <Link
                  href={`/profile/${activity.user.name.toLowerCase()}`}
                  className="font-medium hover:text-red-400 transition-colors"
                >
                  {activity.user.name}
                </Link>{" "}
                {activity.type === "follow" && "te ha seguido"}
                {activity.type === "like" && `ha dado me gusta a ${activity.content}`}
                {activity.type === "comment" && `ha comentado en ${activity.content}`}
                {activity.type === "mention" && `te ha mencionado en ${activity.content}`}
              </p>
              <p className="text-xs text-zinc-500">{activity.timestamp}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

