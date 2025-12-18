import { Navbar } from '@/components/navbar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar, MapPin, Star, Award, TrendingUp } from 'lucide-react'
import Link from 'next/link'

// --- Types for TMDB Data ---
interface ActorDetails {
  id: number
  name: string
  biography: string
  profile_path: string
  birthday: string
  place_of_birth: string
  popularity: number
  known_for_department: string
}

interface MovieCredit {
  id: number
  title?: string
  name?: string
  poster_path: string
  release_date?: string
  first_air_date?: string
  vote_average: number
  popularity: number
  media_type: string // Added to distinguish between movie/tv
  character?: string // Added to ensure acting role
}

// --- Data Fetching ---
const fetchActorDetails = async (id: number): Promise<ActorDetails> => {
  const apikey = process.env.MOVIE_DB_API_KEY
  const res = await fetch(`https://api.themoviedb.org/3/person/${id}?api_key=${apikey}`)
  return res.json()
}

const fetchActorMovies = async (id: number): Promise<MovieCredit[]> => {
  const apikey = process.env.MOVIE_DB_API_KEY
  const res = await fetch(
    `https://api.themoviedb.org/3/person/${id}/combined_credits?api_key=${apikey}`
  )
  const data = await res.json()

  // LOGIC FIX: Filter for 'movie' media_type specifically
  return (data.cast || [])
    .filter(
      (m: MovieCredit) => m.poster_path && m.media_type === 'movie' // Only include movies, not TV shows or Crew roles
    )
    .sort((a: MovieCredit, b: MovieCredit) => b.popularity - a.popularity)
}

const ActorProfilePage = async ({ params }: { params: { id: string } }) => {
  const { id } = await params
  const actorId = parseInt(id)

  const [actor, movies] = await Promise.all([fetchActorDetails(actorId), fetchActorMovies(actorId)])

  const profileImageUrl = actor.profile_path
    ? `https://image.tmdb.org/t/p/h632${actor.profile_path}`
    : '/placeholder-actor.png'
  const posterBaseUrl = 'https://image.tmdb.org/t/p/w500'

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <Navbar />

      {/* Cinematic Hero Header */}
      <div className="relative h-[50vh] w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20 blur-xl scale-110"
          style={{ backgroundImage: `url(${profileImageUrl})` }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/60 to-transparent" />
      </div>

      {/* Main Content Container */}
      <div className="container mx-auto px-4 -mt-64 relative z-10">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Left: Profile Image Card */}
          <div className="w-full md:w-1/3 lg:w-1/4 group">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl border border-white/10 transition-transform duration-500 group-hover:scale-[1.02]">
              <img
                src={profileImageUrl}
                alt={actor.name}
                className="object-cover w-full h-auto aspect-[2/3]"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>

          {/* Right: Actor Info */}
          <div className="flex-1 space-y-6">
            <div className="space-y-2">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-linear-to-r from-white to-gray-500 bg-clip-text text-transparent">
                {actor.name}
              </h1>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground items-center">
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary hover:bg-primary/20"
                >
                  <Award className="w-3 h-3 mr-1" /> {actor.known_for_department}
                </Badge>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" /> {actor.birthday || 'N/A'}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> {actor.place_of_birth || 'Unknown'}
                </div>
                <div className="flex items-center gap-1 text-yellow-500">
                  <TrendingUp className="w-4 h-4" /> {actor.popularity?.toFixed(0)} Score
                </div>
              </div>
            </div>

            <div className="space-y-4 max-w-3xl">
              <h2 className="text-2xl font-semibold border-b border-white/10 pb-2">Biography</h2>
              <p className="text-muted-foreground leading-relaxed text-lg whitespace-pre-line">
                {actor.biography || `No biography available for ${actor.name}.`}
              </p>
            </div>
          </div>
        </div>

        {/* Cinematic Filmography Section */}
        <div className="mt-20 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Movies Filmography</h2>
            <div className="h-px flex-1 mx-8 bg-linear-to-r from-white/20 to-transparent hidden md:block" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {movies.slice(0, 18).map(movie => {
              const releaseDate = movie.release_date || movie.first_air_date
              const year = releaseDate ? new Date(releaseDate).getFullYear() : 'N/A'

              return (
                <Card
                  key={`${movie.id}-${movie.character}`}
                  className="bg-transparent border-none group cursor-pointer"
                >
                  <CardContent className="p-0 space-y-3">
                    <Link href={`/movie/${movie.id}`}>
                      <div className="relative overflow-hidden rounded-xl aspect-[2/3] shadow-lg transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.7)]">
                        <img
                          src={`${posterBaseUrl}${movie.poster_path}`}
                          alt={movie.title || movie.name}
                          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                          <div className="flex items-center gap-1 text-yellow-400 text-xs font-bold mb-1">
                            <Star className="w-3 h-3 fill-yellow-400" />
                            {movie.vote_average?.toFixed(1)}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-medium text-sm line-clamp-1 group-hover:text-primary transition-colors">
                          {movie.title || movie.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">{year}</p>
                      </div>
                    </Link>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ActorProfilePage
