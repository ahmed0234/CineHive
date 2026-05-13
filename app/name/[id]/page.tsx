import { Navbar } from '@/components/navbar'
import Link from 'next/link'
import { MovieCard } from './MovieCard'

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
