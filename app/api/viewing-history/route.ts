import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/viewing-history - Obtiene el historial de visualización del usuario actual
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Buscar el historial de visualización del usuario
    const viewingHistory = await prisma.viewingHistory.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        movie: {
          include: {
            genres: {
              include: {
                genre: true,
              },
            },
          },
        },
      },
      orderBy: {
        viewedAt: 'desc',
      },
    });

    // Transformar los datos para el cliente
    const formattedHistory = viewingHistory.map((entry) => ({
      id: entry.movie.id,
      title: entry.movie.title,
      releaseYear: entry.movie.releaseYear,
      director: entry.movie.director || undefined,
      posterImage: entry.movie.posterImage || undefined,
      genres: entry.movie.genres.map((g) => g.genre.name),
      viewedAt: entry.viewedAt.toISOString(),
    }));

    return NextResponse.json({ history: formattedHistory });
  } catch (error) {
    console.error('Error obteniendo historial de visualización:', error);
    return NextResponse.json(
      { error: 'Error al obtener el historial de visualización' },
      { status: 500 }
    );
  }
}

// POST /api/viewing-history - Añade una película al historial de visualización
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { movieId, viewedAt } = body;

    if (!movieId) {
      return NextResponse.json(
        { error: 'El ID de la película es requerido' },
        { status: 400 }
      );
    }

    // Verificar si la película existe
    const movieExists = await prisma.movie.findUnique({
      where: { id: movieId },
    });

    if (!movieExists) {
      return NextResponse.json(
        { error: 'La película no existe' },
        { status: 404 }
      );
    }

    // Crear o actualizar el registro de visualización
    const viewingRecord = await prisma.viewingHistory.upsert({
      where: {
        userId_movieId: {
          userId: session.user.id,
          movieId: movieId,
        },
      },
      update: {
        viewedAt: viewedAt ? new Date(viewedAt) : new Date(),
      },
      create: {
        userId: session.user.id,
        movieId: movieId,
        viewedAt: viewedAt ? new Date(viewedAt) : new Date(),
      },
    });

    return NextResponse.json({
      message: 'Película añadida al historial de visualización',
      viewingRecord,
    });
  } catch (error) {
    console.error('Error añadiendo película al historial:', error);
    return NextResponse.json(
      { error: 'Error al añadir película al historial' },
      { status: 500 }
    );
  }
}

// DELETE /api/viewing-history?movieId=xxx - Elimina una película del historial
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const movieId = searchParams.get('movieId');

    if (!movieId) {
      return NextResponse.json(
        { error: 'El ID de la película es requerido' },
        { status: 400 }
      );
    }

    // Verificar si el registro existe
    const existingRecord = await prisma.viewingHistory.findUnique({
      where: {
        userId_movieId: {
          userId: session.user.id,
          movieId: movieId,
        },
      },
    });

    if (!existingRecord) {
      return NextResponse.json(
        { error: 'La película no está en el historial' },
        { status: 404 }
      );
    }

    // Eliminar el registro
    await prisma.viewingHistory.delete({
      where: {
        userId_movieId: {
          userId: session.user.id,
          movieId: movieId,
        },
      },
    });

    return NextResponse.json({
      message: 'Película eliminada del historial de visualización',
    });
  } catch (error) {
    console.error('Error eliminando película del historial:', error);
    return NextResponse.json(
      { error: 'Error al eliminar película del historial' },
      { status: 500 }
    );
  }
}
