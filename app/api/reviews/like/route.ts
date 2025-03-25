import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  // Check authentication
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { reviewId, action } = await request.json();
    const userId = session.user.id as string;

    if (!reviewId || !['like', 'unlike'].includes(action)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    // Check if review exists
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    // Check if user is trying to like their own review
    if (review.userId === userId) {
      return NextResponse.json(
        { error: 'Cannot like your own review' },
        { status: 400 }
      );
    }

    // Process like/unlike action
    if (action === 'like') {
      // Create like record
      await prisma.reviewLike.create({
        data: {
          userId,
          reviewId,
        },
      });

      // Increment likes count
      await prisma.review.update({
        where: { id: reviewId },
        data: {
          likesCount: { increment: 1 },
        },
      });
    } else {
      // Delete like record
      await prisma.reviewLike.delete({
        where: {
          userId_reviewId: {
            userId,
            reviewId,
          },
        },
      });

      // Decrement likes count
      await prisma.review.update({
        where: { id: reviewId },
        data: {
          likesCount: { decrement: 1 },
        },
      });
    }

    // Get updated review
    const updatedReview = await prisma.review.findUnique({
      where: { id: reviewId },
      select: { likesCount: true },
    });

    return NextResponse.json({ 
      success: true, 
      likesCount: updatedReview?.likesCount
    });
  } catch (error) {
    console.error('Error processing like/unlike:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const reviewId = searchParams.get('reviewId');
    
    if (!reviewId) {
      return NextResponse.json(
        { error: 'Review ID is required' },
        { status: 400 }
      );
    }

    const userId = session.user.id as string;

    // Check if the user has liked this review
    const existingLike = await prisma.reviewLike.findUnique({
      where: {
        userId_reviewId: {
          userId,
          reviewId,
        },
      },
    });

    const likesCount = await getLikesCount(reviewId);

    return NextResponse.json({
      liked: !!existingLike,
      likesCount,
    });
  } catch (error) {
    console.error('Error checking review like status:', error);
    return NextResponse.json(
      { error: 'Failed to check like status' },
      { status: 500 }
    );
  }
}

// Helper function to get current likes count
async function getLikesCount(reviewId: string): Promise<number> {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    select: { likesCount: true },
  });
  
  return review?.likesCount || 0;
}
