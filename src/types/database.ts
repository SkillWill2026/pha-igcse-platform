export type QuestionStatus = 'draft' | 'approved' | 'rejected' | 'deleted'
export type QuestionType = 'mcq' | 'short_answer' | 'structured' | 'extended'
export type AnswerStatus = 'draft' | 'approved' | 'rejected' | 'deleted'

export interface QuestionRow {
  id: string
  serial_number: string | null
  parent_question_ref: string | null
  part_label: string | null
  batch_id: string | null
  exam_board_id: string
  topic_id: string
  subtopic_id: string
  sub_subtopic_id: string | null
  content_text: string
  image_url: string | null
  difficulty: number
  question_type: QuestionType
  marks: number
  status: QuestionStatus
  ai_extracted: boolean
  calculator: boolean | null
  source_question_id: string | null
  created_at: string
  updated_at: string
}

export interface QuestionWithRelations extends QuestionRow {
  exam_boards: { id: string; name: string } | null
  topics: { id: string; ref: string; name: string } | null
  subtopics: { id: string; ref: string; name: string } | null
  sub_subtopics: { ext_num: number; outcome: string; tier: string } | null
  answer_serial: string | null
  answer_status: string | null
}

export type UploadBatch = {
  id: string
  total_files: number
  completed_files: number
  failed_files: number
  total_questions_extracted: number
  topic_id: string | null
  subtopic_id: string | null
  sub_subtopic_id: string | null
  status: 'processing' | 'completed' | 'partial' | 'failed'
  created_at: string
  completed_at: string | null
}

export type QuestionImage = {
  id: string
  question_id: string
  storage_path: string
  public_url: string | null
  image_type: 'question' | 'answer' | 'diagram'
  caption: string | null
  sort_order: number
  created_at: string
}

export interface AnswerRow {
  id: string
  question_id: string
  content: string
  step_by_step: string[]
  mark_scheme: string
  confidence_score: number | null
  status: AnswerStatus
  ai_generated: boolean
  serial_number: string | null
  created_at: string
  updated_at: string
}

export interface AnswerWithQuestion extends AnswerRow {
  questions:
    | (QuestionRow & {
        exam_boards: { id: string; name: string } | null
        topics: { id: string; ref: string; name: string } | null
        subtopics: { id: string; ref: string; name: string } | null
      })
    | null
}
