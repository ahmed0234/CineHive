'use client'

import { useState, useRef, useEffect } from 'react'
import { Star, ChevronLeft, ChevronRight, Calendar, Play, X, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

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
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)
  const [playingMovieId, setPlayingMovieId] = useState<number | null>(null)
  const [iframeLoaded, setIframeLoaded] = useState(false)

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (playingMovieId) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [playingMovieId])

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
      <h2 className="text-sm sm:text-xl md:text-2xl font-bold mb-4 px-4 md:px-8 lg:px-12 font-bartel text-yellow-400">
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
            <MovieCard 
              key={movie.id} 
              movie={movie} 
              mediaType={mediaType}
              onPlayClick={(id) => {
                setPlayingMovieId(id)
                setIframeLoaded(false)
              }} 
            />
          ))}
        </div>
      </div>

      {/* Cinematic Movie Player Modal */}
      {playingMovieId && (() => {
        const playingMovie = movies.find(m => m.id === playingMovieId)
        if (!playingMovie) return null
        
        return (
          <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center animate-in fade-in duration-500">
            {/* Cinematic Backdrop */}
            <div 
              className="absolute inset-0 bg-black/95"
              onClick={() => setPlayingMovieId(null)}
            >
              {/* Blurred background image of the movie */}
              <div 
                className="absolute inset-0 opacity-20 blur-3xl saturate-150"
                style={{
                  backgroundImage: `url(${playingMovie.backdrop_path ? `https://image.tmdb.org/t/p/original${playingMovie.backdrop_path}` : ''})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              {/* Gradient overlay for blending */}
              <div className="absolute inset-0 bg-linear-to-t from-black via-black/80 to-transparent" />
            </div>
            
            {/* Top Bar with Title and Close Button */}
            <div className="absolute top-0 left-0 w-full p-6 md:p-8 flex items-start justify-between z-50">
              <div className="animate-in slide-in-from-top-10 duration-700 delay-300 fill-mode-both max-w-3xl">
                <h2 className="text-2xl md:text-4xl font-bold text-white drop-shadow-lg">
                  {playingMovie.title || playingMovie.name}
                </h2>
                {(playingMovie.release_date || playingMovie.first_air_date) && (
                  <p className="text-gray-400 text-sm md:text-base mt-2 font-medium">
                    {new Date((playingMovie.release_date || playingMovie.first_air_date)!).getFullYear()} • Cinematic Experience
                  </p>
                )}
              </div>
              <button
                onClick={() => setPlayingMovieId(null)}
                className="p-3 bg-white/5 hover:bg-white/20 rounded-full text-white/70 hover:text-white transition-all backdrop-blur-xl border border-white/10 hover:scale-110 hover:rotate-90 duration-300 group shadow-2xl cursor-pointer"
                aria-label="Close player"
              >
                <X className="w-6 h-6 md:w-8 md:h-8" />
              </button>
            </div>
            
            {/* Modal Container */}
            <div className="relative w-[95%] max-w-7xl aspect-video mx-auto shadow-[0_0_100px_rgba(0,0,0,0.9)] rounded-2xl overflow-hidden animate-in zoom-in-95 duration-500 delay-100 fill-mode-both border border-white/10 bg-black/80 group mt-16 md:mt-8">
              
              {/* Ambient Lighting / Glow Effect behind iframe */}
              <div className="absolute inset-0 bg-linear-to-tr from-yellow-500/5 via-transparent to-blue-500/5 pointer-events-none" />
              
              {/* Loading State */}
              {!iframeLoaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-40 backdrop-blur-xl transition-opacity duration-500">
                  <Loader2 className="w-12 h-12 text-yellow-400 animate-spin mb-6 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
                  <p className="text-yellow-400/90 font-medium animate-pulse tracking-[0.2em] text-sm md:text-base uppercase">
                    Loading Cinematic Experience...
                  </p>
                </div>
              )}
              
              {/* Player Iframe */}
              <iframe
                src={`https://vaplayer.ru/embed/${mediaType}/${playingMovie.id}`}
                className="absolute inset-0 w-full h-full"
                allowFullScreen
                onLoad={() => setIframeLoaded(true)}
                style={{ opacity: iframeLoaded ? 1 : 0, transition: 'opacity 0.8s ease-in-out' }}
              />
            </div>
          </div>
        )
      })()}
    </section>
  )
}

function MovieCard({ movie, onPlayClick, mediaType }: { movie: Movie; onPlayClick: (id: number) => void; mediaType: 'movie' | 'tv' }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const displayTitle = movie.title || movie.name || 'Unknown'
  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : `/placeholder.svg?height=450&width=300&query=${encodeURIComponent(
        displayTitle + ' poster'
      )}`

  const dateString = movie.release_date || movie.first_air_date
  const releaseYear = dateString ? new Date(dateString).getFullYear() : null

  const rating = movie.vote_average ? (movie.vote_average / 2).toFixed(1) : null

  return (
    <Link href={`/${mediaType}/${movie.id}`} className="block group/link">
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
              alt={displayTitle}
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

            {/* Cinematic Hover Overlay (Visual Only) */}
            <div className="absolute inset-0 z-20 bg-black/20 backdrop-blur-[2px] opacity-0 group-hover/card:opacity-100 transition-all duration-500 pointer-events-none" />

            {/* Premium Play Button Badge */}
            <div 
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onPlayClick(movie.id)
              }}
              className="absolute z-30 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover/card:opacity-100 transition-all duration-500 cursor-pointer"
              aria-label="Play Now"
            >
              <div className="w-12 h-12 md:w-14 md:h-14 bg-black/50 hover:bg-yellow-400 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-white hover:text-black transition-all duration-300 transform scale-75 group-hover/card:scale-100 shadow-[0_0_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(250,204,21,0.6)] group/play">
                <Play className="w-5 h-5 md:w-6 md:h-6 ml-1 fill-current transition-transform group-hover/play:scale-110" />
              </div>
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
