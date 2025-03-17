import Image from "next/image"
import Link from "next/link"
import { Film, Heart } from "lucide-react"

import { cn } from "@/lib/utils"

interface MovieListCardProps {
  title: string
  description: string
  count: number
  image: string
  creator?: string
  likes?: number
  className?: string
}

export default function MovieListCard({
  title,
  description,
  count,
  image,
  creator,
  likes,
  className,
}: MovieListCardProps) {
  return (
    <Link
      href={`/movie-lists/${title.toLowerCase().replace(/\s+/g, "-")}`}
      className={cn(
        "group relative flex h-64 flex-col overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 transition-all hover:border-red-500 hover:shadow-lg",
        className,
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />
      <Image
        src={image || "/placeholder.svg"}
        alt={title}
        width={600}
        height={400}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="relative mt-auto p-4">
        <div className="mb-1 flex items-center justify-between">
          <h3 className="text-lg font-medium group-hover:text-red-500">{title}</h3>
          {likes && (
            <div className="flex items-center gap-1 text-sm text-zinc-400">
              <Heart className="h-3.5 w-3.5" />
              <span>{likes}</span>
            </div>
          )}
        </div>
        <p className="mb-3 text-sm text-zinc-400">{description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-sm text-zinc-500">
            <Film className="h-3.5 w-3.5" />
            <span>{count} films</span>
          </div>
          {creator && (
            <div className="text-xs text-zinc-500">
              by <span className="text-zinc-400">{creator}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

