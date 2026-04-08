'use client'
import dynamic from 'next/dynamic'
import { useEffect, useRef } from 'react'

const Excalidraw = dynamic(
  () => import('@excalidraw/excalidraw').then(m => m.Excalidraw),
  { ssr: false }
)

export default function ExcalidrawEmbedPage() {
  const apiRef = useRef<any>(null)

  useEffect(() => {
    const handler = async (event: MessageEvent) => {
      if (event.data?.type !== 'EXPORT_PNG') return
      if (!apiRef.current) return

      const { exportToBlob } = await import('@excalidraw/excalidraw')
      const blob = await exportToBlob({
        elements: apiRef.current.getSceneElements(),
        appState: {
          ...apiRef.current.getAppState(),
          exportBackground: true
        },
        files: apiRef.current.getFiles(),
        mimeType: 'image/png'
      })

      const reader = new FileReader()
      reader.onloadend = () => {
        window.parent.postMessage({
          type: 'EXPORT_RESULT',
          dataUrl: reader.result
        }, '*')
      }
      reader.readAsDataURL(blob)
    }

    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [])

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Excalidraw
        excalidrawAPI={(api) => { apiRef.current = api }}
        gridModeEnabled={true}
        initialData={{ appState: { gridSize: 20 } }}
      />
    </div>
  )
}
