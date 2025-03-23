"use client";

import { use, useState, useEffect } from "react";

import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Heart, MessageSquare, Share2, Star, ThumbsDown, ThumbsUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function MovieReviewDetailPage({ params }: { params: Promise<{ movieId: string }> }) {
  const { movieId } = use(params); // Desenvuelve la Promesa de `params`

  const [movieTitle, setMovieTitle] = useState("Loading...");
  const [releaseYear, setReleaseYear] = useState(2000);
  const [director, setDirector] = useState("Not specified");
  const [duration, setDuration] = useState(999);
  const [synopsis, setSynopsis] = useState("");

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch the movie title based on the movieId
  useEffect(() => {
    const fetchMovieTitle = async () => {
      try {
        const response = await fetch(`/api/movies/${movieId}`);
        const data = await response.json();
        if (data.success) {
          console.log(`Movie information loaded: ${JSON.stringify(data, null, 2)}`);
          setMovieTitle(data.movie.title); // Set the movie title from the API response
          setReleaseYear(data.movie.releaseYear);
          setDirector(data.movie.director)
          setDuration(data.movie.duration)
          setSynopsis(data.movie.synopsis)
        } else {
          setMovieTitle("Unknown Movie");
        }
      } catch (error) {
        console.error("Error fetching movie title:", error);
        setMovieTitle("Error loading movie");
      }
    };

    fetchMovieTitle();
  }, [movieId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          movieId, // UUID de la película
          userId: "user-uuid-placeholder", // Verifica si `session` y `session.user` existen
          rating, // Calificación del usuario
          content: review, // Contenido de la reseña
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("¡Reseña enviada exitosamente!");
        setRating(0); // Reinicia la calificación
        setReview(""); // Limpia el contenido de la reseña
      } else {
        alert("Error al enviar la reseña: " + data.error);
      }
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al enviar la reseña.");
    } finally {
      setLoading(false);
    }
  };

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

      {/* Movie Header */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black"></div>
        <div className="relative h-[300px] md:h-[400px]">
          <Image
            src="/placeholder.svg?height=800&width=1600"
            alt={movieTitle}
            width={1600}
            height={800}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="container relative -mt-32 px-4 pb-8 pt-0">
          <div className="flex flex-col items-start gap-6 md:flex-row">
            <div className="h-48 w-32 flex-shrink-0 overflow-hidden rounded-lg border border-zinc-800 shadow-lg md:h-64 md:w-44">
              <Image
                src="/placeholder.svg?height=600&width=400"
                alt={movieTitle}
                width={400}
                height={600}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1 pt-32 md:pt-40">
              <div className="mb-2 flex items-center gap-2">
                <Button variant="ghost" size="icon" asChild className="h-8 w-8 text-zinc-400 hover:text-white">
                  <Link href="/movie-reviews">
                    <ArrowLeft className="h-4 w-4" />
                  </Link>
                </Button>
                <span className="text-sm text-zinc-400">Back to Reviews</span>
              </div>
              <h1 className="mb-2 text-3xl font-bold md:text-4xl">{movieTitle}</h1>
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <span className="text-zinc-400">{releaseYear}</span>
                <span className="text-zinc-500">•</span>
                <span className="text-zinc-400">{director}</span>
                <span className="text-zinc-500">•</span>
                <span className="text-zinc-400">{duration} min</span>
              </div>
              <div className="mb-6 flex items-center gap-4">
                <div className="flex items-center">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${i < 4 ? "fill-red-500 text-red-500" : "fill-zinc-700 text-zinc-700"}`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-lg font-medium">4.2</span>
                  <span className="ml-1 text-zinc-400">(128 reviews)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white"
                  >
                    <Heart className="mr-2 h-4 w-4" /> Add to Watchlist
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white"
                  >
                    <Share2 className="mr-2 h-4 w-4" /> Share
                  </Button>
                </div>
              </div>
              <p className="max-w-3xl text-zinc-300">
                {synopsis}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Write Review Section */}
      <section className="border-t border-zinc-800 bg-zinc-900/50">
        <div className="container px-4 py-8">
          <h2 className="mb-6 text-2xl font-bold">Write Your Review</h2>
          <form onSubmit={handleSubmit} className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 overflow-hidden rounded-full">
                  <Image
                    src="/placeholder.svg?height=100&width=100"
                    alt="Your Avatar"
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="font-medium">Your Rating</span>
              </div>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Button
                    key={i}
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={`h-10 w-10 ${i < rating ? "text-red-500" : "text-zinc-500"}`}
                    onClick={() => setRating(i + 1)}
                  >
                    <Star className={`h-6 w-6 ${i < rating ? "fill-red-500" : ""}`} />
                  </Button>
                ))}
              </div>
            </div>
            <Textarea
              placeholder="Share your thoughts on this film... (1000 character limit)"
              className="mb-4 min-h-[120px] resize-none border-zinc-700 bg-zinc-800 text-zinc-300 placeholder:text-zinc-500"
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />
            <div className="flex items-center justify-between">
              <div className="text-sm text-zinc-500">
                <span className="font-medium text-zinc-400">Pro tip:</span> You can use emojis to express your feelings!
                🎬 🔥 👍
              </div>
              <Button type="submit" className="bg-red-600 hover:bg-red-700" disabled={loading}>
                {loading ? "Submitting..." : "Post Review"}
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="container px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Reviews & Discussions</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-zinc-400">Sort by:</span>
            <select className="rounded-md border border-zinc-700 bg-zinc-800 px-2 py-1 text-sm text-zinc-300">
              <option>Most Recent</option>
              <option>Highest Rated</option>
              <option>Most Discussed</option>
            </select>
          </div>
        </div>

        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="border-b border-zinc-800 bg-transparent">
            <TabsTrigger
              value="all"
              className="data-[state=active]:border-red-500 data-[state=active]:bg-transparent data-[state=active]:text-white"
            >
              All Reviews (24)
            </TabsTrigger>
            <TabsTrigger
              value="friends"
              className="data-[state=active]:border-red-500 data-[state=active]:bg-transparent data-[state=active]:text-white"
            >
              Friends (3)
            </TabsTrigger>
            <TabsTrigger
              value="critics"
              className="data-[state=active]:border-red-500 data-[state=active]:bg-transparent data-[state=active]:text-white"
            >
              Critics (8)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6 space-y-6">
            {/* Review 1 */}
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
                      <span className="font-medium">FilmObsessive</span>
                      <span className="ml-2 text-sm text-zinc-500">• Critic</span>
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
                    "A masterpiece of surrealist cinema that continues to disturb and fascinate decades later. Lynch's
                    debut feature establishes his unique visual language and thematic obsessions. The sound design alone
                    is worth the price of admission, creating an industrial hellscape that gets under your skin and
                    stays there. The black and white photography is stunning, making the grimy, decaying setting feel
                    both timeless and nightmarish. 🖤🎬👶"
                  </p>
                  <div className="mt-3 flex items-center gap-3">
                    <Button variant="ghost" size="sm" className="h-7 gap-1 text-zinc-400 hover:text-white">
                      <ThumbsUp className="h-3.5 w-3.5" />
                      <span>42</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 gap-1 text-zinc-400 hover:text-white">
                      <ThumbsDown className="h-3.5 w-3.5" />
                      <span>3</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 gap-1 text-zinc-400 hover:text-white">
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>Reply</span>
                    </Button>
                    <span className="text-xs text-zinc-500">2 days ago</span>
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
                      <span className="font-medium">SurrealCinephile</span>
                    </div>
                    <p className="text-zinc-300">
                      "Completely agree about the sound design. The constant industrial hum creates such a sense of
                      dread. What did you think about the baby creature? Still gives me nightmares! 😱"
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

            {/* Review 2 */}
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
                      <span className="font-medium">CasualViewer</span>
                    </div>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${i < 2 ? "fill-red-500 text-red-500" : "fill-zinc-700 text-zinc-700"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-zinc-300">
                    "I really tried to get into this, but it was just too weird and slow for me. I understand it's
                    considered a classic, but I couldn't connect with it at all. The baby thing was just disturbing
                    without any purpose. Maybe I'm missing something? 🤔"
                  </p>
                  <div className="mt-3 flex items-center gap-3">
                    <Button variant="ghost" size="sm" className="h-7 gap-1 text-zinc-400 hover:text-white">
                      <ThumbsUp className="h-3.5 w-3.5" />
                      <span>12</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 gap-1 text-zinc-400 hover:text-white">
                      <ThumbsDown className="h-3.5 w-3.5" />
                      <span>15</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 gap-1 text-zinc-400 hover:text-white">
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>Reply</span>
                    </Button>
                    <span className="text-xs text-zinc-500">1 week ago</span>
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
                      <span className="font-medium">ArtFilmExpert</span>
                    </div>
                    <p className="text-zinc-300">
                      "It's definitely not for everyone! Lynch's work often requires multiple viewings and some
                      background on surrealism. The baby represents anxieties about parenthood and responsibility. Maybe
                      try it again with that lens? 🧠🎭"
                    </p>
                    <div className="mt-2 flex items-center gap-3">
                      <Button variant="ghost" size="sm" className="h-7 gap-1 text-zinc-400 hover:text-white">
                        <ThumbsUp className="h-3.5 w-3.5" />
                        <span>24</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 gap-1 text-zinc-400 hover:text-white">
                        <MessageSquare className="h-3.5 w-3.5" />
                        <span>Reply</span>
                      </Button>
                      <span className="text-xs text-zinc-500">5 days ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* More Reviews Button */}
            <Button
              variant="outline"
              className="w-full border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white"
            >
              Load More Reviews
            </Button>
          </TabsContent>

          <TabsContent value="friends" className="mt-6">
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
              <div className="mb-4 flex items-start gap-3">
                <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full">
                  <Image
                    src="/placeholder.svg?height=100&width=100"
                    alt="Friend Avatar"
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="mb-1 flex items-center justify-between">
                    <div>
                      <span className="font-medium">CinematicBuddy</span>
                      <span className="ml-2 text-sm text-zinc-500">• Friend</span>
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
                    "Remember when we watched this at the midnight screening last year? Still can't get that baby's cry
                    out of my head! Lynch really knows how to create unforgettable imagery. The radiator lady still
                    confuses me though. 🎭🖤"
                  </p>
                  <div className="mt-3 flex items-center gap-3">
                    <Button variant="ghost" size="sm" className="h-7 gap-1 text-zinc-400 hover:text-white">
                      <ThumbsUp className="h-3.5 w-3.5" />
                      <span>3</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 gap-1 text-zinc-400 hover:text-white">
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>Reply</span>
                    </Button>
                    <span className="text-xs text-zinc-500">3 months ago</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="critics" className="mt-6">
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
              <div className="mb-4 flex items-start gap-3">
                <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full">
                  <Image
                    src="/placeholder.svg?height=100&width=100"
                    alt="Critic Avatar"
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="mb-1 flex items-center justify-between">
                    <div>
                      <span className="font-medium">FilmScholar</span>
                      <span className="ml-2 text-sm text-zinc-500">• Verified Critic</span>
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
                    "Lynch's debut remains one of the most striking first features in cinema history. Drawing on
                    influences from Buñuel to Kafka, he creates a uniquely American nightmare landscape. The film's
                    exploration of masculine anxiety around fatherhood was revolutionary for its time and continues to
                    resonate. The practical effects, created on a shoestring budget, are more effective than most modern
                    CGI spectacles. Essential viewing for anyone interested in the power of cinema as an art form.
                    🎞️🧠🖤"
                  </p>
                  <div className="mt-3 flex items-center gap-3">
                    <Button variant="ghost" size="sm" className="h-7 gap-1 text-zinc-400 hover:text-white">
                      <ThumbsUp className="h-3.5 w-3.5" />
                      <span>87</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 gap-1 text-zinc-400 hover:text-white">
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>Reply</span>
                    </Button>
                    <span className="text-xs text-zinc-500">2 weeks ago</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
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

