import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Edit, Filter, Heart, MoreHorizontal, Plus, Search, Share2, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function MovieListDetailPage({ params }: Readonly<{ params: { slug: string } }>) {
  // This would normally come from a database
  const listTitle = params.slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-black/90 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center">
              <span className="text-xl font-bold text-red-500">CULT</span>
              <span className="text-xl font-bold text-white">+</span>
              <span className="text-xl font-bold text-white">UNDERGROUND</span>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative text-zinc-400 hover:text-white">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                3
              </span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full border border-zinc-800 bg-zinc-900 p-0 hover:bg-zinc-800"
                >
                  <div className="h-8 w-8 overflow-hidden rounded-full">
                    <Image
                      src="/placeholder.svg?height=100&width=100"
                      alt="Profile"
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
                      src="/placeholder.svg?height=100&width=100"
                      alt="Profile"
                      width={32}
                      height={32}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-sm font-medium text-white">CinemaFanatic</p>
                    <p className="text-xs text-zinc-400">@cinemafanatic</p>
                  </div>
                </div>
                <DropdownMenuItem className="hover:bg-zinc-800 hover:text-white focus:bg-zinc-800 focus:text-white">
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
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-zinc-800 hover:text-white focus:bg-zinc-800 focus:text-white">
                  <svg
                    className="mr-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  <span>My Lists</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-zinc-800 hover:text-white focus:bg-zinc-800 focus:text-white">
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
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-zinc-800 hover:text-white focus:bg-zinc-800 focus:text-white">
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
                  <span>Log Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* List Header */}
      <section className="border-b border-zinc-800 bg-zinc-900">
        <div className="container px-4 py-6">
          <div className="mb-6 flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild className="h-8 w-8 text-zinc-400 hover:text-white">
              <Link href="/movie-lists">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <span className="text-sm text-zinc-400">Back to Lists</span>
          </div>

          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-3xl font-bold">{listTitle}</h1>
              <p className="mt-1 text-zinc-400">12 films • Created 3 months ago</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white"
              >
                <Share2 className="mr-2 h-4 w-4" /> Share
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white"
              >
                <Heart className="mr-2 h-4 w-4" /> Add to Favorites
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="border-zinc-800 bg-zinc-900 text-zinc-300">
                  <DropdownMenuItem className="hover:bg-zinc-800 hover:text-white focus:bg-zinc-800 focus:text-white">
                    <Edit className="mr-2 h-4 w-4" /> Edit List
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-500 hover:bg-red-950 hover:text-red-400 focus:bg-red-950 focus:text-red-400">
                    <Trash2 className="mr-2 h-4 w-4" /> Delete List
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <p className="mt-4 max-w-3xl text-zinc-300">
            A curated collection of essential cyberpunk films exploring dystopian futures, advanced technology, and the
            human condition in neon-lit urban landscapes.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container px-4 py-8">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Film
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white"
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64 sm:flex-none">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <Input
                placeholder="Search in this list..."
                className="border-zinc-700 bg-zinc-900 pl-9 text-zinc-300 placeholder:text-zinc-500"
              />
            </div>
            <Select defaultValue="title">
              <SelectTrigger className="w-[180px] border-zinc-700 bg-zinc-900 text-zinc-300">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="border-zinc-700 bg-zinc-900 text-zinc-300">
                <SelectItem value="title">Title (A-Z)</SelectItem>
                <SelectItem value="title-desc">Title (Z-A)</SelectItem>
                <SelectItem value="year">Release Year (Newest)</SelectItem>
                <SelectItem value="year-asc">Release Year (Oldest)</SelectItem>
                <SelectItem value="rating">Rating (Highest)</SelectItem>
                <SelectItem value="rating-asc">Rating (Lowest)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="grid" className="mb-6">
          <TabsList className="border-b border-zinc-800 bg-transparent">
            <TabsTrigger
              value="grid"
              className="data-[state=active]:border-red-500 data-[state=active]:bg-transparent data-[state=active]:text-white"
            >
              Grid View
            </TabsTrigger>
            <TabsTrigger
              value="list"
              className="data-[state=active]:border-red-500 data-[state=active]:bg-transparent data-[state=active]:text-white"
            >
              List View
            </TabsTrigger>
            <TabsTrigger
              value="details"
              className="data-[state=active]:border-red-500 data-[state=active]:bg-transparent data-[state=active]:text-white"
            >
              Details View
            </TabsTrigger>
          </TabsList>

          <TabsContent value="grid" className="mt-6">
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="group relative overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 transition-all hover:border-red-500"
                >
                  <div className="aspect-[2/3] overflow-hidden">
                    <Image
                      src={`/placeholder.svg?height=600&width=400`}
                      alt={`Movie ${i + 1}`}
                      width={400}
                      height={600}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 transition-opacity group-hover:opacity-100">
                    <div className="flex justify-between">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700 hover:text-white"
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700 hover:text-white"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium">Cyberpunk Film {i + 1}</h3>
                    <p className="text-sm text-zinc-400">{1980 + i} • Director Name</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="list" className="mt-6">
            <div className="space-y-2">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900 p-3 hover:border-red-500"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-8 overflow-hidden rounded bg-zinc-800">
                      <Image
                        src={`/placeholder.svg?height=600&width=400`}
                        alt={`Movie ${i + 1}`}
                        width={400}
                        height={600}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">Cyberpunk Film {i + 1}</h3>
                      <p className="text-sm text-zinc-400">{1980 + i} • Director Name</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="details" className="mt-6">
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 hover:border-red-500"
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/4">
                      <div className="aspect-[2/3] h-full w-full">
                        <Image
                          src={`/placeholder.svg?height=600&width=400`}
                          alt={`Movie ${i + 1}`}
                          width={400}
                          height={600}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col p-4">
                      <div className="mb-2 flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-medium">Cyberpunk Film {i + 1}</h3>
                          <p className="text-zinc-400">{1980 + i} • Director Name • 120 min</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white">
                            <Heart className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="mb-4 text-zinc-300">
                        A dystopian future where corporations control society and technology has advanced beyond
                        humanity's ability to control it. The film explores themes of identity, consciousness, and
                        rebellion in a neon-lit urban landscape.
                      </p>
                      <div className="mt-auto">
                        <div className="mb-2 flex flex-wrap gap-2">
                          <span className="rounded-full bg-zinc-800 px-2.5 py-1 text-xs text-zinc-300">Cyberpunk</span>
                          <span className="rounded-full bg-zinc-800 px-2.5 py-1 text-xs text-zinc-300">Sci-Fi</span>
                          <span className="rounded-full bg-zinc-800 px-2.5 py-1 text-xs text-zinc-300">Dystopian</span>
                          <span className="rounded-full bg-zinc-800 px-2.5 py-1 text-xs text-zinc-300">Neo-Noir</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            <svg className="h-4 w-4 fill-red-500" viewBox="0 0 24 24">
                              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                            </svg>
                            <span className="ml-1 text-sm">8.{i + 1}/10</span>
                          </div>
                          <span className="text-sm text-zinc-500">•</span>
                          <span className="text-sm text-zinc-400">Added on May 15, 2025</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Activity History Section */}
      <section className="border-t border-zinc-800 bg-zinc-900/50">
        <div className="container px-4 py-8">
          <h2 className="mb-6 text-2xl font-bold">Activity History</h2>
          <div className="space-y-4">
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-zinc-800"></div>
                  <span className="font-medium">You</span>
                </div>
                <span className="text-sm text-zinc-500">2 days ago</span>
              </div>
              <p className="text-zinc-300">
                Added <span className="text-red-500">Blade Runner 2049</span> to this list
              </p>
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-zinc-800"></div>
                  <span className="font-medium">You</span>
                </div>
                <span className="text-sm text-zinc-500">1 week ago</span>
              </div>
              <p className="text-zinc-300">
                Removed <span className="text-red-500">The Matrix Resurrections</span> from this list
              </p>
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-zinc-800"></div>
                  <span className="font-medium">You</span>
                </div>
                <span className="text-sm text-zinc-500">2 weeks ago</span>
              </div>
              <p className="text-zinc-300">Created this list with 10 films</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 bg-black py-8">
        <div className="container px-4">
          <div className="mb-8 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex items-center">
                <span className="text-xl font-bold text-red-500">CULT</span>
                <span className="text-xl font-bold text-white">+</span>
                <span className="text-xl font-bold text-white">UNDERGROUND</span>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="#" className="text-zinc-400 hover:text-white">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17h-2v-2h2v2zm2.07-7.75l-.9.92C11.45 12.9 11 13.5 11 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" />
                </svg>
              </Link>
              <Link href="#" className="text-zinc-400 hover:text-white">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                </svg>
              </Link>
              <Link href="#" className="text-zinc-400 hover:text-white">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02z" />
                </svg>
              </Link>
            </div>
          </div>
          <div className="mt-8 text-center">
            <p className="text-sm text-zinc-500">© 2025 Cult & Underground Movies. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

