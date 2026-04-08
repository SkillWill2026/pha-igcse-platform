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
    // Load Excalidraw's CSS from public folder
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = '/excalidraw.css'
    document.head.appendChild(link)

    const applyFixes = () => {
      // Fix ToolIcon elements
      document.querySelectorAll('.ToolIcon__icon').forEach(el => {
        const e = el as HTMLElement
        e.style.cssText += 'width:2rem!important;height:2rem!important;display:flex!important;align-items:center!important;justify-content:center!important;flex-shrink:0!important;'
        e.querySelectorAll('svg').forEach(svg => {
          const s = svg as SVGElement
          s.style.cssText += 'width:1.25rem!important;height:1.25rem!important;max-width:1.25rem!important;max-height:1.25rem!important;'
        })
      })
      // Fix toolbar container width
      document.querySelectorAll('.App-toolbar').forEach(el => {
        const e = el as HTMLElement
        e.style.cssText += 'width:auto!important;height:auto!important;min-width:0!important;'
      })
      // Fix layer-ui wrapper
      document.querySelectorAll('.layer-ui__wrapper').forEach(el => {
        const e = el as HTMLElement
        e.style.cssText += 'width:100%!important;height:100%!important;'
      })
    }

    // Apply immediately and after delays to catch Excalidraw's late render
    applyFixes()
    const t1 = setTimeout(applyFixes, 500)
    const t2 = setTimeout(applyFixes, 1500)
    const t3 = setTimeout(applyFixes, 3000)

    // MutationObserver to apply whenever new elements are added
    const observer = new MutationObserver(() => applyFixes())
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3)
      observer.disconnect()
      link.remove()
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
