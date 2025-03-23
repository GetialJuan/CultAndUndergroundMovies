import { NextRequest, NextResponse } from 'next/server';
import { getUserRecommendations } from '@/lib/services/recommendations';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Obtener la sesión del usuario actual
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Encontrar el usuario en la base de datos
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Obtener las recomendaciones para el usuario
    const recommendations = await getUserRecommendations(user.id);
    return NextResponse.json(recommendations);
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recommendations' },
      { status: 500 }
    );
  }
}

// POST /api/recommendations/viewed - Mark a recommendation as viewed
export async function POST(request: NextRequest) {
  const session: any = await getServerSession(authOptions as any);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { movieId } = await request.json();

    if (!movieId) {
      return NextResponse.json(
        { error: 'Movie ID is required' },
        { status: 400 }
      );
    }

    await markRecommendationAsViewed(session.user.id, movieId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error marking recommendation as viewed:', error);
    return NextResponse.json(
      { error: 'Failed to update recommendation' },
      { status: 500 }
    );
  }
}
