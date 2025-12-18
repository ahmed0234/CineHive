import Footer from '@/components/footer'
import { MovieHeroCarousel } from '@/components/herocarousel'
import { MovieRow } from '@/components/movie-row'
import { Navbar } from '@/components/navbar'

const fetchMovies = async () => {
  const apiKey = process.env.MOVIE_DB_API_KEY
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-US&page=1`
  )
  const data = await res.json()
  return data.results
}

const UpcomingMovies = async () => {
  const apiKey = process.env.MOVIE_DB_API_KEY
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}&language=en-US&page=1`
  )
  const data = await res.json()
  return data.results
}

const popularMovies = async () => {
  const apiKey = process.env.MOVIE_DB_API_KEY
  const res = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&page=1`)
  const data = await res.json()
  return data.results
}

const scififantasies = async () => {
  const apiKey = process.env.MOVIE_DB_API_KEY
  const res = await fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=878,14&sort_by=popularity.desc&page=1`
  )
  const data = await res.json()
  return data.results
}

const romanceDrama = async () => {
  const apiKey = process.env.MOVIE_DB_API_KEY
  const res = await fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=10749,18&sort_by=popularity.desc&page=1`
  )
  const data = await res.json()
  return data.results
}

const popularSeasons = async () => {
  const apiKey = process.env.MOVIE_DB_API_KEY
  const res = await fetch(`https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}`)
  const data = await res.json()
  return data.results
}

const horror = async () => {
  const apiKey = process.env.MOVIE_DB_API_KEY
  const res = await fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=27,53&sort_by=popularity.desc&page=1`
  )
  const data = await res.json()
  return data.results
}

const page = async () => {
  const [
    movies,
    upcomingMovies,
    popularMoviesData,
    scififantasy,
    romanceanddrama,
    horrorMovies,
    seasons,
  ] = await Promise.all([
    fetchMovies(),
    UpcomingMovies(),
    popularMovies(),
    scififantasies(),
    romanceDrama(),
    horror(),
    popularSeasons(),
  ])
  return (
    <div className="">
      <Navbar />
      <MovieHeroCarousel movies={movies} />
      <div className="mt-4">
        <MovieRow title="🔥 Upcoming & New" movies={upcomingMovies} />
        <MovieRow title="🎭 Popular & Trending" movies={popularMoviesData} />
        <MovieRow title="🚀 Sci-Fi & Fantasy" movies={scififantasy} />
        <MovieRow title="❤️ Romance & Drama" movies={romanceanddrama} />
        <MovieRow title="👻 Horror & Thriller" movies={horrorMovies} />
        <MovieRow title="📺 TV Shows & Seasons" movies={seasons} />
      </div>
      <Footer />
    </div>
  )
}

export default page
