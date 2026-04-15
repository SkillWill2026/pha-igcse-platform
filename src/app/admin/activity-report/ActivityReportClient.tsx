'use client'

import { useEffect, useState, useCallback } from 'react'
import { BarChart2, Download, Printer, RefreshCw } from 'lucide-react'

type Summary = {
  totalBatches: number
  totalFilesUploaded: number
  totalQuestionsExtracted: number
  totalApproved: number
  totalRejected: number
  totalAnswersGenerated: number
  totalPPTDecks: number
  totalDatabankUploads: number  // NEW
}

type UserRow = {
  userId: string
  fullName: string
  role: string
  batchCount: number
  filesUploaded: number
  questionsExtracted: number
  failedFiles: number
  databankUploads: number  // NEW
}

type BatchRow = {
  id: string
  uploadedBy: string
  totalFiles: number
  completedFiles: number
  failedFiles: number
  questionsExtracted: number
  status: string
  createdAt: string
}

type PPTRow = { id: string; title: string; createdAt: string }

// NEW
type DatabankRow = {
  id: string
  title: string
  uploadedBy: string
  docType: string
  createdAt: string
}

type ReportData = {
  period: { from: string; to: string }
  summary: Summary
  byUser: UserRow[]
  recentBatches: BatchRow[]
  recentPPT: PPTRow[]
  recentDatabank: DatabankRow[]  // NEW
}

const PRESETS = [
  { label: 'Last 24 hours', hours: 24 },
  { label: 'Last 7 days',   hours: 168 },
  { label: 'Last 30 days',  hours: 720 },
]

