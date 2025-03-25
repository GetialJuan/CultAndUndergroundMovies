"use client";

import { useState } from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  value: number;
  onChange: (rating: number) => void;
}

export function StarRating({ value, onChange }: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);
  
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
          className="focus:outline-none"
          aria-label={`Rate ${star} stars out of 5`}
        >
          <Star
            size={24}
            className={`
              transition-colors
              ${(hoverRating || value) >= star 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-gray-400'
              }
            `}
          />
        </button>
      ))}
    </div>
  );
}
