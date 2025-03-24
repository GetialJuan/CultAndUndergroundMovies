import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Get distinct directors and filter out nulls
    const movies = await prisma.movie.findMany({
      where: {
        director: {
          not: null
        }
      },
      select: {
        director: true
      },
      distinct: ['director']
    });
    
    const directors = movies
      .map(movie => movie.director)
      .filter(director => director !== null) as string[];
    
    return NextResponse.json(directors);
  } catch (error) {
    console.error('Error fetching directors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch directors' },
      { status: 500 }
    );
  }
}
