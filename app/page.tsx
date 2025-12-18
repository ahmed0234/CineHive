import { MovieHeroCarousel } from '@/components/herocarousel'
import { Navbar } from '@/components/navbar'

const fetchMovies = async () => {
  const apiKey = process.env.MOVIE_DB_API_KEY
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-US&page=1`
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
    </div>
  )
}

export default page
