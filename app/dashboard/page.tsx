import { Suspense } from "react"
import Link from "next/link"
import { Search, User, Bell, Menu } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Image from "next/image"

// Componentes para la página principal
import ActivityFeed from "@/components/dashboard/activity-feed"
import MovieRecommendations from "@/components/dashboard/movie-recommendations"
import QuickAccess from "@/components/dashboard/quick-access"
import MobileNavigation from "@/components/dashboard/mobile-navigation"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-zinc-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center">
              <div className="mr-2 h-6 w-6 border border-red-600"></div>
              <span className="text-xl font-bold">CULT & UNDERGROUND</span>
            </Link>

            {/* <div className="hidden md:flex items-center space-x-6">
              <Link href="/films" className="hover:text-red-600 transition-colors">
                Films
              </Link>
              <Link href="/lists" className="hover:text-red-600 transition-colors">
                Lists
              </Link>
            </div> */}

            <div className="flex items-center space-x-4">
              <Link href="/search" className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Link>
              <Link href="/notifications" className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Notifications</span>
              </Link>
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
              {/* <Link href="/profile" className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
                <User className="h-5 w-5" />
                <span className="sr-only">Profile</span>
              </Link> */}
              {/* <button className="md:hidden p-2 hover:bg-zinc-800 rounded-full transition-colors">
                <Menu className="h-5 w-5" />
              </button> */}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation (visible on small screens) */}
      <MobileNavigation />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Quick Access Sidebar */}
          <aside className="hidden lg:block lg:col-span-3">
            <QuickAccess />
          </aside>

          {/* Activity Feed */}
          <section className="lg:col-span-6">
            <h2 className="text-2xl font-bold mb-6">Your Feed</h2>
            <Suspense fallback={<div className="h-64 bg-zinc-900 animate-pulse rounded-lg"></div>}>
              <ActivityFeed />
            </Suspense>
          </section>

          {/* Recommendations */}
          <aside className="lg:col-span-3">
            <h2 className="text-2xl font-bold mb-6">Recommended For You</h2>
            <Suspense fallback={<div className="h-64 bg-zinc-900 animate-pulse rounded-lg"></div>}>
              <MovieRecommendations />
            </Suspense>
          </aside>
        </div>
      </main>
    </div>
  )
}

