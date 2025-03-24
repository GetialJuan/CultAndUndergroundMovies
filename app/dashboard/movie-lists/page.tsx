// Ruta: c:\Users\carlo\Documents\Universidad\Proyecto Integrador\CultAndUndergroundMovies\app\dashboard\movie-lists\page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import MovieListCard from '@/components/movie-list-card';

export default function MovieListsPage() {
  const router = useRouter();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formError, setFormError] = useState('');
  const [myLists, setMyLists] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  // Formulario
  const [listName, setListName] = useState('');
  const [listDescription, setListDescription] = useState('');

  // Fetch movie lists on component mount
  useEffect(() => {
    const fetchMovieLists = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/movie-lists');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || 'Error al obtener listas de películas'
          );
        }

        // Transformar los datos para que coincidan con el formato esperado
        const formattedLists = data.map((list: any) => ({
          id: list.id,
          title: list.name,
          description: list.description || 'Sin descripción',
          count: list._count.items,
          image:
            list.items[0]?.movie?.posterImage ||
            '/placeholder.svg?height=300&width=200',
          creator: 'Tú',
          createdAt: list.createdAt,
        }));

        setMyLists(formattedLists);
      } catch (error: any) {
        console.error('Error fetching movie lists:', error);
        setFetchError(
          error.message || 'Error al cargar tus listas de películas'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieLists();
  }, []);

  const handleCreateList = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError('');

    if (!listName.trim()) {
      setFormError('El nombre de la lista es obligatorio');
      return;
    }

    try {
      setIsCreating(true);

      const response = await fetch('/api/movie-lists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: listName,
          description: listDescription,
          isPublic: true,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al crear la lista');
      }

      // Redirigir a la página de la nueva lista
      router.push(`/dashboard/movie-lists/${data.id}`);
    } catch (error: any) {
      console.error('Error creating list:', error);
      setFormError(
        error.message || 'No se pudo crear la lista. Inténtalo de nuevo.'
      );
    } finally {
      setIsCreating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-red-500" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Tus Listas de Películas</h1>
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          className="bg-red-500 hover:bg-red-600"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Nueva Lista
        </Button>
      </div>

      {fetchError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{fetchError}</AlertDescription>
        </Alert>
      )}

      {myLists.length === 0 ? (
        <div className="text-center p-10 border border-dashed border-zinc-700 rounded-lg">
          <h3 className="text-xl mb-2">No tienes listas de películas</h3>
          <p className="text-zinc-400 mb-6">
            Crea una lista para organizar tus películas favoritas, compartir
            recomendaciones o seguir tu lista de pendientes.
          </p>
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-red-500 hover:bg-red-600"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Crear mi primera lista
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myLists.map((list) => (
            <MovieListCard
              key={list.id}
              id={list.id}
              title={list.title}
              description={list.description}
              count={list.count}
              image={list.image}
              creator={list.creator}
            />
          ))}
        </div>
      )}

      {/* Create List Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle>Crear nueva lista de películas</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateList}>
            {formError && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Nombre de la lista <span className="text-red-500">*</span>
                </label>
                <Input
                  id="name"
                  value={listName}
                  onChange={(e) => setListName(e.target.value)}
                  className="bg-zinc-800 border-zinc-700"
                  placeholder="Ej. Películas favoritas de los 80s"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Descripción (opcional)
                </label>
                <Textarea
                  id="description"
                  value={listDescription}
                  onChange={(e) => setListDescription(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 min-h-[100px]"
                  placeholder="Describe el tema o propósito de esta lista..."
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
                className="border-zinc-700"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isCreating}
                className="bg-red-500 hover:bg-red-600"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creando...
                  </>
                ) : (
                  'Crear Lista'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
