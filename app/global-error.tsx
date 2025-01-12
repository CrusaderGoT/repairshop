'use client' // Error boundaries must be Client Components
 
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    // global-error must include html and body tags
    <html>
      <body>
        <h2>Something went wrong! <br />{error.message}</h2>
        <button type="button" onClick={() => reset()}>Try again</button>
      </body>
    </html>
  )
}