// app/actions.ts
'use server'

import { redirect } from 'next/navigation'

export async function searchMovies(formData: FormData) {
  const query = formData.get('movieName')

  if (!query || typeof query !== 'string') return

  // Perform any server-side logic here (e.g., logging)
  // Then redirect to your dynamic route
  redirect(`/name/${encodeURIComponent(query)}`)
}
