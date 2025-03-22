"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { TrendingUp, ChevronRight, MessageSquare, Heart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

// Datos simulados para tendencias
const trendingFilms = [
  {
    id: 1,
    title: "Possession",
    year: 1981,
    director: "Andrzej Żuławski",
    poster: "/placeholder.svg?height=150&width=100",
    activity: "+128% esta semana",
  },
  {
    id: 2,
    title: "Videodrome",
    year: 1983,
    director: "David Cronenberg",
    poster: "/placeholder.svg?height=150&width=100",
    activity: "+95% esta semana",
  },
  {
    id: 3,
    title: "Suspiria",
    year: 1977,
    director: "Dario Argento",
    poster: "/placeholder.svg?height=150&width=100",
    activity: "+82% esta semana",
  },
  {
    id: 4,
    title: "El Topo",
    year: 1970,
    director: "Alejandro Jodorowsky",
    poster: "/placeholder.svg?height=150&width=100",
    activity: "+74% esta semana",
  },
]

const trendingDiscussions = [
  {
    id: 1,
    title: "¿Es 'Donnie Darko' realmente una película de culto o solo es pretenciosa?",
    user: {
      name: "FilmDebater",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    comments: 48,
    likes: 76,
    timestamp: "Hace 2 días",
  },
  {
    id: 2,
    title: "Las mejores películas de culto asiáticas que deberías ver al menos una vez",
    user: {
      name: "AsianCinemaFan",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    comments: 35,
    likes: 92,
    timestamp: "Hace 3 días",
  },
  {
    id: 3,
    title: "Debate: ¿Cuál es la mejor película de David Lynch?",
    user: {
      name: "LynchianWorld",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    comments: 67,
    likes: 54,
    timestamp: "Hace 1 semana",
  },
]

export default function TrendingSection() {
  const [activeTab, setActiveTab] = useState("peliculas")

  return (
    <section className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-red-500" />
          <h2 className="text-xl font-bold">Tendencias</h2>
        </div>
        <Link href="/trending" className="text-sm text-zinc-400 hover:text-white flex items-center">
          Ver todo <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      </div>

      <Tabs defaultValue="peliculas" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="border-b border-zinc-800 bg-transparent mb-4">
          <TabsTrigger
            value="peliculas"
            className="data-[state=active]:border-red-500 data-[state=active]:bg-transparent data-[state=active]:text-white"
          >
            Películas
          </TabsTrigger>
          <TabsTrigger
            value="discusiones"
            className="data-[state=active]:border-red-500 data-[state=active]:bg-transparent data-[state=active]:text-white"
          >
            Discusiones
          </TabsTrigger>
        </TabsList>

        <TabsContent value="peliculas" className="space-y-0">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trendingFilms.map((film, index) => (
              <motion.div
                key={film.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Link href={`/films/${film.title.toLowerCase().replace(/\s+/g, "-")}`} className="group block">
                  <div className="relative aspect-[2/3] overflow-hidden rounded-md mb-2">
                    <Image
                      src={film.poster || "/placeholder.svg"}
                      alt={film.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                      <span className="flex items-center text-xs font-medium text-red-400">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {film.activity}
                      </span>
                    </div>
                  </div>
                  <h3 className="font-medium group-hover:text-red-400 transition-colors">{film.title}</h3>
                  <p className="text-xs text-zinc-400">
                    {film.year} • {film.director}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="discusiones" className="space-y-3">
          {trendingDiscussions.map((discussion, index) => (
            <motion.div
              key={discussion.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Link
                href={`/discussions/${discussion.id}`}
                className="flex gap-4 p-3 rounded-md hover:bg-zinc-800/50 transition-colors"
              >
                <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full">
                  <Image
                    src={discussion.user.avatar || "/placeholder.svg"}
                    alt={discussion.user.name}
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium hover:text-red-400 transition-colors">{discussion.title}</h3>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-xs text-zinc-400">{discussion.user.name}</span>
                    <span className="text-xs text-zinc-500">{discussion.timestamp}</span>
                    <div className="flex items-center text-xs text-zinc-400">
                      <MessageSquare className="h-3 w-3 mr-1" />
                      {discussion.comments}
                    </div>
                    <div className="flex items-center text-xs text-zinc-400">
                      <Heart className="h-3 w-3 mr-1" />
                      {discussion.likes}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}

          <div className="text-center mt-4">
            <Button
              variant="outline"
              size="sm"
              className="border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white"
            >
              Ver más discusiones
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </section>
  )
}

