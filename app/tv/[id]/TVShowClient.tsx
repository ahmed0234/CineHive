'use client'

import React, { useState, useEffect } from 'react'
import { Star, Calendar, Play, X, Loader2 } from 'lucide-react'

export default function TVShowClient({ show }: { show: any }) {
  // Try to default to Season 1, or the first available season if Season 1 doesn't exist
  const defaultSeason = show.seasons?.find((s: any) => s.season_number > 0)?.season_number || 1
  const [selectedSeason, setSelectedSeason] = useState<number>(defaultSeason)
  const [episodes, setEpisodes] = useState<any[]>([])
  const [loadingEpisodes, setLoadingEpisodes] = useState(false)
  
  // Player state
  const [playingEpisode, setPlayingEpisode] = useState<any>(null)
  const [iframeLoaded, setIframeLoaded] = useState(false)

  useEffect(() => {
    const fetchEpisodes = async () => {
      setLoadingEpisodes(true)
      try {
        const res = await fetch(`/api/tv/${show.id}/season/${selectedSeason}`)
        if (res.ok) {
          const data = await res.json()
          setEpisodes(data.episodes || [])
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoadingEpisodes(false)
      }
    }
    fetchEpisodes()
  }, [show.id, selectedSeason])

  // Scroll lock and Escape key for Modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPlayingEpisode(null)
    }

    if (playingEpisode) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [playingEpisode])

  const validSeasons = show.seasons?.filter((s: any) => s.season_number > 0) || []

  return (
    <div className="min-h-screen bg-black pb-20 font-sans">
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] lg:h-[70vh] flex items-end overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={`https://image.tmdb.org/t/p/original${show.backdrop_path || show.poster_path}`}
            alt={show.name}
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
        </div>

        <div className="container mx-auto px-4 md:px-8 pb-12 z-10 relative">
          <div className="max-w-4xl space-y-5">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white drop-shadow-xl">
              {show.name}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm md:text-base text-zinc-300">
              {show.vote_average > 0 && (
                <div className="flex items-center gap-1 text-yellow-400 font-bold bg-yellow-400/10 px-3 py-1 rounded-md border border-yellow-400/20">
                  <Star className="w-5 h-5 fill-current" />
                  <span>{show.vote_average.toFixed(1)}</span>
                </div>
              )}
              {show.first_air_date && (
                <div className="flex items-center gap-2 font-medium">
                  <Calendar className="w-4 h-4 text-zinc-400" />
                  {new Date(show.first_air_date).getFullYear()}
                </div>
              )}
              <div className="flex gap-2 flex-wrap">
                {show.genres?.slice(0, 3).map((g: any) => (
                  <span
                    key={g.id}
                    className="px-3 py-1 bg-white/10 rounded-full border border-white/10 text-xs font-semibold tracking-wide"
                  >
                    {g.name}
                  </span>
                ))}
              </div>
            </div>

            <p className="text-lg text-zinc-300 line-clamp-3 leading-relaxed max-w-3xl drop-shadow-md">
              {show.overview}
            </p>
          </div>
        </div>
      </section>

      {/* Episodes Section */}
      <section className="container mx-auto px-4 md:px-8 py-16">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-white/5 pb-8">
          <h2 className="text-3xl font-bold text-white flex items-center gap-4">
            <span className="w-2 h-8 bg-yellow-500 rounded-full inline-block shadow-[0_0_15px_rgba(234,179,8,0.6)]"></span>
            Episodes
          </h2>

          <div className="relative">
            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(Number(e.target.value))}
              className="appearance-none bg-zinc-900 border border-white/10 text-white pl-6 pr-14 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 text-lg font-medium cursor-pointer shadow-xl hover:bg-zinc-800 transition-colors"
            >
              {validSeasons.map((season: any) => (
                <option key={season.id} value={season.season_number}>
                  {season.name} ({season.episode_count} Episodes)
                </option>
              ))}
            </select>
            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
              ▼
            </div>
          </div>
        </div>

        {loadingEpisodes ? (
          <div className="flex flex-col justify-center items-center h-64 space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-yellow-500" />
            <p className="text-zinc-400 font-medium animate-pulse tracking-wider uppercase text-sm">Loading Episodes...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {episodes.map((episode: any) => (
              <div 
                key={episode.id} 
                className="group relative bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden hover:border-yellow-500/30 hover:shadow-2xl hover:shadow-yellow-500/10 transition-all duration-300 transform hover:-translate-y-1.5"
              >
                {/* Episode Thumbnail */}
                <div className="relative aspect-video bg-zinc-800 overflow-hidden">
                  <img
                    src={
                      episode.still_path
                        ? `https://image.tmdb.org/t/p/w500${episode.still_path}`
                        : `https://image.tmdb.org/t/p/w500${show.backdrop_path || show.poster_path}`
                    }
                    alt={episode.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/90 via-transparent to-transparent opacity-100 group-hover:opacity-0 transition-opacity duration-300" />
                  
                  {/* Episode Number Badge */}
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-md text-sm font-bold text-white border border-white/10 shadow-lg">
                    S{selectedSeason} E{episode.episode_number}
                  </div>

                  {/* Play Button Overlay */}
                  <button
                    onClick={() => {
                      setPlayingEpisode(episode)
                      setIframeLoaded(false)
                    }}
                    className="absolute inset-0 m-auto flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500/90 text-black opacity-0 shadow-[0_0_30px_rgba(234,179,8,0.5)] backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-yellow-400 group-hover:opacity-100 z-10"
                  >
                    <Play className="h-8 w-8 fill-current ml-1" />
                  </button>
                </div>

                {/* Episode Info */}
                <div className="p-5">
                  <h3 className="font-bold text-lg text-white mb-2 line-clamp-1 group-hover:text-yellow-400 transition-colors">
                    {episode.name}
                  </h3>
                  <div className="flex items-center text-xs text-zinc-400 mb-3 font-medium">
                    {episode.air_date ? new Date(episode.air_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Unknown Date'}
                    {episode.runtime && <span className="mx-2 text-zinc-600">•</span>}
                    {episode.runtime && <span>{episode.runtime} min</span>}
                  </div>
                  <p className="text-sm text-zinc-500 line-clamp-3 leading-relaxed">
                    {episode.overview || 'No overview available for this episode.'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Cinematic Play Modal */}
      {playingEpisode && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-0 md:p-6 lg:p-10 animate-in fade-in duration-500">
          {/* Cinematic Backdrop */}
          <div 
            className="absolute inset-0 bg-black/95 backdrop-blur-2xl"
            onClick={() => setPlayingEpisode(null)}
          />
            
          {/* Top Bar with Title and Close Button */}
          <div className="absolute top-0 left-0 w-full p-4 md:p-8 flex items-start justify-between z-50 pointer-events-none">
            <div className="animate-in slide-in-from-top-10 duration-700 delay-300 max-w-3xl pointer-events-auto">
              <h2 className="text-xl md:text-3xl font-bold text-white drop-shadow-2xl leading-tight">
                <span className="text-yellow-500 mr-3 border-r border-white/20 pr-3">S{selectedSeason} E{playingEpisode.episode_number}</span>
                {playingEpisode.name}
              </h2>
              <p className="text-zinc-400 text-sm md:text-base mt-2 font-medium">
                {show.name} • Cinematic Experience
              </p>
            </div>
            <button
              onClick={() => setPlayingEpisode(null)}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white/90 hover:text-white transition-all backdrop-blur-xl border border-white/10 hover:scale-110 duration-300 shadow-2xl pointer-events-auto"
            >
              <X className="w-6 h-6 md:w-8 md:h-8" />
            </button>
          </div>
            
          {/* Modal Container */}
          <div className="relative w-full h-full md:h-auto md:max-w-7xl md:aspect-video bg-black shadow-[0_0_100px_rgba(0,0,0,0.9)] md:rounded-2xl overflow-hidden animate-in zoom-in-95 duration-500 delay-100 border border-white/10 mt-16 md:mt-0">
              
            {/* Loading State */}
            {!iframeLoaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-40 backdrop-blur-xl">
                <Loader2 className="w-12 h-12 text-yellow-500 animate-spin mb-6 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
                <p className="text-yellow-500 font-medium animate-pulse tracking-[0.2em] text-sm uppercase">
                  Loading Episode...
                </p>
              </div>
            )}
              
            {/* Player Iframe */}
            <iframe
              src={`https://vaplayer.ru/embed/tv/${show.id}/${selectedSeason}/${playingEpisode.episode_number}`}
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
