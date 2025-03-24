// Ruta: app/api/users/[userId]/followers/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;

    const followers = await prisma.follower.findMany({
      where: {
        followedId: userId,
      },
      include: {
        follower: {
          select: {
            id: true,
            username: true,
            profilePicture: true,
            biography: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(followers.map((follow) => follow.follower));
  } catch (error) {
    console.error('Error fetching followers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch followers' },
      { status: 500 }
    );
  }
}
