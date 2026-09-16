'use client'

import React, { useState, useEffect } from 'react'
import { X, Loader2 } from 'lucide-react'

export interface MoviePlayerModalProps {
  isOpen: boolean
  onClose: () => void
  mediaId: number | null
  mediaType?: 'movie' | 'tv'
  title?: string
  releaseDate?: string
  backdropPath?: string
}

export function MoviePlayerModal({
  isOpen,
  onClose,
  mediaId,
  mediaType = 'movie',
  title,
  releaseDate,
  backdropPath,
}: MoviePlayerModalProps) {
  const [iframeLoaded, setIframeLoaded] = useState(false)

  // Reset iframeLoaded state whenever mediaId changes
  useEffect(() => {
    if (isOpen) {
      setIframeLoaded(false)
    }
  }, [isOpen, mediaId])

  // Scroll lock and Escape key listener
  useEffect(() => {
    if (!isOpen) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen || !mediaId) return null

  const year = releaseDate ? new Date(releaseDate).getFullYear() : null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title ? `${title} Video Player` : 'Video Player'}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center animate-in fade-in duration-300"
    >
      {/* Cinematic Backdrop */}
      <div className="absolute inset-0 bg-black/95" onClick={onClose}>
        {backdropPath && (
          <div
            className="absolute inset-0 opacity-20 blur-2xl saturate-150 pointer-events-none"
            style={{
              backgroundImage: `url(https://image.tmdb.org/t/p/w780${backdropPath})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
      </div>

      {/* Top Bar with Title and Close Button */}
      <div className="absolute top-0 left-0 w-full p-6 md:p-8 flex items-start justify-between z-50 pointer-events-none">
        <div className="max-w-3xl pointer-events-auto">
          {title && (
            <h2 className="text-2xl md:text-4xl font-bold text-white drop-shadow-lg">{title}</h2>
          )}
          {year && (
            <p className="text-gray-400 text-sm md:text-base mt-2 font-medium">
              {year} • Cinematic Experience
            </p>
          )}
        </div>
        <button
          onClick={onClose}
          className="pointer-events-auto p-3 bg-white/10 hover:bg-white/20 rounded-full text-white/80 hover:text-white transition-all backdrop-blur-md border border-white/10 hover:scale-110 duration-200 shadow-2xl cursor-pointer"
          aria-label="Close player"
        >
          <X className="w-6 h-6 md:w-8 md:h-8" />
        </button>
      </div>

      {/* Modal Container */}
      <div className="relative w-[95%] max-w-7xl aspect-video mx-auto shadow-[0_0_80px_rgba(0,0,0,0.9)] rounded-2xl overflow-hidden border border-white/10 bg-black/90 mt-16 md:mt-8">
        {/* Loading State */}
        {!iframeLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-40 transition-opacity duration-300">
            <Loader2 className="w-10 h-10 text-yellow-400 animate-spin mb-4" />
            <p className="text-yellow-400/90 font-medium tracking-widest text-sm uppercase">
              Loading Cinematic Experience...
            </p>
          </div>
        )}

        {/* Player Iframe */}
        <iframe
          src={`https://vaplayer.ru/embed/${mediaType}/${mediaId}`}
          className="absolute inset-0 w-full h-full"
          allowFullScreen
          onLoad={() => setIframeLoaded(true)}
          style={{
            opacity: iframeLoaded ? 1 : 0,
            transition: 'opacity 0.4s ease-in-out',
          }}
        />
      </div>
    </div>
  )
}
