export type QuestionStatus = 'draft' | 'approved' | 'rejected'
export type QuestionType = 'mcq' | 'short_answer' | 'structured' | 'extended'
export type AnswerStatus = 'draft' | 'approved' | 'rejected'

export interface QuestionRow {
  id: string
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
  source_question_id: string | null
  created_at: string
  updated_at: string
}

export interface QuestionWithRelations extends QuestionRow {
  exam_boards: { id: string; name: string } | null
  topics: { id: string; ref: string; name: string } | null
  subtopics: { id: string; ref: string; name: string } | null
  sub_subtopics: { ext_num: number; outcome: string; tier: string } | null
}

export interface AnswerRow {
  id: string
  question_id: string
  content_text: string
  step_by_step: string[]
  mark_scheme: string
  confidence_score: number | null
  status: AnswerStatus
  ai_generated: boolean
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
