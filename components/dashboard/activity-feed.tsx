"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { MessageSquare, Heart, Star, List, User } from "lucide-react"

// Tipos para las actividades
type ActivityType = "all" | "reviews" | "lists" | "likes" | "follows"

// Datos de ejemplo para el feed
const MOCK_ACTIVITIES = [
  {
    id: 1,
    type: "review",
    user: {
      id: 101,
      name: "Carlos Mendoza",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: {
      movie: {
        id: 201,
        title: "Eraserhead",
        poster: "/placeholder.svg?height=120&width=80",
        year: 1977,
        director: "David Lynch",
      },
      rating: 4.5,
      text: "Una obra maestra surrealista que desafía toda convención narrativa. Lynch crea una atmósfera inquietante que se queda contigo mucho después de terminar la película.",
    },
    timestamp: "2 horas atrás",
  },
  {
    id: 2,
    type: "list",
    user: {
      id: 102,
      name: "Ana García",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: {
      list: {
        id: 301,
        title: "Cine de culto japonés de los 90s",
        count: 12,
      },
      movies: [
        { id: 202, poster: "/placeholder.svg?height=80&width=60" },
        { id: 203, poster: "/placeholder.svg?height=80&width=60" },
        { id: 204, poster: "/placeholder.svg?height=80&width=60" },
      ],
    },
    timestamp: "5 horas atrás",
  },
  {
    id: 3,
    type: "like",
    user: {
      id: 103,
      name: "Miguel Ángel",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: {
      movie: {
        id: 205,
        title: "El Topo",
        poster: "/placeholder.svg?height=120&width=80",
        year: 1970,
        director: "Alejandro Jodorowsky",
      },
    },
    timestamp: "1 día atrás",
  },
  {
    id: 4,
    type: "follow",
    user: {
      id: 104,
      name: "Laura Martínez",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: {
      followedUser: {
        id: 105,
        name: "Roberto Sánchez",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
    timestamp: "2 días atrás",
  },
]

export default function ActivityFeed() {
  const [filter, setFilter] = useState<ActivityType>("all")

  // Filtrar actividades según el tipo seleccionado
  const filteredActivities = MOCK_ACTIVITIES.filter((activity) => {
    if (filter === "all") return true
    if (filter === "reviews") return activity.type === "review"
    if (filter === "lists") return activity.type === "list"
    if (filter === "likes") return activity.type === "like"
    if (filter === "follows") return activity.type === "follow"
    return true
  })

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="flex overflow-x-auto pb-2 space-x-2">
        <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${
            filter === "all" ? "bg-red-600 text-white" : "bg-zinc-800 hover:bg-zinc-700"
            }`}
        >
            All Activities
        </button>
        <button
            onClick={() => setFilter("reviews")}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${
            filter === "reviews" ? "bg-red-600 text-white" : "bg-zinc-800 hover:bg-zinc-700"
            }`}
        >
            <MessageSquare className="inline-block mr-1 h-4 w-4" />
            Reviews
        </button>
        <button
            onClick={() => setFilter("lists")}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${
            filter === "lists" ? "bg-red-600 text-white" : "bg-zinc-800 hover:bg-zinc-700"
            }`}
        >
            <List className="inline-block mr-1 h-4 w-4" />
            Lists
        </button>
        <button
            onClick={() => setFilter("likes")}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${
            filter === "likes" ? "bg-red-600 text-white" : "bg-zinc-800 hover:bg-zinc-700"
            }`}
        >
            <Heart className="inline-block mr-1 h-4 w-4" />
            Likes
        </button>
        <button
            onClick={() => setFilter("follows")}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${
            filter === "follows" ? "bg-red-600 text-white" : "bg-zinc-800 hover:bg-zinc-700"
            }`}
        >
            <User className="inline-block mr-1 h-4 w-4" />
            Following
        </button>
    </div>

      {/* Lista de actividades */}
      <div className="space-y-4">
        {filteredActivities.length === 0 ? (
          <div className="text-center py-8 bg-zinc-900 rounded-lg">
            <p className="text-zinc-400">No activities to show</p>
          </div>
        ) : (
          filteredActivities.map((activity) => (
            <div key={activity.id} className="bg-zinc-900 rounded-lg p-4">
              {/* Encabezado de la actividad */}
              <div className="flex items-center mb-3">
                <Image
                  src={activity.user.avatar || "/placeholder.svg"}
                  alt={activity.user.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div className="ml-3">
                  <Link href={`/user/${activity.user.id}`} className="font-semibold hover:text-red-600">
                    {activity.user.name}
                  </Link>
                  <div className="text-sm text-zinc-400">
                    {activity.type === "review" && "escribió una reseña"}
                    {activity.type === "list" && "actualizó una lista"}
                    {activity.type === "like" && "le gustó una película"}
                    {activity.type === "follow" && "siguió a un usuario"}
                    <span className="mx-1">·</span>
                    {activity.timestamp}
                  </div>
                </div>
              </div>

              {/* Contenido de la actividad */}
              {activity.type === "review" && (
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href={`/film/${activity.content.movie.id}`} className="shrink-0">
                    <Image
                      src={activity.content.movie.poster || "/placeholder.svg"}
                      alt={activity.content.movie.title}
                      width={80}
                      height={120}
                      className="rounded-md"
                    />
                  </Link>
                  <div>
                    <Link href={`/film/${activity.content.movie.id}`} className="font-bold text-lg hover:text-red-600">
                      {activity.content.movie.title}{" "}
                      <span className="text-zinc-400 font-normal">({activity.content.movie.year})</span>
                    </Link>
                    <div className="flex items-center my-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(activity.content.rating)
                              ? "fill-yellow-500 text-yellow-500"
                              : i < activity.content.rating
                                ? "fill-yellow-500 text-yellow-500 fill-opacity-50"
                                : "text-zinc-600"
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm">{activity.content.rating}/5</span>
                    </div>
                    <p className="text-zinc-300 mt-2">{activity.content.text}</p>
                  </div>
                </div>
              )}

              {activity.type === "list" && (
                <div>
                  <Link href={`/list/${activity.content.list.id}`} className="font-bold text-lg hover:text-red-600">
                    {activity.content.list.title}
                  </Link>
                  <p className="text-sm text-zinc-400 mb-3">{activity.content.list.count} películas</p>
                  <div className="flex space-x-2 overflow-x-auto pb-2">
                    {activity.content.movies.map((movie) => (
                      <Link key={movie.id} href={`/film/${movie.id}`}>
                        <Image
                          src={movie.poster || "/placeholder.svg"}
                          alt="Movie poster"
                          width={60}
                          height={80}
                          className="rounded-md hover:opacity-80 transition-opacity"
                        />
                      </Link>
                    ))}
                    <Link
                      href={`/list/${activity.content.list.id}`}
                      className="flex items-center justify-center w-[60px] h-[80px] bg-zinc-800 rounded-md hover:bg-zinc-700 transition-colors"
                    >
                      <span className="text-sm">+{activity.content.list.count - activity.content.movies.length}</span>
                    </Link>
                  </div>
                </div>
              )}

              {activity.type === "like" && (
                <div className="flex items-center">
                  <Link href={`/film/${activity.content.movie.id}`} className="shrink-0">
                    <Image
                      src={activity.content.movie.poster || "/placeholder.svg"}
                      alt={activity.content.movie.title}
                      width={60}
                      height={90}
                      className="rounded-md"
                    />
                  </Link>
                  <div className="ml-4">
                    <Link href={`/film/${activity.content.movie.id}`} className="font-bold hover:text-red-600">
                      {activity.content.movie.title}{" "}
                      <span className="text-zinc-400 font-normal">({activity.content.movie.year})</span>
                    </Link>
                    <p className="text-sm text-zinc-400">Director: {activity.content.movie.director}</p>
                  </div>
                </div>
              )}

              {activity.type === "follow" && (
                <div className="flex items-center">
                  <Link href={`/user/${activity.content.followedUser.id}`}>
                    <Image
                      src={activity.content.followedUser.avatar || "/placeholder.svg"}
                      alt={activity.content.followedUser.name}
                      width={50}
                      height={50}
                      className="rounded-full"
                    />
                  </Link>
                  <div className="ml-4">
                    <Link href={`/user/${activity.content.followedUser.id}`} className="font-bold hover:text-red-600">
                      {activity.content.followedUser.name}
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

