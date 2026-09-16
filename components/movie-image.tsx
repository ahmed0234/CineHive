import React from 'react'

// Lightweight inline SVG placeholder data URIs to avoid any external network requests
export const POSTER_PLACEHOLDER =
  'data:image/svg+xml;charset=utf-8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="450" viewBox="0 0 300 450" fill="%2318181b">' +
      '<rect width="300" height="450" fill="%2318181b"/>' +
      '<path d="M110 200h80v50h-80z" fill="%2327272a"/>' +
      '<circle cx="130" cy="180" r="15" fill="%233f3f46"/>' +
      '<text x="150" y="270" font-family="sans-serif" font-size="14" fill="%2371717a" text-anchor="middle">No Poster</text>' +
      '</svg>'
  )

export const BACKDROP_PLACEHOLDER =
  'data:image/svg+xml;charset=utf-8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720" fill="%2309090b">' +
      '<rect width="1280" height="720" fill="%2309090b"/>' +
      '<text x="640" y="370" font-family="sans-serif" font-size="24" fill="%233f3f46" text-anchor="middle">No Backdrop</text>' +
      '</svg>'
  )

export const PROFILE_PLACEHOLDER =
  'data:image/svg+xml;charset=utf-8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="450" viewBox="0 0 300 450" fill="%2318181b">' +
      '<rect width="300" height="450" fill="%2318181b"/>' +
      '<circle cx="150" cy="170" r="45" fill="%2327272a"/>' +
      '<path d="M90 290c0-40 30-60 60-60s60 20 60 60" fill="%2327272a"/>' +
      '<text x="150" y="320" font-family="sans-serif" font-size="14" fill="%2371717a" text-anchor="middle">No Photo</text>' +
      '</svg>'
  )

export interface MovieImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  path?: string | null
  alt: string
  type?: 'poster' | 'backdrop' | 'profile' | 'still'
  priority?: boolean
  className?: string
  sizes?: string
}

/**
 * High-performance standard <img> component for TMDB media.
 * - Generates responsive srcSet across TMDB CDN edge sizes
 * - Strictly sets loading="eager" & fetchPriority="high" for priority items (LCP)
 * - Uses native loading="lazy" and decoding="async" for offscreen items
 * - Zero external placeholder network calls (uses inline SVG)
 * - Preserves aspect ratio for zero Cumulative Layout Shift (CLS)
 */
export function MovieImage({
  path,
  alt,
  type = 'poster',
  priority = false,
  className = '',
  sizes,
  ...rest
}: MovieImageProps) {
  if (!path) {
    const fallback =
      type === 'backdrop'
        ? BACKDROP_PLACEHOLDER
        : type === 'profile'
        ? PROFILE_PLACEHOLDER
        : POSTER_PLACEHOLDER

    return (
      <img
        src={fallback}
        alt={alt}
        className={className}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        {...rest}
      />
    )
  }

  const base = 'https://image.tmdb.org/t/p'
  let src = ''
  let srcSet = ''
  let defaultSizes = ''

  switch (type) {
    case 'backdrop':
      // Backdrops: w780, w1280 (much smaller than 'original' but crystal clear for 1080p/mobile)
      src = `${base}/w1280${path}`
      srcSet = `${base}/w780${path} 780w, ${base}/w1280${path} 1280w`
      defaultSizes = sizes || '100vw'
      break

    case 'profile':
      src = `${base}/w185${path}`
      srcSet = `${base}/w185${path} 185w, ${base}/h632${path} 300w`
      defaultSizes = sizes || '(max-width: 768px) 150px, 200px'
      break

    case 'still':
      src = `${base}/w500${path}`
      srcSet = `${base}/w300${path} 300w, ${base}/w500${path} 500w`
      defaultSizes = sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
      break

    case 'poster':
    default:
      // Movie Posters: cards are rendered at 160px - 224px.
      // w185 and w342 cover 1x and 2x DPR efficiently without the overhead of w500.
      src = `${base}/w342${path}`
      srcSet = `${base}/w185${path} 185w, ${base}/w342${path} 342w, ${base}/w500${path} 500w`
      defaultSizes = sizes || '(max-width: 640px) 160px, (max-width: 1024px) 192px, 224px'
      break
  }

  return (
    <img
      src={src}
      srcSet={srcSet}
      sizes={defaultSizes}
      alt={alt}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
      {...rest}
    />
  )
}
