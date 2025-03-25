'use client';

import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { Search, Bell, User, List } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Image from 'next/image';
import NotificationDropdown from '@/components/ui/notification-dropdown';
import { Button } from '@/components/ui/button';
import LogoutButton from '@/components/logout-button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSession } from 'next-auth/react';

// Define the profile data type
type ProfileData = {
  id: string;
  username: string;
  email: string;
  profilePicture: string | null;
  biography: string | null;
  createdAt: string;
  followingCount: number;
  followersCount: number;
  reviewsCount: number;
  movieListsCount: number;
};


export default function Layout({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile data
  useEffect(() => {
    if (status === 'authenticated') {
      fetchProfileData();
    }
  }, [status]);

  const fetchProfileData = async () => {
    try {
      const response = await fetch('/api/profile');
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'unauthenticated') {
    return <div>Not authenticated</div>;
  }

  return (
    <>
      {/* Header */}
      <header className="border-b border-zinc-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center">
              <svg
                className="mr-2 h-6 w-6 text-white"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
                <line x1="7" y1="2" x2="7" y2="22" />
                <line x1="17" y1="2" x2="17" y2="22" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <line x1="2" y1="7" x2="7" y2="7" />
                <line x1="2" y1="17" x2="7" y2="17" />
                <line x1="17" y1="17" x2="22" y2="17" />
                <line x1="17" y1="7" x2="22" y2="7" />
              </svg>
              <span className="text-xl font-bold">CULT & UNDERGROUND</span>
            </Link>

            {/* Navigation & Actions */}
            <div className="flex items-center space-x-4">
              {/* Search Button */}
              <Link
                href="/search"
                className="p-2 hover:bg-zinc-800 rounded-full transition-colors"
              >
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
                <DropdownMenuContent
                  align="end"
                  className="w-72 border-zinc-800 bg-zinc-900 text-zinc-300"
                >
                  <NotificationDropdown />
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full border border-zinc-800 bg-zinc-900 p-0 hover:bg-zinc-800"
                  >
                    <div className="h-8 w-8 overflow-hidden rounded-full">
                      {loading || !profile ? (
                        <div className="h-full w-full bg-zinc-800 flex items-center justify-center">
                          <User className="h-4 w-4" />
                        </div>
                      ) : (
                        <Avatar className="h-full w-full">
                          <AvatarImage
                            src={profile.profilePicture || ''}
                            alt={profile.username}
                          />
                          <AvatarFallback className="bg-zinc-800">
                            {profile.username?.charAt(0).toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 border-zinc-800 bg-zinc-900 text-zinc-300"
                >
                  <div className="flex items-center gap-2 p-2">
                    {loading || !profile ? (
                      <div className="h-8 w-8 bg-zinc-800 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4" />
                      </div>
                    ) : (
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={profile.profilePicture || ''}
                          alt={profile.username}
                        />
                        <AvatarFallback className="bg-zinc-800">
                          {profile.username?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div>
                      <p className="text-sm font-medium text-white">
                        {loading
                          ? 'Loading...'
                          : profile?.username || session?.user?.name || 'User'}
                      </p>
                      <p className="text-xs text-zinc-400">
                        {profile?.email
                          ? `@${profile.email.split('@')[0]}`
                          : session?.user?.email
                          ? `@${session.user.email.split('@')[0]}`
                          : ''}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 hover:bg-zinc-800"
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/dashboard/movie-lists"
                      className="flex items-center gap-2 hover:bg-zinc-800"
                    >
                      <List className="w-4 h-4" />
                      My Lists
                    </Link>
                  </DropdownMenuItem>
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
