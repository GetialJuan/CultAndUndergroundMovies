/**
 * @fileoverview FilmGallery component for displaying a gallery of featured cult films.
 * This component renders a horizontal scrolling gallery of film cards, each displaying
 * a film's image, title, director, year, and genre. It uses Next.js Image for optimized
 * image loading and Lucide React icons for navigation.
 *
 * @component
 * @example
 * <FilmGallery />
 */

'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

/**
 * @typedef {Object} Film
 * @property {number} id - The unique ID of the film.
 * @property {string} title - The title of the film.
 * @property {string} director - The director of the film.
 * @property {number} year - The release year of the film.
 * @property {string} genre - The genre of the film.
 * @property {string} image - The URL of the film's image.
 */

/** @type {Film[]} */
const films = [
  {
    id: 1,
    title: 'Eraserhead',
    director: 'David Lynch',
    year: 1977,
    genre: 'Surrealist Horror',
    image: '/lading/1.jpg',
  },
  {
    id: 2,
    title: 'Donnie Darko',
    director: 'Richard Kelly',
    year: 2001,
    genre: 'Sci-Fi Thriller',
    image: '/lading/2.jpg',
  },
  {
    id: 3,
    title: 'El Topo',
    director: 'Alejandro Jodorowsky',
    year: 1970,
    genre: 'Acid Western',
    image: '/lading/3.jpg',
  },
  {
    id: 4,
    title: 'Videodrome',
    director: 'David Cronenberg',
    year: 1983,
    genre: 'Body Horror',
    image: '/lading/4.jpg',
  },
  {
    id: 5,
    title: 'Suspiria',
    director: 'Dario Argento',
    year: 1977,
    genre: 'Giallo Horror',
    image: '/lading/5.jpg',
  },
  {
    id: 6,
    title: 'Repo Man',
    director: 'Alex Cox',
    year: 1984,
    genre: 'Punk Sci-Fi',
    image: '/lading/6.jpg',
  },
  {
    id: 7,
    title: 'Tetsuo: The Iron Man',
    director: 'Shinya Tsukamoto',
    year: 1989,
    genre: 'Cyberpunk Horror',
    image: '/lading/7.jpg',
  },
  {
    id: 8,
    title: 'Holy Mountain',
    director: 'Alejandro Jodorowsky',
    year: 1973,
    genre: 'Surrealist Fantasy',
    image: '/lading/8.jpg',
  },
];

/**
 * FilmGallery component.
 *
 * @returns {JSX.Element} The rendered FilmGallery component.
 */
export function FilmGallery() {
  /** @type {React.RefObject<HTMLDivElement>} */
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  /**
   * Scrolls the film gallery to the left.
   */
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  /**
   * Scrolls the film gallery to the right.
   */
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <section id="films" className="py-16 bg-black/80">
      <div className="container px-4 md:px-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold tracking-tight">
            Featured Cult Films
          </h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={scrollLeft}
              className="rounded-full border-white/20 hover:bg-white/10"
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Scroll left</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={scrollRight}
              className="rounded-full border-white/20 hover:bg-white/10"
            >
              <ChevronRight className="h-5 w-5" />
              <span className="sr-only">Scroll right</span>
            </Button>
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto pb-6 gap-4 snap-x scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {films.map((film) => (
            <div
              key={film.id}
              className="min-w-[250px] md:min-w-[300px] snap-start group relative"
            >
              <div className="relative aspect-[2/2.8] overflow-hidden rounded-md">
                <Image
                  src={film.image}
                  alt={`${film.title} (${film.year}) dirigida por ${film.director}`}
                  fill
                  sizes="(max-width: 768px) 250px, 300px"
                  priority={film.id <= 4} // Load the first 4 images immediately
                  quality={85}
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <h3 className="text-xl font-bold">{film.title}</h3>
                  <p className="text-sm text-gray-300">
                    {film.director}, {film.year}
                  </p>
                  <span className="inline-block mt-2 px-2 py-1 text-xs bg-red-500/20 text-red-400 rounded-full">
                    {film.genre}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link href="/dashboard">
            <Button className="bg-red-500 hover:bg-red-600 text-white">
              Explore All Films
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}