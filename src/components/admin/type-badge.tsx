import { cn } from '@/lib/utils'
import type { QuestionType } from '@/types/database'

const TYPE_STYLES: Record<QuestionType, string> = {
  mcq:          'bg-blue-100   text-blue-800',
  short_answer: 'bg-green-100  text-green-800',
  structured:   'bg-amber-100  text-amber-800',
  extended:     'bg-purple-100 text-purple-800',
}

const TYPE_LABELS: Record<QuestionType, string> = {
  mcq:          'MCQ',
  short_answer: 'Short Ans',
  structured:   'Structured',
  extended:     'Extended',
}

export function TypeBadge({ type }: { type: string }) {
  const t = type as QuestionType
  return (
    <span
      className={cn(
        'inline-flex items-center rounded px-2 py-0.5 text-xs font-medium whitespace-nowrap',
        TYPE_STYLES[t] ?? 'bg-muted text-muted-foreground',
      )}
    >
      {TYPE_LABELS[t] ?? type}
    </span>
  )
}
