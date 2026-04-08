export default function ExcalidrawEmbedLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" style={{ margin: 0, padding: 0, overflow: 'hidden', height: '100%', width: '100%' }}>
      <head>
        <style>{`
          * { box-sizing: border-box; }
          html, body { overflow: hidden !important; max-height: 100vh !important; }
        `}</style>
      </head>
      <body style={{ margin: 0, padding: 0, overflow: 'hidden', height: '100vh', width: '100vw', maxHeight: '100vh', maxWidth: '100vw' }}>
        {children}
      </body>
    </html>
  )
}
