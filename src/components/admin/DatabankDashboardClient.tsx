'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

type TopicStat = {
  id: string
  ref: string
  name: string
  doc_count: number
  chunk_count: number
}

type Stats = {
  total_documents: number
  total_chunks: number
  covered_topics: number
  total_topics: number
  by_status: Record<string, number>
  by_type: Record<string, number>
  topic_coverage: TopicStat[]
}

type RecentDoc = {
  id: string
  title: string
  doc_type: string
  processing_status: string
  chunk_count: number
  page_count: number | null
  created_at: string
  topics: { name: string; ref: string } | null
}

type Props = {
  initialStats: unknown
  initialRecentDocs: unknown[]
  initialError: string | null
}

const DOC_TYPE_LABELS: Record<string, string> = {
  textbook: 'Textbook',
  past_paper: 'Past paper',
  mark_scheme: 'Mark scheme',
  revision_guide: 'Revision guide',
}

const STATUS_STYLES: Record<string, string> = {
  completed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  processing: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  pending: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  failed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

function CoverageBar({ value, max }: { value: number; max: number }) {
  const pct = max === 0 ? 0 : Math.round((value / max) * 100)
  const color = pct === 0
    ? 'bg-gray-200 dark:bg-gray-700'
    : pct < 30
    ? 'bg-amber-400'
    : pct < 70
    ? 'bg-blue-400'
    : 'bg-green-400'

  return (
    <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5 mt-1">
      <div
        className={`h-1.5 rounded-full transition-all duration-500 ${color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

export function DatabankDashboardClient({ initialStats, initialRecentDocs, initialError }: Props) {
  const [stats, setStats] = useState<Stats | null>(initialStats as Stats | null)
  const recentDocs = initialRecentDocs as RecentDoc[]

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch('/api/databank/stats')
      if (res.ok) {
        const data = await res.json()
        setStats(data)
      }
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  if (initialError) return (
    <div className="p-6 text-red-600 text-sm">Error: {initialError}</div>
  )

  if (!stats) return (
    <div className="p-6 text-gray-400 text-sm">Loading stats…</div>
  )

  const maxChunks = Math.max(...stats.topic_coverage.map(t => t.chunk_count), 1)

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">

      {/* Top stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-1">
          <div className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            {stats.total_documents}
          </div>
          <div className="text-xs text-gray-400">Total documents</div>
        </div>
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-1">
          <div className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            {stats.total_chunks.toLocaleString()}
          </div>
          <div className="text-xs text-gray-400">Total chunks</div>
        </div>
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-1">
          <div className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            {stats.covered_topics}
            <span className="text-sm font-normal text-gray-400"> / {stats.total_topics}</span>
          </div>
          <div className="text-xs text-gray-400">Topics covered</div>
        </div>
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-1">
          <div className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            {stats.by_status.failed > 0
              ? <span className="text-red-500">{stats.by_status.failed}</span>
              : stats.by_status.processing > 0
              ? <span className="text-blue-500">{stats.by_status.processing}</span>
              : <span className="text-green-500">{stats.by_status.completed}</span>
            }
          </div>
          <div className="text-xs text-gray-400">
            {stats.by_status.failed > 0
              ? 'Failed — needs retry'
              : stats.by_status.processing > 0
              ? 'Currently processing'
              : 'All completed'}
          </div>
        </div>
      </div>

      {/* Two column: doc types + flagged answers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* By doc type */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-3">
          <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">Documents by type</div>
          {Object.entries(DOC_TYPE_LABELS).map(([key, label]) => (
            <div key={key} className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">{label}</span>
              <span className="font-medium text-gray-800 dark:text-gray-200">
                {stats.by_type[key] ?? 0}
              </span>
            </div>
          ))}
        </div>

        {/* Answer queue shortcut */}
        <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20 p-4 space-y-3">
          <div className="text-sm font-semibold text-amber-800 dark:text-amber-300">Answer quality</div>
          <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
            Low-confidence answers need tutor review before they appear to students.
            Use the Answer Queue to approve, edit, or reject flagged answers.
          </p>
          <Link
            href="/admin/answer-queue"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium rounded-lg transition-colors"
          >
            Go to Answer Queue →
          </Link>
        </div>
      </div>

      {/* Topic coverage heatmap */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">Topic coverage</div>
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600 inline-block"/>
              None
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block"/>
              Low
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-400 inline-block"/>
              Medium
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-400 inline-block"/>
              Good
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {stats.topic_coverage.map(t => (
            <div key={t.id} className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate pr-2">
                  <span className="text-gray-400 mr-1">{t.ref}</span>
                  {t.name}
                </div>
                <div className="text-xs text-gray-400 shrink-0">
                  {t.doc_count > 0
                    ? `${t.doc_count} doc${t.doc_count !== 1 ? 's' : ''} · ${t.chunk_count} chunks`
                    : 'no documents'}
                </div>
              </div>
              <CoverageBar value={t.chunk_count} max={maxChunks} />
            </div>
          ))}
        </div>
      </div>

      {/* Recent uploads */}
      {recentDocs.length > 0 && (
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">Recent uploads</div>
            <Link
              href="/admin/databank/documents"
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
            >
              View all →
            </Link>
          </div>
          {recentDocs.map(doc => (
            <div key={doc.id} className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="text-sm text-gray-700 dark:text-gray-300 truncate">{doc.title}</div>
                <div className="text-xs text-gray-400 mt-0.5">
                  {DOC_TYPE_LABELS[doc.doc_type] ?? doc.doc_type}
                  {doc.topics && ` · ${doc.topics.ref}`}
                  {doc.page_count && ` · ${doc.page_count} pages`}
                  {doc.chunk_count > 0 && ` · ${doc.chunk_count} chunks`}
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded text-xs font-medium shrink-0 ${STATUS_STYLES[doc.processing_status] ?? STATUS_STYLES.pending}`}>
                {doc.processing_status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
