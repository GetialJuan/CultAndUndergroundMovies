"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Compass, ChevronLeft, ChevronRight, Star, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

// Datos simulados para exploración de películas
const filmCategories = [
  {
    id: "recientes",
    name: "Recién Añadidas",
    films: [
      {
        id: 1,
        title: "Mandy",
        year: 2018,
        director: "Panos Cosmatos",
        poster: "/placeholder.svg?height=300&width=200",
        rating: 4.2,
      },
      {
        id: 2,
        title: "The Lighthouse",
        year: 2019,
        director: "Robert Eggers",
        poster: "/placeholder.svg?height=300&width=200",
        rating: 4.5,
      },
      {
        id: 3,
        title: "Climax",
        year: 2018,
        director: "Gaspar Noé",
        poster: "/placeholder.svg?height=300&width=200",
        rating: 4.1,
      },
      {
        id: 4,
        title: "Titane",
        year: 2021,
        director: "Julia Ducournau",
        poster: "/placeholder.svg?height=300&width=200",
        rating: 3.9,
      },
      {
        id: 5,
        title: "Possessor",
        year: 2020,
        director: "Brandon Cronenberg",
        poster: "/placeholder.svg?height=300&width=200",
        rating: 3.8,
      },
      {
        id: 6,
        title: "The Void",
        year: 2016,
        director: "Steven Kostanski",
        poster: "/placeholder.svg?height=300&width=200",
        rating: 3.7,
      },
    ],
  },
  {
    id: "clasicos",
    name: "Clásicos de Culto",
    films: [
      {
        id: 1,
        title: "Eraserhead",
        year: 1977,
        director: "David Lynch",
        poster: "/placeholder.svg?height=300&width=200",
        rating: 4.3,
      },
      {
        id: 2,
        title: "El Topo",
        year: 1970,
        director: "Alejandro Jodorowsky",
        poster: "/placeholder.svg?height=300&width=200",
        rating: 4.0,
      },
      {
        id: 3,
        title: "Suspiria",
        year: 1977,
        director: "Dario Argento",
        poster: "/placeholder.svg?height=300&width=200",
        rating: 4.4,
      },
      {
        id: 4,
        title: "Videodrome",
        year: 1983,
        director: "David Cronenberg",
        poster: "/placeholder.svg?height=300&width=200",
        rating: 4.2,
      },
      {
        id: 5,
        title: "Repo Man",
        year: 1984,
        director: "Alex Cox",
        poster: "/placeholder.svg?height=300&width=200",
        rating: 3.9,
      },
      {
        id: 6,
        title: "Tetsuo: The Iron Man",
        year: 1989,
        director: "Shinya Tsukamoto",
        poster: "/placeholder.svg?height=300&width=200",
        rating: 4.1,
      },
    ],
  },
  {
    id: "underground",
    name: "Underground",
    films: [
      {
        id: 1,
        title: "Begotten",
        year: 1990,
        director: "E. Elias Merhige",
        poster: "/placeholder.svg?height=300&width=200",
        rating: 3.8,
      },
      {
        id: 2,
        title: "Arrebato",
        year: 1979,
        director: "Iván Zulueta",
        poster: "/placeholder.svg?height=300&width=200",
        rating: 4.2,
      },
      {
        id: 3,
        title: "Gummo",
        year: 1997,
        director: "Harmony Korine",
        poster: "/placeholder.svg?height=300&width=200",
        rating: 3.7,
      },
      {
        id: 4,
        title: "Visitor Q",
        year: 2001,
        director: "Takashi Miike",
        poster: "/placeholder.svg?height=300&width=200",
        rating: 3.6,
      },
      {
        id: 5,
        title: "Angst",
        year: 1983,
        director: "Gerald Kargl",
        poster: "/placeholder.svg?height=300&width=200",
        rating: 4.0,
      },
      {
        id: 6,
        title: "Possession",
        year: 1981,
        director: "Andrzej Żuławski",
        poster: "/placeholder.svg?height=300&width=200",
        rating: 4.5,
      },
    ],
  },
]

export default function ExploreFilms() {
  const [activeTab, setActiveTab] = useState("recientes")
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" })
    }
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Compass className="h-5 w-5 text-red-500" />
          <h2 className="text-2xl font-bold">Explorar Películas</h2>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={scrollLeft}
            className="h-8 w-8 rounded-full border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Desplazar a la izquierda</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={scrollRight}
            className="h-8 w-8 rounded-full border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white"
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Desplazar a la derecha</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="recientes" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="border-b border-zinc-800 bg-transparent">
          {filmCategories.map((category) => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className="data-[state=active]:border-red-500 data-[state=active]:bg-transparent data-[state=active]:text-white"
            >
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {filmCategories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="mt-4">
            <div ref={scrollContainerRef} className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {category.films.map((film, index) => (
                <motion.div
                  key={film.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="min-w-[200px] flex-shrink-0"
                >
                  <Link href={`/films/${film.title.toLowerCase().replace(/\s+/g, "-")}`} className="group block">
                    <div className="relative aspect-[2/3] overflow-hidden rounded-md mb-2">
                      <Image
                        src={film.poster || "/placeholder.svg"}
                        alt={film.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-red-500 mr-1" />
                              <span className="text-sm">{film.rating}/5</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-full bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700 hover:text-white"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
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
        ))}
      </Tabs>
    </section>
  )
}

