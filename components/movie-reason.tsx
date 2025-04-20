"use client";

import { useSpeech } from "@/hooks/use-speech";
import { useEffect, useState } from "react";

export function MovieReasonGemini({ movie }: { movie: any }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const speak = useSpeech(text);

  const generate = async () => {
    setLoading(true);
    const res = await fetch("/api/gemini", {
      method: "POST",
      body: JSON.stringify({
        title: movie.title,
        genre: movie.genres,
        synopsis: movie.synopsis,
        isCult: movie.isCult,
        isUnderground: movie.isUnderground,
        releaseYear: movie.releaseYear,
      }),
    });
    const data = await res.json();
    setText(data.result);
    setLoading(false);
  };
  
  // Es importante llamar a getVoices() tras haberse cargado el evento 'voiceschanged':
  useEffect(() => {
    window.speechSynthesis.onvoiceschanged = () => {
      // Esto asegura que las voces estén disponibles antes de usarlas
      window.speechSynthesis.getVoices();
    };
  }, []);

  return (
    <div className="space-y-3 mt-4">
      <button
        onClick={generate}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        disabled={loading}
      >
        {loading ? "Generating..." : "✍️ ¿Why should I see this?"}
      </button>

      {text && (
        <div className="bg-zinc-800 p-3 rounded text-white">
          <p>{text}</p>
          <button
            onClick={speak}
            className="mt-2 px-3 py-1 bg-blue-600 rounded hover:bg-blue-700"
          >
            🔊 Listen
          </button>
        </div>
      )}
    </div>
  );
}
