"use client"

import { useEffect, useState } from "react"
import { use } from "react" // Add this import
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Edit, Filter, Heart, MoreHorizontal, Plus, Search, Share2, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Define types for our data structures based on Prisma schema
interface Movie {
  id: string;
  title: string;
  releaseYear: number;
  director: string;
  duration?: number;
  posterImage?: string;
  synopsis?: string;
  genres?: { genre: { name: string } }[];
}

interface MovieListItem {
  listId: string;
  movieId: string;
  addedAt: string;
  notes?: string;
  movie: Movie;
}

interface User {
  id: string;
  username: string;
  profilePicture?: string;
}

interface MovieList {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  userId: string;
  items: MovieListItem[];
  user: User;
}

export default function MovieListDetailPage({ params }: Readonly<{ params: { id: string } }>) {
  // Unwrap params using React.use()
  const unwrappedParams: any = use(params as any);
  const [movieList, setMovieList] = useState<MovieList | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [movieToDelete, setMovieToDelete] = useState<MovieListItem | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    async function fetchMovieList() {
      try {
        setLoading(true);
        // Use unwrappedParams.id instead of params.id
        const response = await fetch(`/api/movie-lists/${unwrappedParams.id}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch movie list: ${response.status}`);
        }
        
        const data = await response.json();
        setMovieList(data);
      } catch (err) {
        console.error("Error fetching movie list:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchMovieList();
  }, [unwrappedParams.id]); // Update the dependency array too

  // Function to handle deletion of a movie from the list
  async function removeFromList(movieId: string) {
    try {
      setDeleteLoading(true);
      const response = await fetch(`/api/movie-lists/${unwrappedParams.id}/items/${movieId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to remove movie: ${response.status}`);
      }

      // Update the state to remove the movie
      if (movieList) {
        setMovieList({
          ...movieList,
          items: movieList.items.filter(item => item.movieId !== movieId)
        });
      }
      
      // Close the dialog
      setShowDeleteDialog(false);
      setMovieToDelete(null);
    } catch (err) {
      console.error("Error removing movie:", err);
    } finally {
      setDeleteLoading(false);
    }
  }

  // Function to open delete confirmation dialog
  function openDeleteDialog(item: MovieListItem) {
    setMovieToDelete(item);
    setShowDeleteDialog(true);
  }

  // Show loading state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-zinc-600 border-t-red-500 mx-auto"></div>
          <p className="text-zinc-400">Loading movie list...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="max-w-md text-center px-4">
          <h2 className="mb-4 text-2xl font-bold text-red-500">Error Loading Movie List</h2>
          <p className="mb-6 text-zinc-400">{error}</p>
          <Link href="/dashboard/movie-lists">
            <Button variant="outline" className="border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Lists
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Get title and movie count
  const listTitle = movieList?.name || "Untitled List";
  const movieCount = movieList?.items?.length || 0;

  return (
    <div className="min-h-screen bg-black text-white">
      
      {/* List Header */}
      <section className="border-b border-zinc-800 bg-zinc-900">
      <div className="container px-4 py-6">
          <div className="mb-6 flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild className="h-8 w-8 text-zinc-400 hover:text-white">
              <Link href="/dashboard/movie-lists">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <span className="text-sm text-zinc-400">Back to Lists</span>
          </div>

          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-3xl font-bold">{listTitle}</h1>
              <p className="mt-1 text-zinc-400">
                {movieCount} {movieCount === 1 ? 'film' : 'films'} • Created {movieList?.createdAt ? new Date(movieList.createdAt).toLocaleDateString() : 'recently'}
                {movieList?.user && ` by ${movieList.user.username}`}
              </p>
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
            {movieList?.description || "No description available for this list."}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container px-4 py-8">

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
              {movieList?.items.map((item) => (
                <div
                  key={item.movieId}
                  className="group relative overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 transition-all hover:border-red-500"
                >
                  <div className="aspect-[2/3] overflow-hidden">
                    <Image
                      src={item.movie.posterImage || `/placeholder.svg?height=600&width=400`}
                      alt={item.movie.title}
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
                        onClick={() => openDeleteDialog(item)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium">{item.movie.title}</h3>
                    <p className="text-sm text-zinc-400">{item.movie.releaseYear} • {item.movie.director}</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="list" className="mt-6">
            <div className="space-y-2">
              {movieList?.items.map((item) => (
                <div
                  key={item.movieId}
                  className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900 p-3 hover:border-red-500"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-8 overflow-hidden rounded bg-zinc-800">
                      <Image
                        src={item.movie.posterImage || `/placeholder.svg?height=600&width=400`}
                        alt={item.movie.title}
                        width={400}
                        height={600}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{item.movie.title}</h3>
                      <p className="text-sm text-zinc-400">{item.movie.releaseYear} • {item.movie.director}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-zinc-400 hover:text-white"
                      onClick={() => openDeleteDialog(item)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="details" className="mt-6">
            <div className="space-y-4">
              {movieList?.items.map((item) => (
                <div
                  key={item.movieId}
                  className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 hover:border-red-500"
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/4">
                      <div className="aspect-[2/3] h-full w-full">
                        <Image
                          src={item.movie.posterImage || `/placeholder.svg?height=600&width=400`}
                          alt={item.movie.title}
                          width={400}
                          height={600}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col p-4">
                      <div className="mb-2 flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-medium">{item.movie.title}</h3>
                          <p className="text-zinc-400">
                            {item.movie.releaseYear} • {item.movie.director}
                            {item.movie.duration && ` • ${Math.floor(item.movie.duration / 60)}h ${item.movie.duration % 60}m`}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white">
                            <Heart className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-zinc-400 hover:text-white"
                            onClick={() => openDeleteDialog(item)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="mb-4 text-zinc-300">
                        {item.movie.synopsis || "No description available for this movie."}
                      </p>
                      <div className="mt-auto">
                        <div className="mb-2 flex flex-wrap gap-2">
                          {item.movie.genres?.map((genreItem, index) => (
                            <span key={index} className="rounded-full bg-zinc-800 px-2.5 py-1 text-xs text-zinc-300">
                              {genreItem.genre.name}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-zinc-400">Added on {new Date(item.addedAt).toLocaleDateString()}</span>
                          {item.notes && (
                            <>
                              <span className="text-sm text-zinc-500">•</span>
                              <span className="text-sm text-zinc-400">Note: {item.notes}</span>
                            </>
                          )}
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="border-zinc-800 bg-zinc-900 text-white sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Remove Movie from List</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Are you sure you want to remove "{movieToDelete?.movie.title}" from "{listTitle}"?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteDialog(false)}
              className="border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white"
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => movieToDelete && removeFromList(movieToDelete.movieId)}
              disabled={deleteLoading}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deleteLoading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-zinc-600 border-t-white"></div>
                  Removing...
                </>
              ) : (
                'Remove'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

