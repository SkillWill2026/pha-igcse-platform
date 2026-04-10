import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const subtopicId = 'bd4d8b0a-2402-469f-95d7-c10cf0454210'

const { data, error } = await supabase
  .from('sub_subtopics')
  .select('id, ext_num, core_num, outcome, e_only, tier, sort_order')
  .eq('subtopic_id', subtopicId)
  .order('sort_order', { ascending: true })

console.log('data:', JSON.stringify(data?.slice(0, 2)))
console.log('error:', JSON.stringify(error))
