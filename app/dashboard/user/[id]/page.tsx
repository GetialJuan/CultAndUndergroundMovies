import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Film, Star } from 'lucide-react';
import { validateUUID } from '@/lib/utils';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

interface UserProfilePageProps {
  params: {
    id: string;
  };
}

async function getUser(id: string) {
  if (!validateUUID(id)) {
    return null;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        reviews: {
          include: {
            movie: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 5,
        },
        _count: {
          select: {
            reviews: true,
            followers: true,
            following: true,
          },
        },
      },
    });

    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

export default async function UserProfilePage({ params }: UserProfilePageProps) {
  if (!params?.id) {
    notFound();
  }

  const user = await getUser(params.id);
  const session = await getServerSession(authOptions);

  if (!user) {
    notFound();
  }

  // Check if current user is viewing their own profile
  const isOwnProfile = session?.user?.id === user.id;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-6">
          <Button
            asChild
            variant="ghost"
            className="flex items-center text-zinc-400 hover:text-white hover:bg-zinc-800/50"
          >
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Link>
          </Button>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Profile picture */}
            <div className="w-32 h-32 rounded-full overflow-hidden bg-zinc-800 flex-shrink-0 flex items-center justify-center">
              {user.profilePicture ? (
                <Image
                  src={user.profilePicture}
                  alt={user.username}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="h-16 w-16 text-zinc-600" />
              )}
            </div>

            {/* User info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold mb-2">{user.username}</h1>
              
              {user.biography && (
                <p className="text-zinc-300 mb-4">{user.biography}</p>
              )}
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-4">
                <div className="text-center">
                  <div className="text-lg font-semibold">{user._count.reviews}</div>
                  <div className="text-sm text-zinc-400">Reseñas</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold">{user._count.followers}</div>
                  <div className="text-sm text-zinc-400">Seguidores</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold">{user._count.following}</div>
                  <div className="text-sm text-zinc-400">Siguiendo</div>
                </div>
              </div>
              
              {!isOwnProfile && session?.user && (
                <Button variant="outline" className="border-zinc-700 hover:bg-zinc-800">
                  Seguir
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Recent reviews section */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Reseñas recientes</h2>
          
          {user.reviews.length > 0 ? (
            <div className="space-y-4">
              {user.reviews.map((review) => (
                <div key={review.id} className="border border-zinc-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Link 
                      href={`/dashboard/film/${review.movie.id}`}
                      className="font-medium text-lg hover:text-blue-400 transition-colors flex items-center"
                    >
                      <Film className="h-4 w-4 mr-2" />
                      {review.movie.title}
                    </Link>
                    <div className="flex items-center bg-zinc-800 px-2 py-1 rounded">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                      <span>{review.rating}/5</span>
                    </div>
                  </div>
                  <p className="text-zinc-300 line-clamp-3">{review.content}</p>
                  <div className="mt-2 text-sm text-zinc-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
              
              <div className="flex justify-center mt-4">
                <Button asChild variant="outline" className="border-zinc-700 hover:bg-zinc-800">
                  <Link href={`/dashboard/user/${user.id}/reviews`}>
                    Ver todas las reseñas
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center p-4 text-zinc-400 border border-zinc-800 rounded-md">
              <p>Este usuario aún no ha escrito reseñas.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
