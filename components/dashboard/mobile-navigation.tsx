"use client"

import { useState } from "react"
import Link from "next/link"
import { Film, List, MessageSquare, User, Search, Home, X } from "lucide-react"

export default function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false)

  if (!isOpen) return null

  return (
    <div className="lg:hidden fixed inset-0 bg-black bg-opacity-95 z-50 flex flex-col">
      <div className="flex justify-end p-4">
        <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
          <X className="h-6 w-6" />
        </button>
      </div>

      <nav className="flex-1 flex flex-col items-center justify-center space-y-6 text-xl">
        <Link
          href="/dashboard"
          className="flex flex-col items-center hover:text-red-600 transition-colors"
          onClick={() => setIsOpen(false)}
        >
          <Home className="h-6 w-6 mb-1" />
          <span>Inicio</span>
        </Link>
        <Link
          href="/search"
          className="flex flex-col items-center hover:text-red-600 transition-colors"
          onClick={() => setIsOpen(false)}
        >
          <Search className="h-6 w-6 mb-1" />
          <span>Buscar</span>
        </Link>
        <Link
          href="/films"
          className="flex flex-col items-center hover:text-red-600 transition-colors"
          onClick={() => setIsOpen(false)}
        >
          <Film className="h-6 w-6 mb-1" />
          <span>Películas</span>
        </Link>
        <Link
          href="/my-lists"
          className="flex flex-col items-center hover:text-red-600 transition-colors"
          onClick={() => setIsOpen(false)}
        >
          <List className="h-6 w-6 mb-1" />
          <span>Listas</span>
        </Link>
        <Link
          href="/forums"
          className="flex flex-col items-center hover:text-red-600 transition-colors"
          onClick={() => setIsOpen(false)}
        >
          <MessageSquare className="h-6 w-6 mb-1" />
          <span>Foros</span>
        </Link>
        <Link
          href="/profile"
          className="flex flex-col items-center hover:text-red-600 transition-colors"
          onClick={() => setIsOpen(false)}
        >
          <User className="h-6 w-6 mb-1" />
          <span>Perfil</span>
        </Link>
      </nav>
    </div>
  )
}

