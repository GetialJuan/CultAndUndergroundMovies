'use client';

import React, { createContext, useContext, useState } from 'react';

export type ReviewUser = {
  id: string;
  username: string;
  profilePicture: string | null;
};

export type Review = {
  id: string;
  content: string;
  rating: number;
  likesCount: number;
  isLiked?: boolean;
  createdAt: string;
  user: ReviewUser;
};

type ReviewsContextType = {
  reviews: Review[];
  setReviews: React.Dispatch<React.SetStateAction<Review[]>>;
  addReview: (review: Review) => void;
  updateReviewLikes: (reviewId: string, newLikesCount: number, isLiked: boolean) => void;
};

// Create context with a default value that satisfies the type but will be overridden
const defaultContextValue: ReviewsContextType = {
  reviews: [],
  setReviews: () => {},
  addReview: () => {},
  updateReviewLikes: () => {},
};

const ReviewsContext = createContext<ReviewsContextType>(defaultContextValue);

export function useReviews() {
  const context = useContext(ReviewsContext);
  if (!context) {
    console.error("useReviews must be used within a ReviewsProvider");
    // Return default context instead of throwing to prevent app crashes
    return defaultContextValue;
  }
  return context;
}

type ReviewsProviderProps = {
  initialReviews: Review[];
  children: React.ReactNode;
};

export function ReviewsProvider({ initialReviews, children }: ReviewsProviderProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews || []);

  const addReview = (review: Review) => {
    if (!review) return;
    setReviews((prevReviews) => [review, ...prevReviews]);
  };

  const updateReviewLikes = (reviewId: string, newLikesCount: number, isLiked: boolean) => {
    if (!reviewId) return;
    setReviews((prevReviews) =>
      prevReviews.map((review) =>
        review.id === reviewId
          ? { ...review, likesCount: newLikesCount, isLiked }
          : review
      )
    );
  };

  // Create the context value
  const contextValue: ReviewsContextType = {
    reviews,
    setReviews,
    addReview,
    updateReviewLikes,
  };

  return (
    <ReviewsContext.Provider value={contextValue}>
      {children}
    </ReviewsContext.Provider>
  );
}
