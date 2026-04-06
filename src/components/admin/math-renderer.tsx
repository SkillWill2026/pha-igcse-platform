'use client'

import { useMemo } from 'react'
import katex from 'katex'
import { cn } from '@/lib/utils'

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function renderKatex(math: string, displayMode: boolean): string {
  try {
    return katex.renderToString(math, { displayMode, throwOnError: false, output: 'html' })
  } catch {
    return `<code class="text-destructive">${escapeHtml(math)}</code>`
  }
}

/**
 * Splits text on $$...$$  and $...$  patterns and renders math with KaTeX.
 * Non-math segments are HTML-escaped; newlines become <br>.
 */
function renderMathInText(text: string): string {
  // Capture both display ($$...$$) and inline ($...$) math
  const parts = text.split(/((?:\$\$[\s\S]*?\$\$|\$[^\n$]*?\$))/g)

  return parts
    .map((part) => {
      if (part.startsWith('$$') && part.endsWith('$$') && part.length > 4) {
        return renderKatex(part.slice(2, -2), true)
      }
      if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
        return renderKatex(part.slice(1, -1), false)
      }
      return escapeHtml(part).replace(/\n/g, '<br>')
    })
    .join('')
}

interface MathRendererProps {
  text: string
  className?: string
}

export function MathRenderer({ text, className }: MathRendererProps) {
  const html = useMemo(() => renderMathInText(text), [text])

  return (
    <div
      className={cn('math-content leading-relaxed', className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
