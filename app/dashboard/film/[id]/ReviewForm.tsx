"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "next-auth/react";
import { StarRating } from "./StarRating";
import { useReviews } from "./ReviewsContext";
import RecorderBtn from "@/components/ui/recorder-btn";

export default function ReviewForm({ movieId }: { movieId: string }) {
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { data: session } = useSession();
  const { addReview } = useReviews();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError("Por favor, selecciona una calificación");
      return;
    }
    
    if (content.trim().length < 10) {
      setError("Tu reseña debe tener al menos 10 caracteres");
      return;
    }
    
    setError("");
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`/api/movies/${movieId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          movieId,
          rating,
          content,
        }),
      });
      
      if (!response.ok) {
        throw new Error("Error al enviar la reseña");
      }
      
      const newReview = await response.json();
      
      // Format the review to match the expected shape in our context
      const formattedReview = {
        ...newReview,
        createdAt: new Date().toISOString(),
        likesCount: 0,
        user: {
          id: session?.user?.id || "",
          username: session?.user?.name || "",
          profilePicture: session?.user?.image || null,
        }
      };
      
      // Add the new review to our context
      addReview(formattedReview);
      
      // Reset form
      setContent("");
      setRating(0);
      
      // Success notification could be added here
      
    } catch (err) {
      console.error("Error submitting review:", err);
      setError("Ha ocurrido un error al enviar tu reseña. Inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-zinc-300">
          Tu calificación
        </label>
        <StarRating value={rating} onChange={setRating} />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="review" className="block text-sm font-medium text-zinc-300">
          Tu reseña
        </label>
        <Textarea
          id="review"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Comparte tu opinión sobre esta película..."
          className="min-h-[120px] bg-zinc-800 border-zinc-700 text-white"
        />
      </div>
      
      {error && (
        <div className="p-3 bg-red-900/50 border border-red-800 rounded text-red-200 text-sm">
          {error}
        </div>
      )}
      
      <div className="flex justify-end">
        <RecorderBtn
          onTranscriptionReceived={(transcription) => setContent(transcription)}
          className="mr-2"
          disabled={isSubmitting}
        />
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-purple-600 hover:bg-purple-700"
        >
          {isSubmitting ? "Enviando..." : "Publicar reseña"}
        </Button>
      </div>
    </form>
  );
}
