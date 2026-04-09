export async function embedTexts(texts: string[]): Promise<number[][]> {
  const apiKey = process.env.VOYAGE_API_KEY
  if (!apiKey) throw new Error('VOYAGE_API_KEY is not set')

  const batchSize = 128
  const allEmbeddings: number[][] = []

  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize)
    const res = await fetch('https://api.voyageai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: batch,
        model: 'voyage-3',
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      throw new Error(`Voyage AI error: ${res.status} ${err}`)
    }

    const data = await res.json()
    const sorted = data.data.sort((a: { index: number }, b: { index: number }) => a.index - b.index)
    allEmbeddings.push(...sorted.map((d: { embedding: number[] }) => d.embedding))
  }

  return allEmbeddings
}

export function chunkText(text: string, chunkSize = 2000, overlap = 200): string[] {
  const chunks: string[] = []
  let start = 0

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length)
    const chunk = text.slice(start, end).trim()
    if (chunk.length > 50) chunks.push(chunk)
    if (end === text.length) break
    start = end - overlap
  }

  return chunks
}
