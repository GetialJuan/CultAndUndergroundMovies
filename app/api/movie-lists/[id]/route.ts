/**
 * @fileoverview API routes for managing individual movie lists.
 * This module defines API endpoints for retrieving, updating, and deleting specific movie lists.
 * It uses Next.js serverless functions, NextAuth.js for authentication, and Prisma for database interactions.
 */

import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

/**
 * GET /api/lists/[id] - Retrieves a specific movie list by ID.
 *
 * @async
 * @param {NextRequest} req - The incoming request object.
 * @param {Object} params - The route parameters.
 * @param {string} params.id - The ID of the movie list to retrieve.
 * @returns {Promise<NextResponse>} A JSON response containing the movie list or an error message.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    // Get the list with item count
    const list = await prisma.movieList.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            movie: true,
          },
        },
        user: {
          select: {
            id: true,
            username: true,
            profilePicture: true,
          },
        },
      },
    });

    if (!list) {
      return NextResponse.json({ message: 'List not found' }, { status: 404 });
    }

    // Check if this is a private list that doesn't belong to the current user
    const session: any = await getServerSession(authOptions as any);
    if (!list.isPublic && (!session?.user || session.user.id !== list.userId)) {
      return NextResponse.json(
        { message: "You don't have permission to view this list" },
        { status: 403 }
      );
    }

    return NextResponse.json(list, { status: 200 });
  } catch (error) {
    console.error('Error fetching movie list:', error);

    return NextResponse.json(
      { message: 'An error occurred while fetching the list' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/lists/[id] - Updates a specific movie list by ID.
 *
 * @async
 * @param {NextRequest} req - The incoming request object containing the updated list data.
 * @param {Object} params - The route parameters.
 * @param {string} params.id - The ID of the movie list to update.
 * @returns {Promise<NextResponse>} A JSON response containing the updated movie list or an error message.
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const { name, description, isPublic } = await req.json();

    // Get the current user session
    const session: any = await getServerSession(authOptions as any);

    if (!session || !session.user) {
      return NextResponse.json(
        { message: 'Unauthorized. Please sign in to update a list.' },
        { status: 401 }
      );
    }

    // Check if the list exists and belongs to the current user
    const existingList = await prisma.movieList.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existingList) {
      return NextResponse.json({ message: 'List not found' }, { status: 404 });
    }

    if (existingList.userId !== session.user.id) {
      return NextResponse.json(
        { message: "You don't have permission to update this list" },
        { status: 403 }
      );
    }

    // Update the list
    const updatedList = await prisma.movieList.update({
      where: { id },
      data: {
        name: name || undefined,
        description: description !== undefined ? description : undefined,
        isPublic: isPublic !== undefined ? isPublic : undefined,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedList, { status: 200 });
  } catch (error) {
    console.error('Error updating movie list:', error);

    return NextResponse.json(
      { message: 'An error occurred while updating the list' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/lists/[id] - Deletes a specific movie list by ID.
 *
 * @async
 * @param {NextRequest} req - The incoming request object.
 * @param {Object} params - The route parameters.
 * @param {string} params.id - The ID of the movie list to delete.
 * @returns {Promise<NextResponse>} A JSON response indicating the success of deleting the movie list or an error message.
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Get the current user session
    const session: any = await getServerSession(authOptions as any);

    if (!session || !session.user) {
      return NextResponse.json(
        { message: 'Unauthorized. Please sign in to delete a list.' },
        { status: 401 }
      );
    }

    // Check if the list exists and belongs to the current user
    const existingList = await prisma.movieList.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existingList) {
      return NextResponse.json({ message: 'List not found' }, { status: 404 });
    }

    if (existingList.userId !== session.user.id) {
      return NextResponse.json(
        { message: "You don't have permission to delete this list" },
        { status: 403 }
      );
    }

    // Delete all items in the list first
    await prisma.movieListItem.deleteMany({
      where: { listId: id },
    });

    // Delete the list
    await prisma.movieList.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'List deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting movie list:', error);

    return NextResponse.json(
      { message: 'An error occurred while deleting the list' },
      { status: 500 }
    );
  }
}