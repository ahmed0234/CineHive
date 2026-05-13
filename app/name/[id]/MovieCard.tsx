'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Play, X } from 'lucide-react'

export function MovieCard({ movie }: { movie: any }) {
  const posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`
  const [isPlayModalOpen, setIsPlayModalOpen] = useState(false)
  const [iframeLoaded, setIframeLoaded] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsPlayModalOpen(false)
      }
    }

    if (isPlayModalOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isPlayModalOpen])

  return (
    <>
      <div className="group relative overflow-hidden rounded-xl bg-slate-900 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-yellow-500/20">
        <Link href={`/movie/${movie.id}`}>
          <div className="aspect-2/3 w-full relative overflow-hidden">
            <img
              src={posterUrl}
              alt={movie.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />

            <div className="absolute top-2 right-2 rounded-md bg-black/70 px-2 py-1 text-xs font-bold text-yellow-500 backdrop-blur-md">
              ★ {movie.vote_average?.toFixed(1)}
            </div>
            
            {/* Play Button Overlay */}
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setIsPlayModalOpen(true)
              }}
              className="absolute inset-0 m-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-white opacity-0 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white/30 group-hover:opacity-100 shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] z-10"
            >
              <Play className="h-8 w-8 fill-current" />
            </button>
          </div>

          <div className="p-4">
            <h3 className="line-clamp-1 text-lg font-semibold text-white">{movie.title}</h3>
            <p className="text-sm text-slate-400">{movie.release_date?.split('-')[0] || 'N/A'}</p>

            <p className="mt-2 line-clamp-2 text-xs text-slate-300 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              {movie.overview}
            </p>
          </div>
        </Link>
      </div>

      {/* Play Now Modal */}
      {isPlayModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-0 md:p-6 lg:p-10">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/95 backdrop-blur-md animate-in fade-in duration-500"
            onClick={() => setIsPlayModalOpen(false)}
          />

          {/* Modal Container */}
          <div className="relative w-full h-full md:h-auto md:max-w-7xl md:aspect-video bg-zinc-950 md:rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] ring-1 ring-white/10 animate-in zoom-in-95 fade-in duration-500">
            {/* Header/Close button */}
            <div className="absolute top-0 left-0 right-0 p-4 md:p-6 flex justify-end z-20 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
              <button
                onClick={() => setIsPlayModalOpen(false)}
                className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-95 pointer-events-auto shadow-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Loading State */}
            {!iframeLoaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950 z-10">
                <div className="w-16 h-16 border-4 border-zinc-800 border-t-white rounded-full animate-spin mb-4" />
                <p className="text-zinc-400 font-medium animate-pulse">Loading cinematic experience...</p>
              </div>
            )}

            {/* Video Player */}
            <iframe
              src={`https://vaplayer.ru/embed/movie/${movie.id}`}
              className="absolute inset-0 w-full h-full"
              allowFullScreen
              onLoad={() => setIframeLoaded(true)}
              style={{ opacity: iframeLoaded ? 1 : 0, transition: 'opacity 0.8s ease-in-out' }}
            />
          </div>
        </div>
      )}
    </>
  )
}
