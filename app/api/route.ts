import { NextResponse } from "next/server";

export async function GET() {
  const key = process.env.MOVIE_DB_API_KEY;
  const data = await fetch(
    `https://api.themoviedb.org/3/trending/movie/day?api_key=${key}`,
  );
  const guess = await data.json();
  return NextResponse.json(guess.results);
}
