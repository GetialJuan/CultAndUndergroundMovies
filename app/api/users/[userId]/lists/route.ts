import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;
    const limit = 10; // Número máximo de listas a devolver

    const lists = await prisma.movieList.findMany({
      where: {
        userId: userId,
        isPublic: true, // Solo listas públicas
      },
      include: {
        _count: {
          select: {
            items: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
      take: limit,
    });

    return NextResponse.json(lists);
  } catch (error) {
    console.error('Error fetching movie lists:', error);
    return NextResponse.json(
      { error: 'Failed to fetch movie lists' },
      { status: 500 }
    );
  }
}
