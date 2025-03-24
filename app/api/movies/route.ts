import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const title = searchParams.get('title') || '';
    const director = searchParams.get('director') || '';
    const genre = searchParams.get('genre') || '';
    const year = searchParams.get('year') ? parseInt(searchParams.get('year') as string, 10) : undefined;
    const sortBy = searchParams.get('sortBy') || 'releaseYear';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    // Prepare filter conditions
    const whereClause: any = {
      AND: []
    };

    if (title) {
      whereClause.AND.push({
        title: {
          contains: title,
          mode: 'insensitive'
        }
      });
    }

    if (director) {
      whereClause.AND.push({
        director: {
          contains: director,
          mode: 'insensitive'
        }
      });
    }

    if (year) {
      whereClause.AND.push({
        releaseYear: year
      });
    }

    if (genre) {
      whereClause.AND.push({
        genres: {
          some: {
            genre: {
              name: {
                contains: genre,
                mode: 'insensitive'
              }
            }
          }
        }
      });
    }

    // If no filters applied, remove AND array
    if (whereClause.AND.length === 0) {
      delete whereClause.AND;
    }

    // Get total count for pagination
    const totalMovies = await prisma.movie.count({
      where: whereClause
    });

    // Get movies with pagination and sorting
    const movies = await prisma.movie.findMany({
      where: whereClause,
      include: {
        genres: {
          include: {
            genre: true
          }
        },
        reviews: {
          select: {
            rating: true
          }
        },
        streamings: {
          include: {
            platform: true
          }
        }
      },
      orderBy: {
        [sortBy]: sortOrder
      },
      skip: (page - 1) * limit,
      take: limit
    });

    // Calculate average rating for each movie
    const moviesWithRating = movies.map(movie => {
      const ratings = movie.reviews.map(review => review.rating);
      const avgRating = ratings.length > 0 
        ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length 
        : null;
      
      // Transform genres for easier consumption
      const genres = movie.genres.map(mg => mg.genre.name);
      
      // Transform streaming platforms
      const streamingPlatforms = movie.streamings.map(s => ({
        name: s.platform.name,
        url: s.url,
        logoUrl: s.platform.logoUrl
      }));

      return {
        ...movie,
        avgRating,
        genres,
        streamingPlatforms
      };
    });

    return NextResponse.json({
      movies: moviesWithRating,
      pagination: {
        total: totalMovies,
        pages: Math.ceil(totalMovies / limit),
        currentPage: page,
        limit
      }
    });
  } catch (error) {
    console.error('Error fetching movies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch movies' },
      { status: 500 }
    );
  }
}
