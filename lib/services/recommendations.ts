import { prisma } from '@/lib/prisma';
import { Movie, User, MovieRecommendation } from '@prisma/client';
import { cache } from 'react';

type RecommendationWithMovie = MovieRecommendation & {
  movie: Movie;
};

export interface MovieRecommendationResponse {
  id: string;
  title: string;
  poster: string;
  year: number;
  director: string | null;
  rating: number;
  reason: string;
}

// Cache recommendations for 24 hours
const CACHE_TTL = 24 * 60 * 60 * 1000;

export const generateRecommendationsForUser = async (userId: string): Promise<void> => {
  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      preferences: true,
      viewingHistory: {
        include: { movie: { include: { genres: { include: { genre: true } } } } },
        orderBy: { viewedAt: 'desc' },
        take: 10,
      },
      reviews: {
        where: { rating: { gte: 4 } }, // Only consider high ratings (4-5)
        include: { movie: { include: { genres: { include: { genre: true } } } } },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
      movieLists: {
        include: {
          items: {
            include: { movie: { include: { genres: { include: { genre: true } } } } }
          }
        }
      }
    }
  });

  if (!user) {
    throw new Error('User not found');
  }

  // Extract genres from liked movies
  const likedGenres = new Map<string, number>();
  
  // Add genres from highly rated movies
  user.reviews.forEach(review => {
    review.movie.genres.forEach(genre => {
      const genreName = genre.genre.name;
      likedGenres.set(genreName, (likedGenres.get(genreName) || 0) + 2);
    });
  });
  
  // Add genres from recently viewed movies
  user.viewingHistory.forEach(history => {
    history.movie.genres.forEach(genre => {
      const genreName = genre.genre.name;
      likedGenres.set(genreName, (likedGenres.get(genreName) || 0) + 1);
    });
  });
  
  // Add user's preferred genres from preferences (if they exist)
  if (user.preferences) {
    user.preferences.preferredGenres.forEach(genreName => {
      likedGenres.set(genreName, (likedGenres.get(genreName) || 0) + 3);
    });
  }
  
  // Get favorite directors
  const favoriteDirectors = new Set<string>();
  user.reviews.forEach(review => {
    if (review.movie.director && review.rating >= 4) {
      favoriteDirectors.add(review.movie.director);
    }
  });
  
  if (user.preferences?.favoriteDirectors) {
    user.preferences.favoriteDirectors.forEach(dir => favoriteDirectors.add(dir));
  }
  
  // Get movies already seen by the user
  const seenMovieIds = new Set(user.viewingHistory.map(h => h.movie.id));
  
  // Get movies already recommended to the user
  const existingRecommendations = await prisma.movieRecommendation.findMany({
    where: { userId },
    select: { movieId: true }
  });
  const recommendedMovieIds = new Set(existingRecommendations.map(r => r.movieId));
  
  // Get the top genres for recommendations
  const topGenres = Array.from(likedGenres.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(entry => entry[0]);
  
  // Find movies based on preferred genres that the user hasn't seen yet
  const potentialRecommendations = await prisma.movie.findMany({
    where: {
      id: { notIn: Array.from(seenMovieIds) },
      genres: {
        some: {
          genre: {
            name: { in: topGenres }
          }
        }
      }
    },
    include: {
      genres: {
        include: { genre: true }
      },
      reviews: {
        select: {
          rating: true
        }
      }
    },
    take: 50
  });
  
  // Score each movie for recommendation
  const scoredMovies = potentialRecommendations.map(movie => {
    let score = 0;
    let reasons: string[] = [];
    
    // Score based on genre match
    movie.genres.forEach(genreRelation => {
      const genreName = genreRelation.genre.name;
      const genreWeight = likedGenres.get(genreName) || 0;
      score += genreWeight;
      
      if (genreWeight > 1 && topGenres.includes(genreName)) {
        reasons.push(`Coincide con tu interés en películas de ${genreName}`);
      }
    });
    
    // Score based on director
    if (movie.director && favoriteDirectors.has(movie.director)) {
      score += 3;
      reasons.push(`Del director ${movie.director} que te gusta`);
    }
    
    // Score based on cult/underground status
    if (user.preferences?.preferredGenres.includes('Cult') && movie.isCult) {
      score += 2;
      reasons.push('Es una película de culto');
    }
    
    if (user.preferences?.preferredGenres.includes('Underground') && movie.isUnderground) {
      score += 2;
      reasons.push('Es una película underground');
    }
    
    // Calculate average rating if available
    const avgRating = movie.reviews.length > 0 
      ? movie.reviews.reduce((sum, r) => sum + r.rating, 0) / movie.reviews.length
      : 0;
    
    if (avgRating > 4) {
      score += 1;
      reasons.push('Altamente valorada por la comunidad');
    }
    
    return {
      movie,
      score,
      reason: reasons.length > 0 ? reasons[0] : 'Basado en tus preferencias',
      avgRating,
    };
  });
  
  // Sort by score and take top recommendations
  const topRecommendations = scoredMovies
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
  
  // Store recommendations in the database
  const recommendations = topRecommendations.map(rec => ({
    userId,
    movieId: rec.movie.id,
    score: rec.score,
    reason: rec.reason,
    isViewed: false,
  }));
  
  // Delete previous recommendations
  await prisma.movieRecommendation.deleteMany({
    where: { userId }
  });
  
  // Insert new recommendations
  await prisma.movieRecommendation.createMany({
    data: recommendations
  });
};

