import { PrismaClient } from '@prisma/client'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { validateUUID } from '@/lib/utils'
import AddToListButton from './AddToListButton'

// Initialize Prisma client
const prisma = new PrismaClient()

// Define props interface for the page component
interface PageProps {
  params: {
    id: string
  }
}

async function getMovie(id: string) {
  if (!validateUUID(id)) {
    return null
  }
  
  try {
    const movie = await prisma.movie.findUnique({
      where: { id },
      include: {
        genres: {
          include: {
            genre: true
          }
        },
        reviews: {
          include: {
            user: true
          }
        },
        streamings: {
          include: {
            platform: true
          }
        }
      }
    })
    
    return movie
  } catch (error) {
    console.error('Error fetching movie:', error)
    return null
  }
}

export default async function FilmDetailPage({ params }: PageProps) {
  const movie = await getMovie(params.id)
  
  if (!movie) {
    notFound()
  }
  
  // Calculate average rating if there are reviews
  const averageRating = movie.reviews.length > 0
    ? movie.reviews.reduce((sum, review) => sum + review.rating, 0) / movie.reviews.length
    : null
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link 
          href="/dashboard" 
          className="inline-flex items-center px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
        >
          ← Volver
        </Link>
      </div>
      
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        {/* Movie header with poster and basic info */}
        <div className="flex flex-col md:flex-row">
          {movie.posterImage ? (
            <div className="md:w-1/3">
              <img 
                src={movie.posterImage} 
                alt={`Poster de ${movie.title}`} 
                className="w-full h-auto object-cover"
              />
            </div>
          ) : (
            <div className="md:w-1/3 bg-gray-700 flex items-center justify-center">
              <span className="text-gray-400 text-xl">No hay poster disponible</span>
            </div>
          )}
          
          <div className="p-6 md:w-2/3">
            <h1 className="text-3xl font-bold mb-2">
              {movie.title} {movie.releaseYear && `(${movie.releaseYear})`}
            </h1>
            
            {movie.originalTitle && movie.originalTitle !== movie.title && (
              <p className="text-gray-400 mb-4">
                Título original: {movie.originalTitle}
              </p>
            )}
            
            {movie.director && (
              <p className="mb-2">
                <span className="font-semibold">Director:</span> {movie.director}
              </p>
            )}
            
            {movie.duration && (
              <p className="mb-2">
                <span className="font-semibold">Duración:</span> {movie.duration} minutos
              </p>
            )}
            
            {movie.genres.length > 0 && (
              <div className="mb-4">
                <span className="font-semibold">Géneros:</span>{' '}
                {movie.genres.map(mg => mg.genre.name).join(', ')}
              </div>
            )}
            
            {averageRating !== null && (
              <div className="mb-4">
                <span className="font-semibold">Calificación promedio:</span>{' '}
                <span className="text-yellow-500">★</span> {averageRating.toFixed(1)}/5
                <span className="text-sm text-gray-500 ml-2">({movie.reviews.length} reseñas)</span>
              </div>
            )}
            
            <div className="flex space-x-2 mb-4">
              {movie.isCult && (
                <span className="px-2 py-1 bg-purple-600 text-white text-sm rounded-full">
                  De Culto
                </span>
              )}
              {movie.isUnderground && (
                <span className="px-2 py-1 bg-indigo-600 text-white text-sm rounded-full">
                  Underground
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* Synopsis section */}
        <div className="p-6 border-t border-gray-700">
          <h2 className="text-xl font-bold mb-4">Sinopsis</h2>
          {movie.synopsis ? (
            <p className="text-gray-300">{movie.synopsis}</p>
          ) : (
            <p className="text-gray-500 italic">No hay sinopsis disponible.</p>
          )}
        </div>
        
        {/* Add to list section */}
        <div className="p-6 border-t border-gray-700">
          <h2 className="text-xl font-bold mb-4">Añadir a lista</h2>
          <AddToListButton movieId={params.id} />
        </div>
        
        {/* Streaming availability */}
        {movie.streamings.length > 0 && (
          <div className="p-6 border-t border-gray-700">
            <h2 className="text-xl font-bold mb-4">Disponible en</h2>
            <div className="flex flex-wrap gap-4">
              {movie.streamings.map((streaming) => (
                <a 
                  key={streaming.platformId} 
                  href={streaming.url || '#'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600"
                >
                  {streaming.platform.logoUrl && (
                    <img 
                      src={streaming.platform.logoUrl} 
                      alt={streaming.platform.name} 
                      className="w-5 h-5 mr-2" 
                    />
                  )}
                  {streaming.platform.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
