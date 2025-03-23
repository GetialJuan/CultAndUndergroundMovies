"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Star, ChevronRight, Loader2 } from "lucide-react"
import { MovieRecommendationResponse } from "@/lib/services/recommendations"

// Fallback recommendations in case API fails or user is not logged in
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
  const [recommendations, setRecommendations] = useState<MovieRecommendationResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/recommendations')
        
        if (!response.ok) {
          throw new Error('Failed to fetch recommendations')
        }
        
        const data = await response.json()
        setRecommendations(data)
      } catch (err) {
        console.error('Error fetching recommendations:', err)
        setError('No pudimos cargar tus recomendaciones')
        // Fall back to mock data if API fails
        setRecommendations(MOCK_RECOMMENDATIONS.map(movie => ({
          id: String(movie.id),
          title: movie.title,
          poster: movie.poster,
          year: movie.year,
          director: movie.director || null,
          rating: movie.rating,
          reason: movie.reason
        })))
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendations()
  }, [])

  const handleRecommendationClick = async (movieId: string) => {
    try {
      // Mark the recommendation as viewed when clicked
      await fetch('/api/recommendations/viewed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ movieId }),
      })
    } catch (err) {
      console.error('Error marking recommendation as viewed:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
      </div>
    )
  }

  if (error && recommendations.length === 0) {
    return (
      <div className="text-center py-6 text-zinc-500">
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {recommendations.map((movie) => (
        <div key={movie.id} className="bg-zinc-900 rounded-lg p-3 hover:bg-zinc-800 transition-colors">
          <Link 
            href={`/film/${movie.id}`} 
            className="flex"
            onClick={() => handleRecommendationClick(movie.id)}
          >
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
                <span className="ml-1 text-xs">{movie.rating.toFixed(1)}</span>
              </div>
              <p className="text-xs text-zinc-500 mt-1">{movie.reason}</p>
            </div>
          </Link>
        </div>
      ))}

      <Link
        href="/explore"
        className="block text-center py-3 bg-zinc-900 hover:bg-zinc-800 rounded-lg text-sm transition-colors"
      >
        Explorar más películas
        <ChevronRight className="inline-block ml-1 h-4 w-4" />
      </Link>
    </div>
  )
}

