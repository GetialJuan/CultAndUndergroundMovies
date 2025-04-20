"use client"
import { useEffect } from "react";

export function useSpeech(text: string) {
  // Precargar las voces en cuanto cambien
  useEffect(() => {
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices()
    };
  }, []);

  const speak = (altText: string = text) => {
    if (!altText) return;

    const utterance = new SpeechSynthesisUtterance(altText);
    utterance.lang = "es-CO";     // español de Colombia
    utterance.rate = 1.2;         // velocidad algo elevada
    utterance.pitch = 1.1;        // tono ligeramente más alto
    utterance.volume = 1;         // volumen máximo

    // Voz en español de Colombia, preferiblemente femenina
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(
      (v) =>
        v.lang.startsWith("es") &&
        /female|maria|lucia|helena|sabina|lupe/i.test(v.name)
    );
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }

    window.speechSynthesis.speak(utterance);
  };

  return speak;
}


