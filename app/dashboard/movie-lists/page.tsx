"use client"

import Link from "next/link"
import { Film, ListFilter, Plus, Search, SlidersHorizontal } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import MovieListCard from "@/components/movie-list-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function MovieListsPage() {
  const router = useRouter()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [formError, setFormError] = useState("")
  const [myLists, setMyLists] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [fetchError, setFetchError] = useState("")

  // Fetch movie lists on component mount
  useEffect(() => {
    const fetchMovieLists = async () => {
      try {
        setIsLoading(true)
        setFetchError("")
        
        const response = await fetch("/api/movie-lists")
        const data = await response.json()
        
        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch movie lists")
        }
        
        // Transform the data to match the expected format
        const formattedLists = data.map((list: any) => ({
          id: list.id,
          title: list.name,
          description: list.description || "",
          count: list.itemCount || 0,
          image: list.image ?? "/placeholder.svg?height=400&width=600", // Default image
        }))
        
        setMyLists(formattedLists)
      } catch (error) {
        console.error("Error fetching movie lists:", error)
        setFetchError((error as any).message || "Failed to load your movie lists")
        toast.error("Failed to load your movie lists")
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchMovieLists()
  }, [])

  const handleCreateList = async (event: any) => {
    event.preventDefault()
    setFormError("")
    setIsCreating(true)
    
    const formData = new FormData(event.target)
    const name = formData.get("name")
    const description = formData.get("description")
    
    if (!name || typeof name !== "string" || name.trim() === "") {
      setFormError("Please enter a valid list name")
      setIsCreating(false)
      return
    }
    
    try {
      const response = await fetch("/api/movie-lists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description: description || "",
        }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to create list")
      }
      
      // Add new list to state
      setMyLists([
        {
          id: data.id,
          title: data.name,
          description: data.description || "",
          count: 0,
          image: "/placeholder.svg?height=400&width=600"
        },
        ...myLists
      ])
      
      toast.success("List created successfully")
      setIsCreateDialogOpen(false)
      router.refresh()
    } catch (error) {
      setFormError((error as any).message || "An error occurred while creating the list")
      toast.error((error as any).message || "Failed to create list")
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-zinc-900 to-black py-16">
        <div className="container px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">
              Your Personalized <span className="text-red-500">Movie Lists</span>
            </h1>
            <p className="mb-8 text-lg text-zinc-400">
              Create, organize, and share your curated collections of cult and underground cinema
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button className="w-full bg-red-600 hover:bg-red-700 sm:w-auto">
                <Plus className="mr-2 h-4 w-4" /> Create New List
              </Button>
              <Button
                variant="outline"
                className="w-full border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white sm:w-auto"
              >
                Explore Lists
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

      {/* Main Content */}
      <section className="container px-4 py-12">
        <div className="mb-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <h2 className="text-2xl font-bold">Your Movie Lists</h2>
          <div className="flex w-full items-center gap-2 sm:w-auto">
            <div className="relative flex-1 sm:w-64 sm:flex-none">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <Input
                placeholder="Search your lists..."
                className="border-zinc-700 bg-zinc-900 pl-9 text-zinc-300 placeholder:text-zinc-500"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              className="border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Tabs defaultValue="my-lists" className="mb-8">
          <TabsList className="border-b border-zinc-800 bg-transparent">
            <TabsTrigger
              value="my-lists"
              className="data-[state=active]:border-red-500 data-[state=active]:bg-transparent data-[state=active]:text-white"
            >
              My Lists
            </TabsTrigger>
            <TabsTrigger
              value="followed"
              className="data-[state=active]:border-red-500 data-[state=active]:bg-transparent data-[state=active]:text-white"
            >
              Followed Lists
            </TabsTrigger>
            <TabsTrigger
              value="popular"
              className="data-[state=active]:border-red-500 data-[state=active]:bg-transparent data-[state=active]:text-white"
            >
              Popular Lists
            </TabsTrigger>
          </TabsList>
          <TabsContent value="my-lists" className="mt-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div 
                className="flex h-64 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-zinc-700 bg-zinc-900/50 p-6 text-center transition-colors hover:border-red-500 hover:text-red-500"
                onClick={() => setIsCreateDialogOpen(true)}
              >
                <div className="mb-4 rounded-full bg-zinc-800 p-3">
                  <Plus className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-medium">Create New List</h3>
                <p className="text-sm text-zinc-400">Start organizing your favorite cult films</p>
              </div>
              
              {isLoading ? (
                // Loading state
                Array(2).fill(0).map((_, i) => (
                  <div key={`skeleton-${i}`} className="h-64 rounded-lg bg-zinc-800/50 animate-pulse">
                    <div className="h-full w-full flex items-center justify-center">
                      <svg className="h-10 w-10 text-zinc-700 animate-spin" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  </div>
                ))
              ) : fetchError ? (
                // Error state
                <div className="col-span-full py-8 text-center">
                  <div className="inline-flex rounded-full bg-red-500/20 p-4 text-red-500 mb-4">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <p className="text-lg text-zinc-300">{fetchError}</p>
                  <Button 
                    variant="outline" 
                    className="mt-4 border-zinc-700"
                    onClick={() => router.refresh()}
                  >
                    Try Again
                  </Button>
                </div>
              ) : myLists.length === 0 ? (
                // Empty state
                <div className="col-span-full py-8 text-center">
                  <div className="inline-flex rounded-full bg-zinc-800 p-4 mb-4">
                    <Film className="h-6 w-6 text-zinc-400" />
                  </div>
                  <p className="text-lg text-zinc-300">You haven't created any lists yet</p>
                  <p className="text-zinc-500 mt-2 mb-4">Create your first movie list to start organizing your collection</p>
                  <Button 
                    className="bg-red-600 hover:bg-red-700"
                    onClick={() => setIsCreateDialogOpen(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Create New List
                  </Button>
                </div>
              ) : (
                // Display lists
                myLists.map((list) => (
                  <MovieListCard
                    key={list.id}
                    title={list.title}
                    description={list.description}
                    count={list.count}
                    image={list.image}
                    id={list.id}
                  />
                ))
              )}
            </div>
          </TabsContent>
          <TabsContent value="followed" className="mt-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <MovieListCard
                title="Giallo Classics"
                description="Italian horror-thrillers from the masters"
                count={9}
                image="/placeholder.svg?height=400&width=600"
                creator="FilmNoir42"
              />
              <MovieListCard
                title="Experimental Animation"
                description="Pushing the boundaries of the medium"
                count={11}
                image="/placeholder.svg?height=400&width=600"
                creator="AvantGardeArtist"
              />
              <MovieListCard
                title="Forgotten Sci-Fi"
                description="Overlooked gems of speculative cinema"
                count={14}
                image="/placeholder.svg?height=400&width=600"
                creator="SpaceOdyssey"
              />
            </div>
          </TabsContent>
          <TabsContent value="popular" className="mt-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <MovieListCard
                title="Cult Directors: Lynch"
                description="The surreal world of David Lynch"
                count={8}
                image="/placeholder.svg?height=400&width=600"
                creator="TwinPeaksFan"
                likes={243}
              />
              <MovieListCard
                title="Midnight Cult Classics"
                description="The essential late-night viewing experience"
                count={16}
                image="/placeholder.svg?height=400&width=600"
                creator="MidnightMarauder"
                likes={189}
              />
              <MovieListCard
                title="Transgressive Cinema"
                description="Films that pushed societal boundaries"
                count={12}
                image="/placeholder.svg?height=400&width=600"
                creator="CinemaRebel"
                likes={156}
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-12 rounded-xl bg-zinc-900 p-6 md:p-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">List Management Features</h2>
            <Button variant="link" className="text-red-500 hover:text-red-400">
              View Tutorial
            </Button>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-lg bg-zinc-800 p-5">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-red-500/20 text-red-500">
                <ListFilter className="h-5 w-5" />
              </div>
              <h3 className="mb-2 text-lg font-medium">Sort & Filter</h3>
              <p className="text-sm text-zinc-400">
                Organize your lists by title, release date, rating, genre, or director
              </p>
            </div>
            <div className="rounded-lg bg-zinc-800 p-5">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-red-500/20 text-red-500">
                <Film className="h-5 w-5" />
              </div>
              <h3 className="mb-2 text-lg font-medium">Quick Add</h3>
              <p className="text-sm text-zinc-400">Add films to your lists directly from any movie details page</p>
            </div>
            <div className="rounded-lg bg-zinc-800 p-5">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-red-500/20 text-red-500">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-medium">Activity History</h3>
              <p className="text-sm text-zinc-400">Track your list changes and interactions over time</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-t from-zinc-900 to-black py-16">
        <div className="container px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Discover New Films for Your Collection</h2>
          <p className="mx-auto mb-8 max-w-2xl text-zinc-400">
            Explore our curated recommendations, connect with fellow enthusiasts, and find your next cult classic to add
            to your personalized lists.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button className="w-full bg-red-600 hover:bg-red-700 sm:w-auto">Explore Recommendations</Button>
            <Button
              variant="outline"
              className="w-full border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white sm:w-auto"
            >
              Browse Popular Lists
            </Button>
          </div>
        </div>
      </section>

      {/* Create List Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Movie List</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateList}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-left">
                  List Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter a unique name for your list"
                  className="border-zinc-700 bg-zinc-900"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description" className="text-left">
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe what this list is about (optional)"
                  className="border-zinc-700 bg-zinc-900"
                  rows={3}
                />
              </div>
              {formError && (
                <div className="rounded-md bg-red-500/20 p-3 text-sm text-red-400">
                  {formError}
                </div>
              )}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" className="border-zinc-700 bg-zinc-900">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isCreating} className="bg-red-600 hover:bg-red-700">
                {isCreating ? "Creating..." : "Create List"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

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
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm text-zinc-400 hover:text-white">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-zinc-400 hover:text-white">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-zinc-400 hover:text-white">
                    Films
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-zinc-400 hover:text-white">
                    Community
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm text-zinc-400 hover:text-white">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-zinc-400 hover:text-white">
                    Film Database
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-zinc-400 hover:text-white">
                    Director Spotlights
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-zinc-400 hover:text-white">
                    Film Festivals
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm text-zinc-400 hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-zinc-400 hover:text-white">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-zinc-400 hover:text-white">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Connect</h3>
              <p className="mb-4 text-sm text-zinc-400">
                Subscribe to our newsletter for the latest updates on cult cinema.
              </p>
              <form className="flex">
                <Input
                  type="email"
                  placeholder="Your email"
                  className="rounded-r-none border-zinc-700 bg-zinc-900 text-zinc-300 placeholder:text-zinc-500"
                />
                <Button className="rounded-l-none bg-red-600 hover:bg-red-700">Subscribe</Button>
              </form>
            </div>
          </div>
          <div className="mt-8 border-t border-zinc-800 pt-8 text-center">
            <p className="text-sm text-zinc-500">© 2025 Cult & Underground Movies. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

