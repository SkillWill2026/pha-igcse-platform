// Supabase Edge Function — Deno runtime
// Heavy PDF processing: Mistral OCR + Claude extraction + DB insert
// Called by /api/ingest (Next.js) which returns immediately after firing this.
// Uses EdgeRuntime.waitUntil so HTTP response is sent instantly while work continues.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

declare const EdgeRuntime: { waitUntil(p: Promise<unknown>): void };

const VALID_QUESTION_TYPES = ["mcq", "short_answer", "structured", "extended"];

const EXTRACTION_SYSTEM_PROMPT = `You are an expert Cambridge IGCSE Mathematics question extractor.
Your job is to extract individual questions from exam paper text and return them as a JSON array.

CRITICAL EXTRACTION RULES — follow these exactly:

RULE 0 — WORKSHEET FORMAT:
If the document appears to be a math worksheet with equations grouped
under question numbers (like "Question 1:", "Question 2:") but WITHOUT
explicit instruction text, infer the instruction from context:
- Equations in the form "y = [expression with other variables]" →
  instruction is "Make y the subject of the formula:"
- Equations in the form "x = [expression]" →
  instruction is "Make x the subject of the formula:"
- Still apply RULE 1: each lettered sub-part becomes a separate question
- Include the inferred instruction in the content field

RULE 1 — MULTI-PART QUESTIONS:
When a question has lettered sub-parts like (a), (b), (c) or (i), (ii), (iii):
- Create ONE separate question for EACH sub-part
- The content of each question is ONLY the sub-part expression/text — NOT the parent instruction
- Do NOT include the parent question number or instruction in the content
- Set part_label to the letter/roman numeral e.g. "a", "b", "c"
- Set parent_question_ref to the parent question number e.g. "1", "2"

RULE 2 — IMAGE-TAGGED QUESTIONS (e.g. angles, geometry worksheets):
When questions are identified by grid tags like A1, A2, A3, B1, B2, C1, C2 etc:
- Create ONE separate question per tag
- The content should be the tag + the instruction text
- Add a note that the diagram must be added manually
- Set parent_question_ref to the letter group e.g. "A", "B", "C"
- Set part_label to the number e.g. "1", "2", "3"

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
Each object must have:
content (string), part_label (string|null), parent_question_ref (string|null),
question_type ("mcq"|"short_answer"|"structured"|"extended"),
marks (integer 1-10), difficulty (integer 1-5)`;

