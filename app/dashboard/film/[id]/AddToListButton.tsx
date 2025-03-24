'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

type MovieList = {
  id: string;
  name: string;
};

interface AddToListButtonProps {
  movieId: string;
}

export default function AddToListButton({ movieId }: AddToListButtonProps) {
  const { data: session, status } = useSession();
  const [lists, setLists] = useState<MovieList[]>([]);
  const [selectedListId, setSelectedListId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const response = await fetch('/api/movie-lists');
        if (response.ok) {
          const data = await response.json();
          setLists(data);
          if (data.length > 0) {
            setSelectedListId(data[0].id);
          }
        }
      } catch (error) {
        console.error('Error fetching lists:', error);
      }
    };

    if (session) {
      fetchLists();
    }
  }, [session]);

  const handleAddToList = async () => {
    if (!selectedListId) {
      setMessage({ text: 'Por favor selecciona una lista', type: 'error' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/movie-lists/${selectedListId}/items/${movieId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ text: 'Película añadida a la lista correctamente', type: 'success' });
      } else {
        setMessage({ text: data.message || 'Error al añadir la película', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Error al procesar la solicitud', type: 'error' });
      console.error('Error adding movie to list:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading') {
    return <div className="mt-4">Cargando...</div>;
  }

  if (status === 'unauthenticated') {
    return (
      <div className="mt-4 text-sm text-gray-400">
        Inicia sesión para añadir esta película a tus listas
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <select
          className="bg-gray-700 text-white rounded px-3 py-2 w-full sm:w-auto"
          value={selectedListId}
          onChange={(e) => setSelectedListId(e.target.value)}
          disabled={isLoading || lists.length === 0}
        >
          {lists.length === 0 ? (
            <option value="">No tienes listas creadas</option>
          ) : (
            lists.map((list) => (
              <option key={list.id} value={list.id}>
                {list.name}
              </option>
            ))
          )}
        </select>
        <button
          onClick={handleAddToList}
          disabled={isLoading || lists.length === 0}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded disabled:opacity-50"
        >
          {isLoading ? 'Añadiendo...' : 'Añadir a lista'}
        </button>
      </div>
      
      {message && (
        <div 
          className={`mt-2 text-sm p-2 rounded ${
            message.type === 'success' ? 'bg-green-900 text-green-100' : 'bg-red-900 text-red-100'
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
}
