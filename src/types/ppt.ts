export type YouchiPose = 'excited' | 'thinking' | 'waiting' | 'thumbs_up' | 'laughing' | 'wink' | 'neutral'
export type SlideType = 'title' | 'concept' | 'question' | 'answer' | 'summary'
export type PptStatus = 'draft' | 'approved'

export interface Slide {
  id: string
  type: SlideType
  title: string
  subtitle?: string
  bullets?: string[]
  key_concept?: string
  question_content?: string
  answer_working?: string[]
  answer_content?: string
  speaker_notes: string
  youchi_pose: YouchiPose
}

export interface PptDeck {
  id: string
  subtopic_id: string
  subject_id: string
  title: string
  status: PptStatus
  slides: Slide[]
  tutor_notes: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}
