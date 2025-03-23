// Ruta: c:\Users\carlo\Documents\Universidad\Proyecto Integrador\CultAndUndergroundMovies\app\api\recommendations\viewed\route.ts
import { NextRequest, NextResponse } from 'next/server';
import { markRecommendationAsViewed } from '@/lib/services/recommendations';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { movieId } = body;

    if (!movieId) {
      return NextResponse.json(
        { error: 'Se requiere ID de película' },
        { status: 400 }
      );
    }

    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    await markRecommendationAsViewed(user.id, movieId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error marcando recomendación como vista:', error);
    return NextResponse.json(
      { error: 'Error al marcar recomendación como vista' },
      { status: 500 }
    );
  }
}
