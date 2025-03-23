import type { ReactNode } from "react";
import Link from "next/link";
import { Search, Bell } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Image from "next/image";
import NotificationDropdown from "@/components/ui/notification-dropdown";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react"
import LogoutButton from "@/components/logout-button";

export const metadata = {
  title: "Movie Lists | Cult & Underground Movies",
  description: "Create, organize, and share your curated collections of cult and underground cinema",
};

export default function MovieListsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* Header */}
      <header className="border-b border-zinc-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center">
              <div className="mr-2 h-6 w-6 border border-red-600"></div>
              <span className="text-xl font-bold">CULT & UNDERGROUND</span>
            </Link>

            {/* Navigation & Actions */}
            <div className="flex items-center space-x-4">
              {/* Search Button */}
              <Link href="/search" className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Link>

              {/* Notifications Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
                    <Bell className="h-5 w-5" />
                    <span className="sr-only">Notifications</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72 border-zinc-800 bg-zinc-900 text-zinc-300">
                  <NotificationDropdown />
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full border border-zinc-800 bg-zinc-900 p-0 hover:bg-zinc-800">
                    <div className="h-8 w-8 overflow-hidden rounded-full">
                      <Image src="/placeholder.svg?height=100&width=100" alt="Profile" width={32} height={32} className="h-full w-full object-cover" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 border-zinc-800 bg-zinc-900 text-zinc-300">
                  <div className="flex items-center gap-2 p-2">
                    <Image src="/placeholder.svg?height=100&width=100" alt="Profile" width={32} height={32} className="h-8 w-8 rounded-full" />
                    <div>
                      <p className="text-sm font-medium text-white">CinemaFanatic</p>
                      <p className="text-xs text-zinc-400">@cinemafanatic</p>
                    </div>
                  </div>
                  <DropdownMenuItem className="hover:bg-zinc-800">Profile</DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-zinc-800">My Lists</DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-zinc-800">Settings</DropdownMenuItem>
                  <DropdownMenuItem>
                    <LogoutButton />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>
    </>
  );
}
