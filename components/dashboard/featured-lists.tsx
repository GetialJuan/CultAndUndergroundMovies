"use client"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Star, ChevronRight, Film } from "lucide-react"

// Datos simulados para listas destacadas
const featuredLists = [
  {
    id: 1,
    title: "Joyas del Cine Surrealista",
    creator: "CinematicDreamer",
    count: 15,
    films: [
      {
        title: "El Ángel Exterminador",
        poster: "/placeholder.svg?height=60&width=40",
      },
      {
        title: "La Montaña Sagrada",
        poster: "/placeholder.svg?height=60&width=40",
      },
      {
        title: "Persona",
        poster: "/placeholder.svg?height=60&width=40",
      },
    ],
  },
  {
    id: 2,
    title: "Culto Asiático Extremo",
    creator: "AsianCinemaFan",
    count: 12,
    films: [
      {
        title: "Tetsuo: The Iron Man",
        poster: "/placeholder.svg?height=60&width=40",
      },
      {
        title: "Audition",
        poster: "/placeholder.svg?height=60&width=40",
      },
      {
        title: "Oldboy",
        poster: "/placeholder.svg?height=60&width=40",
      },
    ],
  },
  {
    id: 3,
    title: "Cine Experimental de los 70s",
    creator: "RetroFilmBuff",
    count: 18,
    films: [
      {
        title: "El Topo",
        poster: "/placeholder.svg?height=60&width=40",
      },
      {
        title: "Eraserhead",
        poster: "/placeholder.svg?height=60&width=40",
      },
      {
        title: "Sweet Movie",
        poster: "/placeholder.svg?height=60&width=40",
      },
    ],
  },
]

export default function FeaturedLists() {
  return (
    <section className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 text-red-500" />
          <h2 className="text-xl font-bold">Listas Destacadas</h2>
        </div>
        <Link href="/movie-lists" className="text-sm text-zinc-400 hover:text-white flex items-center">
          Ver todo <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      </div>

      <div className="space-y-4">
        {featuredLists.map((list, index) => (
          <motion.div
            key={list.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Link
              href={`/movie-lists/${list.title.toLowerCase().replace(/\s+/g, "-")}`}
              className="block p-3 rounded-md hover:bg-zinc-800/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium hover:text-red-400 transition-colors">{list.title}</h3>
                <span className="flex items-center text-xs text-zinc-400">
                  <Film className="h-3 w-3 mr-1" />
                  {list.count}
                </span>
              </div>
              <p className="text-xs text-zinc-500 mb-3">Por {list.creator}</p>
              <div className="flex gap-2">
                {list.films.map((film, filmIndex) => (
                  <div key={filmIndex} className="h-[60px] w-[40px] flex-shrink-0 overflow-hidden rounded">
                    <Image
                      src={film.poster || "/placeholder.svg"}
                      alt={film.title}
                      width={40}
                      height={60}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
                <div className="h-[60px] w-[40px] flex-shrink-0 flex items-center justify-center bg-zinc-800 rounded text-zinc-400 text-xs">
                  +{list.count - list.films.length}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

