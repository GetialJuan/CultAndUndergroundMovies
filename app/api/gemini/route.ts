import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    const { title, genre, synopsis, isCult, isUnderground, releaseYear } = await req.json();

    let extraTags = [];
    if (isCult) extraTags.push("de culto");
    if (isUnderground) extraTags.push("underground");

    const tagsDescription = extraTags.length > 0 ? ` Esta película es considerada ${extraTags.join(" y ")}.` : "";

    const prompt = `Escribe una razón breve pero convincente por la que alguien debería ver la película 
    "${title}", lanzada en el año ${releaseYear}. Género: ${genre}. Sinopsis: ${synopsis}.${tagsDescription} 
    Además, menciona qué tipo de persona (por ejemplo, fanáticos de la ciencia ficción, amantes de los 
    thrillers psicológicos, o espectadores que disfrutan de tramas introspectivas) disfrutaría especialmente 
    de esta película. En máximo 300 caracteres.`;
    
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
    console.log("Data:", data);
    const output = data.candidates?.[0]?.content?.parts?.[0]?.text || "No se pudo generar el texto.";
  
    return new Response(JSON.stringify({ result: output }), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  