"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { useReviews } from "./ReviewsContext";

export default function ReviewsList({ movieId }: { movieId: string }) {
  const { reviews } = useReviews();
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(reviews.length >= 5);
  
  const loadMoreReviews = async () => {
    setIsLoadingMore(true);
    try {
      const nextPage = page + 1;
      const response = await fetch(`/api/movies/${movieId}/reviews?page=${nextPage}`);
      
      if (!response.ok) {
        throw new Error("Error fetching more reviews");
      }
      
      const data = await response.json();
      
      // If we received fewer than 5 reviews, there are no more to load
      setHasMore(data.length >= 5);
      setPage(nextPage);
      
      // Here we would normally update our reviews list
      // But since we're now using the context, this will be handled differently
      // This function would need to be updated to work with our context
      
    } catch (error) {
      console.error("Error loading more reviews:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 border border-zinc-800 rounded-md">
        <p className="text-zinc-400">Todavía no hay reseñas para esta película.</p>
        <p className="text-zinc-500 text-sm mt-2">¡Sé el primero en compartir tu opinión!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <article 
          key={review.id} 
          className="border border-zinc-800 rounded-md p-4 space-y-3"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage 
                  src={review.user.profilePicture || undefined} 
                  alt={review.user.username} 
                />
                <AvatarFallback className="bg-zinc-700">
                  {review.user.username.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium text-zinc-200">{review.user.username}</div>
                <div className="text-xs text-zinc-500">
                  {formatDistanceToNow(new Date(review.createdAt), {
                    addSuffix: true,
                    locale: es
                  })}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-1 bg-zinc-800 px-2 py-1 rounded">
              <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-medium">{review.rating}</span>
            </div>
          </div>
          
          <div className="text-zinc-300 text-sm leading-relaxed">
            {review.content}
          </div>
          
          {/* Additional review actions could go here - like, reply, etc. */}
        </article>
      ))}
      
      {hasMore && (
        <div className="flex justify-center pt-2">
          <Button
            variant="outline"
            onClick={loadMoreReviews}
            disabled={isLoadingMore}
            className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
          >
            {isLoadingMore ? "Cargando..." : "Cargar más reseñas"}
          </Button>
        </div>
      )}
    </div>
  );
}
