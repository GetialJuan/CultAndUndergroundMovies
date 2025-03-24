import Link from "next/link"
import { Film, List, MessageSquare, Heart, User, Clock, Plus } from "lucide-react"
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export default async function QuickAccess() {
  const session = await getServerSession(authOptions);
    
  if (!session?.user?.email) {
    return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
  }

  return (
    <div className="space-y-6">
      {/* Quick Profile */}
      <div className="bg-zinc-900 rounded-lg p-4">
        <Link href="/profile" className="flex items-center space-x-3 mb-4">
          <div className="h-12 w-12 rounded-full bg-zinc-800 flex items-center justify-center">
            <User className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold">{session.user.name}</h3>
            <p className="text-sm text-zinc-400">View Profile</p>
          </div>
        </Link>

        <div className="grid grid-cols-3 gap-2 text-center text-sm">
          <div className="bg-zinc-800 p-2 rounded-md">
            <p className="font-bold">42</p>
            <p className="text-zinc-400">Reviews</p>
          </div>
          <div className="bg-zinc-800 p-2 rounded-md">
            <p className="font-bold">16</p>
            <p className="text-zinc-400">Lists</p>
          </div>
          <div className="bg-zinc-800 p-2 rounded-md">
            <p className="font-bold">128</p>
            <p className="text-zinc-400">Following</p>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-zinc-900 rounded-lg p-4">
        <h3 className="font-bold mb-3">Quick Access</h3>
        <nav className="space-y-1">
          <Link href="/watchlist" className="flex items-center p-2 hover:bg-zinc-800 rounded-md transition-colors">
            <Clock className="h-5 w-5 mr-3 text-zinc-400" />
            <span>Watchlist</span>
          </Link>
          <Link href="/dashboard/movie-lists" className="flex items-center p-2 hover:bg-zinc-800 rounded-md transition-colors">
            <List className="h-5 w-5 mr-3 text-zinc-400" />
            <span>My Lists</span>
          </Link>
          <Link href="/favorites" className="flex items-center p-2 hover:bg-zinc-800 rounded-md transition-colors">
            <Heart className="h-5 w-5 mr-3 text-zinc-400" />
            <span>Favorites</span>
          </Link>
          <Link href="/dashboard/explore" className="flex items-center p-2 hover:bg-zinc-800 rounded-md transition-colors">
            <Film className="h-5 w-5 mr-3 text-zinc-400" />
            <span>Explore Movies</span>
          </Link>
        </nav>
      </div>

      {/* Quick Actions */}
      <div className="space-y-2">
        <Link
          href="/create-list"
          className="flex items-center justify-center p-2 bg-zinc-800 hover:bg-zinc-700 rounded-md transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          <span>Create List</span>
        </Link>
      </div>
    </div>
  )
}
