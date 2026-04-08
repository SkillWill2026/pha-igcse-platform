import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const subtopicId = searchParams.get('subtopic_id')

    if (!subtopicId) {
      return NextResponse.json(
        { error: 'subtopic_id query parameter is required' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // Fetch sub-subtopics for the given subtopic
    const { data, error } = await supabase
      .from('sub_subtopics')
      .select('id, ref, name, e_only')
      .eq('subtopic_id', subtopicId)
      .order('ref', { ascending: true })

    if (error) {
      console.error('Error fetching sub-subtopics:', error)
      return NextResponse.json(
        { error: 'Failed to fetch sub-subtopics' },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
