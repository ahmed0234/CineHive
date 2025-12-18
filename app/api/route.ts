import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const apiKey = process.env.MOVIE_DB_API_KEY
  const res = await fetch(
    `https://api.themoviedb.org/3/person/${148012}/combined_credits?api_key=${apiKey}`
  )
  const data = await res.json()
  return NextResponse.json(data)
}
