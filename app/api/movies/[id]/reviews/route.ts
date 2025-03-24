import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const offset = parseInt(searchParams.get('offset') || '0');
    const limit = parseInt(searchParams.get('limit') || '5');

    const movieId = params.id;

    if (!movieId) {
      return NextResponse.json(
        { error: 'Movie ID is required' },
        { status: 400 }
      );
    }

    const reviews = await prisma.review.findMany({
      where: { movieId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            profilePicture: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limit,
    });

    // Transform the reviews to match the expected format
    const formattedReviews = reviews.map(review => ({
      ...review,
      createdAt: review.createdAt.toISOString(),
    }));

    return NextResponse.json({ reviews: formattedReviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const movieId = params.id;
    const body = await request.json();
    const { rating, content } = body;
    
    // Get user from session - you may need to adjust this based on your auth setup
    const session = await getServerSession(); // You'll need to import getServerSession
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'You must be logged in to post a review' },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    
    // Check if user already reviewed this movie
    const existingReview = await prisma.review.findFirst({
      where: {
        movieId,
        userId
      }
    });
    
    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this movie' },
        { status: 400 }
      );
    }
    
    // Create the review
    const newReview = await prisma.review.create({
      data: {
        content,
        rating,
        movieId,
        userId
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            profilePicture: true,
          },
        },
      }
    });
    
    return NextResponse.json({
      ...newReview,
      createdAt: newReview.createdAt.toISOString()
    });
    
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
}
