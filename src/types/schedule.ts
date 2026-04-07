export type SubtopicStatus = 'draft' | 'in_progress' | 'review' | 'approved'

export interface SubSubtopic {
  id: string
  subtopic_id: string
  ref: string
  title: string
  syllabus_code?: string
  qs_total: number
  mcq_count: number
  short_ans_count: number
  structured_count: number
  extended_count: number
  sort_order: number
  created_at: string
}

export interface Topic {
  id: string
  ref: string
  name: string
  subtopic_count: number
  total_questions: number
  ppt_decks: number
  completion_date: string | null
  hours_est: number | null
  sort_order: number
  created_at: string
}

export interface PPTDeck {
  id: string
  subtopic_id: string
  filename: string
  file_path: string
  file_size: number | null
  uploaded_by: string | null
  created_at: string
}

export interface Subtopic {
  id: string
  topic_id: string
  ref: string
  title: string
  due_date: string | null
  sprint_week: number | null
  qs_total: number
  mcq_count: number
  short_ans_count: number
  structured_count: number
  extended_count: number
  status: SubtopicStatus
  sort_order: number
  created_at: string
  ppt_required: boolean
  examples_required: number
  ppt_decks?: PPTDeck[]
  examples_count?: number
  sub_subtopics?: SubSubtopic[]
}

export interface TopicWithSubtopics extends Topic {
  subtopics: Subtopic[]
}
