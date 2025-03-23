import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: { movieId: string } }) {
  try {
    // Asegúrate de que params.movieId esté disponible
    const { movieId } = params;

    if (!movieId) {
      return NextResponse.json({ success: false, error: "Movie ID is required" }, { status: 400 });
    }

    // Buscar la película en la base de datos
    const movie = await prisma.movie.findUnique({
      where: { id: movieId },
      select: {
        title: true,
        duration: true,
        releaseYear: true,
        director: true,
        synopsis: true,
      },
    });

    if (!movie) {
      return NextResponse.json({ success: false, error: "Movie not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, movie });
  } catch (error) {
    console.error("Error fetching movie:", error);
    return NextResponse.json({ success: false, error: "Error fetching movie" }, { status: 500 });
  }
}