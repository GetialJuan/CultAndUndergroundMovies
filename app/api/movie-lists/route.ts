// Ruta: c:\Users\carlo\Documents\Universidad\Proyecto Integrador\CultAndUndergroundMovies\app\api\movie-lists\route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/movie-lists - Get movie lists for the current user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
    }

    // Buscar el usuario por email en lugar de por id
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    const movieLists = await prisma.movieList.findMany({
      where: { userId: user.id },
      include: {
        _count: {
          select: { items: true },
        },
        items: {
          include: {
            movie: {
              select: {
                posterImage: true,
              },
            },
          },
          take: 1,
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json(movieLists);
  } catch (error) {
    console.error('Error fetching movie lists:', error);
    return NextResponse.json(
      { message: 'Error al obtener listas de películas' },
      { status: 500 }
    );
  }
}

// POST /api/movie-lists - Create a new movie list
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { name, description, isPublic } = body;

    if (!name) {
      return NextResponse.json(
        { message: 'El nombre de la lista es obligatorio' },
        { status: 400 }
      );
    }

    const newList = await prisma.movieList.create({
      data: {
        name,
        description: description || '',
        isPublic: isPublic ?? true,
        userId: user.id,
      },
    });

    return NextResponse.json(newList);
  } catch (error) {
    console.error('Error creating movie list:', error);
    return NextResponse.json(
      { message: 'Error al crear lista de películas' },
      { status: 500 }
    );
  }
}
