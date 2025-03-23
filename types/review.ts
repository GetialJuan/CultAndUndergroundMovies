// Ruta: types/review.ts
export type Review = {
  id: string;
  rating: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  movie: {
    id: string;
    title: string;
    releaseYear: number;
    posterImage: string | null;
  };
  _count?: {
    likes: number;
    comments: number;
  };
};
