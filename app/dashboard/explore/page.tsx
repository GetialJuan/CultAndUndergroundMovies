'use client';

import { useState, useEffect, useCallback, useRef, Fragment } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

type Movie = {
  id: string;
  title: string;
  originalTitle?: string;
  releaseYear: number;
  director?: string;
  posterImage?: string;
  isCult: boolean;
  isUnderground: boolean;
  avgRating: number | null;
  genres: string[];
  streamingPlatforms: {
    name: string;
    url?: string;
    logoUrl?: string;
  }[];
};

type Pagination = {
  total: number;
  pages: number;
  currentPage: number;
  limit: number;
};

// Custom debounce function
function useDebounce<T extends any[]>(
  callback: (...args: T) => void,
  delay: number
): (...args: T) => void {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return useCallback(
    (...args: T) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );
}

export default function ExplorePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Search filters
  const [title, setTitle] = useState(searchParams.get('title') || '');
  const [director, setDirector] = useState(searchParams.get('director') || '');
  const [genre, setGenre] = useState(searchParams.get('genre') || '');
  const [year, setYear] = useState(searchParams.get('year') || '');
  const [sortBy, setSortBy] = useState(
    searchParams.get('sortBy') || 'releaseYear'
  );
  const [sortOrder, setSortOrder] = useState(
    searchParams.get('sortOrder') || 'desc'
  );

  // Autocomplete data
  const [genres, setGenres] = useState<string[]>([]);
  const [directors, setDirectors] = useState<string[]>([]);
  const [genreSuggestions, setGenreSuggestions] = useState<string[]>([]);
  const [directorSuggestions, setDirectorSuggestions] = useState<string[]>([]);

  // Results
  const [movies, setMovies] = useState<Movie[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    pages: 0,
    currentPage: 1,
    limit: 10,
  });

  // UI states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch genres and directors for autocomplete
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch('/api/movies/genres');
        if (!response.ok) throw new Error('Failed to fetch genres');
        const data = await response.json();
        setGenres(data.map((g: any) => g.name));
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    const fetchDirectors = async () => {
      try {
        const response = await fetch('/api/movies/directors');
        if (!response.ok) throw new Error('Failed to fetch directors');
        const data = await response.json();
        setDirectors(data);
      } catch (error) {
        console.error('Error fetching directors:', error);
      }
    };

    fetchGenres();
    fetchDirectors();
  }, []);

  // Update URL with search parameters
  const updateUrl = useCallback(() => {
    const params = new URLSearchParams();
    if (title) params.set('title', title);
    if (director) params.set('director', director);
    if (genre) params.set('genre', genre);
    if (year) params.set('year', year);
    params.set('sortBy', sortBy);
    params.set('sortOrder', sortOrder);
    params.set('page', pagination.currentPage.toString());

    router.push(`/dashboard/explore?${params.toString()}`);
  }, [
    title,
    director,
    genre,
    year,
    sortBy,
    sortOrder,
    pagination.currentPage,
    router,
  ]);

  // Fetch movies based on filters
  const fetchMovies = async (page = pagination.currentPage) => {
    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams();
      if (title) params.append('title', title);
      if (director) params.append('director', director);
      if (genre) params.append('genre', genre);
      if (year) params.append('year', year);
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);
      params.append('page', page.toString());
      params.append('limit', pagination.limit.toString());

      const response = await fetch(`/api/movies?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }

      const data = await response.json();
      setMovies(data.movies);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setError('Failed to load movies. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Custom debounced search function
  const debouncedSearch = useDebounce(() => {
    updateUrl();
    fetchMovies(1);
  }, 500);

  // Handle input changes
  const handleTitleChange = (value: string) => {
    setTitle(value);
    debouncedSearch();
  };

  const handleDirectorChange = (value: string) => {
    setDirector(value);
    if (value) {
      const matches = directors.filter((d) =>
        d.toLowerCase().includes(value.toLowerCase())
      );
      setDirectorSuggestions(matches.slice(0, 5));
    } else {
      setDirectorSuggestions([]);
    }
    debouncedSearch();
  };

  const handleGenreChange = (value: string) => {
    setGenre(value);
    if (value) {
      const matches = genres.filter((g) =>
        g.toLowerCase().includes(value.toLowerCase())
      );
      setGenreSuggestions(matches.slice(0, 5));
    } else {
      setGenreSuggestions([]);
    }
    debouncedSearch();
  };

  const handleYearChange = (value: string) => {
    // Only allow numbers
    if (value === '' || /^\d+$/.test(value)) {
      setYear(value);
      debouncedSearch();
    }
  };

  const handleSortChange = (sortBy: string, sortOrder: string) => {
    setSortBy(sortBy);
    setSortOrder(sortOrder);
    debouncedSearch();
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchMovies(parseInt(searchParams.get('page') || '1', 10));
  }, [searchParams]);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
    fetchMovies(newPage);
    updateUrl();
  };

  // Render a placeholder for movie poster
  const renderPoster = (movie: Movie) => {
    if (movie.posterImage) {
      return (
        <Image
          src={movie.posterImage}
          alt={movie.title}
          width={150}
          height={225}
          className="rounded-md shadow-md"
        />
      );
    }
    return (
      <div className="w-[150px] h-[225px] bg-zinc-800 flex items-center justify-center rounded-md shadow-md">
        <span className="text-zinc-500">No poster</span>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-white">Explore Movies</h1>

      {/* Search Filters */}
      <div className="bg-zinc-900 rounded-lg shadow-lg p-6 mb-8 border border-zinc-800">
        <h2 className="text-xl font-semibold mb-4 text-white">
          Search Filters
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Title filter */}
          <div className="relative">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-zinc-300 mb-1"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Search by title"
              className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 text-white placeholder-zinc-400"
            />
          </div>

          {/* Director filter with autocomplete */}
          <div className="relative">
            <label
              htmlFor="director"
              className="block text-sm font-medium text-zinc-300 mb-1"
            >
              Director
            </label>
            <input
              type="text"
              id="director"
              value={director}
              onChange={(e) => handleDirectorChange(e.target.value)}
              placeholder="Search by director"
              className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 text-white placeholder-zinc-400"
            />
            {directorSuggestions.length > 0 && (
              <ul className="absolute z-10 w-full bg-zinc-800 border border-zinc-700 rounded-md mt-1 max-h-60 overflow-auto">
                {directorSuggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="p-2 hover:bg-zinc-700 cursor-pointer text-zinc-200"
                    onClick={() => {
                      setDirector(suggestion);
                      setDirectorSuggestions([]);
                      debouncedSearch();
                    }}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Genre filter with autocomplete */}
          <div className="relative">
            <label
              htmlFor="genre"
              className="block text-sm font-medium text-zinc-300 mb-1"
            >
              Genre
            </label>
            <input
              type="text"
              id="genre"
              value={genre}
              onChange={(e) => handleGenreChange(e.target.value)}
              placeholder="Search by genre"
              className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 text-white placeholder-zinc-400"
            />
            {genreSuggestions.length > 0 && (
              <ul className="absolute z-10 w-full bg-zinc-800 border border-zinc-700 rounded-md mt-1 max-h-60 overflow-auto">
                {genreSuggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="p-2 hover:bg-zinc-700 cursor-pointer text-zinc-200"
                    onClick={() => {
                      setGenre(suggestion);
                      setGenreSuggestions([]);
                      debouncedSearch();
                    }}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Year filter */}
          <div>
            <label
              htmlFor="year"
              className="block text-sm font-medium text-zinc-300 mb-1"
            >
              Release Year
            </label>
            <input
              type="text"
              id="year"
              value={year}
              onChange={(e) => handleYearChange(e.target.value)}
              placeholder="Enter year"
              className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 text-white placeholder-zinc-400"
            />
          </div>
        </div>

        {/* Sorting options */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-zinc-300 mb-1">
            Sort By
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleSortChange('releaseYear', 'desc')}
              className={`px-4 py-2 rounded-md text-sm ${
                sortBy === 'releaseYear' && sortOrder === 'desc'
                  ? 'bg-red-600 text-white'
                  : 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700 border border-zinc-700'
              }`}
            >
              Newest First
            </button>
            <button
              onClick={() => handleSortChange('releaseYear', 'asc')}
              className={`px-4 py-2 rounded-md text-sm ${
                sortBy === 'releaseYear' && sortOrder === 'asc'
                  ? 'bg-red-600 text-white'
                  : 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700 border border-zinc-700'
              }`}
            >
              Oldest First
            </button>
            <button
              onClick={() => handleSortChange('title', 'asc')}
              className={`px-4 py-2 rounded-md text-sm ${
                sortBy === 'title' && sortOrder === 'asc'
                  ? 'bg-red-600 text-white'
                  : 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700 border border-zinc-700'
              }`}
            >
              Title A-Z
            </button>
            <button
              onClick={() => handleSortChange('title', 'desc')}
              className={`px-4 py-2 rounded-md text-sm ${
                sortBy === 'title' && sortOrder === 'desc'
                  ? 'bg-red-600 text-white'
                  : 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700 border border-zinc-700'
              }`}
            >
              Title Z-A
            </button>
          </div>
        </div>
      </div>

      {/* Results section */}
      <div className="bg-zinc-900 rounded-lg shadow-lg p-6 border border-zinc-800">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Results</h2>
          <p className="text-zinc-400">
            {pagination.total} {pagination.total === 1 ? 'movie' : 'movies'}{' '}
            found
          </p>
        </div>

        {loading ? (
          <div className="py-8 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
          </div>
        ) : error ? (
          <div className="py-8 text-center text-red-400">{error}</div>
        ) : movies.length === 0 ? (
          <div className="py-8 text-center text-zinc-400">
            <p className="text-xl mb-2">No movies found</p>
            <p>Try adjusting your search filters</p>
          </div>
        ) : (
          <div>
            <div className="space-y-6">
              {movies.map((movie) => (
                <div
                  key={movie.id}
                  className="flex flex-col sm:flex-row gap-4 p-4 border border-zinc-800 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors"
                >
                  <div className="flex-shrink-0">{renderPoster(movie)}</div>
                  <div className="flex-grow">
                    <Link href={`/dashboard/film/${movie.id}`}>
                      <h3 className="text-xl font-bold text-red-400 hover:text-red-300 transition-colors">
                        {movie.title} ({movie.releaseYear})
                      </h3>
                    </Link>

                    {movie.originalTitle &&
                      movie.originalTitle !== movie.title && (
                        <p className="text-zinc-400 italic">
                          {movie.originalTitle}
                        </p>
                      )}

                    {movie.director && (
                      <p className="mt-2 text-zinc-300">
                        <span className="font-semibold">Director:</span>{' '}
                        {movie.director}
                      </p>
                    )}

                    <div className="mt-2 flex flex-wrap gap-1">
                      {movie.genres.map((genre, index) => (
                        <span
                          key={index}
                          className="inline-block px-2 py-1 text-xs bg-zinc-700 text-zinc-200 rounded-full"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>

                    {movie.avgRating !== null && (
                      <div className="mt-2 text-zinc-300">
                        <span className="font-semibold">Rating:</span>{' '}
                        {movie.avgRating.toFixed(1)}/10
                      </div>
                    )}

                    {(movie.isCult || movie.isUnderground) && (
                      <div className="mt-2 flex gap-2">
                        {movie.isCult && (
                          <span className="inline-block px-2 py-1 text-xs bg-red-900/50 text-red-200 rounded-full border border-red-800/50">
                            Cult
                          </span>
                        )}
                        {movie.isUnderground && (
                          <span className="inline-block px-2 py-1 text-xs bg-zinc-800 text-zinc-200 rounded-full border border-zinc-700">
                            Underground
                          </span>
                        )}
                      </div>
                    )}

                    {movie.streamingPlatforms.length > 0 && (
                      <div className="mt-2 text-zinc-300">
                        <span className="font-semibold">Available on:</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {movie.streamingPlatforms.map((platform, index) => (
                            <a
                              key={index}
                              href={platform.url || '#'}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block px-3 py-1 text-xs bg-zinc-700 border border-zinc-600 rounded-full hover:bg-zinc-600 text-zinc-200 transition-colors"
                            >
                              {platform.name}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="mt-8 flex justify-center">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className="px-4 py-2 border border-zinc-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-800 text-zinc-300 bg-zinc-900"
                  >
                    Previous
                  </button>

                  {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                    .filter(
                      (page) =>
                        page === 1 ||
                        page === pagination.pages ||
                        Math.abs(page - pagination.currentPage) <= 2
                    )
                    .map((page, index, array) => {
                      // Add ellipsis when there are gaps in the sequence
                      if (index > 0 && page - array[index - 1] > 1) {
                        return (
                          <Fragment key={`ellipsis-${page}`}>
                            <span className="px-4 py-2 border border-zinc-700 rounded-md bg-zinc-800 text-zinc-400">
                              ...
                            </span>
                            <button
                              onClick={() => handlePageChange(page)}
                              className={`px-4 py-2 border border-zinc-700 rounded-md ${
                                pagination.currentPage === page
                                  ? 'bg-red-600 text-white'
                                  : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800'
                              }`}
                            >
                              {page}
                            </button>
                          </Fragment>
                        );
                      }
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-4 py-2 border border-zinc-700 rounded-md ${
                            pagination.currentPage === page
                              ? 'bg-red-600 text-white'
                              : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}

                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.pages}
                    className="px-4 py-2 border border-zinc-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-800 text-zinc-300 bg-zinc-900"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
