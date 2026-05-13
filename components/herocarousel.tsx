'use client'

import type React from 'react'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Star, Calendar, Play, X, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface Movie {
  id: number
  title: string
  backdrop_path: string
  overview: string
  release_date: string
  vote_average: number
}

interface MovieHeroCarouselProps {
  movies: Movie[]
  autoplayInterval?: number
}

export function MovieHeroCarousel({ movies, autoplayInterval = 2500 }: MovieHeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
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

  // Navigate to next slide
  const goToNext = useCallback(() => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex(prev => (prev + 1) % movies.length)
    setTimeout(() => setIsTransitioning(false), 700)
  }, [movies.length, isTransitioning])

  // Navigate to previous slide
  const goToPrevious = useCallback(() => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex(prev => (prev - 1 + movies.length) % movies.length)
    setTimeout(() => setIsTransitioning(false), 700)
  }, [movies.length, isTransitioning])

  // Autoplay functionality
  useEffect(() => {
    if (!isHovered && !playingMovieId && movies.length > 1) {
      const interval = setInterval(goToNext, autoplayInterval)
      return () => clearInterval(interval)
    }
  }, [isHovered, autoplayInterval, goToNext, movies.length, playingMovieId])

  // Handle touch events for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      goToNext()
    }
    if (touchStart - touchEnd < -75) {
      goToPrevious()
    }
  }

  // Navigate to specific slide
  const goToSlide = (index: number) => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex(index)
    setTimeout(() => setIsTransitioning(false), 700)
  }

  if (!movies || movies.length === 0) {
    return null
  }

  const currentMovie = movies[currentIndex]
  const imageUrl = currentMovie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${currentMovie.backdrop_path}`
    : '/placeholder.svg?height=720&width=1280'

  const playingMovie = movies.find(m => m.id === playingMovieId)

  return (
    <div
      className="relative w-full h-[50vh] md:h-[65vh] lg:h-[75vh] overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Images with Cinematic Transitions */}
      <div className="absolute inset-0">
        {movies.map((movie, index) => {
          const isActive = index === currentIndex
          const isPrev = index === (currentIndex - 1 + movies.length) % movies.length

          return (
            <div
              key={movie.id}
              className={`absolute inset-0 transition-all duration-700 ease-out ${
                isActive
                  ? 'opacity-100 scale-100'
                  : isPrev
                  ? 'opacity-0 scale-105'
                  : 'opacity-0 scale-95'
              }`}
              style={{
                backgroundImage: `url(${
                  movie.backdrop_path
                    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
                    : '/placeholder.svg?height=720&width=1280'
                })`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {/* Multi-layer gradient overlays for depth and readability */}
              <div className="absolute inset-0 bg-linear-to-t from-black via-black/60 to-transparent" />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-black/40" />
              <div className="absolute inset-0 bg-black/20" />
            </div>
          )
        })}
      </div>

      {/* Content Container */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-end pb-12 md:pb-16 lg:pb-20">
        <div
          className={`w-full md:w-3/4 lg:w-2/3 transition-all duration-700 ease-out ${
            isTransitioning ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'
          }`}
        >
          {/* Movie Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-yellow-400 mb-4 md:mb-6 leading-tight tracking-tight text-balance drop-shadow-2xl">
            {currentMovie.title}
          </h1>

          {/* Movie Metadata */}
          <div className="flex flex-wrap items-center gap-4 md:gap-6 mb-4 md:mb-6 text-sm md:text-base">
            {currentMovie.release_date && (
              <div className="flex items-center gap-2 text-gray-200">
                <Calendar className="w-4 h-4 md:w-5 md:h-5" />
                <span className="font-medium">
                  {new Date(currentMovie.release_date).getFullYear()}
                </span>
              </div>
            )}
            {currentMovie.vote_average > 0 && (
              <div className="flex items-center gap-2 text-yellow-400">
                <Star className="w-4 h-4 md:w-5 md:h-5 fill-yellow-400" />
                <span className="font-bold text-lg">{currentMovie.vote_average.toFixed(1)}</span>
                <span className="text-gray-300 text-sm">/10</span>
              </div>
            )}
          </div>

          {/* Movie Overview */}
          {currentMovie.overview && (
            <p className="text-gray-100 text-sm md:text-base lg:text-lg leading-relaxed mb-6 md:mb-8 line-clamp-3 md:line-clamp-4 max-w-3xl text-pretty drop-shadow-lg">
              {currentMovie.overview}
            </p>
          )}

          {/* CTA Buttons */}
          {currentMovie.id && (
            <div className="flex flex-wrap items-center gap-4">
              <Link href={`/movie/${currentMovie.id}`}>
                <Button
                  size="lg"
                  className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-6 md:px-8 py-5 md:py-6 text-base md:text-lg shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-yellow-400/50 cursor-pointer"
                >
                  View Details
                </Button>
              </Link>
              <Button
                size="lg"
                onClick={() => {
                  setPlayingMovieId(currentMovie.id)
                  setIframeLoaded(false)
                }}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 font-bold px-6 md:px-8 py-5 md:py-6 text-base md:text-lg shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-white/20 cursor-pointer group flex items-center"
              >
                <Play className="w-5 h-5 mr-2 fill-current group-hover:text-yellow-400 transition-colors" />
                Play Now
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Arrows - Desktop Only */}
      <button
        onClick={goToPrevious}
        disabled={isTransitioning}
        className="hidden md:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 items-center justify-center w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed group"
        aria-label="Previous movie"
      >
        <ChevronLeft className="w-6 h-6 lg:w-7 lg:h-7 group-hover:-translate-x-0.5 transition-transform cursor-pointer" />
      </button>

      <button
        onClick={goToNext}
        disabled={isTransitioning}
        className="hidden md:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 items-center justify-center w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed group"
        aria-label="Next movie"
      >
        <ChevronRight className="w-6 h-6 lg:w-7 lg:h-7 group-hover:translate-x-0.5 transition-transform cursor-pointer" />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 md:gap-3">
        {movies.map((movie, index) => (
          <button
            key={movie.id}
            onClick={() => goToSlide(index)}
            disabled={isTransitioning}
            className={`transition-all duration-300 rounded-full disabled:cursor-not-allowed ${
              index === currentIndex
                ? 'w-8 md:w-10 h-2 md:h-2.5 bg-yellow-400 shadow-lg shadow-yellow-400/50'
                : 'w-2 md:w-2.5 h-2 md:h-2.5 bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to movie ${index + 1}`}
          />
        ))}
      </div>

      {/* Slide Counter - Desktop Only */}
      <div className="hidden md:block absolute top-6 right-6 lg:top-8 lg:right-8 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-medium">
        {currentIndex + 1} / {movies.length}
      </div>

      {/* Cinematic Movie Player Modal */}
      {playingMovie && (
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
                {playingMovie.title}
              </h2>
              {playingMovie.release_date && (
                <p className="text-gray-400 text-sm md:text-base mt-2 font-medium">
                  {new Date(playingMovie.release_date).getFullYear()} • Cinematic Experience
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
              src={`https://vaplayer.ru/embed/movie/${playingMovie.id}`}
              className="absolute inset-0 w-full h-full"
              allowFullScreen
              onLoad={() => setIframeLoaded(true)}
              style={{ opacity: iframeLoaded ? 1 : 0, transition: 'opacity 0.8s ease-in-out' }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
