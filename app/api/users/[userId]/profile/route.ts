// Ruta: c:\Users\carlo\Documents\Universidad\Proyecto Integrador\CultAndUndergroundMovies\app\api\users\[userId]\profile\route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;

    // Get current user session
    const session = await getServerSession(authOptions);
    const currentUserEmail = session?.user?.email;

    // Get the user profile
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        profilePicture: true,
        biography: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            following: true,
            followers: true,
            reviews: true,
            movieLists: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if current user is following this profile user
    let isFollowing = false;

    if (currentUserEmail) {
      const currentUser = await prisma.user.findUnique({
        where: { email: currentUserEmail },
      });

      if (currentUser) {
        const followRecord = await prisma.follower.findUnique({
          where: {
            followerId_followedId: {
              followerId: currentUser.id,
              followedId: userId,
            },
          },
        });

        isFollowing = !!followRecord;
      }
    }

    return NextResponse.json({
      id: user.id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      biography: user.biography,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      followingCount: user._count.following,
      followersCount: user._count.followers,
      reviewsCount: user._count.reviews,
      movieListsCount: user._count.movieLists,
      isFollowing,
      isCurrentUser: session?.user?.email === user.email,
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user profile data' },
      { status: 500 }
    );
  }
}
