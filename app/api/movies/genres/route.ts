/**
 * @fileoverview API route to fetch a list of genres from the database.
 * This module queries the Prisma database to retrieve a list of all genres, ordered alphabetically by name.
 * It returns the list as a JSON response or an error message if the operation fails.
 */

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * GET /api/genres - Retrieves a list of genres from the database, ordered alphabetically.
 *
 * @async
 * @returns {Promise<NextResponse>} A JSON response containing an array of genres or an error message.
 */
export async function GET() {
  try {
    const genres = await prisma.genre.findMany({
      orderBy: {
        name: 'asc'
      }
    });
    
    return NextResponse.json(genres);
  } catch (error) {
    console.error('Error fetching genres:', error);
    return NextResponse.json(
      { error: 'Failed to fetch genres' },
      { status: 500 }
    );
  }
}