// Get user recommendations (with caching)
export async function getUserRecommendations(
  userId: string
): Promise<MovieRecommendationResponse[]> {
  try {
    // Buscar recomendaciones específicas para el usuario
    const userRecommendations = await prisma.movieRecommendation.findMany({
      where: {
        userId: userId,
        isViewed: false,
      },
      include: {
        movie: {
          select: {
            id: true,
            title: true,
            releaseYear: true,
            posterImage: true,
            director: true,
            reviews: {
              select: {
                rating: true,
              },
            },
          },
        },
      },
      orderBy: {
        score: 'desc',
      },
      take: 5,
    });

    // Si hay recomendaciones para el usuario, retornarlas
    if (userRecommendations.length > 0) {
      return userRecommendations.map((rec) => ({
        id: rec.movie.id,
        title: rec.movie.title,
        poster:
          rec.movie.posterImage || '/placeholder.svg?height=180&width=120',
        year: rec.movie.releaseYear,
        director: rec.movie.director,
        rating: calculateAverageRating(rec.movie.reviews),
        reason: rec.reason || 'Basado en tus preferencias',
      }));
    }

    // Si no hay recomendaciones, obtener películas populares
    const popularMovies = await prisma.movie.findMany({
      where: {
        OR: [{ isCult: true }, { isUnderground: true }],
      },
      include: {
        reviews: {
          select: {
            rating: true,
          },
        },
      },
      take: 5,
    });

    return popularMovies.map((movie) => ({
      id: movie.id,
      title: movie.title,
      poster: movie.posterImage || '/placeholder.svg?height=180&width=120',
      year: movie.releaseYear,
      director: movie.director,
      rating: calculateAverageRating(movie.reviews),
      reason: 'Película popular en nuestra comunidad',
    }));
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    throw error;
  }
}


export async function markRecommendationAsViewed(
  userId: string,
  movieId: string
): Promise<void> {
  try {
    // Actualizar el estado de la recomendación a vista
    await prisma.movieRecommendation.updateMany({
      where: {
        userId: userId,
        movieId: movieId,
      },
      data: {
        isViewed: true,
      },
    });

    // También registrar en el historial de visualización
    await prisma.viewingHistory.upsert({
      where: {
        userId_movieId: {
          userId: userId,
          movieId: movieId,
        },
      },
      update: {
        viewedAt: new Date(),
      },
      create: {
        userId: userId,
        movieId: movieId,
        viewedAt: new Date(),
      },
    });
  } catch (error) {
    console.error('Error marking recommendation as viewed:', error);
    throw error;
  }
}

// Función auxiliar para calcular la calificación promedio
function calculateAverageRating(reviews: { rating: number }[]): number {
  if (reviews.length === 0) {
    return 4.0; // Valor predeterminado si no hay reseñas
  }

  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return sum / reviews.length;
}