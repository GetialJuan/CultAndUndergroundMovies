/**
 * @fileoverview MovieRecommendations component that fetches and displays a list of recommended movies.
 * The component handles loading states, errors, and allows users to mark movies as viewed.
 * 
 * @component
 * @example
 * import MovieRecommendations from '@/components/dashboard/movie-recommendations';
 * 
 * function Dashboard() {
 *   return <MovieRecommendations />;
 * }
 * 
 * export default Dashboard;
 */

'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ChevronRight, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { MovieRecommendationResponse } from '@/lib/services/recommendations';
import { Button } from '@/components/ui/button';

/**
 * MovieRecommendations component displays a list of recommended movies.
 * Fetches recommendations from an API and handles user interactions.
 * 
 * @returns {JSX.Element} The rendered component.
 */
export default function MovieRecommendations() {
  const [recommendations, setRecommendations] = useState<MovieRecommendationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches movie recommendations from the API.
   * Updates the component's state with the fetched data.
   * 
   * @async
   * @returns {Promise<void>}
   */
  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/recommendations', {
        cache: 'no-store',
        headers: {
          Pragma: 'no-cache',
          'Cache-Control': 'no-cache',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Error ${response.status}: Failed to fetch recommendations`
        );
      }

      const data = await response.json();
      setRecommendations(data);
    } catch (err: any) {
      console.error('Error fetching recommendations:', err);
      setError(err.message || 'Failed to load recommendations. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  /**
   * Marks a movie recommendation as viewed when clicked.
   * 
   * @async
   * @param {string} movieId - The ID of the movie to mark as viewed.
   * @returns {Promise<void>}
   */
  const handleRecommendationClick = async (movieId: string) => {
    try {
      await fetch('/api/recommendations/viewed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ movieId }),
      });
    } catch (err) {
      console.error('Error marking recommendation as viewed:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 text-red-400 rounded-lg p-4">
        <div className="flex items-center mb-3">
          <AlertCircle className="h-5 w-5 mr-2" />
          <p>{error}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="mt-2 mx-auto block border-red-800 text-red-400 hover:bg-red-900/30"
          onClick={() => fetchRecommendations()}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Try again
        </Button>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="text-center py-6 text-zinc-500">
        <p>No recommendations available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {recommendations.map((movie) => (
        <div key={movie.id} className="bg-zinc-900 rounded-lg p-3 hover:bg-zinc-800 transition-colors">
          <Link href={`/dashboard/film/${movie.id}`} className="flex" onClick={() => handleRecommendationClick(movie.id)}>
            <Image
              src={movie.poster || '/placeholder.svg?height=180&width=120'}
              alt={movie.title}
              width={60}
              height={90}
              className="rounded-md"
            />
            <div className="ml-3 flex-1">
              <h3 className="font-bold">
                {movie.title}{' '}
                <span className="text-zinc-400 font-normal">({movie.year})</span>
              </h3>
              <p className="text-sm text-zinc-400">{movie.director}</p>
              <div className="flex items-center mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < Math.floor(movie.rating)
                        ? 'fill-yellow-500 text-yellow-500'
                        : i < movie.rating
                        ? 'fill-yellow-500 text-yellow-500 fill-opacity-50'
                        : 'text-zinc-600'
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
        href="/dashboard/explore"
        className="block text-center py-3 bg-zinc-900 hover:bg-zinc-800 rounded-lg text-sm transition-colors"
      >
        Explore more movies
        <ChevronRight className="inline-block ml-1 h-4 w-4" />
      </Link>
    </div>
  );
}
