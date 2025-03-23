// Ruta: app/api/users/[userId]/following/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;

    const following = await prisma.follower.findMany({
      where: {
        followerId: userId,
      },
      include: {
        followed: {
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

    return NextResponse.json(following.map((follow) => follow.followed));
  } catch (error) {
    console.error('Error fetching following:', error);
    return NextResponse.json(
      { error: 'Failed to fetch following' },
      { status: 500 }
    );
  }
}
