import { Navbar } from '@/components/navbar'
import Footer from '@/components/footer'
import TVShowClient from './TVShowClient'

async function getTVShow(id: string) {
  const apiKey = process.env.MOVIE_DB_API_KEY
  const res = await fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}`, {
    next: { revalidate: 60 * 60 }
  })
  if (!res.ok) return null
  return res.json()
}

export default async function TVShowPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const show = await getTVShow(id)

  if (!show) {
    return (
      <main className="min-h-screen bg-black">
        <Navbar />
        <div className="flex h-[70vh] items-center justify-center text-white">
          <p className="text-xl font-medium text-zinc-400">TV Show not found or an error occurred.</p>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="bg-black text-white">
      <Navbar />
      <TVShowClient show={show} />
      <Footer />
    </main>
  )
}
