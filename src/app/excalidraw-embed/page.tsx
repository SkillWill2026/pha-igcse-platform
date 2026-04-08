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
    const applyIconFix = () => {
      // Force inline style overrides on all ToolIcon elements
      document.querySelectorAll('.ToolIcon__icon').forEach(el => {
        (el as HTMLElement).style.cssText +=
          'width:2rem!important;height:2rem!important;display:flex!important;align-items:center!important;justify-content:center!important;'
        el.querySelectorAll('svg').forEach(svg => {
          (svg as SVGElement).style.cssText +=
            'width:1.25rem!important;height:1.25rem!important;max-width:1.25rem!important;max-height:1.25rem!important;'
        })
      })
    }

    // Apply immediately and after delays to catch Excalidraw's late render
    applyIconFix()
    const t1 = setTimeout(applyIconFix, 500)
    const t2 = setTimeout(applyIconFix, 1500)
    const t3 = setTimeout(applyIconFix, 3000)

    // MutationObserver to apply whenever new ToolIcon elements are added
    const observer = new MutationObserver(() => applyIconFix())
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3)
      observer.disconnect()
    }
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
