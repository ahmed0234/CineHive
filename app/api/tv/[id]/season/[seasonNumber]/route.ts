import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string; seasonNumber: string }> }
) {
  const { id, seasonNumber } = await params
  const apiKey = process.env.MOVIE_DB_API_KEY
  
  if (!apiKey) return NextResponse.json({ error: 'No API Key' }, { status: 500 })

  const res = await fetch(`https://api.themoviedb.org/3/tv/${id}/season/${seasonNumber}?api_key=${apiKey}`)
  
  if (!res.ok) return NextResponse.json({ error: 'Failed to fetch' }, { status: res.status })
  
  const data = await res.json()
  return NextResponse.json(data)
}
