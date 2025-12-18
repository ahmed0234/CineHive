'use client'

import React, { useRef, useState } from 'react'

import {
  Star,
  Clock,
  Calendar,
  Play,
  DollarSign,
  Building2,
  Globe,
  ChevronRight,
  ChevronLeft,
  X,
  Clapperboard,
  PenTool,
  Camera,
} from 'lucide-react'

import Link from 'next/link'

// --- 1. UPDATED TYPES ---

interface CastMember {
  id: number

  name: string

  character: string

  profile_path: string | null
}

interface CrewMember {
  id: number

  name: string

  job: string

  profile_path: string | null
}

interface MovieData {
  title: string

  tagline: string

  overview: string

  backdrop_path: string

  poster_path: string

  release_date: string

  runtime: number

  vote_average: number

  genres: { id: number; name: string }[]

  budget: number

  revenue: number

  status: string

  production_companies: { name: string; logo_path: string | null }[]

  credits: { cast: CastMember[] }

  videos: { results: { key: string; site: string; type: string }[] }
}

const CrewCard = ({ person }: { person: CrewMember }) => (
  <div className="group flex-shrink-0 w-36 md:w-44 bg-zinc-900/50 rounded-xl overflow-hidden border border-zinc-800 hover:border-yellow-500/50 transition-all duration-300 snap-start">
    <div className="h-48 overflow-hidden bg-zinc-800">
      <img
        src={
          person.profile_path
            ? `https://image.tmdb.org/t/p/w300${person.profile_path}`
            : 'https://via.placeholder.com/300x450?text=No+Photo'
        }
        alt={person.name}
        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
      />
    </div>

    <div className="p-3">
      <p className="font-bold text-sm text-white truncate">{person.name}</p>

      <p className="text-xs text-yellow-500/80 font-medium">{person.job}</p>
    </div>
  </div>
)

interface CrewSectionProps {
  title: string

  icon: React.ReactNode

  data: CrewMember[]

  scrollRef: React.RefObject<HTMLDivElement>

  onScroll: (ref: React.RefObject<HTMLDivElement>, dir: 'left' | 'right') => void
}

