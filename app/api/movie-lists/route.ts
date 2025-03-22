import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { Prisma } from "@prisma/client";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: NextRequest) {
  try {
    // Get the current user session
    const session = await getServerSession(authOptions as any);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { message: "Unauthorized. Please sign in to create a list." },
        { status: 401 }
      );
    }
    
    const { name, description } = await req.json();
    
    // Validate input data
    if (!name || name.trim() === "") {
      return NextResponse.json(
        { message: "List name is required" },
        { status: 400 }
      );
    }
    
    // Para debugging
    console.log("Session user object:", session.user);
    console.log("Session:", session);
    
    // Get the user ID from the session
    if (!session.user.id) {
      return NextResponse.json(
        { message: "User ID not found in session" },
        { status: 400 }
      );
    }
    
    const userId = session.user.id;
    
    // Create the new list
    const newList = await prisma.movieList.create({
      data: {
        name,
        description,
        userId,
        isPublic: true, // Default to public
      },
    });
    
    return NextResponse.json(newList, { status: 201 });
  } catch (error) {
    console.error("Error creating movie list:", error);
    
    // Add more detailed error logging
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    
    // Handle uniqueness constraint violation
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json(
          { message: "A list with this name already exists" },
          { status: 409 }
        );
      }
    }
    
    return NextResponse.json(
      { message: "An error occurred while creating the list" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    // Get the current user session
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { message: "Unauthorized. Please sign in to view your lists." },
        { status: 401 }
      );
    }
    
    // Get the user ID from the session
    if (!session.user.id) {
      return NextResponse.json(
        { message: "User ID not found in session" },
        { status: 400 }
      );
    }
    
    const userId = session.user.id;
    
    // Fetch all lists for the current user
    const lists = await prisma.movieList.findMany({
      where: {
        userId,
      },
      include: {
        _count: {
          select: {
            items: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    // Transform the data to include the count
    const formattedLists = lists.map(list => ({
      id: list.id,
      name: list.name,
      description: list.description,
      isPublic: list.isPublic,
      createdAt: list.createdAt,
      updatedAt: list.updatedAt,
      itemCount: list._count.items,
    }));
    
    return NextResponse.json(formattedLists, { status: 200 });
  } catch (error) {
    console.error("Error fetching movie lists:", error);
    
    return NextResponse.json(
      { message: "An error occurred while fetching lists" },
      { status: 500 }
    );
  }
}
