"use client"
import Image from "next/image"
import Link from "next/link"
import { Star, ChevronRight } from "lucide-react"

// Datos de ejemplo para recomendaciones
const MOCK_RECOMMENDATIONS = [
  {
    id: 1,
    title: "Videodrome",
    poster: "/placeholder.svg?height=180&width=120",
    year: 1983,
    director: "David Cronenberg",
    rating: 4.2,
    reason: "Basado en tu interés en películas de David Lynch",
  },
  {
    id: 2,
    title: "Possession",
    poster: "/placeholder.svg?height=180&width=120",
    year: 1981,
    director: "Andrzej Żuławski",
    rating: 4.0,
    reason: 'Basado en tu lista "Horror Psicológico"',
  },
  {
    id: 3,
    title: "Holy Motors",
    poster: "/placeholder.svg?height=180&width=120",
    year: 2012,
    director: "Leos Carax",
    rating: 3.9,
    reason: "Recomendado por usuarios con gustos similares",
  },
  {
    id: 4,
    title: "Suspiria",
    poster: "/placeholder.svg?height=180&width=120",
    year: 1977,
    director: "Dario Argento",
    rating: 4.3,
    reason: "Basado en tus calificaciones recientes",
  },
]

export default function MovieRecommendations() {
  return (
    <div className="space-y-4">
      {MOCK_RECOMMENDATIONS.map((movie) => (
        <div key={movie.id} className="bg-zinc-900 rounded-lg p-3 hover:bg-zinc-800 transition-colors">
          <Link href={`/film/${movie.id}`} className="flex">
            <Image
              src={movie.poster || "/placeholder.svg"}
              alt={movie.title}
              width={60}
              height={90}
              className="rounded-md"
            />
            <div className="ml-3 flex-1">
              <h3 className="font-bold">
                {movie.title} <span className="text-zinc-400 font-normal">({movie.year})</span>
              </h3>
              <p className="text-sm text-zinc-400">{movie.director}</p>
              <div className="flex items-center mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < Math.floor(movie.rating)
                        ? "fill-yellow-500 text-yellow-500"
                        : i < movie.rating
                          ? "fill-yellow-500 text-yellow-500 fill-opacity-50"
                          : "text-zinc-600"
                    }`}
                  />
                ))}
                <span className="ml-1 text-xs">{movie.rating}</span>
              </div>
              <p className="text-xs text-zinc-500 mt-1">{movie.reason}</p>
            </div>
          </Link>
        </div>
      ))}

      <Link
        href="/recommendations"
        className="block text-center py-3 bg-zinc-900 hover:bg-zinc-800 rounded-lg text-sm transition-colors"
      >
        View all recommendations
        <ChevronRight className="inline-block ml-1 h-4 w-4" />
      </Link>
    </div>
  )
}

