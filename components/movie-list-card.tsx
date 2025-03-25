/**
 * @fileoverview MovieListCard component for displaying movie list information.
 * This component renders a card that displays a movie list's title, description,
 * count of films, creator, likes, and an optional image. It handles loading and
 * displaying the image, including fallback to default images when necessary.
 *
 * @component
 * @example
 * <MovieListCard
 * title="My Favorite Movies"
 * description="A collection of my all-time favorite films."
 * count={10}
 * image="/path/to/image.jpg"
 * creator="John Doe"
 * likes={15}
 * id="123"
 * />
 */

import Image from 'next/image';
import Link from 'next/link';
import { Film, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect, useMemo } from 'react';

/**
 * @typedef {Object} MovieListCardProps
 * @property {string} title - The title of the movie list.
 * @property {string} description - A brief description of the movie list.
 * @property {number} count - The number of films in the list.
 * @property {string|null|undefined} [image] - The URL of the movie list's image.
 * @property {string} [creator] - The creator of the movie list.
 * @property {number} [likes] - The number of likes the movie list has received.
 * @property {string} [className] - Additional CSS classes for styling.
 * @property {string} [id] - The unique ID of the movie list.
 */

/**
 * MovieListCard component.
 *
 * @param {MovieListCardProps} props - The component props.
 * @returns {JSX.Element} The rendered MovieListCard component.
 */
export default function MovieListCard({
  title,
  description,
  count,
  image,
  creator,
  likes,
  className,
  id,
}: MovieListCardProps) {
  /** @type {[string, React.Dispatch<React.SetStateAction<string>>]} */
  const [backgroundImage, setBackgroundImage] = useState<string>('');
  /** @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]} */
  const [imageLoaded, setImageLoaded] = useState(false);
  /** @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]} */
  const [useDefaultImage, setUseDefaultImage] = useState(!image);

  /**
   * Generates a gradient color based on the title for lists without an image.
   *
   * @type {string}
   */
  const gradientColor = useMemo(() => {
    // Calculate a color based on the title text
    const hash = title
      .split('')
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);

    const colors = [
      'from-blue-900/90 via-black/60 to-transparent',
      'from-red-900/90 via-black/60 to-transparent',
      'from-purple-900/90 via-black/60 to-transparent',
      'from-amber-900/90 via-black/60 to-transparent',
      'from-emerald-900/90 via-black/60 to-transparent',
    ];

    return colors[hash % colors.length];
  }, [title]);

  /**
   * Effect to determine which image to display.
   */
  useEffect(() => {
    if (!image) {
      // If no image, assign a default image
      const defaultImage = `/images/default-list-background-${
        Math.floor(Math.random() * 5) + 1
      }.jpg`;
      setBackgroundImage(defaultImage);
      setUseDefaultImage(true);
    } else {
      setBackgroundImage(image);
      setUseDefaultImage(false);
    }
  }, [image]);

  return (
    <Link
      href={`/dashboard/movie-lists/${id}`}
      className={cn(
        'group relative flex h-64 flex-col overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 transition-all hover:border-red-500 hover:shadow-lg',
        className
      )}
    >
      {/* Loading background */}
      <div className="absolute inset-0 bg-zinc-800" />

      {/* Image with Next.js Image */}
      {backgroundImage && (
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={backgroundImage}
            alt="" // Empty alt to avoid visible alternative text
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={cn(
              'object-cover transition-all duration-500 group-hover:scale-105 brightness-75',
              !imageLoaded ? 'opacity-0' : 'opacity-100'
            )}
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              // On error, assign a default image
              const defaultImage = `/images/default-list-background-${
                Math.floor(Math.random() * 5) + 1
              }.jpg`;
              setBackgroundImage(defaultImage);
              setUseDefaultImage(true);
            }}
            priority={false}
          />
        </div>
      )}

      {/* Gradient based on default or movie image */}
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-t',
          useDefaultImage
            ? gradientColor
            : 'from-black via-black/70 to-black/30'
        )}
      />

      {/* Information panel with semi-transparent background */}
      <div className="relative mt-auto w-full p-4 bg-black/50 backdrop-blur-sm">
        <div className="mb-1 flex items-center justify-between">
          <h3 className="text-lg font-medium text-white group-hover:text-red-400 transition-colors">
            {title}
          </h3>
          {likes && (
            <div className="flex items-center gap-1 text-sm text-zinc-300">
              <Heart className="h-3.5 w-3.5" />
              <span>{likes}</span>
            </div>
          )}
        </div>
        <p className="mb-3 text-sm text-zinc-300 line-clamp-2">{description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-sm text-zinc-400">
            <Film className="h-3.5 w-3.5" />
            <span>
              {count} {count === 1 ? 'film' : 'films'}
            </span>
          </div>
          {creator && (
            <div className="text-xs text-zinc-400">
              by <span className="text-zinc-300">{creator}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}