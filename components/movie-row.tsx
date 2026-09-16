'use client'

import React, { useState, useRef, useMemo, useCallback } from 'react'
import { Star, ChevronLeft, ChevronRight, Calendar, Play } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { MovieImage } from '@/components/movie-image'
import { MoviePlayerModal } from '@/components/movie-player-modal'

export interface Movie {
  id: number
  title?: string
  name?: string
  poster_path?: string
  backdrop_path?: string
  overview?: string
  release_date?: string
  first_air_date?: string
  vote_average?: number
}

interface MovieRowProps {
  title: string
  movies: Movie[]
  className?: string
  mediaType?: 'movie' | 'tv'
}

export function MovieRow({ title, movies, className, mediaType = 'movie' }: MovieRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const isScrollingRef = useRef(false)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)
  const [playingMovieId, setPlayingMovieId] = useState<number | null>(null)

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

  // Throttled scroll handler using requestAnimationFrame to prevent layout thrashing
  const handleScroll = useCallback(() => {
    if (isScrollingRef.current) return
    isScrollingRef.current = true

    requestAnimationFrame(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
        setShowLeftArrow(scrollLeft > 10)
        setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10)
      }
      isScrollingRef.current = false
    })
  }, [])

  const playingMovie = useMemo(
    () => movies.find(m => m.id === playingMovieId),
    [movies, playingMovieId]
  )

  if (!movies || movies.length === 0) {
    return null
  }

  return (
    <section
      className={cn('relative group/section px-4', className)}
      style={{
        contentVisibility: 'auto',
        containIntrinsicSize: '1px 360px',
      }}
    >
      {/* Section Title */}
      <h2 className="text-sm sm:text-xl md:text-2xl font-bold mb-4 px-4 md:px-8 lg:px-12 font-bartel text-yellow-400">
        {title}
      </h2>

      {/* Scroll Container */}
      <div className="relative">
        {/* Left Arrow */}
        {showLeftArrow && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-0 bottom-0 z-20 w-12 md:w-16 bg-gradient-to-r from-background/95 to-transparent opacity-0 group-hover/section:opacity-100 transition-opacity duration-200 flex items-center justify-start pl-2 hover:from-background cursor-pointer"
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
            className="absolute right-0 top-0 bottom-0 z-20 w-12 md:w-16 bg-gradient-to-l from-background/95 to-transparent opacity-0 group-hover/section:opacity-100 transition-opacity duration-200 flex items-center justify-end pr-2 hover:from-background cursor-pointer"
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
            <MovieCard
              key={movie.id}
              movie={movie}
              mediaType={mediaType}
              onPlayClick={id => setPlayingMovieId(id)}
            />
          ))}
        </div>
      </div>

      {/* Shared Video Player Modal - only rendered when active */}
      <MoviePlayerModal
        isOpen={playingMovieId !== null}
        onClose={() => setPlayingMovieId(null)}
        mediaId={playingMovieId}
        mediaType={mediaType}
        title={playingMovie?.title || playingMovie?.name}
        releaseDate={playingMovie?.release_date || playingMovie?.first_air_date}
        backdropPath={playingMovie?.backdrop_path}
      />
    </section>
  )
}

/**
 * Optimized MovieCard:
 * - 0 React state hooks (pure CSS hover effects for zero re-renders)
 * - 2D GPU-accelerated transforms replace expensive preserve-3d layers
 * - Responsive TMDB image sizing (w185/w342) saves ~70% bandwidth
 * - Explicit aspect-ratio prevents layout shift (CLS = 0)
 */
function MovieCard({
  movie,
  onPlayClick,
  mediaType,
}: {
  movie: Movie
  onPlayClick: (id: number) => void
  mediaType: 'movie' | 'tv'
}) {
  const displayTitle = movie.title || movie.name || 'Unknown'
  const dateString = movie.release_date || movie.first_air_date
  const releaseYear = dateString ? new Date(dateString).getFullYear() : null
  const rating = movie.vote_average ? (movie.vote_average / 2).toFixed(1) : null

  return (
    <Link href={`/${mediaType}/${movie.id}`} className="block group/link select-none">
      <div className="group/card relative flex-none w-40 md:w-48 lg:w-56 snap-start">
        {/* Movie Poster Container */}
        <div
          className={cn(
            'relative rounded-lg overflow-hidden transition-all duration-300 ease-out cursor-pointer',
            'hover:scale-105 hover:-translate-y-2 hover:shadow-2xl hover:shadow-yellow-500/10',
            'active:scale-95'
          )}
        >
          {/* Poster Image Box */}
          <div className="relative aspect-[2/3] bg-zinc-900 overflow-hidden">
            <MovieImage
              path={movie.poster_path}
              alt={displayTitle}
              type="poster"
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover/card:scale-105"
            />

            {/* Subtle Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-tr from-yellow-500/20 via-transparent to-primary/10 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <div className="absolute inset-0 border-2 border-yellow-500/0 group-hover/card:border-yellow-500/40 rounded-lg transition-colors duration-300 pointer-events-none" />

            {/* Quick Info Badge (Mobile Only) */}
            <div className="md:hidden absolute top-2 right-2 bg-black/80 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1 shadow-md pointer-events-none">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              <span className="text-xs text-white font-semibold">{rating || 'N/A'}</span>
            </div>

            {/* Premium Play Button Badge */}
            <div
              role="button"
              tabIndex={0}
              onClick={e => {
                e.preventDefault()
                e.stopPropagation()
                onPlayClick(movie.id)
              }}
              className="absolute z-30 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover/card:opacity-100 transition-all duration-300 cursor-pointer"
              aria-label="Play Now"
            >
              <div className="w-12 h-12 md:w-14 md:h-14 bg-black/60 hover:bg-yellow-400 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:text-black transition-all duration-200 transform scale-90 group-hover/card:scale-100 shadow-[0_0_20px_rgba(0,0,0,0.6)] hover:shadow-[0_0_30px_rgba(250,204,21,0.6)]">
                <Play className="w-5 h-5 md:w-6 md:h-6 ml-0.5 fill-current transition-transform group-hover:scale-110" />
              </div>
            </div>
          </div>

          {/* Slide-up Desktop Overlay */}
          <div
            className={cn(
              'hidden md:block absolute bottom-0 inset-x-0 bg-gradient-to-t from-zinc-950 via-zinc-950/95 to-transparent p-4 pb-3',
              'translate-y-full group-hover/card:translate-y-0 transition-transform duration-300 ease-out',
              'border-t border-yellow-500/20'
            )}
          >
            <h3 className="font-bold text-foreground text-sm lg:text-base mb-1.5 line-clamp-2 leading-tight">
              {displayTitle}
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
            {displayTitle}
          </h3>
          {releaseYear && <p className="text-xs text-muted-foreground mt-0.5">{releaseYear}</p>}
        </div>
      </div>
    </Link>
  )
}
