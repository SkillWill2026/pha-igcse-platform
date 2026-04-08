'use client'
import dynamic from 'next/dynamic'
import { useEffect } from 'react'

const Excalidraw = dynamic(
  () => import('@excalidraw/excalidraw').then(m => m.Excalidraw),
  { ssr: false }
)

export default function ExcalidrawEmbed() {
  let api: any = null

  useEffect(() => {
    window.addEventListener('message', async (event) => {
      if (event.data.type !== 'EXPORT_PNG' || !api) return
      const { exportToBlob } = await import('@excalidraw/excalidraw')
      const blob = await exportToBlob({
        elements: api.getSceneElements(),
        appState: { ...api.getAppState(), exportBackground: true },
        files: api.getFiles(),
        mimeType: 'image/png'
      })
      const reader = new FileReader()
      reader.onload = () => {
        window.parent.postMessage({ type: 'EXPORT_RESULT', dataUrl: reader.result }, '*')
      }
      reader.readAsDataURL(blob)
    })
  }, [])

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Excalidraw
        excalidrawAPI={(a) => { api = a }}
        gridModeEnabled={true}
        initialData={{ appState: { gridSize: 20 } }}
      />
    </div>
  )
}
