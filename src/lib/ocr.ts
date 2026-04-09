export async function extractTextWithOCR(pdfBuffer: Buffer): Promise<string> {
  const apiKey = process.env.MISTRAL_API_KEY
  if (!apiKey) throw new Error('MISTRAL_API_KEY is not set')

  const base64Pdf = pdfBuffer.toString('base64')
  const dataUrl = `data:application/pdf;base64,${base64Pdf}`

  const res = await fetch('https://api.mistral.ai/v1/ocr', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'mistral-ocr-latest',
      document: {
        type: 'document_url',
        document_url: dataUrl,
      },
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Mistral OCR error: ${res.status} ${err}`)
  }

  const data = await res.json()

  const pages: string[] = (data.pages ?? []).map(
    (p: { markdown?: string; text?: string }) => p.markdown ?? p.text ?? ''
  )

  return pages.join('\n\n')
}

export function isImageBasedPdf(text: string, pageCount: number): boolean {
  const avgCharsPerPage = text.trim().length / Math.max(pageCount, 1)
  return avgCharsPerPage < 100
}
