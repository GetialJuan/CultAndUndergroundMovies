import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from "@/lib/auth"

// Create a new PrismaClient instance or use a global instance to avoid too many connections
const prisma = new PrismaClient();

// GET reviews for a specific movie
export async function GET(
  request: NextRequest,
  { params }: { params: { movieId: string } }
) {
  try {
    // IMPORTANT: We need to await the params object in Next.js App Router
    const { movieId } = await params;
    
    if (!movieId) {
      return NextResponse.json(
        { error: 'Movie ID is required' },
        { status: 400 }
      );
    }

    console.log('Fetching reviews for movie:', movieId);
    
    const reviews = await prisma.review.findMany({
      where: {
        movieId: movieId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            profilePicture: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

// POST a new review
export async function POST(
  request: NextRequest,
  { params }: { params: { movieId: string } }
) {
  try {
    // IMPORTANT: We need to await the params object in Next.js App Router
   
    const { movieId } = await params;
    
    console.log('Creating review for movie:', movieId);
    
    if (!movieId) {
      return NextResponse.json(
        { error: 'Movie ID is required' },
        { status: 400 }
      );
    }
    
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const userId = session.user.id as string;
    const body = await request.json();
    const { rating, content } = body;

    // Validate rating and content
    if (!rating || !content) {
      return NextResponse.json(
        { error: 'Rating and content are required' },
        { status: 400 }
      );
    }

    // Check if movie exists
    const movie = await prisma.movie.findUnique({
      where: { id: movieId },
    });

    if (!movie) {
      return NextResponse.json(
        { error: 'Movie not found' },
        { status: 404 }
      );
    }

    // Check if user has already reviewed this movie
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_movieId: {
          userId,
          movieId,
        },
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this movie' },
        { status: 409 }
      );
    }

    console.log('Creating review with data:', {
      userId,
      movieId,
      rating: parseInt(rating.toString(), 10),
      content
    });

    // Create new review
    const newReview = await prisma.review.create({
      data: {
        userId,
        movieId,
        rating: parseInt(rating.toString(), 10),
        content,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            profilePicture: true,
          },
        },
      },
    });

    console.log('Review created successfully:', newReview);

    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
}
