'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface GraphModalProps {
  isOpen: boolean
  onClose: () => void
  onSaved: (savedImage: { image_url: string; display_url: string | null; image_id: string; storage_path: string; image_type: string }) => void
  questionId: string
  imageType: 'question' | 'answer'
  prefillText?: string
}

export default function GraphModal({
  isOpen,
  onClose,
  onSaved,
  questionId,
  imageType,
  prefillText = '',
}: GraphModalProps) {
  const [activeTab, setActiveTab] = useState<'plotter' | 'desmos'>('plotter')
  const [expression, setExpression] = useState('')
  const [xMin, setXMin] = useState(-10)
  const [xMax, setXMax] = useState(10)
  const [plotterError, setPlotterError] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [saveSuccess, setSaveSuccess] = useState(false)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const desmosRef = useRef<HTMLDivElement>(null)
  const desmosCalculatorRef = useRef<any>(null)
  const desmosScriptLoadedRef = useRef(false)

  // Initialize expression from prefillText
  useEffect(() => {
    if (!prefillText) {
      setExpression('')
      return
    }

    // Try to extract "y = ..." or "f(x) = ..."
    const yMatch = prefillText.match(/y\s*=\s*([^,\n]+)/i)
    const fxMatch = prefillText.match(/f\s*\(\s*x\s*\)\s*=\s*([^,\n]+)/i)

    if (yMatch) {
      setExpression(yMatch[1].trim())
    } else if (fxMatch) {
      setExpression(fxMatch[1].trim())
    } else {
      // Use first 80 chars
      setExpression(prefillText.slice(0, 80))
    }
  }, [prefillText, isOpen])

  // Render Function Plotter graph
  const renderPlotter = useCallback(async () => {
    if (!canvasRef.current || !expression.trim()) {
      setPlotterError('')
      return
    }

    try {
      const { compile } = await import('mathjs')
      setPlotterError('')

      // Strip "y =" or similar from expression
      let expr = expression.trim()
      const eqMatch = expr.match(/^[^=]*=\s*(.+)/)
      if (eqMatch) {
        expr = eqMatch[1]
      }

      const compiled = compile(expr)
      const points: { x: number; y: number }[] = []

      // Evaluate at 500 points
      const step = (xMax - xMin) / 500
      for (let x = xMin; x <= xMax; x += step) {
        try {
          const y = compiled.evaluate({ x })
          if (typeof y === 'number' && isFinite(y)) {
            points.push({ x, y })
          }
        } catch {
          // Skip points that cause errors
        }
      }

      if (points.length === 0) {
        setPlotterError('No valid points to plot')
        return
      }

      // Calculate y range with 10% padding
      const yValues = points.map((p) => p.y)
      let yMin = Math.min(...yValues)
      let yMax = Math.max(...yValues)

      // Avoid zero range
      if (yMin === yMax) {
        yMin -= 5
        yMax += 5
      }

      const yPadding = (yMax - yMin) * 0.1
      yMin -= yPadding
      yMax += yPadding

      // Draw on canvas
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')!
      const w = canvas.width
      const h = canvas.height

      // White background
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, w, h)

      // Padding
      const pad = 50
      const graphW = w - 2 * pad
      const graphH = h - 2 * pad

      // Grid lines
      ctx.strokeStyle = '#e5e7eb'
      ctx.lineWidth = 1

      // Vertical grid
      const xStep = (xMax - xMin) / 10
      for (let x = Math.ceil(xMin / xStep) * xStep; x <= xMax; x += xStep) {
        const px = pad + ((x - xMin) / (xMax - xMin)) * graphW
        ctx.beginPath()
        ctx.moveTo(px, pad)
        ctx.lineTo(px, pad + graphH)
        ctx.stroke()
      }

      // Horizontal grid
      const yStep = (yMax - yMin) / 10
      for (let y = Math.ceil(yMin / yStep) * yStep; y <= yMax; y += yStep) {
        const py = pad + ((yMax - y) / (yMax - yMin)) * graphH
        ctx.beginPath()
        ctx.moveTo(pad, py)
        ctx.lineTo(pad + graphW, py)
        ctx.stroke()
      }

      // Axes
      ctx.strokeStyle = '#4b5563'
      ctx.lineWidth = 2

      // X axis
      const xAxisY = pad + ((yMax - 0) / (yMax - yMin)) * graphH
      ctx.beginPath()
      ctx.moveTo(pad, xAxisY)
      ctx.lineTo(pad + graphW, xAxisY)
      ctx.stroke()

      // X axis arrow
      ctx.beginPath()
      ctx.moveTo(pad + graphW - 10, xAxisY - 5)
      ctx.lineTo(pad + graphW, xAxisY)
      ctx.lineTo(pad + graphW - 10, xAxisY + 5)
      ctx.stroke()

      // Y axis
      const yAxisX = pad + ((0 - xMin) / (xMax - xMin)) * graphW
      ctx.beginPath()
      ctx.moveTo(yAxisX, pad)
      ctx.lineTo(yAxisX, pad + graphH)
      ctx.stroke()

      // Y axis arrow
      ctx.beginPath()
      ctx.moveTo(yAxisX - 5, pad + 10)
      ctx.lineTo(yAxisX, pad)
      ctx.lineTo(yAxisX + 5, pad + 10)
      ctx.stroke()

      // Axis labels
      ctx.fillStyle = '#4b5563'
      ctx.font = '14px monospace'
      ctx.fillText('x', pad + graphW - 20, xAxisY + 20)
      ctx.fillText('y', yAxisX + 10, pad + 15)

      // Axis tick labels
      ctx.font = '12px monospace'
      ctx.fillStyle = '#6b7280'

      // X ticks
      for (let x = Math.ceil(xMin / xStep) * xStep; x <= xMax; x += xStep) {
        const px = pad + ((x - xMin) / (xMax - xMin)) * graphW
        ctx.fillText(x.toFixed(0), px - 12, xAxisY + 18)
      }

      // Y ticks
      for (let y = Math.ceil(yMin / yStep) * yStep; y <= yMax; y += yStep) {
        const py = pad + ((yMax - y) / (yMax - yMin)) * graphH
        ctx.fillText(y.toFixed(0), yAxisX - 35, py + 5)
      }

      // Draw curve
      ctx.strokeStyle = '#2563eb'
      ctx.lineWidth = 2.5
      ctx.beginPath()

      let firstPoint = true
      let prevY = null

      for (const point of points) {
        const px = pad + ((point.x - xMin) / (xMax - xMin)) * graphW
        const py = pad + ((yMax - point.y) / (yMax - yMin)) * graphH

        // Detect discontinuities
        if (prevY !== null) {
          const yRange = yMax - yMin
          const yJump = Math.abs(point.y - prevY) / yRange
          if (yJump > 0.5) {
            // Lift pen
            firstPoint = true
          }
        }

        if (firstPoint) {
          ctx.moveTo(px, py)
          firstPoint = false
        } else {
          ctx.lineTo(px, py)
        }

        prevY = point.y
      }

      ctx.stroke()

      // Expression label
      ctx.fillStyle = '#2563eb'
      ctx.font = 'bold 14px monospace'
      ctx.fillText(`y = ${expression}`, 15, 25)

    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      setPlotterError(`Error: ${msg}`)
    }
  }, [expression, xMin, xMax])

  // Debounced re-render
  useEffect(() => {
    const timer = setTimeout(renderPlotter, 600)
    return () => clearTimeout(timer)
  }, [expression, xMin, xMax, renderPlotter])

  // Load Desmos when tab changes
  useEffect(() => {
    if (!isOpen || activeTab !== 'desmos' || desmosScriptLoadedRef.current) {
      return
    }

    const loadDesmos = async () => {
      try {
        // Load the Desmos script
        const script = document.createElement('script')
        script.src = 'https://www.desmos.com/api/v1.11/calculator.js?apiKey=bfca35ada33b414caddb2ea45eb84680'
        script.async = true

        script.onload = () => {
          if (!desmosRef.current) return

          const Desmos = (window as any).Desmos
          const calculator = Desmos.GraphingCalculator(desmosRef.current, {
            keypad: false,
            settingsMenu: false,
            border: false,
          })

          desmosCalculatorRef.current = calculator
          desmosScriptLoadedRef.current = true
        }

        document.head.appendChild(script)
      } catch (err) {
        console.error('Failed to load Desmos:', err)
      }
    }

    loadDesmos()
  }, [isOpen, activeTab])

  // Cleanup on unmount or close
  useEffect(() => {
    return () => {
      if (desmosCalculatorRef.current) {
        try {
          desmosCalculatorRef.current.destroy?.()
        } catch {
          // Ignore cleanup errors
        }
      }
    }
  }, [])

  async function applyWatermarks(canvas: HTMLCanvasElement): Promise<void> {
    const ctx = canvas.getContext('2d')!
    const year = new Date().getFullYear()

    // ── Logo top-right ────────────────────────────────────
    await new Promise<void>((resolve) => {
      fetch('/skillwill-logo.svg')
        .then((res) => res.text())
        .then((svgText) => {
          // Patch SVG dimensions from "100%" to explicit pixels
          const patched = svgText
            .replace(/width="100%"/g, 'width="1024"')
            .replace(/height="100%"/g, 'height="768"')
            .replace(/width='100%'/g, "width='1024'")
            .replace(/height='100%'/g, "height='768'")

          // Create blob URL from patched SVG
          const blob = new Blob([patched], { type: 'image/svg+xml' })
          const blobUrl = URL.createObjectURL(blob)

          const logoImg = new Image()
          logoImg.onload = () => {
            const logoH = 36
            const logoW = Math.round(logoH * 1024 / 768)
            const logoX = canvas.width - logoW - 10
            const logoY = 7

            // White background behind logo for contrast
            ctx.save()
            ctx.fillStyle = 'rgba(255, 255, 255, 0.88)'
            ctx.beginPath()
            if (typeof ctx.roundRect !== 'undefined') {
              ctx.roundRect(logoX - 5, logoY - 4, logoW + 10, logoH + 8, 6)
            } else {
              ctx.rect(logoX - 5, logoY - 4, logoW + 10, logoH + 8)
            }
            ctx.fill()
            ctx.drawImage(logoImg, logoX, logoY, logoW, logoH)
            ctx.restore()
            URL.revokeObjectURL(blobUrl)
            resolve()
          }
          logoImg.onerror = () => {
            URL.revokeObjectURL(blobUrl)
            // Fallback to text badge if SVG fails to load
            const logoX = canvas.width - 100
            const logoY = 8
            ctx.save()
            ctx.fillStyle = 'rgba(20, 80, 135, 0.92)'
            ctx.beginPath()
            if (typeof ctx.roundRect !== 'undefined') {
              ctx.roundRect(logoX, logoY, 92, 36, 6)
            } else {
              ctx.rect(logoX, logoY, 92, 36)
            }
            ctx.fill()
            ctx.fillStyle = '#ffffff'
            ctx.font = 'bold 13px Arial, sans-serif'
            ctx.textAlign = 'left'
            ctx.textBaseline = 'top'
            ctx.fillText('SkillWill', logoX + 7, logoY + 5)
            ctx.font = '10px Arial, sans-serif'
            ctx.fillStyle = 'rgba(255,255,255,0.8)'
            ctx.fillText('Education', logoX + 7, logoY + 21)
            ctx.restore()
            resolve()
          }
          logoImg.src = blobUrl
        })
        .catch(() => {
          // Fallback to text badge if fetch fails
          const logoX = canvas.width - 100
          const logoY = 8
          ctx.save()
          ctx.fillStyle = 'rgba(20, 80, 135, 0.92)'
          ctx.beginPath()
          if (typeof ctx.roundRect !== 'undefined') {
            ctx.roundRect(logoX, logoY, 92, 36, 6)
          } else {
            ctx.rect(logoX, logoY, 92, 36)
          }
          ctx.fill()
          ctx.fillStyle = '#ffffff'
          ctx.font = 'bold 13px Arial, sans-serif'
          ctx.textAlign = 'left'
          ctx.textBaseline = 'top'
          ctx.fillText('SkillWill', logoX + 7, logoY + 5)
          ctx.font = '10px Arial, sans-serif'
          ctx.fillStyle = 'rgba(255,255,255,0.8)'
          ctx.fillText('Education', logoX + 7, logoY + 21)
          ctx.restore()
          resolve()
        })
    })

    // ── Copyright bottom-right ────────────────────────────
    const copyText = `© skillwill.ae - PHA ${year}`
    ctx.save()
    ctx.font = 'bold 13px Arial, sans-serif'
    ctx.textAlign = 'right'
    ctx.textBaseline = 'bottom'
    const tw = ctx.measureText(copyText).width
    const padX = 6
    const padY = 4
    const boxX = canvas.width - tw - padX * 2 - 10
    const boxY = canvas.height - 14 - padY * 2 - 6
    // White pill background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.88)'
    ctx.beginPath()
    if (typeof ctx.roundRect !== 'undefined') {
      ctx.roundRect(boxX, boxY, tw + padX * 2, 14 + padY * 2, 4)
    } else {
      ctx.rect(boxX, boxY, tw + padX * 2, 14 + padY * 2)
    }
    ctx.fill()
    ctx.fillStyle = 'rgba(20, 20, 20, 0.92)'
    ctx.fillText(copyText, canvas.width - 10 - padX, canvas.height - 6 - padY)
    ctx.restore()
  }

  const handleSave = async () => {
    setSaving(true)
    setSaveError('')
    setSaveSuccess(false)

    try {
      let imageData: string

      if (activeTab === 'plotter') {
        if (!canvasRef.current) {
          setSaveError('Canvas not ready')
          setSaving(false)
          return
        }
        await applyWatermarks(canvasRef.current)
        imageData = canvasRef.current.toDataURL('image/png')
      } else {
        if (!desmosCalculatorRef.current) {
          setSaveError('Desmos calculator not loaded')
          setSaving(false)
          return
        }

        try {
          // Use asyncScreenshot for higher quality with watermarks
          await new Promise<void>((resolve, reject) => {
            desmosCalculatorRef.current.asyncScreenshot({ width: 800, height: 600, targetPixelRatio: 2 }, (dataUrl: string) => {
              // Create canvas for watermarking
              const tempCanvas = document.createElement('canvas')
              tempCanvas.width = 800
              tempCanvas.height = 600
              const tempCtx = tempCanvas.getContext('2d')!

              // Draw screenshot onto canvas
              const screenshotImg = new Image()
              screenshotImg.onload = async () => {
                tempCtx.drawImage(screenshotImg, 0, 0)
                // Apply watermarks
                await applyWatermarks(tempCanvas)
                imageData = tempCanvas.toDataURL('image/png')
                resolve()
              }
              screenshotImg.onerror = () => reject(new Error('Failed to load screenshot'))
              screenshotImg.src = dataUrl
            })
          })
        } catch (err) {
          setSaveError(`Screenshot failed: ${err instanceof Error ? err.message : String(err)}`)
          setSaving(false)
          return
        }
      }

      const res = await fetch('/api/graph/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question_id: questionId,
          image_type: imageType,
          image_data: imageData,
          source: activeTab === 'plotter' ? 'function_plotter' : 'desmos',
        }),
      })

      if (!res.ok) {
        const errData = (await res.json()) as { error?: string }
        throw new Error(errData.error ?? `Server error ${res.status}`)
      }

      const data = (await res.json()) as { image_url: string; display_url: string | null; image_id: string; storage_path: string }

      setSaveSuccess(true)
      setTimeout(() => {
        onSaved({
          image_url: data.image_url,
          display_url: data.display_url,
          image_id: data.image_id,
          storage_path: data.storage_path,
          image_type: imageType,
        })
        onClose()
      }, 800)
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      setSaveError(msg)
    } finally {
      setSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg flex flex-col max-w-3xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="border-b px-6 py-4 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold">Generate Graph</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Saving to: {imageType === 'question' ? 'Question' : 'Answer'} images
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b flex gap-0">
          <button
            onClick={() => setActiveTab('plotter')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'plotter'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            📈 Function Plotter
          </button>
          <button
            onClick={() => setActiveTab('desmos')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'desmos'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            📊 Desmos
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'plotter' ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Expression</label>
                <input
                  type="text"
                  value={expression}
                  onChange={(e) => setExpression(e.target.value)}
                  placeholder="e.g., x^2 or sin(x)"
                  className="w-full mt-1 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">X Min</label>
                  <input
                    type="number"
                    value={xMin}
                    onChange={(e) => setXMin(Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">X Max</label>
                  <input
                    type="number"
                    value={xMax}
                    onChange={(e) => setXMax(Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <button
                onClick={renderPlotter}
                className="px-3 py-2 text-sm font-medium bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
              >
                🔄 Refresh
              </button>

              <canvas
                ref={canvasRef}
                width={680}
                height={360}
                className="border rounded-md bg-white w-full"
              />

              {plotterError && (
                <p className="text-sm text-destructive">{plotterError}</p>
              )}
            </div>
          ) : (
            <div>
              {!desmosScriptLoadedRef.current && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              )}
              <div
                ref={desmosRef}
                style={{ height: '500px', width: '100%' }}
                className="rounded-md border"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex-1">
            {saveError && <p className="text-sm text-destructive">{saveError}</p>}
            {saveSuccess && <p className="text-sm text-green-600">✓ Saved!</p>}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : (
                '💾 Save'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
