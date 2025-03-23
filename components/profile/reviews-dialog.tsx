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
import { Star, MessageSquare, ThumbsUp } from 'lucide-react';
import { Review } from '@/types/review';

type ReviewsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
};

// Función simple para formatear tiempo transcurrido
function formatTimeAgo(date: string): string {
  const now = new Date();
  const past = new Date(date);
  const diffTime = Math.abs(now.getTime() - past.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffTime / (1000 * 60));

  if (diffDays > 365) {
    return `hace ${Math.floor(diffDays / 365)} años`;
  } else if (diffDays > 30) {
    return `hace ${Math.floor(diffDays / 30)} meses`;
  } else if (diffDays > 0) {
    return `hace ${diffDays} días`;
  } else if (diffHours > 0) {
    return `hace ${diffHours} horas`;
  } else if (diffMinutes > 0) {
    return `hace ${diffMinutes} minutos`;
  } else {
    return 'hace unos segundos';
  }
}

export function ReviewsDialog({
  open,
  onOpenChange,
  userId,
}: ReviewsDialogProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open && userId) {
      fetchReviews();
    }
  }, [open, userId]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/users/${userId}/reviews`);
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }
      const data = await response.json();
      setReviews(data);
    } catch (err) {
      console.error(err);
      setError('Error loading reviews. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Función para renderizar estrellas según la calificación
  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating ? 'fill-yellow-500 text-yellow-500' : 'text-zinc-600'
          }`}
        />
      ));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reviews</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="py-8 text-center">
            <div className="w-8 h-8 border-t-2 border-red-500 border-solid rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-zinc-400">Loading...</p>
          </div>
        ) : error ? (
          <div className="py-8 text-center text-red-400">{error}</div>
        ) : reviews.length === 0 ? (
          <div className="py-8 text-center text-zinc-400">No reviews yet</div>
        ) : (
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-4 py-2">
              {reviews.map((review) => (
                <Card key={review.id} className="bg-zinc-800 border-zinc-700">
                  <CardContent className="pt-4">
                    <div className="mb-2">
                      <span className="text-lg font-medium">
                        {review.movie.title}{' '}
                        <span className="text-zinc-400">
                          ({review.movie.releaseYear})
                        </span>
                      </span>
                    </div>
                    <div className="flex mb-3">
                      {renderStars(review.rating)}
                    </div>
                    <p className="text-zinc-300 line-clamp-3">
                      {review.content}
                    </p>
                  </CardContent>
                  <CardFooter className="border-t border-zinc-700 text-xs text-zinc-400 pt-3 pb-3 flex justify-between">
                    <span>{formatTimeAgo(review.createdAt)}</span>
                    <div className="flex space-x-4">
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        <span>{review._count?.comments || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="h-3 w-3" />
                        <span>{review._count?.likes || 0}</span>
                      </div>
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