function fmt(iso: string) {
  return new Date(iso).toLocaleString('en-AE', { timeZone: 'Asia/Dubai', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function SummaryCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className={`rounded-xl border p-4 ${color}`}>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </div>
  )
}

export default function ActivityReportClient() {
  const [preset, setPreset]   = useState(0)
  const [data, setData]       = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  const load = useCallback(async (hoursBack: number) => {
    setLoading(true)
    setError(null)
    const from = new Date(Date.now() - hoursBack * 3600000).toISOString()
    const to   = new Date().toISOString()
    try {
      const res = await fetch(`/api/admin/activity-report?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`)
      if (!res.ok) throw new Error(await res.text())
      setData(await res.json())
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load report')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load(PRESETS[preset].hours) }, [preset, load])

  const downloadCSV = () => {
    if (!data) return
    const rows = [
      ['User', 'Role', 'Batches', 'Files Uploaded', 'Questions Extracted', 'Failed Files', 'Databank Uploads'],
      ...data.byUser.map(u => [u.fullName, u.role, u.batchCount, u.filesUploaded, u.questionsExtracted, u.failedFiles, u.databankUploads]),
    ]
    const csv = rows.map(r => r.join(',')).join('\n')
    const a   = document.createElement('a')
    a.href    = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv)
    a.download = `activity-report-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
  }

  const s = data?.summary

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 print:p-2">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 print:hidden">
        <div className="flex items-center gap-2">
          <BarChart2 className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-bold">Activity Report</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg overflow-hidden border">
            {PRESETS.map((p, i) => (
              <button
                key={i}
                onClick={() => setPreset(i)}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${preset === i ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent'}`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <button onClick={() => load(PRESETS[preset].hours)} className="p-1.5 rounded-md border hover:bg-accent" title="Refresh">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={downloadCSV} disabled={!data} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border hover:bg-accent disabled:opacity-50">
            <Download className="h-3.5 w-3.5" /> CSV
          </button>
          <button onClick={() => window.print()} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border hover:bg-accent">
            <Printer className="h-3.5 w-3.5" /> Print
          </button>
        </div>
      </div>

      {/* Print header */}
      <div className="hidden print:block">
        <h1 className="text-2xl font-bold">PHA IGCSE Platform — Activity Report</h1>
        {data && <p className="text-sm text-gray-500">{fmt(data.period.from)} → {fmt(data.period.to)}</p>}
        <p className="text-sm text-gray-500">Generated: {fmt(new Date().toISOString())}</p>
      </div>

      {error && <div className="rounded-lg bg-red-50 text-red-700 border border-red-200 p-4 text-sm">{error}</div>}

      {loading && !data && (
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading report…</div>
      )}

      {data && (
        <>
          <p className="text-xs text-muted-foreground">
            Period: <span className="font-medium">{fmt(data.period.from)}</span> → <span className="font-medium">{fmt(data.period.to)}</span>
          </p>

          {/* Summary cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            <SummaryCard label="Upload Batches"       value={s!.totalBatches}            color="bg-blue-50 border-blue-100" />
            <SummaryCard label="Files Uploaded"       value={s!.totalFilesUploaded}       color="bg-indigo-50 border-indigo-100" />
            <SummaryCard label="Questions Extracted"  value={s!.totalQuestionsExtracted}  color="bg-purple-50 border-purple-100" />
            <SummaryCard label="Approved"             value={s!.totalApproved}            color="bg-green-50 border-green-100" />
            <SummaryCard label="Rejected"             value={s!.totalRejected}            color="bg-red-50 border-red-100" />
            <SummaryCard label="Answers Generated"    value={s!.totalAnswersGenerated}    color="bg-yellow-50 border-yellow-100" />
            <SummaryCard label="PPT Decks"            value={s!.totalPPTDecks}            color="bg-orange-50 border-orange-100" />
            <SummaryCard label="Databank Uploads"     value={s!.totalDatabankUploads}     color="bg-teal-50 border-teal-100" />
          </div>

          {/* Per-user table */}
          <div>
            <h2 className="text-sm font-semibold mb-2">Upload Activity by User</h2>
            {data.byUser.length === 0 ? (
              <p className="text-sm text-muted-foreground">No upload activity in this period.</p>
            ) : (
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      {['User', 'Role', 'Batches', 'Files', 'Extracted', 'Failed', 'Databank'].map(h => (
                        <th key={h} className="text-left px-4 py-2.5 font-medium text-xs text-muted-foreground">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {data.byUser.map(u => (
                      <tr key={u.userId} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-2.5 font-medium">{u.fullName}</td>
                        <td className="px-4 py-2.5 capitalize text-muted-foreground">{u.role}</td>
                        <td className="px-4 py-2.5">{u.batchCount}</td>
                        <td className="px-4 py-2.5">{u.filesUploaded}</td>
                        <td className="px-4 py-2.5">{u.questionsExtracted}</td>
                        <td className="px-4 py-2.5">{u.failedFiles > 0 ? <span className="text-red-600 font-medium">{u.failedFiles}</span> : 0}</td>
                        <td className="px-4 py-2.5">{u.databankUploads}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Recent batches */}
          {data.recentBatches.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold mb-2">Recent Upload Batches</h2>
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      {['Uploaded By', 'Files', 'Extracted', 'Failed', 'Status', 'Time'].map(h => (
                        <th key={h} className="text-left px-4 py-2.5 font-medium text-xs text-muted-foreground">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {data.recentBatches.map(b => (
                      <tr key={b.id} className="hover:bg-muted/30">
                        <td className="px-4 py-2.5 font-medium">{b.uploadedBy}</td>
                        <td className="px-4 py-2.5">{b.totalFiles}</td>
                        <td className="px-4 py-2.5">{b.questionsExtracted}</td>
                        <td className="px-4 py-2.5">{b.failedFiles > 0 ? <span className="text-red-600">{b.failedFiles}</span> : 0}</td>
                        <td className="px-4 py-2.5">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            b.status === 'completed' ? 'bg-green-100 text-green-700' :
                            b.status === 'failed'    ? 'bg-red-100 text-red-700' :
                            b.status === 'partial'   ? 'bg-yellow-100 text-yellow-700' :
                                                       'bg-blue-100 text-blue-700'
                          }`}>{b.status}</span>
                        </td>
                        <td className="px-4 py-2.5 text-muted-foreground text-xs">{fmt(b.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PPT Decks */}
          {data.recentPPT.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold mb-2">PPT Decks Created</h2>
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      {['Title', 'Created At'].map(h => (
                        <th key={h} className="text-left px-4 py-2.5 font-medium text-xs text-muted-foreground">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {data.recentPPT.map(p => (
                      <tr key={p.id} className="hover:bg-muted/30">
                        <td className="px-4 py-2.5 font-medium">{p.title}</td>
                        <td className="px-4 py-2.5 text-muted-foreground text-xs">{fmt(p.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Databank Uploads — NEW */}
          {(data.recentDatabank?.length ?? 0) > 0 && (
            <div>
              <h2 className="text-sm font-semibold mb-2">Recent Databank Uploads</h2>
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      {['Title', 'Uploaded By', 'Type', 'Time'].map(h => (
                        <th key={h} className="text-left px-4 py-2.5 font-medium text-xs text-muted-foreground">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {data.recentDatabank.map(d => (
                      <tr key={d.id} className="hover:bg-muted/30">
                        <td className="px-4 py-2.5 font-medium">{d.title}</td>
                        <td className="px-4 py-2.5">{d.uploadedBy}</td>
                        <td className="px-4 py-2.5 text-muted-foreground capitalize">{d.docType}</td>
                        <td className="px-4 py-2.5 text-muted-foreground text-xs">{fmt(d.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
