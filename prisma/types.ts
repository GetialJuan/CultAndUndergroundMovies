import { Prisma } from '@prisma/client';

// Tipos para los objetos retornados por Prisma al crear registros
export type SeedUser = {
  id: string;
  email: string;
  passwordHash: string | null;
  googleId: string | null;
  username: string;
  profilePicture: string | null;
  biography: string | null;
  createdAt: Date;
  updatedAt: Date;
  lastLogin: Date | null;
};

export type SeedMovie = {
  id: string;
  title: string;
  originalTitle: string | null;
  releaseYear: number;
  synopsis: string | null;
  director: string | null;
  posterImage: string | null;
  backdropImage: string | null;
  duration: number | null;
  isCult: boolean;
  isUnderground: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type SeedGenre = {
  id: string;
  name: string;
  description: string | null;
};

export type SeedReview = {
  id: string;
  userId: string;
  movieId: string;
  rating: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  likesCount: number;
};

export type SeedMovieList = {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type SeedStreamingPlatform = {
  id: string;
  name: string;
  logoUrl: string | null;
  websiteUrl: string | null;
};
