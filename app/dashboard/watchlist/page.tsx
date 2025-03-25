'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, Film, Plus, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

type HistoryMovie = {
  id: string;
  title: string;
  releaseYear: number;
  director?: string;
  posterImage?: string;
  genres: string[];
  viewedAt: string;
};

export default function ViewingHistoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [history, setHistory] = useState<HistoryMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchViewingHistory();
    }
  }, [status]);

  const fetchViewingHistory = async () => {
    try {
      const response = await fetch('/api/viewing-history');

      if (!response.ok) {
        throw new Error('Error al obtener el historial');
      }

      const data = await response.json();
      setHistory(data.history);
    } catch (err) {
      console.error('Error al obtener historial:', err);
      setError(
        'No se pudo cargar tu historial de visualización. Por favor, inténtalo más tarde.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-zinc-900 border border-red-800 p-4 rounded-lg text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-400">{error}</p>
          <Button
            variant="outline"
            className="mt-4 border-zinc-700 hover:bg-zinc-800"
            onClick={fetchViewingHistory}
          >
            Intentar de Nuevo
          </Button>
        </div>
      </div>
    );
  }

  // Agrupar películas por mes/año
  const groupedMovies = history.reduce((groups, movie) => {
    const date = new Date(movie.viewedAt);
    const monthYear = `${date.toLocaleString('es-ES', {
      month: 'long',
    })} ${date.getFullYear()}`;

    if (!groups[monthYear]) {
      groups[monthYear] = [];
    }

    groups[monthYear].push(movie);
    return groups;
  }, {} as Record<string, HistoryMovie[]>);

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <Clock className="h-8 w-8" />
          Historial de Visualización
        </h1>
        <p className="text-zinc-400 mt-2">Películas que has visto</p>
      </header>

      {history.length > 0 ? (
        <div className="space-y-8">
          {Object.entries(groupedMovies).map(([monthYear, movies]) => (
            <div key={monthYear}>
              <h2 className="text-xl font-semibold mb-4 text-white capitalize">
                {monthYear}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {movies.map((movie) => (
                  <div
                    key={`${movie.id}-${movie.viewedAt}`}
                    className="bg-zinc-800 border border-zinc-700 rounded-lg overflow-hidden hover:border-zinc-600 transition-colors"
                  >
                    <div>
                      {movie.posterImage ? (
                        <Image
                          src={movie.posterImage}
                          alt={movie.title}
                          width={300}
                          height={450}
                          className="w-full h-[180px] object-cover"
                        />
                      ) : (
                        <div className="w-full h-[180px] bg-zinc-700 flex items-center justify-center">
                          <Film className="h-10 w-10 text-zinc-500" />
                        </div>
                      )}
                    </div>

                    <div className="p-3">
                      <Link href={`/dashboard/film/${movie.id}`}>
                        <h3 className="font-bold text-red-400 hover:text-red-300 transition-colors line-clamp-1">
                          {movie.title} ({movie.releaseYear})
                        </h3>
                      </Link>

                      {movie.director && (
                        <p className="text-zinc-300 text-sm mt-1 line-clamp-1">
                          {movie.director}
                        </p>
                      )}

                      <div className="mt-2 flex flex-wrap gap-1">
                        {movie.genres.slice(0, 2).map((genre, index) => (
                          <span
                            key={index}
                            className="inline-block px-2 py-0.5 text-xs bg-zinc-700 text-zinc-200 rounded-full"
                          >
                            {genre}
                          </span>
                        ))}
                        {movie.genres.length > 2 && (
                          <span className="inline-block px-2 py-0.5 text-xs bg-zinc-700 text-zinc-200 rounded-full">
                            +{movie.genres.length - 2}
                          </span>
                        )}
                      </div>

                      <p className="text-zinc-400 text-xs mt-2">
                        Visto el {new Date(movie.viewedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 text-center">
          <Film className="h-16 w-16 text-zinc-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">
            No has visto ninguna película
          </h2>
          <p className="text-zinc-400 mb-6">
            Comienza a explorar y registrar películas que hayas visto
          </p>
          <Button asChild className="bg-red-600 hover:bg-red-700">
            <Link href="/dashboard/explore">
              <Plus className="h-5 w-5 mr-2" />
              Explorar Películas
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
