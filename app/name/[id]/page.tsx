import { Navbar } from '@/components/navbar'
import Link from 'next/link'

const searchMovie = async (query: string) => {
  const apikey = process.env.MOVIE_DB_API_KEY

  if (!query || query === 'undefined') return null

  const res = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${apikey}&query=${encodeURIComponent(query)}`
  )
  if (!res.ok) return null
  const data = await res.json()

  return data.results.filter((movie: any) => movie.poster_path !== null)
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const movies = await searchMovie(id)

  return (
    <main className="min-h-screen bg-black">
      {/* RENDER NAVBAR ONCE AT THE TOP */}
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {!movies || movies.length === 0 ? (
          <div className="flex h-64 items-center justify-center text-white">
            <p className="text-xl">No movies with posters found for "{decodeURIComponent(id)}"</p>
          </div>
        ) : (
          <>
            <h1 className="mb-8 text-3xl font-bold text-yellow-500 capitalize">
              Results for: {decodeURIComponent(id)}
            </h1>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {movies.map((movie: any) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  )
}

// MovieCard now only handles the individual card UI
function MovieCard({ movie }: { movie: any }) {
  const posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`

  return (
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
  )
}
