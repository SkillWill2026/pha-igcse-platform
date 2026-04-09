import { NextRequest, NextResponse } from 'next/server'
import { createAnthropicClient } from '@/lib/anthropic'
import { createAdminClient } from '@/lib/supabase'

export const runtime = 'nodejs'
export const maxDuration = 300
export const dynamic = 'force-dynamic'

const EXTRACTION_SYSTEM_PROMPT = `You are an expert Cambridge IGCSE Mathematics question extractor.
Your job is to extract individual questions from exam paper text and return them as a JSON array.

CRITICAL EXTRACTION RULES — follow these exactly:

RULE 1 — MULTI-PART QUESTIONS:
When a question has lettered sub-parts like (a), (b), (c) or (i), (ii), (iii):
- Create ONE separate question for EACH sub-part
- The content of each question is ONLY the sub-part expression/text — NOT the parent instruction
- Do NOT include the parent question number or instruction in the content
- Set part_label to the letter/roman numeral e.g. "a", "b", "c"
- Set parent_question_ref to the parent question number e.g. "1", "2"

GOOD EXAMPLE — Input:
"Question 1: Make y the subject of each formula
(a) y + w = c
(b) y − p = m
(c) m + y = s"

GOOD EXAMPLE — Output:
[
  {"content": "Make $y$ the subject: $y + w = c$", "part_label": "a", "parent_question_ref": "1", "question_type": "structured", "marks": 1, "difficulty": 1},
  {"content": "Make $y$ the subject: $y - p = m$", "part_label": "b", "parent_question_ref": "1", "question_type": "structured", "marks": 1, "difficulty": 1},
  {"content": "Make $y$ the subject: $m + y = s$", "part_label": "c", "parent_question_ref": "1", "question_type": "structured", "marks": 1, "difficulty": 1}
]

BAD EXAMPLE — Never do this:
[{"content": "Make y the subject of each formula: (a) y+w=c (b) y-p=m (c) m+y=s"}]

RULE 2 — IMAGE-TAGGED QUESTIONS (e.g. angles, geometry worksheets):
When questions are identified by grid tags like A1, A2, A3, B1, B2, C1, C2 etc:
- Create ONE separate question per tag
- The content should be the tag + the instruction text
- Add a note that the diagram must be added manually
- Set parent_question_ref to the letter group e.g. "A", "B", "C"
- Set part_label to the number e.g. "1", "2", "3"

GOOD EXAMPLE — Input:
"A1 Find the value of x
A2 Find the values of x and y
B1 Find the values of x and y"

GOOD EXAMPLE — Output:
[
  {"content": "A1: Find the value of $x$. [Diagram required — add image manually]", "part_label": "1", "parent_question_ref": "A", "question_type": "structured", "marks": 2, "difficulty": 2},
  {"content": "A2: Find the values of $x$ and $y$. [Diagram required — add image manually]", "part_label": "2", "parent_question_ref": "A", "question_type": "structured", "marks": 3, "difficulty": 2},
  {"content": "B1: Find the values of $x$ and $y$. [Diagram required — add image manually]", "part_label": "1", "parent_question_ref": "B", "question_type": "structured", "marks": 3, "difficulty": 3}
]

RULE 3 — LaTeX FORMATTING:
- Wrap all mathematical expressions in LaTeX: inline $x^2$ or display $$\\frac{a}{b}$$
- Convert fractions: "a/b" → $\\frac{a}{b}$
- Convert powers: "x^2" → $x^2$, "y^3" → $y^3$
- Convert roots: "√y" → $\\sqrt{y}$
- Convert Greek letters: "π" → $\\pi$

RULE 4 — WHAT TO SKIP:
- Skip page headers, footers, copyright notices, website URLs, QR code text
- Skip answer sections and worked examples
- Skip instructions that are not questions (e.g. "Click here", "Scan here")
- Skip blank lines and decorative text

RULE 5 — OUTPUT FORMAT:
Return ONLY a valid JSON array. No markdown, no code fences, no explanation.
Each object must have: content (string), part_label (string|null), parent_question_ref (string|null), question_type ("mcq"|"short_answer"|"structured"|"extended"), marks (integer 1-10), difficulty (integer 1-5)
`

const VALID_QUESTION_TYPES = ['mcq', 'short_answer', 'structured', 'extended'] as const
type QuestionType = (typeof VALID_QUESTION_TYPES)[number]

interface AIQuestion {
  content: string
  parent_question_ref: string | null
  part_label: string | null
  question_type: QuestionType
  difficulty: number
  marks: number | null
  subtopic_ref?: string
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const exam_board_id = formData.get('exam_board_id') as string | null
    const subtopic_id = formData.get('subtopic_id') as string | null
    const sub_subtopic_id = (formData.get('sub_subtopic_id') as string | null) || null
    const batch_id        = (formData.get('batch_id')        as string | null) || null

