/**
 * @fileoverview API route to fetch a list of distinct directors from the movie database.
 * This module queries the Prisma database to retrieve a unique list of directors, excluding null values.
 * It returns the list as a JSON response or an error message if the operation fails.
 */

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * GET /api/directors - Retrieves a list of distinct directors from the movie database.
 *
 * @async
 * @returns {Promise<NextResponse>} A JSON response containing an array of distinct director names or an error message.
 */
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