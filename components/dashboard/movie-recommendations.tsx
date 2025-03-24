// Ruta: c:\Users\carlo\Documents\Universidad\Proyecto Integrador\CultAndUndergroundMovies\components\dashboard\movie-recommendations.tsx
'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Star,
  ChevronRight,
  Loader2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { MovieRecommendationResponse } from '@/lib/services/recommendations';
import { Button } from '@/components/ui/button';

export default function MovieRecommendations() {
  const [recommendations, setRecommendations] = useState<
    MovieRecommendationResponse[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/recommendations', {
        // Añadir cache: 'no-store' para evitar problemas de caché
        cache: 'no-store',
        // Añadir un parámetro timestamp para evitar caché del navegador
        headers: {
          Pragma: 'no-cache',
          'Cache-Control': 'no-cache',
        },
      });

      // Si el servidor responde con error, capturarlo apropiadamente
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error ||
            `Error ${response.status}: Error al obtener recomendaciones`
        );
      }

      const data = await response.json();
      setRecommendations(data);
    } catch (err: any) {
      console.error('Error obteniendo recomendaciones:', err);
      setError(
        err.message ||
          'No pudimos cargar tus recomendaciones. Por favor, intenta más tarde.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const handleRecommendationClick = async (movieId: string) => {
    try {
      // Marcar la recomendación como vista cuando se hace clic
      await fetch('/api/recommendations/viewed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ movieId }),
      });
    } catch (err) {
      console.error('Error marcando recomendación como vista:', err);
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
          Intentar nuevamente
        </Button>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="text-center py-6 text-zinc-500">
        <p>No hay recomendaciones disponibles en este momento.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {recommendations.map((movie) => (
        <div
          key={movie.id}
          className="bg-zinc-900 rounded-lg p-3 hover:bg-zinc-800 transition-colors"
        >
          <Link
            href={`/dashboard/film/${movie.id}`}
            className="flex"
            onClick={() => handleRecommendationClick(movie.id)}
          >
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
                <span className="text-zinc-400 font-normal">
                  ({movie.year})
                </span>
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
        Explorar más películas
        <ChevronRight className="inline-block ml-1 h-4 w-4" />
      </Link>
    </div>
  );
}
