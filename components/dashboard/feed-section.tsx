"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { MessageSquare, Heart, Share2, MoreHorizontal, Film } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"

// Datos simulados para el feed
const feedPosts = [
  {
    id: 1,
    type: "review",
    user: {
      name: "CinemaFanatic",
      username: "cinemafanatic",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    timestamp: "Hace 2 horas",
    content:
      "Acabo de ver 'Eraserhead' de David Lynch por tercera vez y sigue siendo una experiencia surrealista incomparable. La atmósfera industrial opresiva, el sonido inquietante y las imágenes oníricas crean una pesadilla en blanco y negro que se queda contigo mucho después de que termina.",
    film: {
      title: "Eraserhead",
      year: 1977,
      director: "David Lynch",
      poster: "/placeholder.svg?height=120&width=80",
      rating: 4.5,
    },
    likes: 24,
    comments: 8,
  },
  {
    id: 2,
    type: "discussion",
    user: {
      name: "FilmNoir42",
      username: "filmnoir42",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    timestamp: "Hace 5 horas",
    content:
      "¿Cuál consideran que es la mejor película de Alejandro Jodorowsky y por qué? Personalmente me debato entre 'El Topo' y 'La Montaña Sagrada', aunque cada una ofrece una experiencia psicodélica única.",
    likes: 18,
    comments: 15,
  },
  {
    id: 3,
    type: "list",
    user: {
      name: "CultCinemaCollector",
      username: "cultcinemacollector",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    timestamp: "Hace 1 día",
    content:
      "Acabo de actualizar mi lista de 'Cyberpunk Esenciales' con algunas joyas menos conocidas del género. Desde 'Tetsuo: The Iron Man' hasta 'Hardware', estas películas definieron la estética cyberpunk antes de que fuera mainstream.",
    list: {
      title: "Cyberpunk Esenciales",
      count: 12,
      films: [
        {
          title: "Blade Runner",
          poster: "/placeholder.svg?height=90&width=60",
        },
        {
          title: "Tetsuo: The Iron Man",
          poster: "/placeholder.svg?height=90&width=60",
        },
        {
          title: "Hardware",
          poster: "/placeholder.svg?height=90&width=60",
        },
      ],
    },
    likes: 42,
    comments: 7,
  },
]

export default function FeedSection() {
  const [activeTab, setActiveTab] = useState("para-ti")
  const [newPostContent, setNewPostContent] = useState("")

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Implementar lógica para publicar
    console.log("Nuevo post:", newPostContent)
    setNewPostContent("")
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Feed</h2>
        <Button
          variant="outline"
          size="sm"
          className="border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white"
        >
          <Film className="mr-2 h-4 w-4" />
          Nueva Reseña
        </Button>
      </div>

      {/* Formulario para nueva publicación */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
        <form onSubmit={handlePostSubmit}>
          <div className="flex gap-4">
            <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full">
              <Image
                src="/placeholder.svg?height=40&width=40"
                alt="Tu avatar"
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1">
              <Textarea
                placeholder="¿Qué película de culto has visto recientemente?"
                className="min-h-[80px] border-zinc-700 bg-zinc-800 text-white resize-none focus-visible:ring-red-500"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
              />
              <div className="mt-2 flex justify-end">
                <Button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white"
                  disabled={!newPostContent.trim()}
                >
                  Publicar
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Tabs para filtrar el feed */}
      <Tabs defaultValue="para-ti" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="border-b border-zinc-800 bg-transparent">
          <TabsTrigger
            value="para-ti"
            className="data-[state=active]:border-red-500 data-[state=active]:bg-transparent data-[state=active]:text-white"
          >
            Para Ti
          </TabsTrigger>
          <TabsTrigger
            value="siguiendo"
            className="data-[state=active]:border-red-500 data-[state=active]:bg-transparent data-[state=active]:text-white"
          >
            Siguiendo
          </TabsTrigger>
          <TabsTrigger
            value="recientes"
            className="data-[state=active]:border-red-500 data-[state=active]:bg-transparent data-[state=active]:text-white"
          >
            Recientes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="para-ti" className="mt-4 space-y-4">
          {feedPosts.map((post) => (
            <FeedPost key={post.id} post={post} />
          ))}
        </TabsContent>

        <TabsContent value="siguiendo" className="mt-4">
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-8 text-center">
            <p className="text-zinc-400">Sigue a más usuarios para ver su actividad aquí.</p>
            <Button className="mt-4 bg-red-600 hover:bg-red-700 text-white">Explorar Usuarios</Button>
          </div>
        </TabsContent>

        <TabsContent value="recientes" className="mt-4 space-y-4">
          {[...feedPosts].reverse().map((post) => (
            <FeedPost key={post.id} post={post} />
          ))}
        </TabsContent>
      </Tabs>
    </section>
  )
}

function FeedPost({ post }: { post: any }) {
  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(post.likes)

  const handleLike = () => {
    if (liked) {
      setLikesCount(likesCount - 1)
    } else {
      setLikesCount(likesCount + 1)
    }
    setLiked(!liked)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 hover:border-zinc-700"
    >
      {/* Cabecera del post */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <Link href={`/profile/${post.user.username}`} className="h-10 w-10 overflow-hidden rounded-full">
            <Image
              src={post.user.avatar || "/placeholder.svg"}
              alt={post.user.name}
              width={40}
              height={40}
              className="h-full w-full object-cover"
            />
          </Link>
          <div>
            <Link href={`/profile/${post.user.username}`} className="font-medium hover:text-red-400 transition-colors">
              {post.user.name}
            </Link>
            <p className="text-xs text-zinc-500">{post.timestamp}</p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="border-zinc-800 bg-zinc-900 text-zinc-300">
            <DropdownMenuItem className="hover:bg-zinc-800 hover:text-white focus:bg-zinc-800 focus:text-white">
              Guardar
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-zinc-800 hover:text-white focus:bg-zinc-800 focus:text-white">
              Reportar
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-zinc-800 hover:text-white focus:bg-zinc-800 focus:text-white">
              No mostrar publicaciones de {post.user.name}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Contenido del post */}
      <div className="mb-4">
        <p className="text-zinc-200 mb-3">{post.content}</p>

        {/* Si es una reseña, mostrar información de la película */}
        {post.type === "review" && post.film && (
          <Link
            href={`/films/${post.film.title.toLowerCase().replace(/\s+/g, "-")}`}
            className="flex gap-3 p-3 rounded-md bg-zinc-800/50 hover:bg-zinc-800 transition-colors"
          >
            <div className="h-[120px] w-[80px] flex-shrink-0 overflow-hidden rounded">
              <Image
                src={post.film.poster || "/placeholder.svg"}
                alt={post.film.title}
                width={80}
                height={120}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-between">
              <div>
                <h3 className="font-medium">
                  {post.film.title} ({post.film.year})
                </h3>
                <p className="text-sm text-zinc-400">Dir. {post.film.director}</p>
              </div>
              <div className="flex items-center">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className={`h-4 w-4 ${i < Math.floor(post.film.rating) ? "text-red-500" : "text-zinc-600"}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-1 text-sm">{post.film.rating}/5</span>
              </div>
            </div>
          </Link>
        )}

        {/* Si es una lista, mostrar películas de la lista */}
        {post.type === "list" && post.list && (
          <Link
            href={`/movie-lists/${post.list.title.toLowerCase().replace(/\s+/g, "-")}`}
            className="block p-3 rounded-md bg-zinc-800/50 hover:bg-zinc-800 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">{post.list.title}</h3>
              <span className="text-xs text-zinc-400">{post.list.count} películas</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {post.list.films.map((film: any, index: number) => (
                <div key={index} className="h-[90px] w-[60px] flex-shrink-0 overflow-hidden rounded">
                  <Image
                    src={film.poster || "/placeholder.svg"}
                    alt={film.title}
                    width={60}
                    height={90}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
              <div className="h-[90px] w-[60px] flex-shrink-0 flex items-center justify-center bg-zinc-800 rounded text-zinc-400 text-sm">
                +{post.list.count - post.list.films.length}
              </div>
            </div>
          </Link>
        )}
      </div>

      {/* Acciones del post */}
      <div className="flex items-center justify-between border-t border-zinc-800 pt-3">
        <Button
          variant="ghost"
          size="sm"
          className={`text-sm ${liked ? "text-red-500" : "text-zinc-400"} hover:text-red-500 hover:bg-transparent`}
          onClick={handleLike}
        >
          <Heart className={`mr-1 h-4 w-4 ${liked ? "fill-red-500" : ""}`} />
          {likesCount}
        </Button>
        <Button variant="ghost" size="sm" className="text-sm text-zinc-400 hover:text-white hover:bg-transparent">
          <MessageSquare className="mr-1 h-4 w-4" />
          {post.comments}
        </Button>
        <Button variant="ghost" size="sm" className="text-sm text-zinc-400 hover:text-white hover:bg-transparent">
          <Share2 className="mr-1 h-4 w-4" />
          Compartir
        </Button>
      </div>
    </motion.div>
  )
}