    if (!file || !exam_board_id || !subtopic_id) {
      return NextResponse.json(
        { error: 'Missing required fields: file, exam_board_id, subtopic_id' },
        { status: 400 },
      )
    }

    const isMixed = subtopic_id === 'mixed'

    const fileName = file.name.toLowerCase()
    const isPDF = fileName.endsWith('.pdf')
    const isDOCX = fileName.endsWith('.docx')

    if (!isPDF && !isDOCX) {
      return NextResponse.json(
        { error: 'Only PDF (.pdf) and Word (.docx) files are supported' },
        { status: 400 },
      )
    }

    // ── Text extraction ──────────────────────────────────────────────────────
    const buffer = Buffer.from(await file.arrayBuffer())
    let text = ''

    if (isPDF) {
      // pdf-parse is a CommonJS module (module.exports = fn), so .default may be undefined
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const pdfParse = require('pdf-parse') as (buf: Buffer) => Promise<{ text: string; numpages: number }>
      const parsed = await pdfParse(buffer)
      text = parsed.text
      const pageCount = parsed.numpages

      // If image-based PDF, use Mistral OCR fallback
      const avgCharsPerPage = text.trim().length / Math.max(pageCount, 1)
      if (avgCharsPerPage < 100) {
        console.log('[ingest] Image-based PDF detected, using Mistral OCR')
        try {
          const { extractTextWithOCR } = await import('@/lib/ocr')
          text = await extractTextWithOCR(buffer)
          console.log('[ingest] OCR extracted', text.length, 'chars')
        } catch (ocrErr) {
          console.warn('[ingest] OCR failed:', ocrErr)
        }
      }
    } else {
      const mammoth = await import('mammoth')
      const result = await mammoth.extractRawText({ buffer })
      text = result.value
    }

    console.log('[ingest] Text length:', text.length)
    console.log('[ingest] Text preview:', text.slice(0, 500))

    if (!text.trim()) {
      return NextResponse.json(
        { error: 'Could not extract any text from the uploaded file' },
        { status: 422 },
      )
    }

    // ── Initialize Supabase client ───────────────────────────────────────────
    const supabase = createAdminClient()

    // ── Store the original PDF to Supabase Storage ──────────────────────────
    let pdfStoragePath: string | null = null
    if (isPDF && batch_id) {
      try {
        console.log('[ingest] Storing PDF to Supabase Storage...', { batchId: batch_id, fileName: file.name, fileSize: buffer.length })
        const { data: uploadData, error: uploadErr } = await supabase.storage
          .from('pdfs')
          .upload(`${batch_id}/${file.name}`, buffer, {
            contentType: 'application/pdf',
            upsert: false,
          })

        if (uploadErr) {
          console.error('[ingest] PDF storage failed:', { code: uploadErr.name, message: uploadErr.message })
        } else if (uploadData?.path) {
          pdfStoragePath = uploadData.path
          console.log('[ingest] PDF stored successfully at:', pdfStoragePath)
        }
      } catch (err) {
        console.error('[ingest] PDF storage exception:', err instanceof Error ? err.message : String(err))
      }
    } else if (!isPDF) {
      console.log('[ingest] Not a PDF file, skipping PDF storage')
    } else if (!batch_id) {
      console.log('[ingest] No batch_id provided, skipping PDF storage')
    }

    // ── Fetch subtopic + topic for context (skipped for mixed) ──────────────

    let subtopic: { ref: string; title: string; topic_id: string } | null = null
    let topic: { ref: string; name: string } | null = null

    if (!isMixed) {
      const { data: s } = await supabase
        .from('subtopics')
        .select('ref, title, topic_id')
        .eq('id', subtopic_id)
        .single()
      subtopic = s as any

      if (subtopic) {
        const { data: t } = await supabase
          .from('topics')
          .select('ref, name')
          .eq('id', subtopic.topic_id)
          .single()
        topic = t
      }
    }

    // ── Anthropic extraction ─────────────────────────────────────────────────
    const anthropic = createAnthropicClient()

    const systemPrompt = EXTRACTION_SYSTEM_PROMPT

    const contextLine = isMixed
      ? 'This paper contains mixed topics — extract all questions without assuming a specific subtopic.'
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      : `Context: Topic ${topic?.ref ?? '?'} – ${topic?.name ?? 'Unknown'} | Subtopic ${subtopic?.ref ?? '?'} – ${(subtopic as any)?.title ?? 'Unknown'}`

