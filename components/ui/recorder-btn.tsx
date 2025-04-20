"use client";

import { useState, useRef, useEffect } from 'react';
import { Mic, StopCircle } from 'lucide-react';

interface RecorderBtnProps {
  onTranscriptionReceived?: (text: string) => void;
  disabled?: boolean;
  className?: string;
}

export default function RecorderBtn({ 
  onTranscriptionReceived, 
  disabled = false, 
  className = '' 
}: RecorderBtnProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async (event: React.MouseEvent) => {
    event.preventDefault();
    audioChunksRef.current = [];
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        onAudioRecorded(audioBlob);
        
        // Stop all audio tracks
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('No se pudo acceder al micrófono. Por favor verifica los permisos.');
    }
  };

  const stopRecording = (event: React.MouseEvent) => {
    event.preventDefault();
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const onAudioRecorded = async (audioBlob: Blob) => {
    try {
      setIsTranscribing(true);
      
      // Create FormData to send the audio file
      const formData = new FormData();
      formData.append('file', audioBlob, 'recording.webm');
      
      // Send the audio to the transcription API
      const response = await fetch('/api/transcript', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Transcription result:', result);
      // If callback is provided, pass the transcribed text
      if (onTranscriptionReceived && result.text) {
        onTranscriptionReceived(result.text);
      }
    } catch (error) {
      console.error('Error transcribing audio:', error);
      alert('Error al transcribir el audio. Por favor, intenta nuevamente.');
    } finally {
      setIsTranscribing(false);
    }
  }

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
    };
  }, [isRecording]);

  return (
    <button
      onClick={isRecording ? stopRecording : startRecording}
      disabled={disabled || isTranscribing}
      className={`relative bg-pink-600 hover:bg-pink-700 text-white rounded-full px-4 py-2 font-bold disabled:opacity-50 flex items-center justify-center ${className} ${
        isRecording ? 'bg-pink-700' : ''
      } ${isTranscribing ? 'bg-purple-600' : ''}`}
      aria-label={
        isTranscribing 
          ? "Transcribiendo audio" 
          : isRecording 
            ? "Detener grabación" 
            : "Grabar mensaje de voz"
      }
    >
      {isTranscribing ? (
        <>
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-solid border-white border-t-transparent"></div>
        </>
      ) : isRecording ? (
        <>
          <StopCircle size={20} className="" />
          {/* Pulse animation */}
          <span className="absolute w-full h-full rounded-full animate-ping bg-pink-600 opacity-30"></span>
        </>
      ) : (
        <>
          <Mic size={20} className="" />
        </>
      )}
    </button>
  );
}