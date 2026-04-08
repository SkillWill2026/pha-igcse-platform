'use client'
export default function ExcalidrawEmbedLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        html, body {
          overflow: hidden !important;
          height: 100% !important;
          max-height: 100vh !important;
          width: 100% !important;
        }
      `}} />
      {children}
    </>
  )
}
