import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Asegúrate de que prisma esté configurado correctamente

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { movieId, userId, rating, content } = body;

    // Validar los datos recibidos
    if (!movieId || !userId || !rating || !content) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    // Crear una nueva reseña en la base de datos
    const newReview = await prisma.review.create({
      data: {
        movieId,
        userId,
        rating,
        content, // Cambiado de "review" a "content" según el modelo
      },
    });

    return NextResponse.json({ success: true, review: newReview }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Error saving review" }, { status: 500 });
  }
}