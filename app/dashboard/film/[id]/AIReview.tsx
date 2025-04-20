'use client';

import { useReviews } from './ReviewsContext';
import { useState, useEffect } from 'react';
import { Loader2, BookOpen, Volume2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useSpeech } from '@/hooks/use-speech';

interface AIReviewProps {
  movieTitle: string;
}

export default function AIReview({ movieTitle }: AIReviewProps) {
  const { reviews } = useReviews();
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Initialize speech hook
  const speak = useSpeech(summary || '');

  useEffect(() => {
    // Only fetch summary if we have enough reviews
    if (reviews.length >= 3) {
      fetchSummary();
    }
  }, [reviews]);

  const fetchSummary = async () => {
    if (loading || reviews.length < 3) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/gemini/summarize-reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reviews: reviews,
          movieTitle: movieTitle,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Error al obtener el resumen de reseñas');
      }
      
      const data = await response.json();
      setSummary(data.result);
    } catch (err) {
      console.error('Error fetching review summary:', err);
      setError('No se pudo generar el resumen de reseñas');
    } finally {
      setLoading(false);
    }
  };

  if (reviews.length < 3) {
    return null; // Don't render anything if not enough reviews
  }

  return (
    <section className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center">
          <BookOpen className="h-5 w-5 mr-2 text-purple-400" />
          Resumen de opiniones
        </h2>
        <Badge className="bg-purple-900/50 border-purple-700 text-purple-300">
          IA
        </Badge>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 text-zinc-400 animate-spin" />
          <span className="ml-2 text-zinc-400">Analizando reseñas...</span>
        </div>
      ) : error ? (
        <p className="text-zinc-400 italic">{error}</p>
      ) : summary ? (
        <div className="text-zinc-300 leading-relaxed">
          <div className="flex justify-between items-start">
            <p className="flex-1">{summary}</p>
            <button 
              onClick={speak}
              className="ml-4 p-2 text-purple-300 hover:text-purple-200 hover:bg-purple-900/30 rounded-full transition-colors"
              title="Escuchar resumen"
            >
              <Volume2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      ) : (
        <p className="text-zinc-400 italic">No hay suficientes reseñas para generar un resumen.</p>
      )}
    </section>
  );
}
