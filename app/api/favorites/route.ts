import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/favorites - Obtiene la lista de películas favoritas del usuario
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Buscar al usuario
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Buscar o crear la lista de favoritos del usuario
    let favoritesList = await prisma.movieList.findFirst({
      where: {
        userId: user.id,
        name: 'Favoritos',
      },
      include: {
        items: {
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
        },
      },
    });

    // Si no existe la lista de favoritos, la creamos
    if (!favoritesList) {
      favoritesList = await prisma.movieList.create({
        data: {
          userId: user.id,
          name: 'Favoritos',
          description: 'Mis películas favoritas',
          isPublic: true,
        },
        include: {
          items: {
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
          },
        },
      });
    }

    // Transformar los datos para el cliente
    const formattedFavorites = favoritesList.items.map((item) => ({
      id: item.movie.id,
      title: item.movie.title,
      releaseYear: item.movie.releaseYear,
      director: item.movie.director || undefined,
      posterImage: item.movie.posterImage || undefined,
      genres: item.movie.genres.map((g) => g.genre.name),
      addedAt: item.addedAt.toISOString(),
      notes: item.notes || undefined,
      listId: favoritesList!.id,
    }));

    return NextResponse.json({
      favorites: formattedFavorites,
      listId: favoritesList.id,
    });
  } catch (error) {
    console.error('Error obteniendo favoritos:', error);
    return NextResponse.json(
      { error: 'Error al obtener favoritos' },
      { status: 500 }
    );
  }
}

// POST /api/favorites - Añadir película a favoritos
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { movieId, notes } = body;

    if (!movieId) {
      return NextResponse.json(
        { error: 'ID de película requerido' },
        { status: 400 }
      );
    }

    // Buscar al usuario
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
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

    // Buscar o crear la lista de favoritos
    let favoritesList = await prisma.movieList.findFirst({
      where: {
        userId: user.id,
        name: 'Favoritos',
      },
    });

    if (!favoritesList) {
      favoritesList = await prisma.movieList.create({
        data: {
          userId: user.id,
          name: 'Favoritos',
          description: 'Mis películas favoritas',
          isPublic: true,
        },
      });
    }

    // Añadir la película a la lista (o actualizar las notas si ya existe)
    const favoriteItem = await prisma.movieListItem.upsert({
      where: {
        listId_movieId: {
          listId: favoritesList.id,
          movieId: movieId,
        },
      },
      update: {
        notes: notes || undefined,
      },
      create: {
        listId: favoritesList.id,
        movieId: movieId,
        notes: notes || undefined,
      },
    });

    return NextResponse.json({
      message: 'Película añadida a favoritos',
      favorite: favoriteItem,
    });
  } catch (error) {
    console.error('Error añadiendo a favoritos:', error);
    return NextResponse.json(
      { error: 'Error al añadir película a favoritos' },
      { status: 500 }
    );
  }
}

// DELETE /api/favorites?movieId=xxx - Eliminar película de favoritos
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const movieId = searchParams.get('movieId');

    if (!movieId) {
      return NextResponse.json(
        { error: 'ID de película requerido' },
        { status: 400 }
      );
    }

    // Buscar al usuario
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Buscar la lista de favoritos
    const favoritesList = await prisma.movieList.findFirst({
      where: {
        userId: user.id,
        name: 'Favoritos',
      },
    });

    if (!favoritesList) {
      return NextResponse.json(
        { error: 'Lista de favoritos no encontrada' },
        { status: 404 }
      );
    }

    // Eliminar la película de la lista de favoritos
    await prisma.movieListItem.delete({
      where: {
        listId_movieId: {
          listId: favoritesList.id,
          movieId: movieId,
        },
      },
    });

    return NextResponse.json({
      message: 'Película eliminada de favoritos',
    });
  } catch (error) {
    console.error('Error eliminando de favoritos:', error);
    return NextResponse.json(
      { error: 'Error al eliminar película de favoritos' },
      { status: 500 }
    );
  }
}
