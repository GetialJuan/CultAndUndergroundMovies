"use client";
import { useEffect, useRef } from "react";

export function useSpeech(text: string) {
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Precargar voces
  useEffect(() => {
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
  }, []);

  const speak = (altText: string = text) => {
    if (!altText) return;

    // Detener cualquier lectura previa
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(altText);
    utterance.lang = "es-CO";
    utterance.rate = 1.2;
    utterance.pitch = 1.1;
    utterance.volume = 1;

    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(
      (v) =>
        v.lang.startsWith("es") &&
        /female|maria|lucia|helena|sabina|lupe/i.test(v.name)
    );
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const pause = () => {
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
    }
  };

  const resume = () => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
  };

  const cancel = () => {
    window.speechSynthesis.cancel();
  };

  return { speak, pause, resume, cancel };
}
