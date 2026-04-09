import { createAdminClient } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = createAdminClient()
  const body = await request.json()
  const { fileName } = body

  if (!fileName) {
    return NextResponse.json({ error: 'Missing fileName' }, { status: 400 })
  }

  const filePath = `${Date.now()}-${fileName.replace(/\s+/g, '-')}`

  const { data, error } = await supabase.storage
    .from('databank')
    .createSignedUploadUrl(filePath)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ signedUrl: data.signedUrl, filePath, token: data.token })
}
