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
        .ToolIcon__icon {
          width: 2rem !important;
          height: 2rem !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }
        .ToolIcon__icon svg {
          width: 1.25rem !important;
          height: 1.25rem !important;
        }
      `}} />
      {children}
    </>
  )
}