// ── Main handler ──────────────────────────────────────────────────────────────
serve(async (req: Request) => {
  try {
    const body = await req.json();

    // Return 200 immediately — background work continues via waitUntil
    EdgeRuntime.waitUntil(processUpload(body));

    return new Response(JSON.stringify({ accepted: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
});

// ── Background processing ─────────────────────────────────────────────────────
async function processUpload(payload: {
  batch_id: string;
  is_image_pdf: boolean;
  text_content: string;
  topic_id: string | null;
  exam_board_id: string;
  file_name: string;
}) {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { batch_id, is_image_pdf, topic_id, exam_board_id } = payload;
  let text = payload.text_content;

  try {
    // ── OCR if image-based PDF ────────────────────────────────────────────────
    if (is_image_pdf) {
      console.log("[process-upload] Image PDF — running Mistral OCR for batch:", batch_id);

      const { data: batch } = await supabase
        .from("upload_batches")
        .select("source_pdf_path")
        .eq("id", batch_id)
        .single();

      if (!batch?.source_pdf_path) {
        throw new Error("No source_pdf_path found for batch");
      }

      const { data: fileData, error: dlErr } = await supabase.storage
        .from("pdfs")
        .download(batch.source_pdf_path);

      if (dlErr || !fileData) {
        throw new Error(`Storage download failed: ${dlErr?.message}`);
      }

      const pdfBytes = new Uint8Array(await fileData.arrayBuffer());
      // Convert to base64 in chunks to avoid stack overflow on large files
      let base64 = "";
      const chunkSize = 8192;
      for (let i = 0; i < pdfBytes.length; i += chunkSize) {
        base64 += btoa(String.fromCharCode(...pdfBytes.slice(i, i + chunkSize)));
      }

      const ocrRes = await fetch("https://api.mistral.ai/v1/ocr", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${Deno.env.get("MISTRAL_API_KEY")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "mistral-ocr-latest",
          document: {
            type: "document_url",
            document_url: `data:application/pdf;base64,${base64}`,
          },
        }),
      });

      if (!ocrRes.ok) {
        const errText = await ocrRes.text();
        throw new Error(`Mistral OCR failed: ${ocrRes.status} ${errText.slice(0, 200)}`);
      }

      const ocrData = await ocrRes.json();
      text = (ocrData.pages ?? [])
        .map((p: { markdown?: string; text?: string }) => p.markdown ?? p.text ?? "")
        .join("\n\n");

      console.log("[process-upload] OCR complete —", text.length, "chars");
    }

    if (!text.trim()) {
      throw new Error("No text extracted from document");
    }

    // ── Chunk text and run Claude extraction ──────────────────────────────────
    const CHUNK_SIZE = 3000;
    const sourceText = text.slice(0, 20000);
    const chunks: string[] = [];
    for (let i = 0; i < sourceText.length; i += CHUNK_SIZE) {
      chunks.push(sourceText.slice(i, i + CHUNK_SIZE));
    }

    console.log("[process-upload] Processing", chunks.length, "chunks for batch:", batch_id);

    // Get existing question count for batch_position offset
    const { count: existingCount } = await supabase
      .from("questions")
      .select("id", { count: "exact", head: true })
      .eq("batch_id", batch_id);

    let batchPosition = existingCount ?? 0;
    let totalExtracted = 0;

    for (let chunkIdx = 0; chunkIdx < chunks.length; chunkIdx++) {
      const chunk = chunks[chunkIdx];

      try {
        const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "x-api-key": Deno.env.get("ANTHROPIC_API_KEY")!,
            "anthropic-version": "2023-06-01",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "claude-haiku-4-5-20251001",
            max_tokens: 4096,
            messages: [
              {
                role: "user",
                content: `${EXTRACTION_SYSTEM_PROMPT}\n\nDOCUMENT TEXT:\n${chunk}`,
              },
            ],
          }),
        });

        if (!anthropicRes.ok) {
          console.warn("[process-upload] Anthropic error on chunk", chunkIdx, anthropicRes.status);
          continue;
        }

        const anthropicData = await anthropicRes.json();
        const responseText: string = anthropicData.content?.[0]?.text ?? "";

        // Extract JSON array
        let questions: Array<{
          content: string;
          part_label?: string | null;
          parent_question_ref?: string | null;
          question_type?: string;
          marks?: number;
          difficulty?: number;
        }> = [];

        try {
          const firstBracket = responseText.indexOf("[");
          const lastBracket = responseText.lastIndexOf("]");
          if (firstBracket !== -1 && lastBracket > firstBracket) {
            const parsed = JSON.parse(responseText.slice(firstBracket, lastBracket + 1));
            questions = Array.isArray(parsed) ? parsed : [];
          }
        } catch {
          console.warn("[process-upload] JSON parse failed on chunk", chunkIdx);
        }

        // Insert questions
        for (const q of questions) {
          const qType = VALID_QUESTION_TYPES.includes(q.question_type ?? "")
            ? q.question_type!
            : "structured";

          const { error: insertErr } = await supabase.from("questions").insert({
            exam_board_id,
            topic_id: topic_id || null,
            subtopic_id: null,
            sub_subtopic_id: null,
            batch_position: batchPosition++,
            content_text: String(q.content ?? "").trim(),
            parent_question_ref: q.parent_question_ref ?? null,
            part_label: q.part_label ?? null,
            batch_id,
            difficulty: Math.min(5, Math.max(1, Math.round(Number(q.difficulty) || 2))),
            question_type: qType,
            marks: q.marks != null ? Math.max(1, Math.round(Number(q.marks))) : 1,
            status: "draft",
            ai_extracted: true,
          });

          if (!insertErr) {
            totalExtracted++;
          } else if (insertErr.code !== "23505") {
            // 23505 = unique violation (duplicate) — skip silently
            console.warn("[process-upload] insert error:", insertErr.message);
          }
        }

        // Update live progress after each chunk
        await supabase
          .from("upload_batches")
          .update({ questions_extracted: totalExtracted })
          .eq("id", batch_id);

        console.log(`[process-upload] Chunk ${chunkIdx + 1}/${chunks.length} — ${totalExtracted} questions so far`);

      } catch (chunkErr) {
        console.error("[process-upload] chunk", chunkIdx, "failed:", chunkErr);
      }
    }

    // ── Mark batch as done ────────────────────────────────────────────────────
    await supabase
      .from("upload_batches")
      .update({
        status: "completed",
        questions_extracted: totalExtracted,
        total_questions_extracted: totalExtracted,
        completed_files: 1,
        completed_at: new Date().toISOString(),
      })
      .eq("id", batch_id);

    console.log("[process-upload] Done — batch:", batch_id, "| questions:", totalExtracted);

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[process-upload] Fatal error for batch", batch_id, ":", msg);

    await supabase
      .from("upload_batches")
      .update({ status: "failed", error_message: msg.slice(0, 500) })
      .eq("id", batch_id);
  }
}
