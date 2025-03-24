import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/auth';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string; movieId: string } }
) {
  try {
    const listId = params.id;
    const movieId = params.movieId;
    
    // Get the current user session
    const session: any = await getServerSession(authOptions as any);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { message: "Unauthorized. Please sign in to modify a list." },
        { status: 401 }
      );
    }
    
    // Check if the list exists and belongs to the current user
    const existingList = await prisma.movieList.findUnique({
      where: { id: listId },
      select: { userId: true },
    });
    
    if (!existingList) {
      return NextResponse.json(
        { message: "List not found" },
        { status: 404 }
      );
    }
    
    //if (existingList.userId !== session.user.id) {
    //  return NextResponse.json(
    //    { message: "You don't have permission to modify this list" },
    //    { status: 403 }
    //  );
    //}
    
    // Check if the movie is already in the list
    const existingListItem = await prisma.movieListItem.findUnique({
      where: {
        listId_movieId: {
          listId: listId,
          movieId: movieId,
        },
      },
    });
    
    if (existingListItem) {
      return NextResponse.json(
        { message: "Movie already exists in this list" },
        { status: 409 }
      );
    }
    
    // Add the movie to the list
    await prisma.movieListItem.create({
      data: {
        list: {
          connect: { id: listId }
        },
        movie: {
          connect: { id: movieId }
        }
      },
    });
    
    return NextResponse.json(
      { message: "Movie added to list successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding movie to list:", error);
    
    return NextResponse.json(
      { message: "An error occurred while adding the movie to the list" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string; movieId: string } }
) {
  try {
    const listId = params.id;
    const movieId = params.movieId;
    
    // Get the current user session
    const session: any = await getServerSession(authOptions as any);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { message: "Unauthorized. Please sign in to modify a list." },
        { status: 401 }
      );
    }
    
    // Check if the list exists and belongs to the current user
    const existingList = await prisma.movieList.findUnique({
      where: { id: listId },
      select: { userId: true },
    });
    
    if (!existingList) {
      return NextResponse.json(
        { message: "List not found" },
        { status: 404 }
      );
    }
    
    if (existingList.userId !== session.user.id) {
      return NextResponse.json(
        { message: "You don't have permission to modify this list" },
        { status: 403 }
      );
    }
    
    // Check if the movie is in the list
    const listItem = await prisma.movieListItem.findUnique({
      where: {
        listId_movieId: {
          listId: listId,
          movieId: movieId,
        },
      },
    });
    
    if (!listItem) {
      return NextResponse.json(
        { message: "Movie not found in this list" },
        { status: 404 }
      );
    }
    
    // Remove the movie from the list
    await prisma.movieListItem.delete({
      where: {
        listId_movieId: {
          listId: listId,
          movieId: movieId,
        },
      },
    });
    
    return NextResponse.json(
      { message: "Movie removed from list successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error removing movie from list:", error);
    
    return NextResponse.json(
      { message: "An error occurred while removing the movie from the list" },
      { status: 500 }
    );
  }
}
