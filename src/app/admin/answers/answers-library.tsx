'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants, Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { TypeBadge } from '@/components/admin/type-badge'
import { StatusBadge } from '@/components/admin/status-badge'
import type { AnswerWithQuestion } from '@/types/database'

const ALL = '__all__'

interface Props {
  answers:      AnswerWithQuestion[]
  boards:       { id: string; name: string }[]
  topics:       { id: string; ref: string; name: string }[]
  subtopics:    { id: string; ref: string; name: string; topic_id: string }[]
  subSubtopics: { id: string; ref: string; title: string; subtopic_id: string }[]
}

export function AnswersLibrary({ answers, boards, topics, subtopics, subSubtopics }: Props) {
  const router = useRouter()
  const [boardId,       setBoardId]       = useState(ALL)
  const [topicId,       setTopicId]       = useState(ALL)
  const [subtopicId,    setSubtopicId]    = useState(ALL)
  const [subSubtopicId, setSubSubtopicId] = useState(ALL)
  const [status,        setStatus]        = useState(ALL)

  const filteredSubtopics = useMemo(
    () => (topicId === ALL ? subtopics : subtopics.filter((s) => s.topic_id === topicId)),
    [topicId, subtopics],
  )

  const filteredSubSubtopics = useMemo(
    () => (subtopicId === ALL ? subSubtopics : subSubtopics.filter((s) => s.subtopic_id === subtopicId)),
    [subtopicId, subSubtopics],
  )

  const filtered = useMemo(() => {
    return answers.filter((a) => {
      const q = a.questions
      if (!q) return false
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const qAny = q as any
      if (boardId       && boardId       !== ALL && qAny.exam_boards?.id   !== boardId)       return false
      if (topicId       && topicId       !== ALL && qAny.topics?.id        !== topicId)       return false
      if (subtopicId    && subtopicId    !== ALL && qAny.subtopics?.id     !== subtopicId)    return false
      if (subSubtopicId && subSubtopicId !== ALL && qAny.sub_subtopic_id   !== subSubtopicId) return false
      if (status        && status        !== ALL && a.status               !== status)        return false
      return true
    })
  }, [answers, boardId, topicId, subtopicId, subSubtopicId, status])

  const counts = useMemo(() => ({
    total:    filtered.length,
    draft:    filtered.filter((a) => a.status === 'draft').length,
    approved: filtered.filter((a) => a.status === 'approved').length,
    rejected: filtered.filter((a) => a.status === 'rejected').length,
  }), [filtered])

  const hasFilters = boardId !== ALL || topicId !== ALL || subtopicId !== ALL || subSubtopicId !== ALL || status !== ALL
  const clearFilters = () => { setBoardId(ALL); setTopicId(ALL); setSubtopicId(ALL); setSubSubtopicId(ALL); setStatus(ALL) }

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="rounded-lg border bg-card p-4">
        <div className="flex flex-wrap gap-2 items-center">
          <FilterSelect
            placeholder="All Boards"
            value={boardId}
            onValueChange={setBoardId}
            options={boards.map((b) => ({ value: b.id, label: b.name }))}
          />
          <FilterSelect
            placeholder="All Topics"
            value={topicId}
            onValueChange={(v) => { setTopicId(v); setSubtopicId(ALL) }}
            options={topics.map((t) => ({ value: t.id, label: `${t.ref} – ${t.name}` }))}
          />
          <FilterSelect
            placeholder="All Subtopics"
            value={subtopicId}
            onValueChange={(v) => { setSubtopicId(v); setSubSubtopicId(ALL) }}
            options={filteredSubtopics.map((s) => ({ value: s.id, label: `${s.ref} – ${s.name}` }))}
            className="w-56"
          />
          {filteredSubSubtopics.length > 0 && (
            <FilterSelect
              placeholder="All Sub-subtopics"
              value={subSubtopicId}
              onValueChange={setSubSubtopicId}
              options={filteredSubSubtopics.map((s) => ({ value: s.id, label: `${s.ref} – ${s.title}` }))}
              className="w-56"
            />
          )}
          <FilterSelect
            placeholder="All Statuses"
            value={status}
            onValueChange={setStatus}
            options={[
              { value: 'draft',    label: 'Draft' },
              { value: 'approved', label: 'Approved' },
              { value: 'rejected', label: 'Rejected' },
            ]}
          />
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1">
              <X className="h-3 w-3" /> Clear
            </Button>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="flex flex-wrap gap-4 text-sm px-1">
        {[
          { label: 'Total',    value: counts.total,    color: 'text-foreground' },
          { label: 'Draft',    value: counts.draft,    color: 'text-gray-600'  },
          { label: 'Approved', value: counts.approved, color: 'text-green-700' },
          { label: 'Rejected', value: counts.rejected, color: 'text-red-700'   },
        ].map(({ label, value, color }) => (
          <span key={label}>
            <span className={`font-semibold tabular-nums ${color}`}>{value}</span>{' '}
            <span className="text-muted-foreground">{label}</span>
          </span>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-lg border overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-28">Subtopic</TableHead>
              <TableHead>Question Preview</TableHead>
              <TableHead className="w-28">Type</TableHead>
              <TableHead className="w-24 text-right">Confidence</TableHead>
              <TableHead className="w-24">Status</TableHead>
              <TableHead className="w-16" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-12">
                  {answers.length === 0
                    ? 'No answers yet — approve a question to generate one.'
                    : `No answers match the current filters. (${answers.length} loaded)`}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((a) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const q = a.questions as any
                const confidence = a.confidence_score != null
                  ? `${Math.round(a.confidence_score * 100)}%`
                  : '—'
                return (
                  <TableRow key={a.id} className="hover:bg-muted/30">
                    <TableCell>
                      <span className="font-mono text-xs text-muted-foreground">
                        {q?.subtopics?.ref ?? '—'}
                      </span>
                      {q?.subtopics?.name && (
                        <span className="ml-1.5 text-xs">{q.subtopics.name}</span>
                      )}
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <p className="text-sm line-clamp-2">
                        {(q?.content_text ?? '').slice(0, 80)}
                        {(q?.content_text ?? '').length > 80 ? '…' : ''}
                      </p>
                    </TableCell>
                    <TableCell>
                      {q?.question_type ? <TypeBadge type={q.question_type} /> : '—'}
                    </TableCell>
                    <TableCell className="text-right font-semibold tabular-nums text-sm">
                      {confidence}
                    </TableCell>
                    <TableCell><StatusBadge status={a.status} /></TableCell>
                    <TableCell>
                      <button
                        onClick={() => { router.refresh(); router.push(`/admin/answers/${a.id}`) }}
                        className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'gap-1')}
                      >
                        Review <ArrowRight className="h-3 w-3" />
                      </button>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

function FilterSelect({
  placeholder, value, onValueChange, options, className,
}: {
  placeholder: string
  value: string
  onValueChange: (v: string) => void
  options: { value: string; label: string }[]
  className?: string
}) {
  return (
    <Select value={value} onValueChange={(v) => onValueChange(v ?? ALL)}>
      <SelectTrigger className={cn('h-8 text-xs', className ?? 'w-36')}>
        {value !== ALL
          ? <span className="truncate">{options.find((o) => o.value === value)?.label}</span>
          : <span className="text-muted-foreground truncate">{placeholder}</span>}
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={false}>
        <SelectItem value={ALL} label={placeholder}>{placeholder}</SelectItem>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value} label={o.label}>{o.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
