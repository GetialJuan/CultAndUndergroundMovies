'use client';

import { useReviews } from './ReviewsContext';
import { useSession } from 'next-auth/react';
import { Star, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import LikeButton from './LikeButton';

interface ReviewsListProps {
  movieId: string;
}

export default function ReviewsList({ movieId }: ReviewsListProps) {
  const { reviews } = useReviews();
  const { data: session } = useSession();

  if (reviews.length === 0) {
    return (
      <div className="text-center p-8 text-zinc-400 border border-zinc-800 rounded-md">
        <p>Todavía no hay reseñas para esta película.</p>
        <p className="mt-2">¡Sé el primero en compartir tu opinión!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => {
        // Format date as relative time (e.g., "2 days ago")
        const relativeTime = formatDistanceToNow(new Date(review.createdAt), {
          addSuffix: true,
          locale: es,
        });

        return (
          <div
            key={review.id}
            className="p-4 border border-zinc-800 rounded-lg bg-zinc-900/50"
          >
            <div className="flex justify-between mb-3">
              <div className="flex items-center">
                <Link href={`/dashboard/profile/${review.user.id}`} className="hover:opacity-80">
                  <div className="w-10 h-10 mr-3 rounded-full overflow-hidden bg-zinc-800">
                    {review.user.profilePicture ? (
                      <Image
                        src={review.user.profilePicture}
                        alt={review.user.username}
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-400">
                        {review.user.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                </Link>
                <div>
                  <Link 
                    href={`/profile/${review.user.id}`}
                    className="font-medium hover:underline text-white"
                  >
                    {review.user.username}
                  </Link>
                  <div className="text-xs text-zinc-500">{relativeTime}</div>
                </div>
              </div>
              <div className="flex items-center text-yellow-500 bg-zinc-800 px-2 py-1 rounded-full">
                <Star className="h-3 w-3 mr-1 fill-yellow-500" />
                <span className="text-sm">{review.rating}/5</span>
              </div>
            </div>

            <p className="mb-4 text-zinc-300 whitespace-pre-line">{review.content}</p>

            <div className="flex items-center justify-between mt-4">
              <div className="flex space-x-2">
                <LikeButton 
                  reviewId={review.id} 
                  initialLikesCount={review.likesCount} 
                  initialIsLiked={review.isLiked || false} 
                />
                {/* Comment button could be added here in the future */}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
