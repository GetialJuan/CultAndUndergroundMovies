"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { MessageSquare, Heart, Star, List, User } from "lucide-react"
import { useEffect } from "react"

// Tipos para las actividades
type ActivityType = "all" | "reviews" | "lists" | "likes" | "follows"

export default function ActivityFeed() {
  const [filter, setFilter] = useState<ActivityType>("all")
  const [all_activities, setAllActivities] = useState([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const [listsResponse, followersResponse] = await Promise.all([
          fetch("/api/movie-lists"),
          fetch("/api/users/d1ec699b-2fde-4204-a82f-ca9bb761c987/following")
        ])
        const lists = await listsResponse.json()
        const followers = await followersResponse.json()
        const activities = [
          ...lists.map(list => ({ type: "list", ...list })),
          ...followers.followers.map(follow => ({ type: "follow", ...follow }))
        ]
        setAllActivities(activities)
      } catch (error) {
        console.error("Error fetching activities:", error)
      }
    }
    fetchActivities()
  }, [])

  // Filtrar actividades según el tipo seleccionado
  const filteredActivities = all_activities.filter((activity) => {
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
            onClick={() => setFilter("lists")}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${
            filter === "lists" ? "bg-red-600 text-white" : "bg-zinc-800 hover:bg-zinc-700"
            }`}
        >
            <List className="inline-block mr-1 h-4 w-4" />
            Lists
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
                <div className="ml-3">
                  <Link href={`/user/${activity.userId}`} className="font-semibold hover:text-red-600">
                    {/* {activity.user.name} */}
                  </Link>
                  <div className="text-sm text-zinc-400">
                    {activity.type === "list" && "Your lists"}
                    {activity.type === "follow" && "Your follower"}
                    <span className="mx-1">·</span>
                  </div>
                </div>
              </div>

               {/* Contenido de la actividad */}
              {activity.type === "list" && (
                <div>
                  <Link href={`/list/${activity.id}`} className="font-bold text-lg hover:text-red-600">
                    {activity.name}
                  </Link>
                  <p className="text-sm text-zinc-400 mb-3">{activity._count.items} películas</p>
                  <div className="flex space-x-2 overflow-x-auto pb-2">
                    {activity.items?.length > 0 ? (
                      activity.items.map((movie) => (
                        <Link key={movie.movieId} href={`dashboard/film/${movie.movieId}`}>
                          <Image
                            src={movie.movie.posterImage || "/placeholder.svg"}
                            alt="Movie poster"
                            width={60}
                            height={80}
                            className="rounded-md hover:opacity-80 transition-opacity"
                          />
                        </Link>
                      ))
                    ) : (
                      <p className="text-sm text-gray-400">No hay películas en esta lista</p>
                    )}
                    <Link
                      key={`list-${activity.id}`}
                      href={`dashboard/movie-lists/${activity.id}`}
                      className="flex items-center justify-center w-[60px] h-[80px] bg-zinc-800 rounded-md hover:bg-zinc-700 transition-colors"
                    >
                      <span className="text-sm">+{activity._count.items - (activity.items?.length || 0)}</span>
                    </Link>
                  </div>
                </div>
              )}
               
              {activity.type === "follow" && (
                <div className="flex items-center">
                  <Link href={`/user/${activity.id}`}>
                    <Image
                      src={activity.profilePicture || "/placeholder.svg"}
                      alt={activity.username}
                      width={50}
                      height={50}
                      className="rounded-full"
                    />
                  </Link>
                  <div className="ml-4">
                    <Link href={`/profile/${activity.id}`} className="font-bold hover:text-red-600">
                      {activity.username}
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

