'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Film, Plus, AlertCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

type FavoriteMovie = {
  id: string;
  title: string;
  releaseYear: number;
  director?: string;
  posterImage?: string;
  genres: string[];
  addedAt: string;
  notes?: string;
  listId: string;
};

export default function FavoritesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [favorites, setFavorites] = useState<FavoriteMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [listId, setListId] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchFavorites();
    }
  }, [status]);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/favorites');

      if (!response.ok) {
        throw new Error('Error al obtener favoritos');
      }

      const data = await response.json();
      setFavorites(data.favorites);
      setListId(data.listId);
    } catch (err) {
      console.error('Error al obtener favoritos:', err);
      setError(
        'No se pudieron cargar tus películas favoritas. Por favor, inténtalo más tarde.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromFavorites = async (movieId: string) => {
    try {
      setIsRemoving(true);
      setRemovingId(movieId);

      const response = await fetch(`/api/favorites?movieId=${movieId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar de favoritos');
      }

      // Actualizar lista de favoritos
      setFavorites(favorites.filter((movie) => movie.id !== movieId));
    } catch (err) {
      console.error('Error al eliminar de favoritos:', err);
      setError('No se pudo eliminar la película de favoritos.');
    } finally {
      setIsRemoving(false);
      setRemovingId(null);
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
            onClick={fetchFavorites}
          >
            Intentar de Nuevo
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <Heart className="h-8 w-8 text-red-500" />
          Mis Películas Favoritas
        </h1>
        <p className="text-zinc-400 mt-2">
          Películas que has marcado como favoritas
        </p>
        {listId && (
          <div className="mt-4">
            <Link
              href={`/dashboard/movie-lists/${listId}`}
              className="text-red-400 hover:text-red-300 transition-colors text-sm"
            >
              Ver como lista completa →
            </Link>
          </div>
        )}
      </header>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {favorites.map((movie) => (
            <div
              key={movie.id}
              className="bg-zinc-800 border border-zinc-700 rounded-lg overflow-hidden hover:border-zinc-600 transition-colors relative group"
            >
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-8 w-8 bg-black/60 hover:bg-black/80 border border-zinc-600"
                      disabled={isRemoving && removingId === movie.id}
                    >
                      {isRemoving && removingId === movie.id ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-500 border-t-transparent" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-zinc-900 border-zinc-700">
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        ¿Eliminar de favoritos?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-zinc-400">
                        ¿Estás seguro que deseas eliminar "{movie.title}" de tus
                        favoritos?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-zinc-800 border-zinc-700 text-white">
                        Cancelar
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleRemoveFromFavorites(movie.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Eliminar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

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
                  Añadida el {new Date(movie.addedAt).toLocaleDateString()}
                </p>

                {movie.notes && (
                  <p className="mt-2 text-sm italic text-zinc-400 line-clamp-2">
                    "{movie.notes}"
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 text-center">
          <Heart className="h-16 w-16 text-zinc-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">
            No tienes películas favoritas
          </h2>
          <p className="text-zinc-400 mb-6">
            Explora películas y marca tus favoritas para guardarlas aquí
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
