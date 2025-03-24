// Ruta: app/(routes)/profile/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  AlertCircle,
  Camera,
  Film,
  Heart,
  ListChecks,
  Pencil,
  Star,
  Users,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { FollowersDialog } from '@/components/profile/followers-dialog';
import { ReviewsDialog } from '@/components/profile/reviews-dialog';
import { ListsDialog } from '@/components/profile/lists-dialog';

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

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  // Edit form state
  const [username, setUsername] = useState('');
  const [biography, setBiography] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Dialog states
  const [followersOpen, setFollowersOpen] = useState(false);
  const [followingOpen, setFollowingOpen] = useState(false);
  const [reviewsOpen, setReviewsOpen] = useState(false);
  const [listsOpen, setListsOpen] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Fetch user profile data
  useEffect(() => {
    if (status === 'authenticated') {
      fetchProfileData();
    }
  }, [status]);

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/profile');
      if (!response.ok) {
        throw new Error('Failed to fetch profile data');
      }
      const data = await response.json();
      setProfile(data);

      // Initialize edit form
      setUsername(data.username);
      setBiography(data.biography || '');
    } catch (err) {
      setError('Error loading profile. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProfileImage(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccessMessage('');

    try {
      // Create form data for the profile image upload
      const formData = new FormData();
      formData.append('username', username);
      formData.append('biography', biography || '');
      if (profileImage) {
        formData.append('profileImage', profileImage);
      }

      const response = await fetch('/api/profile', {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }

      // Update was successful
      setSuccessMessage('Profile updated successfully!');
      fetchProfileData(); // Reload the profile data
    } catch (err: any) {
      setError(err.message || 'Error updating profile. Please try again.');
      console.error(err);
    } finally {
      setSaving(false);
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

  if (error && !profile) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Alert
          variant="destructive"
          className="border-red-800 bg-red-950/50 text-red-400 max-w-lg"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header (you can reuse the same header from your dashboard page) */}
      <header className="border-b border-zinc-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <a href="/dashboard" className="flex items-center">
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
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Your Profile</h1>

          {successMessage && (
            <Alert className="mb-6 border-green-800 bg-green-950/50 text-green-400">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert
              variant="destructive"
              className="mb-6 border-red-800 bg-red-950/50 text-red-400"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="view" className="w-full">
            <TabsList className="mb-8 border-b border-zinc-800 bg-transparent w-full justify-start">
              <TabsTrigger
                value="view"
                className="data-[state=active]:border-red-500 data-[state=active]:bg-transparent data-[state=active]:text-white"
              >
                View Profile
              </TabsTrigger>
              <TabsTrigger
                value="edit"
                className="data-[state=active]:border-red-500 data-[state=active]:bg-transparent data-[state=active]:text-white"
              >
                Edit Profile
              </TabsTrigger>
            </TabsList>

            {/* View Profile Section */}
            <TabsContent value="view" className="space-y-8">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/3">
                  <div className="rounded-lg bg-zinc-900 p-6 text-center">
                    <div className="mx-auto mb-4 h-32 w-32 overflow-hidden rounded-full border-4 border-red-500">
                      <Avatar className="h-full w-full">
                        <AvatarImage
                          src={profile?.profilePicture || ''}
                          alt={profile?.username || 'User'}
                        />
                        <AvatarFallback className="bg-zinc-800 text-lg">
                          {profile?.username?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <h2 className="text-2xl font-bold mb-1">
                      {profile?.username}
                    </h2>
                    <p className="text-zinc-400 text-sm mb-4">
                      Member since{' '}
                      {new Date(profile?.createdAt || '').toLocaleDateString()}
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
                            {profile?.followingCount}
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
                            {profile?.followersCount}
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
                          <span className="font-bold">
                            {profile?.reviewsCount}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400">Reviews</p>
                      </Button>

                      <Button
                        variant="outline"
                        className="bg-zinc-800 border-none hover:bg-zinc-700 p-3 h-auto flex flex-col items-center"
                        onClick={() => setListsOpen(true)}
                      >
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <ListChecks className="h-4 w-4 text-red-500" />
                          <span className="font-bold">
                            {profile?.movieListsCount}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400">Lists</p>
                      </Button>
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
                        {profile?.biography || 'No biography available.'}
                      </p>
                    </div>

                    <h3 className="text-xl font-bold mb-4 flex items-center">
                      <Film className="mr-2 h-5 w-5 text-red-500" />
                      Contact Information
                    </h3>
                    <div className="space-y-2">
                      <div className="flex flex-col">
                        <span className="text-sm text-zinc-400">Email</span>
                        <span className="text-zinc-300">{profile?.email}</span>
                        <p className="text-xs text-zinc-500 mt-1">
                          Email cannot be changed from this page for security
                          reasons.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Edit Profile Section */}
            <TabsContent value="edit">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="md:w-1/3">
                    <div className="rounded-lg bg-zinc-900 p-6 text-center">
                      <div className="relative mx-auto mb-4">
                        <div className="h-32 w-32 mx-auto overflow-hidden rounded-full border-4 border-red-500">
                          <Avatar className="h-full w-full">
                            <AvatarImage
                              src={
                                imagePreview || profile?.profilePicture || ''
                              }
                              alt={username}
                            />
                            <AvatarFallback className="bg-zinc-800 text-lg">
                              {username.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <label
                          htmlFor="profile-image"
                          className="absolute bottom-0 right-1/4 bg-red-500 hover:bg-red-600 rounded-full p-2 cursor-pointer"
                        >
                          <Camera className="h-5 w-5" />
                          <span className="sr-only">Upload image</span>
                        </label>
                        <input
                          id="profile-image"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </div>

                      <div className="text-xs text-zinc-400 mt-2">
                        Click the camera icon to upload a new profile picture
                      </div>
                    </div>
                  </div>

                  <div className="md:w-2/3">
                    <div className="rounded-lg bg-zinc-900 p-6">
                      <h3 className="text-xl font-bold mb-6 flex items-center">
                        <Pencil className="mr-2 h-5 w-5 text-red-500" />
                        Edit Profile Information
                      </h3>

                      <div className="space-y-4">
                        <div>
                          <label
                            htmlFor="username"
                            className="block text-sm font-medium text-zinc-400 mb-1"
                          >
                            Username
                          </label>
                          <Input
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="border-zinc-700 bg-zinc-800 text-white"
                            required
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="email"
                            className="block text-sm font-medium text-zinc-400 mb-1"
                          >
                            Email (cannot be changed here)
                          </label>
                          <Input
                            id="email"
                            value={profile?.email || ''}
                            disabled
                            className="border-zinc-700 bg-zinc-800 text-zinc-500"
                          />
                          <p className="text-xs text-zinc-500 mt-1">
                            To change your email, please go to Account Settings.
                          </p>
                        </div>

                        <div>
                          <label
                            htmlFor="biography"
                            className="block text-sm font-medium text-zinc-400 mb-1"
                          >
                            Biography
                          </label>
                          <Textarea
                            id="biography"
                            value={biography}
                            onChange={(e) => setBiography(e.target.value)}
                            className="border-zinc-700 bg-zinc-800 text-white min-h-[120px]"
                            placeholder="Tell others about yourself and your taste in films..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setUsername(profile?.username || '');
                      setBiography(profile?.biography || '');
                      setProfileImage(null);
                      setImagePreview(null);
                    }}
                    className="border-zinc-700 text-white hover:bg-zinc-800"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={saving}
                    className="bg-red-500 hover:bg-red-600 text-white"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Dialogs for followers, following, and reviews */}
      {profile && (
        <>
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

          <ListsDialog
            open={listsOpen}
            onOpenChange={setListsOpen}
            userId={profile.id}
          />
        </>
      )}
    </div>
  );
}
