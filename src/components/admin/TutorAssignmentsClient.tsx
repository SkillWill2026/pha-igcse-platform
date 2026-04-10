'use client'

import { useState } from 'react'

type Tutor = { id: string; full_name: string; role: string }
type Assignment = { id: string; user_id: string; topic_id: string; subject_id: string }
type Topic = { id: string; name: string; ref: string; subject_id: string | null }
type Subject = { id: string; name: string; code: string; color: string }
type TopicTarget = { topic_id: string; target: number }

type Props = {
  initialTutors: Tutor[]
  initialAssignments: Assignment[]
  initialTopics: Topic[]
  initialSubjects: Subject[]
  initialTargets: TopicTarget[]
}

export function TutorAssignmentsClient({
  initialTutors,
  initialAssignments,
  initialTopics,
  initialSubjects,
  initialTargets,
}: Props) {
  const [tutors] = useState<Tutor[]>(initialTutors)
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments)
  const [topics] = useState<Topic[]>(initialTopics)
  const [subjects] = useState<Subject[]>(initialSubjects)
  const [targets] = useState<TopicTarget[]>(initialTargets)
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(
    initialTutors[0] ?? null
  )
  const [activeSubjectCode, setActiveSubjectCode] = useState(
    initialSubjects[0]?.code ?? '0580'
  )
  const [saving, setSaving] = useState<string | null>(null)

  const activeSubject = subjects.find(s => s.code === activeSubjectCode)

  const topicsForSubject = topics.filter(
    t => t.subject_id === activeSubject?.id
  )

  const isAssigned = (tutorId: string, topicId: string) =>
    assignments.some(a => a.user_id === tutorId && a.topic_id === topicId)

  const tutorTopics = (tutorId: string) =>
    topics.filter(t => assignments.some(a => a.user_id === tutorId && a.topic_id === t.id))

  const topicTarget = (topicId: string) =>
    targets.find(t => t.topic_id === topicId)?.target ?? 0

  const tutorDailyTarget = (tutorId: string) => {
    const assigned = tutorTopics(tutorId)
    const totalTarget = assigned.reduce((sum, t) => sum + topicTarget(t.id), 0)
    return Math.ceil(totalTarget / 108)
  }

  const toggleAssignment = async (tutorId: string, topicId: string) => {
    if (!activeSubject) return
    const key = `${tutorId}-${topicId}`
    setSaving(key)

    const already = isAssigned(tutorId, topicId)

    if (already) {
      await fetch('/api/users/assignments', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: tutorId, topic_id: topicId }),
      })
      setAssignments(prev =>
        prev.filter(a => !(a.user_id === tutorId && a.topic_id === topicId))
      )
    } else {
      await fetch('/api/users/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: tutorId,
          topic_id: topicId,
          subject_id: activeSubject.id,
        }),
      })
      setAssignments(prev => [
        ...prev,
        { id: crypto.randomUUID(), user_id: tutorId, topic_id: topicId, subject_id: activeSubject.id },
      ])
    }

    setSaving(null)
  }

  if (tutors.length === 0) return (
    <div className="flex flex-col items-center justify-center h-64 gap-3">
      <div className="text-3xl">👥</div>
      <div className="font-medium text-gray-700 dark:text-gray-300">No tutors yet</div>
      <div className="text-sm text-gray-400">Add tutors in the Users page first</div>
      <a href="/admin/users" className="text-sm text-blue-600 hover:underline">Go to Users →</a>
    </div>
  )

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">

      {/* ── Left panel: tutor list ── */}
      <div className="w-72 border-r border-gray-200 dark:border-gray-800 flex flex-col shrink-0">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">Tutors</div>
          <div className="text-xs text-gray-400 mt-0.5">{tutors.length} tutor{tutors.length !== 1 ? 's' : ''}</div>
        </div>

        <div className="overflow-y-auto flex-1">
          {tutors.map(tutor => {
            const assignedCount = tutorTopics(tutor.id).length
            const dailyTarget = tutorDailyTarget(tutor.id)
            return (
              <div
                key={tutor.id}
                onClick={() => setSelectedTutor(tutor)}
                className={`p-4 border-b border-gray-100 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors ${
                  selectedTutor?.id === tutor.id
                    ? 'bg-blue-50 dark:bg-blue-950/40 border-l-2 border-l-blue-500'
                    : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-sm font-medium text-blue-700 dark:text-blue-300 shrink-0">
                    {tutor.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                      {tutor.full_name}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {assignedCount > 0
                        ? `${assignedCount} topic${assignedCount !== 1 ? 's' : ''} · ${dailyTarget}/day`
                        : 'No topics assigned'}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Right panel: topic assignment ── */}
      {selectedTutor && (
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                {selectedTutor.full_name}
              </h2>
              <div className="text-sm text-gray-400 mt-0.5">
                {tutorTopics(selectedTutor.id).length} topics assigned ·{' '}
                {tutorDailyTarget(selectedTutor.id)} Q+A pairs/day target
              </div>
            </div>
          </div>

          {/* Subject tabs */}
          {subjects.length > 1 && (
            <div className="flex gap-2">
              {subjects.map(s => (
                <button
                  key={s.code}
                  onClick={() => setActiveSubjectCode(s.code)}
                  className={`px-4 py-1.5 text-sm font-medium rounded-lg border transition-colors ${
                    activeSubjectCode === s.code
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  {s.name} ({s.code})
                </button>
              ))}
            </div>
          )}

          {/* Topic grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {topicsForSubject.map(topic => {
              const assigned = isAssigned(selectedTutor.id, topic.id)
              const key = `${selectedTutor.id}-${topic.id}`
              const isSaving = saving === key
              const target = topicTarget(topic.id)
              const otherTutors = tutors.filter(
                t => t.id !== selectedTutor.id && isAssigned(t.id, topic.id)
              )

              return (
                <div
                  key={topic.id}
                  className={`rounded-lg border p-4 transition-all ${
                    assigned
                      ? 'border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-950/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${
                          assigned
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                            : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                        }`}>
                          {topic.ref}
                        </span>
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                          {topic.name}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400 mt-1.5">
                        Target: {target.toLocaleString()} Q+A pairs
                      </div>
                      {otherTutors.length > 0 && (
                        <div className="text-xs text-gray-400 mt-0.5">
                          Also: {otherTutors.map(t => t.full_name.split(' ')[0]).join(', ')}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => toggleAssignment(selectedTutor.id, topic.id)}
                      disabled={isSaving}
                      className={`shrink-0 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors disabled:opacity-50 ${
                        assigned
                          ? 'border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                          : 'border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                      }`}
                    >
                      {isSaving ? '…' : assigned ? 'Remove' : 'Assign'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Summary */}
          {tutorTopics(selectedTutor.id).length > 0 && (
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Assignment summary
              </div>
              <div className="space-y-1">
                {tutorTopics(selectedTutor.id).map(t => (
                  <div key={t.id} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium text-gray-700 dark:text-gray-300">{t.ref}</span>
                      {' '}{t.name}
                    </span>
                    <span className="text-gray-400">
                      {topicTarget(t.id).toLocaleString()} target
                    </span>
                  </div>
                ))}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2 flex justify-between text-sm font-medium">
                  <span className="text-gray-700 dark:text-gray-300">Daily target</span>
                  <span className="text-blue-600 dark:text-blue-400">
                    {tutorDailyTarget(selectedTutor.id)} Q+A pairs/day
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
