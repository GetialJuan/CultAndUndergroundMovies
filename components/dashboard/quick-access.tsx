/**
 * @fileoverview QuickAccess component provides a user dashboard with quick profile details,
 * navigation links, and actions related to movies and lists.
 * It fetches user profile data and displays relevant statistics and shortcuts.
 * 
 * @module QuickAccess
 */

'use client';

import Link from 'next/link';
import {
  Film,
  List,
  MessageSquare,
  Heart,
  User,
  Clock,
  Plus,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

/**
 * @typedef {Object} ProfileData
 * @property {string} id - Unique identifier for the user.
 * @property {string} username - User's display name.
 * @property {string} email - User's email address.
 * @property {string | null} profilePicture - URL to the user's profile picture.
 * @property {string | null} biography - Short bio of the user.
 * @property {string} createdAt - Account creation date.
 * @property {number} followingCount - Number of users followed.
 * @property {number} followersCount - Number of followers.
 * @property {number} reviewsCount - Number of reviews written by the user.
 * @property {number} movieListsCount - Number of movie lists created by the user.
 */

/**
 * QuickAccess component displays user-related actions and navigation.
 *
 * @component
 * @returns {JSX.Element} The QuickAccess component.
 */
export default function QuickAccess() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState/** @type {ProfileData | null} */(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchProfileData();
    }
  }, [status]);

  /**
   * Fetches profile data from the API.
   * @async
   * @returns {Promise<void>} Resolves when profile data is fetched and set.
   */
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
    return <div className="space-y-6">Loading...</div>;
  }

  if (status === 'unauthenticated') {
    return <div className="space-y-6">Please sign in to access this content.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Quick Profile Section */}
      <div className="bg-zinc-900 rounded-lg p-4">
        <Link href="/profile" className="flex items-center space-x-3 mb-4">
          <div className="h-12 w-12 rounded-full overflow-hidden">
            {loading || !profile ? (
              <div className="h-full w-full bg-zinc-800 flex items-center justify-center">
                <User className="h-6 w-6" />
              </div>
            ) : (
              <Avatar className="h-full w-full">
                <AvatarImage src={profile.profilePicture || ''} alt={profile.username} />
                <AvatarFallback className="bg-zinc-800">
                  {profile.username?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
          <div>
            <h3 className="font-bold">
              {loading ? 'Loading...' : profile?.username || session?.user?.name || 'User'}
            </h3>
            <p className="text-sm text-zinc-400">View Profile</p>
          </div>
        </Link>

        <div className="grid grid-cols-3 gap-2 text-center text-sm">
          <div className="bg-zinc-800 p-2 rounded-md">
            <p className="font-bold">{loading ? '...' : profile?.reviewsCount || 0}</p>
            <p className="text-zinc-400">Reviews</p>
          </div>
          <div className="bg-zinc-800 p-2 rounded-md">
            <p className="font-bold">{loading ? '...' : profile?.movieListsCount || 0}</p>
            <p className="text-zinc-400">Lists</p>
          </div>
          <div className="bg-zinc-800 p-2 rounded-md">
            <p className="font-bold">{loading ? '...' : profile?.followingCount || 0}</p>
            <p className="text-zinc-400">Following</p>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-zinc-900 rounded-lg p-4">
        <h3 className="font-bold mb-3">Quick Access</h3>
        <nav className="space-y-1">
          <Link href="/dashboard/watchlist" className="flex items-center p-2 hover:bg-zinc-800 rounded-md transition-colors">
            <Clock className="h-5 w-5 mr-3 text-zinc-400" />
            <span>History</span>
          </Link>
          <Link href="/dashboard/movie-lists" className="flex items-center p-2 hover:bg-zinc-800 rounded-md transition-colors">
            <List className="h-5 w-5 mr-3 text-zinc-400" />
            <span>My Lists</span>
          </Link>
          <Link href="/dashboard/favorites" className="flex items-center p-2 hover:bg-zinc-800 rounded-md transition-colors">
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
        <Link href="/add-film" className="flex items-center justify-center p-2 bg-red-600 hover:bg-red-700 rounded-md transition-colors">
          <Plus className="h-5 w-5 mr-2" />
          <span>Add Movie</span>
        </Link>
        <Link href="/create-list" className="flex items-center justify-center p-2 bg-zinc-800 hover:bg-zinc-700 rounded-md transition-colors">
          <Plus className="h-5 w-5 mr-2" />
          <span>Create List</span>
        </Link>
      </div>
    </div>
  );
}
