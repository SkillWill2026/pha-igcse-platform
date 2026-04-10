'use client'

import { useState, useEffect } from 'react'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'

interface Topic {
  id: string
  ref: string
  name: string
}

interface Subtopic {
  id: string
  ref: string
  title: string
  tier: string
  topic_id: string
}

interface SubSubtopic {
  id: string
  ext_num: number | null
  sort_order: number
  core_num: number | null
  outcome: string
  tier: string
}

function TierBadge({ tier }: { tier: string }) {
  return tier === 'extended' ? (
    <span className="ml-1.5 inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium bg-purple-100 text-purple-700">
      E
    </span>
  ) : (
    <span className="ml-1.5 inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium bg-gray-100 text-gray-600">
      C+E
    </span>
  )
}

interface Props {
  onSubSubtopicChange: (id: string | null) => void
  onSubtopicChange?: (id: string | null) => void
  onTopicChange?: (id: string | null) => void
  showTierBadge?: boolean
  subjectId?: string | null
}

export function SyllabusSelector({
  onSubSubtopicChange,
  onSubtopicChange,
  onTopicChange,
  showTierBadge = true,
  subjectId,
}: Props) {
  const [topics, setTopics]             = useState<Topic[]>([])
  const [subtopics, setSubtopics]       = useState<Subtopic[]>([])
  const [subSubtopics, setSubSubtopics] = useState<SubSubtopic[]>([])

  const [topicId, setTopicId]             = useState('')
  const [subtopicId, setSubtopicId]       = useState('')
  const [subSubtopicId, setSubSubtopicId] = useState('')

  useEffect(() => {
    const url = subjectId ? `/api/topics?subject_id=${subjectId}` : '/api/topics'
    fetch(url)
      .then((r) => r.json())
      .then(setTopics)
      .catch(() => {})
  }, [subjectId])

  function handleTopicChange(id: string) {
    setTopicId(id)
    setSubtopicId('')
    setSubSubtopicId('')
    setSubtopics([])
    setSubSubtopics([])
    onSubSubtopicChange(null)
    onSubtopicChange?.(null)
    onTopicChange?.(id || null)
    if (id) {
      fetch(`/api/subtopics?topic_id=${id}`)
        .then((r) => r.json())
        .then(setSubtopics)
        .catch(() => {})
    }
  }

  function handleSubtopicChange(id: string) {
    setSubtopicId(id)
    setSubSubtopicId('')
    setSubSubtopics([])
    onSubSubtopicChange(null)
    onSubtopicChange?.(id || null)
    if (id) {
      fetch(`/api/sub-subtopics?subtopic_id=${id}`)
        .then((r) => r.json())
        .then(setSubSubtopics)
        .catch(() => {})
    }
  }

  function handleSubSubtopicChange(id: string) {
    setSubSubtopicId(id)
    onSubSubtopicChange(id || null)
  }

  const selectedTopic       = topics.find((t) => t.id === topicId)
  const selectedSubtopic    = subtopics.find((s) => s.id === subtopicId)
  const selectedSubSubtopic = subSubtopics.find((s) => s.id === subSubtopicId)

  return (
    <div className="space-y-2">
      {/* Topic */}
      <div className="space-y-1">
        <Label className="text-xs">Topic</Label>
        <Select value={topicId} onValueChange={handleTopicChange}>
          <SelectTrigger className="h-8 text-xs w-full">
            {selectedTopic ? (
              <span className="truncate">
                <span className="font-mono text-muted-foreground mr-1">{selectedTopic.ref}</span>
                {selectedTopic.name}
              </span>
            ) : (
              <span className="text-muted-foreground">Select topic…</span>
            )}
          </SelectTrigger>
          <SelectContent className="max-h-64 overflow-y-auto" alignItemWithTrigger={false}>
            {topics.map((t) => (
              <SelectItem key={t.id} value={t.id} label={`${t.ref} ${t.name}`}>
                <span className="font-mono text-xs mr-1.5 text-muted-foreground">{t.ref}</span>
                {t.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Subtopic */}
      <div className="space-y-1">
        <Label className="text-xs">Subtopic</Label>
        <Select value={subtopicId} onValueChange={handleSubtopicChange} disabled={!topicId}>
          <SelectTrigger className="h-8 text-xs w-full">
            {selectedSubtopic ? (
              <span className="truncate">
                <span className="font-mono text-muted-foreground mr-1">{selectedSubtopic.ref}</span>
                {selectedSubtopic.title}
              </span>
            ) : (
              <span className="text-muted-foreground">Select subtopic…</span>
            )}
          </SelectTrigger>
          <SelectContent className="max-h-64 overflow-y-auto" alignItemWithTrigger={false}>
            {subtopics.map((s) => (
              <SelectItem key={s.id} value={s.id} label={`${s.ref} ${s.title}`}>
                <span className="font-mono text-xs mr-1.5 text-muted-foreground">{s.ref}</span>
                {s.title}
                {showTierBadge && <TierBadge tier={s.tier} />}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Sub-subtopic */}
      <div className="space-y-1">
        <Label className="text-xs">Sub-subtopic</Label>
        <Select value={subSubtopicId} onValueChange={handleSubSubtopicChange} disabled={!subtopicId}>
          <SelectTrigger className="h-8 text-xs w-full">
            {selectedSubSubtopic ? (
              <span className="truncate">
                <span className="font-mono text-muted-foreground mr-1">
                  {Number(selectedSubSubtopic.ext_num ?? selectedSubSubtopic.sort_order)}.
                </span>
                {selectedSubSubtopic.outcome.length > 80
                  ? selectedSubSubtopic.outcome.slice(0, 80) + '…'
                  : selectedSubSubtopic.outcome}
              </span>
            ) : (
              <span className="text-muted-foreground">Select sub-subtopic…</span>
            )}
          </SelectTrigger>
          <SelectContent className="max-h-64 overflow-y-auto" alignItemWithTrigger={false}>
            {subSubtopics.map((s) => {
              const num = Number(s.ext_num ?? s.sort_order)
              return (
                <SelectItem key={s.id} value={s.id} label={`${num}. ${s.outcome}`}>
                  <span className="font-mono text-xs mr-1 text-muted-foreground">{num}.</span>
                  <span>
                    {s.outcome.length > 80 ? s.outcome.slice(0, 80) + '…' : s.outcome}
                  </span>
                  {showTierBadge && <TierBadge tier={s.tier} />}
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
