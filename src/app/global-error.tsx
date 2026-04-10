'use client'

export default function GlobalError({ error }: { error: Error }) {
  fetch('/api/log-error', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: error.message,
      stack: error.stack,
      url: typeof window !== 'undefined' ? window.location.href : '',
    }),
  }).catch(() => {
    // Silently fail if logging fails
  })

  return (
    <html>
      <body>
        <h2>Something went wrong. Please refresh the page.</h2>
      </body>
    </html>
  )
}
