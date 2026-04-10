'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Target, TrendingUp, Calendar, BookOpen, Upload, ClipboardCheck, RefreshCw } from 'lucide-react'

interface TopicBreakdown {
  topic_id: string
  topic_name: string
  topic_ref: string
  daily_target: number
  total_target: number
  total_approved: number
  done_today: number
}

interface ProgressData {
  daily_target: number
  done_today: number
  done_week: number
  done_month: number
  total_approved: number
  topic_breakdown: TopicBreakdown[]
}

interface Props {
  fullName: string
  role: string
}

function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function TutorDashboard({ fullName, role }: Props) {
  const [data, setData] = useState<ProgressData | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState(new Date())

  async function fetchProgress() {
    try {
      const res = await fetch('/api/tutor/progress')
      if (res.ok) setData(await res.json())
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProgress()
    const iv = setInterval(() => { fetchProgress(); setLastRefresh(new Date()) }, 60000)
    return () => clearInterval(iv)
  }, [])

  const dailyPct = data
    ? Math.min(100, Math.round((data.done_today / Math.max(data.daily_target, 1)) * 100))
    : 0
  const barColor = dailyPct >= 100 ? 'bg-green-500' : dailyPct >= 50 ? 'bg-blue-500' : 'bg-amber-500'
  const firstName = fullName.split(' ')[0]

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {getGreeting()}, {firstName} 👋
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {new Date().toLocaleDateString('en-GB', {
              weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
            })}
          </p>
        </div>
        <button
          onClick={() => { setLoading(true); fetchProgress(); setLastRefresh(new Date()) }}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: <Target className="w-5 h-5 text-blue-600" />, label: 'Daily Target', value: data?.daily_target ?? 0, bg: 'bg-blue-50' },
          {
            icon: <TrendingUp className="w-5 h-5 text-green-600" />, label: 'Done Today',
            value: data?.done_today ?? 0, bg: 'bg-green-50',
            highlight: !loading && (data?.done_today ?? 0) >= (data?.daily_target ?? 1) && (data?.daily_target ?? 0) > 0,
          },
          { icon: <Calendar className="w-5 h-5 text-purple-600" />, label: 'This Week', value: data?.done_week ?? 0, bg: 'bg-purple-50' },
          { icon: <BookOpen className="w-5 h-5 text-orange-600" />, label: 'This Month', value: data?.done_month ?? 0, bg: 'bg-orange-50' },
        ].map(({ icon, label, value, bg, highlight }) => (
          <div
            key={label}
            className={`rounded-xl border p-4 ${highlight ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-white'}`}
          >
            <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center mb-3`}>{icon}</div>
            <p className="text-2xl font-bold text-gray-900">{loading ? '—' : value.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Daily Progress Bar */}
      {data && data.daily_target > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-semibold text-gray-800">Today&apos;s Progress</h2>
            <span className="text-sm font-medium text-gray-600">
              {data.done_today} / {data.daily_target} questions
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${barColor}`}
              style={{ width: `${dailyPct}%` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-gray-500">{dailyPct}% complete</span>
            {dailyPct >= 100
              ? <span className="text-xs text-green-600 font-medium">🎉 Target reached!</span>
              : <span className="text-xs text-gray-500">{data.daily_target - data.done_today} remaining</span>
            }
          </div>
        </div>
      )}

      {/* Topic Breakdown */}
      {data && data.topic_breakdown.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-800 mb-4">My Assigned Topics</h2>
          <div className="space-y-5">
            {data.topic_breakdown.map((t) => {
              const pct = t.total_target > 0
                ? Math.min(100, Math.round((t.total_approved / t.total_target) * 100))
                : 0
              return (
                <div key={t.topic_id}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      {t.topic_ref}: {t.topic_name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {t.total_approved.toLocaleString()} / {t.total_target.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-blue-500 transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-0.5">
                    <span className="text-xs text-gray-400">{pct}% of target</span>
                    <span className="text-xs text-gray-400">+{t.done_today} today</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* No assignments warning */}
      {!loading && data && data.topic_breakdown.length === 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-center">
          <p className="text-amber-800 font-medium">No topics assigned yet</p>
          <p className="text-amber-600 text-sm mt-1">
            Ask an admin to assign topics to you from the Users &rarr; Assignments page.
          </p>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            href="/admin/upload"
            className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
          >
            <Upload className="w-5 h-5" />
            <span className="font-medium text-sm">Upload PDF</span>
          </Link>
          <Link
            href="/admin/review"
            className="flex items-center gap-3 p-3 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
          >
            <ClipboardCheck className="w-5 h-5" />
            <span className="font-medium text-sm">Review Queue</span>
          </Link>
        </div>
      </div>

      <p className="text-xs text-gray-400 text-center">
        Last updated: {lastRefresh.toLocaleTimeString()} · Auto-refreshes every 60s
      </p>
    </div>
  )
}
