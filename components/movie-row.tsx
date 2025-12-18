'use client'

import { useState, useRef } from 'react'
import { Star, ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export interface Movie {
  id: number
  title: string
  poster_path?: string
  backdrop_path?: string
  overview?: string
  release_date?: string
  vote_average?: number
}

interface MovieRowProps {
  title: string
  movies: Movie[]
  className?: string
}

export function MovieRow({ title, movies, className }: MovieRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return

    const scrollAmount = scrollRef.current.offsetWidth * 0.8
    const newScrollLeft =
      scrollRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount)

    scrollRef.current.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth',
    })
  }

  const handleScroll = () => {
    if (!scrollRef.current) return

    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    setShowLeftArrow(scrollLeft > 10)
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10)
  }

  if (!movies || movies.length === 0) {
    return null
  }

  return (
    <section className={cn('relative group/section px-4', className)}>
      {/* Section Title */}
      <h2 className="text-xl md:text-2xl font-bold mb-4 px-4 md:px-8 lg:px-12 text-foreground">
        {title}
      </h2>

      {/* Scroll Container */}
      <div className="relative">
        {/* Left Arrow */}
        {showLeftArrow && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-0 bottom-0 z-20 w-12 md:w-16 bg-gradient-to-r from-background/95 to-transparent opacity-0 group-hover/section:opacity-100 transition-opacity duration-300 flex items-center justify-start pl-2 hover:from-background"
            aria-label="Scroll left"
          >
            <div className="w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center hover:scale-110 hover:bg-background transition-all duration-200 shadow-lg">
              <ChevronLeft className="w-6 h-6" />
            </div>
          </button>
        )}

        {/* Right Arrow */}
        {showRightArrow && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-0 bottom-0 z-20 w-12 md:w-16 bg-gradient-to-l from-background/95 to-transparent opacity-0 group-hover/section:opacity-100 transition-opacity duration-300 flex items-center justify-end pr-2 hover:from-background"
            aria-label="Scroll right"
          >
            <div className="w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center hover:scale-110 hover:bg-background transition-all duration-200 shadow-lg">
              <ChevronRight className="w-6 h-6" />
            </div>
          </button>
        )}

        {/* Movie Cards Container */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide px-4 md:px-8 lg:px-12 pb-6 snap-x snap-mandatory scroll-smooth"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {movies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </section>
  )
}

function MovieCard({ movie }: { movie: Movie }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : `/placeholder.svg?height=450&width=300&query=${encodeURIComponent(
        movie.title + ' movie poster'
      )}`

  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : null

  const rating = movie.vote_average ? (movie.vote_average / 2).toFixed(1) : null

  return (
    <Link href={`/movie/${movie.id}`}>
      <div
        className="group/card relative flex-none w-40 md:w-48 lg:w-56 snap-start"
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Movie Poster Container */}
        <div
          className={cn(
            'relative rounded-lg overflow-hidden transition-all duration-300 ease-out cursor-pointer',
            'hover:scale-105 hover:z-10 hover:shadow-2xl hover:shadow-accent/20',
            'active:scale-95',
            'md:hover:scale-110 md:hover:-translate-y-3',
            isExpanded && 'md:scale-110 md:-translate-y-3'
          )}
          style={{
            perspective: '1000px',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Poster Image */}
          <div
            className={cn(
              'relative aspect-[2/3] bg-muted transition-all duration-500',
              'md:group-hover/card:[transform:rotateY(5deg)_rotateX(-3deg)_translateZ(10px)]'
            )}
          >
            <img
              src={imageUrl || '/placeholder.svg'}
              alt={movie.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />

            <div className="absolute inset-0 bg-gradient-to-tr from-accent/30 via-transparent to-primary/20 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />

            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-accent/60 via-accent/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />

            <div className="absolute inset-0 border-2 border-accent/0 group-hover/card:border-accent/50 rounded-lg transition-all duration-500" />

            {/* Quick Info Badge (Mobile) */}
            <div className="md:hidden absolute top-2 right-2 bg-black/80 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              <span className="text-xs text-white font-semibold">{rating || 'N/A'}</span>
            </div>
          </div>

          <div
            className={cn(
              'hidden md:block absolute bottom-0 inset-x-0 bg-gradient-to-t from-background/95 via-background/90 to-transparent backdrop-blur-md p-4 pb-3',
              'translate-y-full group-hover/card:translate-y-0 transition-transform duration-500 ease-out',
              'border-t border-accent/30'
            )}
          >
            <h3 className="font-bold text-foreground text-sm lg:text-base mb-2 line-clamp-2 leading-tight">
              {movie.title}
            </h3>

            <div className="flex items-center gap-3 text-xs">
              {releaseYear && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  <span>{releaseYear}</span>
                </div>
              )}
              {rating && (
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  <span className="font-semibold text-foreground">{rating}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Title Below Poster (Always Visible) */}
        <div className="mt-2 px-1">
          <h3 className="font-semibold text-sm text-foreground line-clamp-2 leading-tight">
            {movie.title}
          </h3>
          {releaseYear && <p className="text-xs text-muted-foreground mt-0.5">{releaseYear}</p>}
        </div>
      </div>
    </Link>
  )
}
