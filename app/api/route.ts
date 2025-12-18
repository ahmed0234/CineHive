import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const apiKey = process.env.MOVIE_DB_API_KEY
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-US&page=1`
  )
  const data = await res.json()
  return NextResponse.json(data.results)
}
