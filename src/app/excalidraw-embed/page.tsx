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
    // Inject Excalidraw CSS — isolated layout strips root CSS imports
    const styleId = 'excalidraw-icon-fix'
    if (document.getElementById(styleId)) return
    const style = document.createElement('style')
    style.id = styleId
    style.textContent = `
      .excalidraw .ToolIcon__icon {
        width: 2rem !important;
        height: 2rem !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
      }
      .excalidraw .ToolIcon__icon svg {
        width: 1.25rem !important;
        height: 1.25rem !important;
        max-width: 1.25rem !important;
        max-height: 1.25rem !important;
      }
      .excalidraw .App-toolbar {
        height: auto !important;
        max-height: none !important;
      }
    `
    document.head.appendChild(style)
    return () => document.getElementById(styleId)?.remove()
  }, [])

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
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <Excalidraw
        excalidrawAPI={(api) => { apiRef.current = api }}
        gridModeEnabled={true}
        initialData={{
          elements: [],
          appState: {
            gridSize: 20,
            viewBackgroundColor: '#ffffff',
          }
        }}
        UIOptions={{
          canvasActions: {
            loadScene: false,
            export: false,
            saveToActiveFile: false,
          }
        }}
      />
    </div>
  )
}
