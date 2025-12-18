import { MovieHeroCarousel } from '@/components/herocarousel'
import { MovieRow } from '@/components/movie-row'
import { Navbar } from '@/components/navbar'
import next from 'next'

const fetchMovies = async () => {
  const apiKey = process.env.MOVIE_DB_API_KEY
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-US&page=1`,
    { next: { revalidate: 60 * 60 * 12 } }
  )
  const data = await res.json()
  return data.results
}

const page = async () => {
  const movies = await fetchMovies()
  return (
    <div className="">
      <Navbar />
      <MovieHeroCarousel movies={movies} />
      <MovieRow title="Upcoming Movies" movies={movies} />
    </div>
  )
}

export default page
