'use client'

import { PPTSection }      from '@/components/schedule/PPTSection'
import { ExamplesSection } from '@/components/schedule/ExamplesSection'
import type { Subtopic }   from '@/types/schedule'

interface Props {
  subtopic:    Subtopic
  topicRef:    string
  topicName:   string
  isAdmin:     boolean
  onUpdate:    (subtopic: Subtopic) => void
}

export function SubtopicExpandedRow({ subtopic, topicRef, topicName, isAdmin, onUpdate }: Props) {
  function handleCountChange(count: number) {
    onUpdate({ ...subtopic, examples_count: count })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 py-4 bg-muted/10 border-t">
      {/* PPT Section */}
      <div className="min-w-0">
        <PPTSection
          subtopic={subtopic}
          topicRef={topicRef}
          isAdmin={isAdmin}
          onUpdate={onUpdate}
        />
      </div>

      {/* Divider on desktop */}
      <div className="hidden md:block absolute left-1/2 top-4 bottom-4 w-px bg-border" />

      {/* Examples Section */}
      <div className="min-w-0">
        <ExamplesSection
          subtopic={subtopic}
          topicName={topicName}
          isAdmin={isAdmin}
          onCountChange={handleCountChange}
        />
      </div>
    </div>
  )
}
