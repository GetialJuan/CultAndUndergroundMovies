import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { reviews, movieTitle } = await req.json();
  
  // Combine all reviews into a single text for the prompt
  const reviewsText = reviews.map((review: any) => 
    `Reseña (${review.rating}/5 estrellas): "${review.content}"`
  ).join("\n\n");

  const prompt = `Analiza las siguientes reseñas de la película "${movieTitle}" y genera un resumen 
  conciso (máximo 400 caracteres) que capture el sentimiento general de los espectadores, 
  destacando los puntos fuertes y débiles mencionados con frecuencia:

  ${reviewsText}
  
  Formato deseado: Un párrafo conciso con el consenso general, seguido de 2-3 elementos positivos 
  y 1-2 elementos negativos (si existen).`;
  
  const res = await fetch("https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro-002:generateContent?key=" + process.env.GEMINI_API_KEY, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  });

  const data = await res.json();
  const output = data.candidates?.[0]?.content?.parts?.[0]?.text || "No se pudieron sintetizar las reseñas.";

  return new Response(JSON.stringify({ result: output }), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
