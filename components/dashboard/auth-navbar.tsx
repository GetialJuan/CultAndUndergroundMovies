"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { signOut } from "next-auth/react"
import { Film, Search, Bell, Menu, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface AuthNavbarProps {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

export default function AuthNavbar({ user }: AuthNavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Implementar búsqueda
    console.log("Searching for:", searchQuery)
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" })
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-black/90 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <Film className="h-6 w-6 text-red-500" />
          <span className="text-xl font-bold tracking-wider">
            CULT<span className="text-red-500">&</span>UNDERGROUND
          </span>
        </Link>

        {/* Barra de búsqueda (visible en desktop) */}
        <form onSubmit={handleSearch} className="hidden md:flex items-center relative max-w-md flex-1 mx-4">
          <Input
            type="search"
            placeholder="Buscar películas, listas o usuarios..."
            className="bg-zinc-900/80 border-zinc-700 focus-visible:ring-red-500 pl-10 pr-4 py-2 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
        </form>

        {/* Navegación y perfil (desktop) */}
        <div className="hidden md:flex items-center gap-4">
          {/* Notificaciones */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5 text-zinc-400" />
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px]">
                  3
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 border-zinc-800 bg-zinc-900">
              <div className="flex items-center justify-between p-2 border-b border-zinc-800">
                <span className="font-medium">Notificaciones</span>
                <Button variant="ghost" size="sm" className="text-xs text-zinc-400 hover:text-white">
                  Marcar todas como leídas
                </Button>
              </div>
              <div className="max-h-[300px] overflow-y-auto py-1">
                <div className="p-3 hover:bg-zinc-800 cursor-pointer">
                  <div className="flex gap-3">
                    <div className="h-9 w-9 rounded-full bg-zinc-800 flex-shrink-0 overflow-hidden">
                      <Image
                        src="/placeholder.svg?height=36&width=36"
                        alt="User"
                        width={36}
                        height={36}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm">
                        <span className="font-medium">CinemaFanatic</span> comentó en tu reseña de "Eraserhead"
                      </p>
                      <p className="text-xs text-zinc-400 mt-1">Hace 2 horas</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 hover:bg-zinc-800 cursor-pointer bg-zinc-800/50">
                  <div className="flex gap-3">
                    <div className="h-9 w-9 rounded-full bg-zinc-800 flex-shrink-0 overflow-hidden">
                      <Image
                        src="/placeholder.svg?height=36&width=36"
                        alt="User"
                        width={36}
                        height={36}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm">
                        <span className="font-medium">FilmNoir42</span> te ha seguido
                      </p>
                      <p className="text-xs text-zinc-400 mt-1">Hace 5 horas</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 hover:bg-zinc-800 cursor-pointer">
                  <div className="flex gap-3">
                    <div className="h-9 w-9 rounded-full bg-zinc-800 flex-shrink-0 overflow-hidden">
                      <Image
                        src="/placeholder.svg?height=36&width=36"
                        alt="User"
                        width={36}
                        height={36}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm">
                        <span className="font-medium">Sistema</span> Tu lista "Cyberpunk Essentials" ha sido destacada
                      </p>
                      <p className="text-xs text-zinc-400 mt-1">Hace 1 día</p>
                    </div>
                  </div>
                </div>
              </div>
              <DropdownMenuSeparator className="bg-zinc-800" />
              <div className="p-2 text-center">
                <Button variant="ghost" size="sm" className="text-xs text-zinc-400 hover:text-white w-full">
                  Ver todas las notificaciones
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Perfil de usuario */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full border border-zinc-800 bg-zinc-900 p-0 hover:bg-zinc-800"
              >
                <div className="h-8 w-8 overflow-hidden rounded-full">
                  <Image
                    src={user.image || "/placeholder.svg?height=32&width=32"}
                    alt={user.name || "Usuario"}
                    width={32}
                    height={32}
                    className="h-full w-full object-cover"
                  />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 border-zinc-800 bg-zinc-900 text-zinc-300">
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="h-8 w-8 overflow-hidden rounded-full">
                  <Image
                    src={user.image || "/placeholder.svg?height=32&width=32"}
                    alt={user.name || "Usuario"}
                    width={32}
                    height={32}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <p className="text-sm font-medium text-white">{user.name || "Usuario"}</p>
                  <p className="text-xs text-zinc-400">{user.email}</p>
                </div>
              </div>
              <DropdownMenuSeparator className="bg-zinc-800" />
              <DropdownMenuItem className="hover:bg-zinc-800 hover:text-white focus:bg-zinc-800 focus:text-white">
                <Link href="/profile" className="flex w-full items-center">
                  <svg
                    className="mr-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span>Perfil</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-zinc-800 hover:text-white focus:bg-zinc-800 focus:text-white">
                <Link href="/movie-lists" className="flex w-full items-center">
                  <svg
                    className="mr-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  <span>Mis Listas</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-zinc-800 hover:text-white focus:bg-zinc-800 focus:text-white">
                <Link href="/settings" className="flex w-full items-center">
                  <svg
                    className="mr-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>Configuración</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-zinc-800" />
              <DropdownMenuItem
                className="hover:bg-zinc-800 hover:text-white focus:bg-zinc-800 focus:text-white cursor-pointer"
                onClick={handleSignOut}
              >
                <svg
                  className="mr-2 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span>Cerrar Sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Menú móvil */}
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Menú móvil expandido */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-zinc-800 bg-black">
          <div className="p-4">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Input
                  type="search"
                  placeholder="Buscar películas, listas o usuarios..."
                  className="bg-zinc-900 border-zinc-700 focus-visible:ring-red-500 pl-10 pr-4 py-2 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
              </div>
            </form>

            <nav className="space-y-4">
              <Link
                href="/profile"
                className="flex items-center gap-3 p-2 hover:bg-zinc-900 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="h-8 w-8 overflow-hidden rounded-full">
                  <Image
                    src={user.image || "/placeholder.svg?height=32&width=32"}
                    alt={user.name || "Usuario"}
                    width={32}
                    height={32}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium">{user.name || "Usuario"}</p>
                  <p className="text-xs text-zinc-400">Ver perfil</p>
                </div>
              </Link>

              <Link
                href="/notifications"
                className="flex items-center justify-between p-2 hover:bg-zinc-900 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-zinc-400" />
                  <span>Notificaciones</span>
                </div>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs">3</span>
              </Link>

              <Link
                href="/movie-lists"
                className="flex items-center gap-3 p-2 hover:bg-zinc-900 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                <svg
                  className="h-5 w-5 text-zinc-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                <span>Mis Listas</span>
              </Link>

              <Link
                href="/settings"
                className="flex items-center gap-3 p-2 hover:bg-zinc-900 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                <svg
                  className="h-5 w-5 text-zinc-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>Configuración</span>
              </Link>

              <button
                className="flex items-center gap-3 p-2 hover:bg-zinc-900 rounded-md w-full text-left"
                onClick={handleSignOut}
              >
                <svg
                  className="h-5 w-5 text-zinc-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span>Cerrar Sesión</span>
              </button>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}

