import Image from "next/image"
import Link from "next/link"
import { ChevronRight, MessageSquare, Star, ThumbsUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function MovieReviewsPage() {
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
                  <span>My Reviews</span>
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

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-zinc-900 to-black py-16">
        <div className="container px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">
              Share Your <span className="text-red-500">Critical Voice</span>
            </h1>
            <p className="mb-8 text-lg text-zinc-400">
              Rate, review, and discuss cult and underground films with fellow enthusiasts
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button className="w-full bg-red-600 hover:bg-red-700 sm:w-auto">Write a Review</Button>
              <Button
                variant="outline"
                className="w-full border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white sm:w-auto"
              >
                Explore Reviews
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-2 pb-4">
          <div className="h-2 w-2 rounded-full bg-red-500"></div>
          <div className="h-2 w-2 rounded-full bg-zinc-700"></div>
          <div className="h-2 w-2 rounded-full bg-zinc-700"></div>
          <div className="h-2 w-2 rounded-full bg-zinc-700"></div>
          <div className="h-2 w-2 rounded-full bg-zinc-700"></div>
        </div>
      </section>

      {/* Featured Reviews Section */}
      <section className="container px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Featured Reviews</h2>
          <Button variant="link" className="text-red-500 hover:text-red-400">
            View All <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Featured Review Card 1 */}
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 overflow-hidden">
            <div className="relative h-48">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Eraserhead"
                width={600}
                height={400}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-4">
                <h3 className="text-xl font-bold">Eraserhead (1977)</h3>
                <div className="mt-1 flex items-center">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < 5 ? "fill-red-500 text-red-500" : "fill-zinc-700 text-zinc-700"}`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-zinc-400">by CinemaObsessed</span>
                </div>
              </div>
            </div>
            <div className="p-4">
              <p className="text-zinc-300">
                "Lynch's debut remains a haunting nightmare of industrial decay and parental anxiety. The sound design
                alone creates an atmosphere unlike anything else in cinema. A true masterpiece of surrealist horror.
                🖤👶🔊"
              </p>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="sm" className="h-8 gap-1 text-zinc-400 hover:text-white">
                    <ThumbsUp className="h-4 w-4" />
                    <span>128</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 gap-1 text-zinc-400 hover:text-white">
                    <MessageSquare className="h-4 w-4" />
                    <span>24</span>
                  </Button>
                </div>
                <span className="text-xs text-zinc-500">2 days ago</span>
              </div>
            </div>
          </div>

          {/* Featured Review Card 2 */}
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 overflow-hidden">
            <div className="relative h-48">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Possession"
                width={600}
                height={400}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-4">
                <h3 className="text-xl font-bold">Possession (1981)</h3>
                <div className="mt-1 flex items-center">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < 4 ? "fill-red-500 text-red-500" : "fill-zinc-700 text-zinc-700"}`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-zinc-400">by FilmNoir42</span>
                </div>
              </div>
            </div>
            <div className="p-4">
              <p className="text-zinc-300">
                "Żuławski's tale of marital collapse as body horror is both viscerally disturbing and emotionally
                devastating. Adjani's subway scene is one of the most intense performances ever committed to film.
                😱💔🐙"
              </p>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="sm" className="h-8 gap-1 text-zinc-400 hover:text-white">
                    <ThumbsUp className="h-4 w-4" />
                    <span>93</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 gap-1 text-zinc-400 hover:text-white">
                    <MessageSquare className="h-4 w-4" />
                    <span>17</span>
                  </Button>
                </div>
                <span className="text-xs text-zinc-500">1 week ago</span>
              </div>
            </div>
          </div>

          {/* Featured Review Card 3 */}
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 overflow-hidden">
            <div className="relative h-48">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Suspiria"
                width={600}
                height={400}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-4">
                <h3 className="text-xl font-bold">Suspiria (1977)</h3>
                <div className="mt-1 flex items-center">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < 5 ? "fill-red-500 text-red-500" : "fill-zinc-700 text-zinc-700"}`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-zinc-400">by GialloGirl</span>
                </div>
              </div>
            </div>
            <div className="p-4">
              <p className="text-zinc-300">
                "Argento's masterpiece of style over substance creates a fever dream of color and sound. The Goblin
                soundtrack alone makes this essential viewing. A perfect gateway into Italian horror. 🔪🎭🌈"
              </p>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="sm" className="h-8 gap-1 text-zinc-400 hover:text-white">
                    <ThumbsUp className="h-4 w-4" />
                    <span>156</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 gap-1 text-zinc-400 hover:text-white">
                    <MessageSquare className="h-4 w-4" />
                    <span>32</span>
                  </Button>
                </div>
                <span className="text-xs text-zinc-500">3 days ago</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Your Reviews Section */}
      <section className="bg-zinc-900/50 py-12">
        <div className="container px-4">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Your Recent Reviews</h2>
            <Button variant="link" className="text-red-500 hover:text-red-400">
              View All <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>

          <Tabs defaultValue="published" className="mb-8">
            <TabsList className="border-b border-zinc-800 bg-transparent">
              <TabsTrigger
                value="published"
                className="data-[state=active]:border-red-500 data-[state=active]:bg-transparent data-[state=active]:text-white"
              >
                Published
              </TabsTrigger>
              <TabsTrigger
                value="drafts"
                className="data-[state=active]:border-red-500 data-[state=active]:bg-transparent data-[state=active]:text-white"
              >
                Drafts
              </TabsTrigger>
            </TabsList>

            <TabsContent value="published" className="mt-6">
              <div className="space-y-4">
                {/* Your Review 1 */}
                <div className="flex flex-col rounded-lg border border-zinc-800 bg-zinc-900 p-4 sm:flex-row sm:items-start">
                  <div className="mb-4 h-24 w-16 flex-shrink-0 overflow-hidden rounded sm:mb-0 sm:mr-4">
                    <Image
                      src="/placeholder.svg?height=600&width=400"
                      alt="El Topo"
                      width={400}
                      height={600}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="text-lg font-medium">El Topo (1970)</h3>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < 4 ? "fill-red-500 text-red-500" : "fill-zinc-700 text-zinc-700"}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-zinc-300">
                      "Jodorowsky's acid western is a surrealist journey through mysticism and violence. Equal parts
                      beautiful and disturbing, it remains a cornerstone of midnight cinema. 🏜️🔫🧠"
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-zinc-500">Published 2 weeks ago</span>
                        <span className="text-xs text-zinc-500">•</span>
                        <span className="text-xs text-zinc-500">42 likes</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="h-8 text-zinc-400 hover:text-white">
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 text-red-500 hover:text-red-400">
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Your Review 2 */}
                <div className="flex flex-col rounded-lg border border-zinc-800 bg-zinc-900 p-4 sm:flex-row sm:items-start">
                  <div className="mb-4 h-24 w-16 flex-shrink-0 overflow-hidden rounded sm:mb-0 sm:mr-4">
                    <Image
                      src="/placeholder.svg?height=600&width=400"
                      alt="Videodrome"
                      width={400}
                      height={600}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="text-lg font-medium">Videodrome (1983)</h3>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < 5 ? "fill-red-500 text-red-500" : "fill-zinc-700 text-zinc-700"}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-zinc-300">
                      "Cronenberg's prophetic vision of media consumption as physical transformation feels more relevant
                      than ever. The practical effects still shock and disturb decades later. Long live the new flesh!
                      📺🩸👁️"
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-zinc-500">Published 1 month ago</span>
                        <span className="text-xs text-zinc-500">•</span>
                        <span className="text-xs text-zinc-500">78 likes</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="h-8 text-zinc-400 hover:text-white">
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 text-red-500 hover:text-red-400">
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="drafts" className="mt-6">
              <div className="rounded-lg border border-dashed border-zinc-700 bg-zinc-900/50 p-8 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800">
                  <svg
                    className="h-6 w-6 text-zinc-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-medium">No Draft Reviews</h3>
                <p className="mb-6 text-zinc-400">You don't have any reviews saved as drafts.</p>
                <Button className="bg-red-600 hover:bg-red-700">Start a New Review</Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Review Features Section */}
      <section className="container px-4 py-12">
        <h2 className="mb-8 text-center text-3xl font-bold">Express Your Critical Voice</h2>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Feature 1 */}
          <div className="rounded-lg bg-zinc-900 p-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20 text-red-500">
              <svg
                className="h-8 w-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-medium">Rate Films</h3>
            <p className="text-zinc-400">
              Share your opinion with our 5-star rating system. Help others discover hidden gems or avoid
              disappointments.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="rounded-lg bg-zinc-900 p-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20 text-red-500">
              <svg
                className="h-8 w-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-medium">Write Reviews</h3>
            <p className="text-zinc-400">
              Express your thoughts in depth with our review system. Add emojis to convey emotion and highlight key
              points.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="rounded-lg bg-zinc-900 p-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20 text-red-500">
              <svg
                className="h-8 w-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2.586l4.707 4.707C10.923 20.497 11.477 21 12 21h8a2 2 0 002-2v-8a2 2 0 00-2-2h-2.586l-4.707-4.707C12.077 3.503 11.523 3 11 3H3a2 2 0 00-2 2v6a2 2 0 002 2h2.586l4.707 4.707C10.923 17.497 11.477 18 12 18h8a2 2 0 002-2v-8a2 2 0 00-2-2h-2.586l-4.707-4.707C12.077 1.503 11.523 1 11 1H3a2 2 0 00-2 2v6a2 2 0 002 2h2.586l4.707 4.707C10.923 15.497 11.477 16 12 16h8a2 2 0 002-2v-8a2 2 0 00-2-2h-2.586l-4.707-4.707C12.077 -0.497 11.523 -1 11 -1H3a2 2 0 00-2 2v6a2 2 0 002 2h2.586l4.707 4.707C10.923 13.497 11.477 14 12 14h8a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l4-4h2a2 2 0 002-2v-6a2 2 0 00-2-2H9a1.994 1.994 0 00-1.414.586L3.586 8H3a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v6z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-medium">Engage in Discussions</h3>
            <p className="text-zinc-400">
              Comment on other reviews, react with likes, and participate in thoughtful discussions about cult cinema.
            </p>
          </div>
        </div>

        <div className="mt-12 rounded-xl bg-zinc-800 p-6 md:p-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="max-w-lg">
              <h3 className="mb-2 text-2xl font-bold">Ready to Share Your Perspective?</h3>
              <p className="text-zinc-300">
                Your unique voice matters in our community of cult cinema enthusiasts. Start rating and reviewing films
                today to contribute to our collective appreciation of underground cinema.
              </p>
            </div>
            <Button className="whitespace-nowrap bg-red-600 hover:bg-red-700">Start Reviewing Now</Button>
          </div>
        </div>
      </section>

      {/* Community Reviews Section */}
      <section className="bg-zinc-900/50 py-12">
        <div className="container px-4">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Community Discussions</h2>
            <Button variant="link" className="text-red-500 hover:text-red-400">
              View All <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-6">
            {/* Discussion Thread 1 */}
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
              <div className="mb-4 flex items-start gap-3">
                <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full">
                  <Image
                    src="/placeholder.svg?height=100&width=100"
                    alt="User Avatar"
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="mb-1 flex items-center justify-between">
                    <div>
                      <span className="font-medium">NightmareNoir</span>
                      <span className="ml-2 text-sm text-zinc-500">on</span>
                      <span className="ml-2 font-medium text-red-500">Mulholland Drive</span>
                    </div>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${i < 5 ? "fill-red-500 text-red-500" : "fill-zinc-700 text-zinc-700"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-zinc-300">
                    "Lynch's masterpiece continues to haunt me years later. The way it shifts from Hollywood dream to
                    nightmare is unparalleled. Naomi Watts delivers one of the greatest performances in cinema history.
                    🌃🔑🎬"
                  </p>
                  <div className="mt-3 flex items-center gap-3">
                    <Button variant="ghost" size="sm" className="h-7 gap-1 text-zinc-400 hover:text-white">
                      <ThumbsUp className="h-3.5 w-3.5" />
                      <span>86</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 gap-1 text-zinc-400 hover:text-white">
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>Reply</span>
                    </Button>
                    <span className="text-xs text-zinc-500">3 days ago</span>
                  </div>
                </div>
              </div>

              {/* Comment 1 */}
              <div className="ml-12 mt-4 border-l-2 border-zinc-800 pl-4">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-full">
                    <Image
                      src="/placeholder.svg?height=100&width=100"
                      alt="User Avatar"
                      width={32}
                      height={32}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="mb-1">
                      <span className="font-medium">CinematicDreamer</span>
                    </div>
                    <p className="text-zinc-300">
                      "Completely agree! The Silencio club scene alone is worth the price of admission. What's your
                      interpretation of the blue key? 🔑"
                    </p>
                    <div className="mt-2 flex items-center gap-3">
                      <Button variant="ghost" size="sm" className="h-7 gap-1 text-zinc-400 hover:text-white">
                        <ThumbsUp className="h-3.5 w-3.5" />
                        <span>12</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 gap-1 text-zinc-400 hover:text-white">
                        <MessageSquare className="h-3.5 w-3.5" />
                        <span>Reply</span>
                      </Button>
                      <span className="text-xs text-zinc-500">2 days ago</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comment 2 */}
              <div className="ml-12 mt-4 border-l-2 border-zinc-800 pl-4">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-full">
                    <Image
                      src="/placeholder.svg?height=100&width=100"
                      alt="User Avatar"
                      width={32}
                      height={32}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="mb-1">
                      <span className="font-medium">NightmareNoir</span>
                    </div>
                    <p className="text-zinc-300">
                      "I see the key as representing the point of no return between fantasy and reality. Once Diane
                      opens that box, she can't go back to her comforting delusion. 🧠💭"
                    </p>
                    <div className="mt-2 flex items-center gap-3">
                      <Button variant="ghost" size="sm" className="h-7 gap-1 text-zinc-400 hover:text-white">
                        <ThumbsUp className="h-3.5 w-3.5" />
                        <span>8</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 gap-1 text-zinc-400 hover:text-white">
                        <MessageSquare className="h-3.5 w-3.5" />
                        <span>Reply</span>
                      </Button>
                      <span className="text-xs text-zinc-500">1 day ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Discussion Thread 2 */}
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
              <div className="mb-4 flex items-start gap-3">
                <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full">
                  <Image
                    src="/placeholder.svg?height=100&width=100"
                    alt="User Avatar"
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="mb-1 flex items-center justify-between">
                    <div>
                      <span className="font-medium">SurrealCinephile</span>
                      <span className="ml-2 text-sm text-zinc-500">on</span>
                      <span className="ml-2 font-medium text-red-500">Holy Mountain</span>
                    </div>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${i < 4 ? "fill-red-500 text-red-500" : "fill-zinc-700 text-zinc-700"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-zinc-300">
                    "Jodorowsky's spiritual odyssey is a visual feast unlike anything else in cinema. Each frame could
                    be hung in a gallery. Not for everyone, but essential viewing for those seeking transcendence
                    through film. 🏔️✨🐸"
                  </p>
                  <div className="mt-3 flex items-center gap-3">
                    <Button variant="ghost" size="sm" className="h-7 gap-1 text-zinc-400 hover:text-white">
                      <ThumbsUp className="h-3.5 w-3.5" />
                      <span>54</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 gap-1 text-zinc-400 hover:text-white">
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>Reply</span>
                    </Button>
                    <span className="text-xs text-zinc-500">1 week ago</span>
                  </div>
                </div>
              </div>
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
              <Link href="#" className="text-zinc-400 hover:text-white">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2zm-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25zM12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
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

