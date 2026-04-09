import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    has_mistral: !!process.env.MISTRAL_API_KEY,
    has_voyage: !!process.env.VOYAGE_API_KEY,
    has_anthropic: !!process.env.ANTHROPIC_API_KEY,
    mistral_length: process.env.MISTRAL_API_KEY?.length ?? 0,
  })
}
