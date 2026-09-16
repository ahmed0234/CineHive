'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Play } from 'lucide-react'
import { MovieImage } from '@/components/movie-image'
import { MoviePlayerModal } from '@/components/movie-player-modal'

export function MovieCard({ movie }: { movie: any }) {
  const [isPlayModalOpen, setIsPlayModalOpen] = useState(false)

  return (
    <>
      <div className="group relative overflow-hidden rounded-xl bg-slate-900 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-yellow-500/20">
        <Link href={`/movie/${movie.id}`}>
          <div className="aspect-[2/3] w-full relative overflow-hidden bg-zinc-900">
            <MovieImage
              path={movie.poster_path}
              alt={movie.title}
              type="poster"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {movie.vote_average > 0 && (
              <div className="absolute top-2 right-2 rounded-md bg-black/70 px-2 py-1 text-xs font-bold text-yellow-500 backdrop-blur-md shadow-md">
                ★ {movie.vote_average.toFixed(1)}
              </div>
            )}

            {/* Play Button Overlay */}
            <button
              onClick={e => {
                e.preventDefault()
                e.stopPropagation()
                setIsPlayModalOpen(true)
              }}
              className="absolute inset-0 m-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-white opacity-0 backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-yellow-400 hover:text-black group-hover:opacity-100 shadow-[0_0_20px_rgba(0,0,0,0.5)] z-10 cursor-pointer"
              aria-label={`Play ${movie.title}`}
            >
              <Play className="h-7 w-7 fill-current ml-0.5" />
            </button>
          </div>

          <div className="p-4">
            <h3 className="line-clamp-1 text-lg font-semibold text-white group-hover:text-yellow-400 transition-colors">
              {movie.title}
            </h3>
            <p className="text-sm text-slate-400">{movie.release_date?.split('-')[0] || 'N/A'}</p>

            {movie.overview && (
              <p className="mt-2 line-clamp-2 text-xs text-slate-300 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                {movie.overview}
              </p>
            )}
          </div>
        </Link>
      </div>

      {/* Shared MoviePlayerModal - only mounts when open */}
      <MoviePlayerModal
        isOpen={isPlayModalOpen}
        onClose={() => setIsPlayModalOpen(false)}
        mediaId={movie.id}
        mediaType="movie"
        title={movie.title}
        releaseDate={movie.release_date}
        backdropPath={movie.backdrop_path}
      />
    </>
  )
}