const CrewSection = ({ title, icon, data, scrollRef, onScroll }: CrewSectionProps) => {
  if (data.length === 0) return null

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-500">{icon}</div>

          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        </div>

        {data.length > 4 && (
          <div className="flex gap-2">
            <button
              onClick={() => onScroll(scrollRef, 'left')}
              className="p-2 rounded-full border border-zinc-800 hover:bg-zinc-800 hover:text-yellow-500 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={() => onScroll(scrollRef, 'right')}
              className="p-2 rounded-full border border-zinc-800 hover:bg-zinc-800 hover:text-yellow-500 transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      <div
        ref={scrollRef}
        className="flex overflow-x-auto gap-5 pb-4 no-scrollbar scroll-smooth snap-x"
      >
        {data.map((person, idx) => (
          <CrewCard key={`${person.id}-${idx}`} person={person} />
        ))}
      </div>
    </section>
  )
}

const MovieDetailsPage = ({ movie }: { movie: MovieData }) => {
  const trailer =
    movie?.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube') ||
    movie?.videos?.results?.[0] // Fallback to the first video if no 'Trailer' type is found

  const [isModalOpen, setIsModalOpen] = useState(false)

  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current

      const scrollTo =
        direction === 'left' ? scrollLeft - clientWidth * 0.7 : scrollLeft + clientWidth * 0.7

      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' })
    }
  }

  // Filter logic

  const directors = movie.credits.crew.filter(c => c.job === 'Director')

  const writers = movie.credits.crew.filter(c => ['Writer', 'Screenplay', 'Author'].includes(c.job))

  const producers = movie.credits.crew

    .filter(c => ['Producer', 'Executive Producer'].includes(c.job))

    .slice(0, 10)

  // Refs for scrolling

  const scrollRefDirectors = useRef<HTMLDivElement>(null)

  const scrollRefWriters = useRef<HTMLDivElement>(null)

  const scrollRefProducers = useRef<HTMLDivElement>(null)

  const handleScroll = (ref: React.RefObject<HTMLDivElement>, direction: 'left' | 'right') => {
    if (ref.current) {
      const { scrollLeft, clientWidth } = ref.current

      const offset = direction === 'left' ? -clientWidth * 0.6 : clientWidth * 0.6

      ref.current.scrollTo({ left: scrollLeft + offset, behavior: 'smooth' })
    }
  }

  // Format currency

  const formatCurrency = (num: number) =>
    num > 0
      ? new Intl.NumberFormat('en-US', {
          style: 'currency',

          currency: 'USD',

          maximumFractionDigits: 0,
        }).format(num)
      : 'N/A'

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-yellow-400 selection:text-black">
      {/* 1. HERO SECTION */}

      <section className="relative w-full h-[70vh] lg:h-[85vh] flex items-end overflow-hidden">
        {/* Backdrop Image */}

        <div className="absolute inset-0 z-0">
          <img
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt={movie.title}
            className="w-full h-full object-cover"
          />

          {/* Cinematic Gradients */}

          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />

          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-transparent to-transparent" />
        </div>

        {/* Hero Content */}

        <div className="container mx-auto px-6 pb-12 z-10 relative">
          <div className="max-w-4xl space-y-4">
            {movie.tagline && (
              <span className="text-yellow-500 font-medium tracking-widest uppercase text-sm">
                {movie.tagline}
              </span>
            )}

            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white">
              {movie.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-sm md:text-base text-zinc-300">
              <div className="flex items-center gap-1 text-yellow-400 font-bold">
                <Star className="w-5 h-5 fill-current" />

                <span>{movie.vote_average.toFixed(1)}</span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />

                {new Date(movie.release_date).getFullYear()}
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {movie.runtime} min
              </div>

              <div className="flex gap-2">
                {movie.genres.slice(0, 3).map(g => (
                  <span
                    key={g.id}
                    className="px-3 py-1 bg-zinc-800/80 rounded-full border border-zinc-700 text-xs"
                  >
                    {g.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 flex gap-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black px-6 md:px-8 py-3 rounded-md font-bold transition-all transform active:scale-95"
              >
                <Play className="w-5 h-5 fill-current" /> Watch Trailer
              </button>
            </div>
          </div>
        </div>
      </section>

      {isModalOpen && trailer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10">
          {/* Overlay */}

          <div
            className="absolute inset-0 bg-black/90 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setIsModalOpen(false)}
          />

          {/* Modal Content */}

          <div className="relative w-full max-w-5xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl ring-1 ring-zinc-800 animate-in zoom-in-95 duration-300">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-zinc-900/50 hover:bg-yellow-500 hover:text-black rounded-full transition-all"
            >
              <X className="w-6 h-6" />
            </button>

            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* 2. TRAILER SECTION */}

      {trailer && (
        <section className="container mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold mb-8 border-l-4 border-yellow-500 pl-4">
            Official Trailer
          </h2>

          <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl ring-1 ring-zinc-800">
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${trailer.key}`}
              title="Movie Trailer"
              allowFullScreen
            />
          </div>
        </section>
      )}

      {/* 3. CAST SECTION */}

      {/* 3. CAST SECTION */}

      <section className="container mx-auto px-6 py-16 ">
        <div className="flex items-center justify-between mb-8 ">
          <h2 className="text-2xl font-bold border-l-4 border-yellow-500 pl-4">Top Billed Cast</h2>

          {/* Navigation Buttons */}

          <div className="hidden md:flex gap-2">
            <button
              onClick={() => scroll('left')}
              className="p-2 rounded-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:text-yellow-500 transition-colors shadow-lg group"
              aria-label="Scroll Left"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={() => scroll('right')}
              className="p-2 rounded-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:text-yellow-500 transition-colors shadow-lg group"
              aria-label="Scroll Right"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Scroll Container */}

        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-6 pb-8 no-scrollbar scroll-smooth snap-x snap-mandatory cursor-pointer"
        >
          {movie.credits.cast.slice(0, 15).map(person => (
            <div
              key={person.id}
              className="group shrink-0 w-40 md:w-48 bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 hover:border-yellow-500/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(234,179,8,0.1)] snap-start "
            >
              <Link href={`/actor/${person.id}`}>
                <div className="h-56 overflow-hidden">
                  <img
                    src={
                      person.profile_path
                        ? `https://image.tmdb.org/t/p/w300${person.profile_path}`
                        : 'https://via.placeholder.com/300x450?text=No+Image'
                    }
                    alt={person.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                <div className="p-4">
                  <p className="font-bold text-sm text-white truncate">{person.name}</p>

                  <p className="text-xs text-zinc-400 truncate">{person.character}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <div className="container mx-auto px-6 py-12">
        <CrewSection
          title="Directors"
          icon={<Camera className="w-5 h-5" />}
          data={directors}
          scrollRef={scrollRefDirectors}
          onScroll={handleScroll}
        />

        <CrewSection
          title="Writers"
          icon={<PenTool className="w-5 h-5" />}
          data={writers}
          scrollRef={scrollRefWriters}
          onScroll={handleScroll}
        />

        <CrewSection
          title="Producers"
          icon={<Clapperboard className="w-5 h-5" />}
          data={producers}
          scrollRef={scrollRefProducers}
          onScroll={handleScroll}
        />
      </div>

      {/* 4. DETAILS SECTION */}

      <section className="container mx-auto px-6 py-16 grid lg:grid-cols-3 gap-12 border-t border-zinc-900">
        {/* Synopsis */}

        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-3xl font-bold">Storyline</h2>

          <p className="text-lg text-zinc-400 leading-relaxed italic">{movie.overview}</p>

          {/* 4. DETAILS SECTION - Production Companies Sub-section */}

          <div className="pt-8">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-yellow-500" />
              Production Houses
            </h3>

            <div className="flex flex-wrap gap-4">
              {movie.production_companies.map(company => {
                // Determine if it has a logo or needs a text badge

                const hasLogo = company.logo_path !== null

                return (
                  <a
                    key={company.name}
                    href={`https://www.google.com/search?q=${encodeURIComponent(
                      company.name + ' official website'
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex items-center gap-3 px-4 py-3 bg-zinc-900/80 border border-zinc-800 rounded-xl hover:border-yellow-500/50 hover:bg-zinc-800 transition-all duration-300 shadow-sm hover:shadow-[0_0_15px_rgba(234,179,8,0.1)]"
                  >
                    {hasLogo ? (
                      <div className="h-8 w-12 flex items-center justify-center overflow-hidden">
                        <img
                          src={`https://image.tmdb.org/t/p/w200${company.logo_path}`}
                          alt={company.name}
                          className="max-h-full max-w-full object-contain brightness-0 invert group-hover:brightness-100 group-hover:invert-0 transition-all duration-500"
                        />
                      </div>
                    ) : (
                      <div className="h-8 w-8 rounded-md bg-yellow-500/10 flex items-center justify-center text-yellow-500 font-bold text-xs border border-yellow-500/20">
                        {company.name.charAt(0)}
                      </div>
                    )}

                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-zinc-300 group-hover:text-yellow-500 transition-colors">
                        {company.name}
                      </span>

                      <span className="text-[10px] text-zinc-500 uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">
                        Visit Website →
                      </span>
                    </div>
                  </a>
                )
              })}
            </div>
          </div>
        </div>

        {/* Sidebar Info */}

        <div className="bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800 space-y-6 h-fit">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-500">
              <Building2 className="w-5 h-5" />
            </div>

            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-widest">Status</p>

              <p className="font-medium">{movie.status}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-500">
              <DollarSign className="w-5 h-5" />
            </div>

            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-widest">Budget</p>

              <p className="font-medium">{formatCurrency(movie.budget)}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-500">
              <Globe className="w-5 h-5" />
            </div>

            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-widest">Revenue</p>

              <p className="font-medium">{formatCurrency(movie.revenue)}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Branding */}

      <footer className="py-12 text-center text-zinc-600 text-sm">
        <p>Data provided by The Movie Database (TMDb)</p>
      </footer>

      {/* Custom Styles for horizontal scroll */}

      <style>{`

        .no-scrollbar::-webkit-scrollbar { display: none; }

        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

      `}</style>
    </div>
  )
}

export default MovieDetailsPage
