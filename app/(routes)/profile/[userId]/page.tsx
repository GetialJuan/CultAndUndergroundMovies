// Ruta: c:\Users\carlo\Documents\Universidad\Proyecto Integrador\CultAndUndergroundMovies\app\(routes)\profile\[userId]\page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  AlertCircle,
  Film,
  ListChecks,
  Star,
  Users,
  UserPlus,
  UserMinus,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { FollowersDialog } from '@/components/profile/followers-dialog';
import { ReviewsDialog } from '@/components/profile/reviews-dialog';

type UserProfileData = {
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
  isFollowing: boolean;
  isCurrentUser: boolean;
};

export default function UserProfilePage() {
  const params = useParams();
  const userId = params.userId as string;
  const { data: session, status } = useSession();
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [followStatus, setFollowStatus] = useState<boolean>(false);
  const [followLoading, setFollowLoading] = useState(false);

  // Dialog states
  const [followersOpen, setFollowersOpen] = useState(false);
  const [followingOpen, setFollowingOpen] = useState(false);
  const [reviewsOpen, setReviewsOpen] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Fetch user profile data
  useEffect(() => {
    if (userId) {
      fetchProfileData();
    }
  }, [userId]);

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/users/${userId}/profile`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('User not found');
        }
        throw new Error('Failed to fetch profile data');
      }
      const data = await response.json();
      setProfile(data);
      setFollowStatus(data.isFollowing);
    } catch (err: any) {
      setError(err.message || 'Error loading profile. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!session) {
      router.push('/login');
      return;
    }

    setFollowLoading(true);
    try {
      if (!followStatus) {
        // Follow the user
        const response = await fetch(`/api/users/${userId}/follow`, {
          method: 'POST',
        });

        if (response.ok) {
          setFollowStatus(true);
          // Update followers count
          if (profile) {
            setProfile({
              ...profile,
              followersCount: profile.followersCount + 1,
              isFollowing: true,
            });
          }
        }
      } else {
        // Unfollow the user
        const response = await fetch(`/api/users/${userId}/follow`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setFollowStatus(false);
          // Update followers count
          if (profile) {
            setProfile({
              ...profile,
              followersCount: profile.followersCount - 1,
              isFollowing: false,
            });
          }
        }
      }
    } catch (err) {
      console.error('Error following/unfollowing user:', err);
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="w-16 h-16 border-t-2 border-red-500 border-solid rounded-full animate-spin mx-auto"></div>
          <p className="text-xl">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Alert
          variant="destructive"
          className="border-red-800 bg-red-950/50 text-red-400 max-w-lg"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || 'User not found'}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-zinc-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <a href="/dashboard" className="flex items-center">
              <div className="mr-2 h-6 w-6 border border-red-600"></div>
              <span className="text-xl font-bold">CULT & UNDERGROUND</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-3xl font-bold">{profile.username}'s Profile</h1>
            {!profile.isCurrentUser && (
              <Button
                onClick={handleFollow}
                disabled={followLoading}
                className={
                  followStatus
                    ? 'bg-zinc-700 hover:bg-zinc-600'
                    : 'bg-red-500 hover:bg-red-600'
                }
              >
                {followLoading ? (
                  'Loading...'
                ) : followStatus ? (
                  <>
                    <UserMinus className="mr-2 h-4 w-4" />
                    Unfollow
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Follow
                  </>
                )}
              </Button>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3">
              <div className="rounded-lg bg-zinc-900 p-6 text-center">
                <div className="mx-auto mb-4 h-32 w-32 overflow-hidden rounded-full border-4 border-red-500">
                  <Avatar className="h-full w-full">
                    <AvatarImage
                      src={profile.profilePicture || ''}
                      alt={profile.username}
                    />
                    <AvatarFallback className="bg-zinc-800 text-lg">
                      {profile.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <h2 className="text-2xl font-bold mb-1">{profile.username}</h2>
                <p className="text-zinc-400 text-sm mb-4">
                  Member since{' '}
                  {new Date(profile.createdAt).toLocaleDateString()}
                </p>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <Button
                    variant="outline"
                    className="bg-zinc-800 border-none hover:bg-zinc-700 p-3 h-auto flex flex-col items-center"
                    onClick={() => setFollowingOpen(true)}
                  >
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Users className="h-4 w-4 text-red-500" />
                      <span className="font-bold">
                        {profile.followingCount}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400">Following</p>
                  </Button>

                  <Button
                    variant="outline"
                    className="bg-zinc-800 border-none hover:bg-zinc-700 p-3 h-auto flex flex-col items-center"
                    onClick={() => setFollowersOpen(true)}
                  >
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Users className="h-4 w-4 text-red-500" />
                      <span className="font-bold">
                        {profile.followersCount}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400">Followers</p>
                  </Button>

                  <Button
                    variant="outline"
                    className="bg-zinc-800 border-none hover:bg-zinc-700 p-3 h-auto flex flex-col items-center"
                    onClick={() => setReviewsOpen(true)}
                  >
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Star className="h-4 w-4 text-red-500" />
                      <span className="font-bold">{profile.reviewsCount}</span>
                    </div>
                    <p className="text-xs text-zinc-400">Reviews</p>
                  </Button>

                  <div className="bg-zinc-800 p-3 rounded-md">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <ListChecks className="h-4 w-4 text-red-500" />
                      <span className="font-bold">
                        {profile.movieListsCount}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400">Lists</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:w-2/3">
              <div className="rounded-lg bg-zinc-900 p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Film className="mr-2 h-5 w-5 text-red-500" />
                  About
                </h3>
                <div className="mb-6">
                  <p className="text-zinc-300">
                    {profile.biography || 'No biography available.'}
                  </p>
                </div>

                {/* Movie Lists Section (for future implementation) */}
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <ListChecks className="mr-2 h-5 w-5 text-red-500" />
                  Featured Lists
                </h3>
                <div className="text-zinc-400">
                  <p>Lists coming soon...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Dialogs for followers, following, and reviews */}
      <FollowersDialog
        open={followersOpen}
        onOpenChange={setFollowersOpen}
        title="Followers"
        userId={profile.id}
        type="followers"
      />

      <FollowersDialog
        open={followingOpen}
        onOpenChange={setFollowingOpen}
        title="Following"
        userId={profile.id}
        type="following"
      />

      <ReviewsDialog
        open={reviewsOpen}
        onOpenChange={setReviewsOpen}
        userId={profile.id}
      />
    </div>
  );
}
