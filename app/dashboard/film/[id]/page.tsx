import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { validateUUID } from '@/lib/utils';
import { ArrowLeft, Star, ExternalLink, Plus } from 'lucide-react';
import AddToListButton from './AddToListButton';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Suspense } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ReviewForm from './ReviewForm';
import ReviewsList from './ReviewsList';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { ReviewsProvider } from './ReviewsContext';
import ControlledTabs from './ControlledTabs';
import { MovieReasonGemini } from '@/components/movie-reason';
import AIReview from './AIReview';

// Initialize Prisma client
const prisma = new PrismaClient();

// Define types for our data structures
type User = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  passwordHash: string | null;
  googleId: string | null;
  username: string;
  profilePicture: string | null;
  biography: string | null;
  lastLogin: Date | null;
};

type Review = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  movieId: string;
  rating: number;
  content: string; // Using content to match schema
  user: User;
};

type Genre = {
  id: string;
  name: string;
};

type MovieGenre = {
  id: string;
  movieId: string;
  genreId: string;
  genre: Genre;
};

type StreamingPlatform = {
  id: string;
  name: string;
  logoUrl: string | null;
};

type MovieStreaming = {
  id: string;
  movieId: string;
  platformId: string;
  url: string | null;
  platform: StreamingPlatform;
};

type Movie = {
  id: string;
  title: string;
  originalTitle: string | null;
  synopsis: string | null;
  releaseYear: number | null;
  duration: number | null;
  director: string | null;
  posterImage: string | null;
  backdropImage: string | null;
  isCult: boolean;
  isUnderground: boolean;
  createdAt: Date;
  updatedAt: Date;
  genres: MovieGenre[];
  reviews: Review[];
  streamings: MovieStreaming[];
};

// Define props interface for the page component
interface PageProps {
  params: {
    id: string;
  };
}

