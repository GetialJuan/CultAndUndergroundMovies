import Image from 'next/image';
import Link from 'next/link';
import { Film, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect, useMemo } from 'react';

interface MovieListCardProps {
  title: string;
  description: string;
  count: number;
  image?: string | null;
  creator?: string;
  likes?: number;
  className?: string;
  id?: string;
}

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
  const [backgroundImage, setBackgroundImage] = useState<string>('');
  const [imageLoaded, setImageLoaded] = useState(false);
  const [useDefaultImage, setUseDefaultImage] = useState(!image);

  // Generar un color basado en el título para listas sin imagen
  const gradientColor = useMemo(() => {
    // Calcular un color basado en el texto del título
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

  // Determinar qué imagen mostrar
  useEffect(() => {
    if (!image) {
      // Si no hay imagen, asignar una imagen por defecto
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
      {/* Primero mostramos un fondo de carga */}
      <div className="absolute inset-0 bg-zinc-800" />

      {/* Imagen con Next.js Image como requieres */}
      {backgroundImage && (
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={backgroundImage}
            alt="" // Alt vacío para evitar texto alternativo visible
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={cn(
              'object-cover transition-all duration-500 group-hover:scale-105 brightness-75',
              !imageLoaded ? 'opacity-0' : 'opacity-100'
            )}
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              // En caso de error, asignar una imagen por defecto
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

      {/* Gradiente específico según si es imagen por defecto o de película */}
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-t',
          useDefaultImage
            ? gradientColor
            : 'from-black via-black/70 to-black/30'
        )}
      />

      {/* Panel de información con fondo semitransparente */}
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