    // Chunk-based extraction: process up to 3 chunks of 3 000 chars each.
    // If a chunk fails to parse it is skipped — resilient to garbled PDFs.
    const CHUNK_SIZE = 5000
    const sourceText = text.slice(0, 15_000)
    const chunks: string[] = []
    for (let i = 0; i < sourceText.length; i += CHUNK_SIZE) {
      chunks.push(sourceText.slice(i, i + CHUNK_SIZE))
    }
    const extractionPrompt = `${systemPrompt}\n\n${contextLine}`

    const allQuestions: AIQuestion[] = []
    for (let chunkIdx = 0; chunkIdx < chunks.length; chunkIdx++) {
      const chunk = chunks[chunkIdx]
      try {
        const response = await anthropic.messages.create({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 2000,
          messages: [{
            role: 'user',
            content: `${extractionPrompt}\n\nDOCUMENT TEXT:\n${chunk}`,
          }],
        })
        const raw = response.content[0].type === 'text' ? response.content[0].text : ''
        console.log('[ingest] Claude raw response:', raw.slice(0, 500))
        const cleaned = raw
          .replace(/^```json\s*/i, '')
          .replace(/^```\s*/i, '')
          .replace(/```\s*$/i, '')
          .trim()
        const parsed = JSON.parse(cleaned)
        if (Array.isArray(parsed)) {
          console.log('[ingest] Questions extracted from chunk:', parsed.length)
          allQuestions.push(...(parsed as AIQuestion[]))
        }
      } catch {
        continue
      }
    }

    if (allQuestions.length === 0) {
      return NextResponse.json(
        { error: 'No questions could be extracted from this document' },
        { status: 422 },
      )
    }

    // ── Insert into questions table ──────────────────────────────────────────
    const rows = allQuestions.map((q) => ({
      exam_board_id,
      topic_id: isMixed ? null : (subtopic?.topic_id ?? null),
      subtopic_id: isMixed ? null : subtopic_id,
      sub_subtopic_id: sub_subtopic_id || null,
      content_text: String(q.content ?? '').trim(),
      parent_question_ref: q.parent_question_ref ?? null,
      part_label: q.part_label ?? null,
      batch_id: batch_id ?? null,
      difficulty: Math.min(5, Math.max(1, Math.round(Number(q.difficulty) || 2))),
      question_type: VALID_QUESTION_TYPES.includes(q.question_type)
        ? q.question_type
        : ('structured' as QuestionType),
      marks: q.marks != null ? Math.max(1, Math.round(Number(q.marks))) : 1,
      status: 'draft' as const,
      ai_extracted: true,
    }))

    // Insert with graceful duplicate handling — skip duplicates instead of failing
    const saved: any[] = []
    const errors: string[] = []

    for (const row of rows) {
      try {
        const { data, error } = await supabase
          .from('questions')
          .insert(row)
          .select('*')
          .single()

        if (error) {
          // Log but continue — don't block the entire batch
          console.warn(`[ingest] insert failed for question:`, error.message)
          if (error.code !== '23505') {
            // 23505 = unique violation, expected for duplicates
            errors.push(`Question skipped: ${error.message}`)
          }
        } else if (data) {
          saved.push(data)
        }
      } catch (err) {
        console.warn(`[ingest] exception inserting question:`, err instanceof Error ? err.message : String(err))
      }
    }

    if (saved.length === 0 && rows.length > 0) {
      return NextResponse.json(
        { error: 'No questions were successfully inserted. All may be duplicates or invalid.', details: errors },
        { status: 422 },
      )
    }

    // ── Update upload_batches with PDF path ──────────────────────────────────
    if (batch_id && pdfStoragePath) {
      try {
        await supabase
          .from('upload_batches')
          .update({
            source_pdf_path: pdfStoragePath,
            source_file_name: file.name,
          })
          .eq('id', batch_id)
      } catch (err) {
        console.warn('[ingest] Failed to update upload_batches with PDF path:', err instanceof Error ? err.message : String(err))
      }
    }

    // Merge subtopic_ref back for the UI (best-effort from AI or context)
    const questions = saved.map((q) => ({
      ...q,
      subtopic_ref: subtopic?.ref ?? '',
    }))

    return NextResponse.json({
      questions,
      count: questions.length,
      total: rows.length,
      skipped: rows.length - saved.length,
      ...(errors.length > 0 && { warnings: errors }),
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    const stack = err instanceof Error ? err.stack : undefined
    console.error('[POST /api/ingest] FULL ERROR:', err)
    return NextResponse.json({ error: message, stack }, { status: 500 })
  }
}