async function getMovie(id: string): Promise<Movie | null> {
  if (!validateUUID(id)) {
    return null;
  }

  try {
    const movie = await prisma.movie.findUnique({
      where: { id },
      include: {
        genres: {
          include: {
            genre: true,
          },
        },
        reviews: {
          include: {
            user: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 5,
        },
        streamings: {
          include: {
            platform: true,
          },
        },
      },
    });

    return movie as Movie | null;
  } catch (error) {
    console.error('Error fetching movie:', error);
    return null;
  }
}

export default async function FilmDetailPage({ params }: PageProps) {
  // Properly await all asynchronous operations
  if (!params?.id) {
    notFound();
  }
  
  const movie = await getMovie(params.id);
  const session = await getServerSession(authOptions);

  if (!movie) {
    notFound();
  }

  // Calculate average rating if there are reviews
  const averageRating =
    movie.reviews.length > 0
      ? movie.reviews.reduce((sum, review) => sum + review.rating, 0) /
        movie.reviews.length
      : null;

  // Check if user has already reviewed this movie
  let userHasReviewed = false;
  
  if (session?.user?.id) {
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_movieId: {
          userId: session.user.id as string,
          movieId: params.id,
        },
      },
    });
    
    userHasReviewed = !!existingReview;
  }

  // Get reviews for initial load - Format to match the expected shape
  const initialReviews = await prisma.review.findMany({
    where: { movieId: params.id },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          profilePicture: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

  // Check which reviews the current user has liked
  let userLikedReviewIds: string[] = [];
  if (session?.user?.id) {
    const userLikes = await prisma.reviewLike.findMany({
      where: {
        userId: session.user.id as string,
        reviewId: {
          in: initialReviews.map(review => review.id),
        },
      },
      select: {
        reviewId: true,
      },
    });
    userLikedReviewIds = userLikes.map(like => like.reviewId);
  }

  // Transform the reviews to include likesCount and format createdAt as string
  const formattedReviews = initialReviews.map(review => ({
    ...review,
    likesCount: review.likesCount || 0,
    isLiked: userLikedReviewIds.includes(review.id),
    createdAt: review.createdAt.toISOString(),
  }));

  return (
    <div className="min-h-screen bg-black text-white ">
      {/* Hero section with backdrop */}
      <div className="relative h-[50vh] w-full mt-20">
        {movie.backdropImage ? (
          <>
            <div className="absolute inset-0 z-0">
              <Image
                src={movie.backdropImage}
                alt={`Backdrop de ${movie.title}`}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/30" />
            </div>
          </>
        ) : (
          <div className="absolute inset-0 bg-zinc-900" />
        )}

        <div className="container mx-auto px-4 h-full relative z-10">
          <div className="flex items-center h-16 pt-4">
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

          <div className="flex flex-col md:flex-row items-end h-[calc(100%-4rem)] pb-8 gap-8">
            {/* Poster */}
            <div className="hidden md:block w-48 lg:w-56 flex-shrink-0 rounded-lg overflow-hidden shadow-xl border border-zinc-800">
              {movie.posterImage ? (
                <Image
                  src={movie.posterImage}
                  alt={`Poster de ${movie.title}`}
                  width={224}
                  height={336}
                  className="w-full h-auto"
                />
              ) : (
                <div className="w-full h-[336px] bg-zinc-800 flex items-center justify-center">
                  <span className="text-zinc-500">No disponible</span>
                </div>
              )}
            </div>

            {/* Title and quick info */}
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                {movie.title} 
              </h1>

              <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-400 mb-4">
                {movie.releaseYear && <span>{movie.releaseYear}</span>}
                {movie.duration && (
                  <>
                    <span className="inline-block w-1 h-1 rounded-full bg-zinc-700"></span>
                    <span>{movie.duration} min</span>
                  </>
                )}
                {movie.director && (
                  <>
                    <span className="inline-block w-1 h-1 rounded-full bg-zinc-700"></span>
                    <span>Dir: {movie.director}</span>
                  </>
                )}
              </div>

              {/* Tags/Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                {movie.genres.map((mg) => (
                  <Badge
                    key={mg.genreId}
                    variant="outline"
                    className="bg-zinc-800/50 border-zinc-700 text-zinc-300"
                  >
                    {mg.genre.name}
                  </Badge>
                ))}

                {movie.isCult && (
                  <Badge className="bg-purple-900/50 border-purple-700 text-purple-300">
                    De Culto
                  </Badge>
                )}

                {movie.isUnderground && (
                  <Badge className="bg-indigo-900/50 border-indigo-700 text-indigo-300">
                    Underground
                  </Badge>
                )}
              </div>

              {/* Rating */}
              {averageRating !== null && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1 px-2 py-1 bg-zinc-800/80 rounded">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-medium">
                      {averageRating.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-sm text-zinc-400">
                    {movie.reviews.length}{' '}
                    {movie.reviews.length === 1 ? 'reseña' : 'reseñas'}
                  </span>
                </div>
              )}

            <MovieReasonGemini movie={movie} />
            </div>
          </div>
        </div>
      </div>

      {/* Movie details */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Synopsis */}
            <section className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Sinopsis</h2>
              {movie.synopsis ? (
                <p className="text-zinc-300 leading-relaxed">
                  {movie.synopsis}
                </p>
              ) : (
                <p className="text-zinc-500 italic">
                  No hay sinopsis disponible.
                </p>
              )}
            </section>

            {/* AI Review summary - added here */}
            <ReviewsProvider initialReviews={formattedReviews as any}>
              <AIReview movieTitle={movie.title} />
            </ReviewsProvider>

            {/* Reviews section - Updated with controlled tabs */}
            <section className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Reseñas y opiniones</h2>
              <ReviewsProvider initialReviews={formattedReviews as any}>
                <ControlledTabs 
                  reviewsContent={<ReviewsList movieId={params.id} />} 
                  writeContent={
                    !session ? (
                      <div className="p-4 text-center text-zinc-400 border border-zinc-800 rounded-md">
                        <p className="mb-2">Debes iniciar sesión para escribir una reseña</p>
                        <Button asChild>
                          <Link href="/login">Iniciar sesión</Link>
                        </Button>
                      </div>
                    ) : userHasReviewed ? (
                      <div className="p-4 text-center text-zinc-400 border border-zinc-800 rounded-md">
                        <p>Ya has escrito una reseña para esta película.</p>
                      </div>
                    ) : (
                      <ReviewForm movieId={params.id} />
                    )
                  }
                  isDisabled={!session || userHasReviewed}
                />
              </ReviewsProvider>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Mobile poster (visible on small screens) */}
            <div className="block md:hidden mx-auto w-48 rounded-lg overflow-hidden shadow-xl border border-zinc-800">
              {movie.posterImage ? (
                <Image
                  src={movie.posterImage}
                  alt={`Poster de ${movie.title}`}
                  width={192}
                  height={288}
                  className="w-full h-auto"
                />
              ) : (
                <div className="w-full h-[288px] bg-zinc-800 flex items-center justify-center">
                  <span className="text-zinc-500">No disponible</span>
                </div>
              )}
            </div>

            {/* Add to list card */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
              <h2 className="text-lg font-bold mb-4">Añadir a lista</h2>
              <Suspense
                fallback={
                  <div className="h-10 bg-zinc-800 animate-pulse rounded"></div>
                }
              >
                <AddToListButton movieId={params.id} />
              </Suspense>
            </div>

            {/* Where to watch */}
            {movie.streamings.length > 0 && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
                <h2 className="text-lg font-bold mb-4">Disponible en</h2>
                <div className="space-y-3">
                  {movie.streamings.map((streaming) => (
                    <a
                      key={streaming.platformId}
                      href={streaming.url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 bg-zinc-800 hover:bg-zinc-700 transition-colors rounded-md w-full"
                    >
                      <div className="flex items-center">
                        {streaming.platform.logoUrl ? (
                          <div className="w-6 h-6 mr-3 flex-shrink-0">
                            <Image
                              src={streaming.platform.logoUrl}
                              alt={streaming.platform.name}
                              width={24}
                              height={24}
                              className="w-full h-full object-contain"
                            />
                          </div>
                        ) : null}
                        <span>{streaming.platform.name}</span>
                      </div>
                      <ExternalLink className="h-4 w-4 text-zinc-400" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Additional info */}
            {movie.originalTitle && movie.originalTitle !== movie.title && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
                <h2 className="text-lg font-bold mb-4">
                  Información adicional
                </h2>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-zinc-400">Título original: </span>
                    <span className="text-zinc-300">{movie.originalTitle}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
