import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="container mx-auto py-16 px-4 text-center">
      <h2 className="text-3xl font-bold mb-4">Película no encontrada</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        No pudimos encontrar la película que estás buscando.
      </p>
      <Link 
        href="/dashboard/films" 
        className="inline-flex items-center px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
      >
        Volver al listado de películas
      </Link>
    </div>
  )
}
