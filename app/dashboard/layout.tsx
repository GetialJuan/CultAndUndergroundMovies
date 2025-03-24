import type { ReactNode } from "react";
import Link from "next/link";
import { Search, Bell, User, List } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Image from "next/image";
import NotificationDropdown from "@/components/ui/notification-dropdown";
import { Button } from "@/components/ui/button";
import LogoutButton from "@/components/logout-button";
import { getServerSession } from "next-auth";
import { authOptions } from '@/lib/auth';
import { NextResponse } from "next/server";
import { getUser } from "@/lib/user";

export const metadata = {
  title: "Movie Lists | Cult & Underground Movies",
  description: "Create, organize, and share your curated collections of cult and underground cinema",
};

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
  }
  
  const user = await getUser(session.user.id);
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
                      <Image src={user.profilePicture} alt="Profile" width={32} height={32} className="h-full w-full object-cover" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 border-zinc-800 bg-zinc-900 text-zinc-300">
                  <div className="flex items-center gap-2 p-2">
                    <Image src="/placeholder.svg?height=100&width=100" alt="Profile" width={32} height={32} className="h-8 w-8 rounded-full" />
                    <div>
                      <p className="text-sm font-medium text-white">{session.user.name}</p>
                      <p className="text-xs text-zinc-400">@{session.user.name}</p>
                    </div>
                  </div>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center gap-2 hover:bg-zinc-800">
                      <User className="w-4 h-4" /> {/* Icono de perfil */}
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/movie-lists" className="flex items-center gap-2 hover:bg-zinc-800">
                      <List className="w-4 h-4" /> {/* Icono de perfil */}
                      My Lists
                    </Link>
                  </DropdownMenuItem>
                  {/* <DropdownMenuItem className="hover:bg-zinc-800">Settings</DropdownMenuItem> */}
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
