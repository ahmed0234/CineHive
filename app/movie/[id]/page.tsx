import MovieDetailsPage from '@/components/movie_details'
import { Navbar } from '@/components/navbar'

const fetchMovieDetails = async (movieID: number) => {
  const apiKey = process.env.MOVIE_DB_API_KEY
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${movieID}?api_key=${apiKey}&append_to_response=credits,videos,images`
  )
  const data = await res.json()
  return data
}

const page = async ({ params }: any) => {
  const { id } = await params
  const movieDetails = await fetchMovieDetails(id)
  return (
    <div>
      <Navbar />
      <MovieDetailsPage movie={movieDetails} />
    </div>
  )
}

export default page
