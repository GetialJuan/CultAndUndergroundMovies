'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Film, Calendar } from 'lucide-react';

type MovieList = {
  id: string;
  name: string;
  description: string | null;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  _count: {
    items: number;
  };
};

type ListsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
};

// Función simple para formatear fecha
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function ListsDialog({ open, onOpenChange, userId }: ListsDialogProps) {
  const [lists, setLists] = useState<MovieList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open && userId) {
      fetchLists();
    }
  }, [open, userId]);

  const fetchLists = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/users/${userId}/lists`);
      if (!response.ok) {
        throw new Error('Failed to fetch movie lists');
      }
      const data = await response.json();
      setLists(data);
    } catch (err) {
      console.error(err);
      setError('Error loading movie lists. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Movie Lists</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="py-8 text-center">
            <div className="w-8 h-8 border-t-2 border-red-500 border-solid rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-zinc-400">Loading...</p>
          </div>
        ) : error ? (
          <div className="py-8 text-center text-red-400">{error}</div>
        ) : lists.length === 0 ? (
          <div className="py-8 text-center text-zinc-400">
            No movie lists yet
          </div>
        ) : (
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-4 py-2">
              {lists.map((list) => (
                <Card key={list.id} className="bg-zinc-800 border-zinc-700">
                  <CardContent className="pt-4">
                    <div className="mb-2">
                      <span className="text-lg font-medium text-white">
                        {list.name}
                      </span>
                    </div>
                    {list.description && (
                      <p className="text-zinc-300 text-sm mb-3 line-clamp-2">
                        {list.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-zinc-400 text-xs">
                      <Film className="h-3.5 w-3.5" />
                      <span>{list._count.items} películas</span>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t border-zinc-700 text-xs text-zinc-400 pt-3 pb-3 flex justify-between">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>Actualizada {formatDate(list.updatedAt)}</span>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}
