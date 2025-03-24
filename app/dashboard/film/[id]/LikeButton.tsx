'use client';

import { useState } from 'react';
import { ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useReviews } from './ReviewsContext';

interface LikeButtonProps {
  reviewId: string;
  initialLikesCount: number;
  initialIsLiked: boolean;
}

export default function LikeButton({ 
  reviewId, 
  initialLikesCount, 
  initialIsLiked 
}: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const { updateReviewLikes } = useReviews();

  const handleLike = async () => {
    if (!session) {
      router.push('/login');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/reviews/like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reviewId,
          action: isLiked ? 'unlike' : 'like',
        }),
      });

      if (response.ok) {
        const newIsLiked = !isLiked;
        const newLikesCount = isLiked ? likesCount - 1 : likesCount + 1;
        
        setIsLiked(newIsLiked);
        setLikesCount(newLikesCount);
        
        // Update the review in the context
        updateReviewLikes(reviewId, newLikesCount, newIsLiked);
      } else {
        console.error('Failed to like review');
      }
    } catch (error) {
      console.error('Error liking review:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLike}
      disabled={isLoading}
      className={`flex items-center gap-1 px-2 py-1 h-8 rounded-md transition-colors ${
        isLiked 
          ? 'text-primary hover:text-primary/90 hover:bg-primary/10' 
          : 'text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800'
      }`}
    >
      <ThumbsUp className={`h-4 w-4 ${isLiked ? 'fill-primary' : ''}`} />
      <span>{likesCount}</span>
    </Button>
  );
}
