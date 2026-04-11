'use client'

import { useState, useEffect, useCallback } from 'react'

type TopicBreakdown = {
  id: string
  ref: string
  name: string
  target: number
  approved: number
}

type TutorBreakdown = {
  id: string
  name: string
  topic_count: number
  topic_refs: string[]
  total_target: number
  approved: number
  pct: number
  daily_target: number
  status: string
}

type ProgressData = {
  total_target: number
  approved_count: number
  remaining: number
  start_date: string
  end_date: string
  days_elapsed: number
  days_remaining: number
  total_days: number
  dynamic_daily: number
  weekly_target: number
  expected_by_now: number
  variance: number
  on_track: boolean
  topic_breakdown: TopicBreakdown[]
  pct_complete: number
}

type Props = {
  isAdmin: boolean
}

export function ProductionDashboard({ isAdmin }: Props) {
  const [data, setData] = useState<ProgressData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingTarget, setEditingTarget] = useState(false)
  const [newTotal, setNewTotal] = useState('')
  const [editingTopics, setEditingTopics] = useState(false)
  const [topicEdits, setTopicEdits] = useState<Record<string, number>>({})
  const [saving, setSaving] = useState(false)
  const [tutors, setTutors] = useState<TutorBreakdown[]>([])
  const [tutorsLoading, setTutorsLoading] = useState(true)
  const [pptApproved, setPptApproved] = useState(0)
  const [pptRequired, setPptRequired] = useState(0)
  const [pptDraft, setPptDraft]   = useState(0)

  const fetchProgress = useCallback(async () => {
    try {
      const res = await fetch('/api/schedule/progress')
      if (!res.ok) throw new Error('Failed to load progress')
      const json = await res.json()
      setData(json)
      setNewTotal(String(json.total_target))
      const edits: Record<string, number> = {}
      for (const t of json.topic_breakdown) {
        edits[t.id] = t.target
      }
      setTopicEdits(edits)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProgress()
    // Fetch tutor breakdown (admin only)
    fetch('/api/schedule/tutors')
      .then(r => r.json())
      .then(d => { setTutors(d.tutors ?? []); setTutorsLoading(false) })
      .catch(() => setTutorsLoading(false))

    // Fetch live PPT stats
    Promise.all([
      fetch('/api/ppt?status=approved').then(r => r.json()),
      fetch('/api/ppt').then(r => r.json()),
      fetch('/api/schedule/topics').then(r => r.json()),
    ]).then(([approvedData, allData, topicsData]) => {
      const allDecks = allData.decks ?? []
      const approvedDecks = approvedData.decks ?? []
      const allSubtopics = (topicsData.topics ?? []).flatMap((t: { subtopics?: { ppt_required?: boolean }[] }) => t.subtopics ?? [])
      const required = allSubtopics.filter((s: { ppt_required?: boolean }) => s.ppt_required).length
      setPptApproved(approvedDecks.length)
      setPptDraft(allDecks.filter((d: { status: string }) => d.status === 'draft').length)
      setPptRequired(required > 0 ? required : allSubtopics.length)
    }).catch(() => {})
  }, [fetchProgress])

  const saveTotal = async () => {
    setSaving(true)
    await fetch('/api/schedule/targets', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ total_target: parseInt(newTotal) }),
    })
    await fetchProgress()
    setEditingTarget(false)
    setSaving(false)
  }

  const saveTopics = async () => {
    setSaving(true)
    const topic_targets = Object.entries(topicEdits).map(([topic_id, target]) => ({
      topic_id,
      target,
    }))
    await fetch('/api/schedule/targets', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic_targets }),
    })
    await fetchProgress()
    setEditingTopics(false)
    setSaving(false)
  }

  if (loading) return (
    <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
      Loading production data...
    </div>
  )

  if (error) return (
    <div className="p-4 text-red-600 text-sm">Error: {error}</div>
  )

  if (!data) return null

  const varianceLabel = data.variance === 0
    ? 'On track'
    : data.variance > 0
    ? `+${data.variance} ahead`
    : `${Math.abs(data.variance)} behind`

  const varianceColor = data.variance >= 0
    ? 'text-green-600 dark:text-green-400'
    : 'text-amber-600 dark:text-amber-400'

  return (
    <div className="space-y-6 p-6">

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
          <div className="text-xs text-gray-400 mb-1">Total target</div>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-medium text-gray-800 dark:text-gray-100">
              {data.total_target.toLocaleString()}
            </div>
            {isAdmin && (
              <button
                onClick={() => setEditingTarget(true)}
                className="text-xs text-blue-500 hover:text-blue-700"
              >
                Edit
              </button>
            )}
          </div>
          <div className="text-xs text-gray-400 mt-1">Q + A approved pairs</div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
          <div className="text-xs text-gray-400 mb-1">Approved so far</div>
          <div className="text-2xl font-medium text-green-600 dark:text-green-400">
            {data.approved_count.toLocaleString()}
          </div>
          <div className="text-xs text-gray-400 mt-1">{data.pct_complete}% complete</div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
          <div className="text-xs text-gray-400 mb-1">Days remaining</div>
          <div className="text-2xl font-medium text-gray-800 dark:text-gray-100">
            {data.days_remaining}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Until {new Date(data.end_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
          <div className="text-xs text-gray-400 mb-1">Today's target</div>
          <div className="text-2xl font-medium text-gray-800 dark:text-gray-100">
            {data.dynamic_daily}
          </div>
          <div className={`text-xs mt-1 font-medium ${varianceColor}`}>
            {varianceLabel}
          </div>
        </div>
      </div>

      {/* Edit total target modal */}
      {editingTarget && (
        <div className="rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20 p-4 flex items-center gap-3">
          <span className="text-sm text-blue-700 dark:text-blue-300">New total target:</span>
          <input
            type="number"
            value={newTotal}
            onChange={e => setNewTotal(e.target.value)}
            className="w-28 px-2 py-1 text-sm border border-blue-300 dark:border-blue-700 rounded bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={saveTotal}
            disabled={saving}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
          <button
            onClick={() => setEditingTarget(false)}
            className="px-3 py-1 text-sm border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Overall progress bar */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Overall progress</span>
          <span className="text-xs text-gray-400">
            {data.approved_count.toLocaleString()} / {data.total_target.toLocaleString()}
          </span>
        </div>
        <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-3 overflow-hidden">
          <div
            className="h-3 rounded-full bg-green-500 transition-all duration-500"
            style={{ width: `${Math.min(100, data.pct_complete)}%` }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs text-gray-400">
            {new Date(data.start_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
          </span>
          <span className={`text-xs font-medium ${varianceColor}`}>
            {varianceLabel} · {data.days_remaining} days left · {data.dynamic_daily}/day needed
          </span>
          <span className="text-xs text-gray-400">
            {new Date(data.end_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
          </span>
        </div>
      </div>

      {/* Monthly milestones */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Monthly milestones</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { month: 'April', days: 18, start: '2025-04-13', end: '2025-04-30' },
            { month: 'May', days: 31, start: '2025-05-01', end: '2025-05-31' },
            { month: 'June', days: 30, start: '2025-06-01', end: '2025-06-30' },
            { month: 'July', days: 30, start: '2025-07-01', end: '2025-07-30' },
          ].map(m => {
            const monthTarget = Math.round((m.days / data.total_days) * data.total_target)
            const endDate = new Date(m.end)
            const isCurrent = new Date(m.start) <= new Date() && new Date() <= endDate
            return (
              <div
                key={m.month}
                className={`text-center p-3 rounded-lg ${
                  isCurrent
                    ? 'bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800'
                    : 'bg-gray-50 dark:bg-gray-900'
                }`}
              >
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">{m.month}</div>
                <div className="text-xs text-gray-400 mt-0.5">{m.days} days</div>
                <div className="text-xl font-medium text-green-600 dark:text-green-400 mt-2">
                  {monthTarget.toLocaleString()}
                </div>
                <div className="text-xs text-gray-400">target</div>
                {isCurrent && (
                  <div className="text-xs text-blue-500 mt-1 font-medium">Current</div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Topic breakdown */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">By topic</div>
          {isAdmin && (
            <button
              onClick={() => setEditingTopics(e => !e)}
              className="text-xs px-3 py-1 border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
            >
              {editingTopics ? 'Cancel' : 'Edit targets'}
            </button>
          )}
        </div>

        <div className="space-y-3">
          {data.topic_breakdown.map(t => {
            const pct = t.target > 0 ? Math.min(100, Math.round((t.approved / t.target) * 100)) : 0
            const status = t.approved === 0
              ? 'not-started'
              : pct >= 100
              ? 'complete'
              : t.approved >= Math.round(t.target * (data.days_elapsed / data.total_days))
              ? 'on-track'
              : 'behind'
            const statusLabel = {
              'not-started': 'Not started',
              complete: 'Complete',
              'on-track': 'On track',
              behind: 'Behind',
            }[status]
            const statusColor = {
              'not-started': 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
              complete: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
              'on-track': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
              behind: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
            }[status]

            return (
              <div key={t.id} className="flex items-center gap-3">
                <span className="text-xs font-medium text-gray-400 w-8 shrink-0">{t.ref}</span>
                <span className="text-xs text-gray-600 dark:text-gray-400 w-40 shrink-0 truncate">{t.name}</span>
                <div className="flex-1">
                  <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-green-500 transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
                {editingTopics ? (
                  <input
                    type="number"
                    value={topicEdits[t.id] ?? t.target}
                    onChange={e => setTopicEdits(prev => ({ ...prev, [t.id]: parseInt(e.target.value) || 0 }))}
                    className="w-20 px-2 py-0.5 text-xs border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                ) : (
                  <span className="text-xs text-gray-400 w-20 text-right shrink-0">
                    {t.approved} / {t.target.toLocaleString()}
                  </span>
                )}
                <span className={`text-xs px-2 py-0.5 rounded font-medium shrink-0 ${statusColor}`}>
                  {statusLabel}
                </span>
              </div>
            )
          })}
        </div>

        {editingTopics && (
          <div className="mt-4 flex gap-2">
            <button
              onClick={saveTopics}
              disabled={saving}
              className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save topic targets'}
            </button>
          </div>
        )}
      </div>

      {/* By tutor breakdown — admin only */}
      {isAdmin && (
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">By tutor</div>
          {tutorsLoading ? (
            <div className="text-xs text-gray-400">Loading tutor data…</div>
          ) : tutors.length === 0 ? (
            <div className="text-xs text-gray-400">No tutors found. Create tutor accounts in Users.</div>
          ) : (
            <div className="space-y-4">
              {tutors.map(tutor => {
                const statusColor = {
                  'unassigned': 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
                  'not-started': 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
                  'complete': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
                  'on-track': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
                  'behind': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
                }[tutor.status] ?? 'bg-gray-100 text-gray-500'
                const statusLabel = {
                  'unassigned': 'Unassigned',
                  'not-started': 'Not started',
                  'complete': 'Complete',
                  'on-track': 'On track',
                  'behind': 'Behind',
                }[tutor.status] ?? tutor.status
                const barColor = tutor.status === 'complete' ? 'bg-green-500'
                  : tutor.status === 'on-track' ? 'bg-blue-500'
                  : tutor.status === 'behind' ? 'bg-amber-500'
                  : 'bg-gray-300'

                return (
                  <div key={tutor.id} className="rounded-lg border border-gray-100 dark:border-gray-800 p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-xs font-bold text-indigo-600 dark:text-indigo-400 shrink-0">
                          {tutor.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-800 dark:text-gray-200">{tutor.name}</div>
                          <div className="text-xs text-gray-400">
                            {tutor.topic_count === 0
                              ? 'No topics assigned'
                              : `${tutor.topic_count} topics · ${tutor.topic_refs.join(', ')}`}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        {tutor.total_target > 0 && (
                          <div className="text-right">
                            <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                              {tutor.daily_target}/day needed
                            </div>
                            <div className="text-xs text-gray-400">
                              {tutor.approved.toLocaleString()} / {tutor.total_target.toLocaleString()}
                            </div>
                          </div>
                        )}
                        <span className={`text-xs px-2 py-0.5 rounded font-medium ${statusColor}`}>
                          {statusLabel}
                        </span>
                      </div>
                    </div>
                    {tutor.total_target > 0 && (
                      <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                          style={{ width: `${Math.min(100, tutor.pct)}%` }}
                        />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* PPT progress */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">PPT presentations</div>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-blue-500 transition-all"
                style={{ width: pptRequired > 0 ? `${Math.round((pptApproved / pptRequired) * 100)}%` : '0%' }}
              />
            </div>
          </div>
          <span className="text-xs text-gray-400">
            {pptApproved} / {pptRequired} approved
          </span>
        </div>
        <div className="flex items-center gap-3 mt-2">
          {pptDraft > 0 && (
            <span className="text-xs text-amber-500">{pptDraft} draft{pptDraft !== 1 ? 's' : ''} pending review</span>
          )}
          <span className="text-xs text-gray-400 ml-auto">1 PPT per subtopic</span>
        </div>
      </div>

    </div>
  )
}
