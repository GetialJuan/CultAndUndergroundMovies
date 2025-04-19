'use client';
import { useRef, useState } from 'react';
import Image from 'next/image';

const BOT_AVATAR = '/lading/bot-avatar.png'; // Cambia la ruta si tienes otra imagen

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

export default function ChatBotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { sender: 'user' as const, text: input };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.text }),
      });
      const data = await res.json();
      setMessages((msgs) => [
        ...msgs,
        { sender: 'bot', text: data.answer || 'Error al responder' },
      ]);
    } catch {
      setMessages((msgs) => [
        ...msgs,
        { sender: 'bot', text: 'Error de conexión' },
      ]);
    }
    setLoading(false);
    setTimeout(() => {
      chatRef.current?.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }, 100);
  };

  return (
    <>
      {/* Botón flotante */}
      <button
        className="fixed z-50 bottom-6 right-6 w-16 h-16 rounded-full bg-gradient-to-br from-purple-700 to-pink-600 shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
        onClick={() => setOpen((v) => !v)}
        aria-label="Abrir chat"
      >
        <Image
          src={BOT_AVATAR}
          alt="Bot"
          width={40}
          height={40}
          className="rounded-full"
        />
      </button>
      {/* Ventana de chat */}
      {open && (
        <div className="fixed z-50 bottom-24 right-6 w-80 max-w-[95vw] bg-zinc-900 rounded-xl shadow-2xl flex flex-col border border-zinc-700 animate-fade-in">
          <div className="flex items-center gap-2 p-4 border-b border-zinc-800">
            <Image
              src={BOT_AVATAR}
              alt="Bot"
              width={32}
              height={32}
              className="rounded-full"
            />
            <span className="font-bold text-lg text-pink-400">
              CineBot Culto
            </span>
            <button
              className="ml-auto text-zinc-400 hover:text-pink-400"
              onClick={() => setOpen(false)}
              aria-label="Cerrar chat"
            >
              ✕
            </button>
          </div>
          <div
            ref={chatRef}
            className="flex-1 overflow-y-auto p-4 space-y-3 bg-zinc-900"
            style={{ maxHeight: 350 }}
          >
            {messages.length === 0 && (
              <div className="text-zinc-400 text-sm text-center">
                ¡Hola! ¿En qué puedo ayudarte sobre Cult & Underground Movies?
              </div>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`px-4 py-2 rounded-2xl max-w-[80%] text-sm ${
                    msg.sender === 'user'
                      ? 'bg-pink-600 text-white'
                      : 'bg-zinc-800 text-pink-200'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="px-4 py-2 rounded-2xl bg-zinc-800 text-pink-200 text-sm animate-pulse">
                  CineBot está escribiendo...
                </div>
              </div>
            )}
          </div>
          <form
            className="flex gap-2 p-3 border-t border-zinc-800 bg-zinc-900"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <input
              className="flex-1 rounded-full px-4 py-2 bg-zinc-800 text-white focus:outline-none"
              placeholder="Escribe tu mensaje..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              maxLength={300}
              autoFocus
            />
            <button
              type="submit"
              className="bg-pink-600 hover:bg-pink-700 text-white rounded-full px-4 py-2 font-bold disabled:opacity-50"
              disabled={loading || !input.trim()}
            >
              Enviar
            </button>
          </form>
        </div>
      )}
    </>
  );
}
