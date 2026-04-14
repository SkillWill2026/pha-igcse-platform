'use client'

import { useState, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type DatabankDoc = {
  id: string
  title: string
  doc_type: string
  topic_id: string | null
  file_name: string
  file_size: number | null
  page_count: number | null
  chunk_count: number
  processing_status: string
  processing_error: string | null
  created_at: string
  topics: { name: string; ref: string } | null
}

type Topic = {
  id: string
  name: string
  ref: string
}

type Props = {
  initialDocuments: unknown[]
  initialTopics: unknown[]
  initialError: string | null
  role: string
}

const DOC_TYPES = [
  { value: 'textbook', label: 'Textbook' },
  { value: 'past_paper', label: 'Past paper' },
  { value: 'mark_scheme', label: 'Mark scheme' },
  { value: 'revision_guide', label: 'Revision guide' },
]

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  processing: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  completed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  failed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

function formatBytes(bytes: number | null) {
  if (!bytes) return '—'
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

export function DatabankDocumentsClient({ initialDocuments, initialTopics, initialError, role }: Props) {
  const [documents, setDocuments] = useState<DatabankDoc[]>(initialDocuments as DatabankDoc[])
  const topics = initialTopics as Topic[]

  const [title, setTitle] = useState('')
  const [docType, setDocType] = useState('past_paper')
  const [topicId, setTopicId] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleUpload = async () => {
    if (!file || !title || !docType) {
      setUploadError('Please fill in all required fields and select a PDF.')
      return
    }
    setUploadError(null)
    setUploading(true)

    try {
      // Step 1: get signed upload URL
      const urlRes = await fetch('/api/databank/upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: file.name }),
      })
      const urlData = await urlRes.json()
      if (!urlRes.ok) throw new Error(urlData.error || 'Failed to get upload URL')

      const { signedUrl, filePath } = urlData

      // Step 2: upload directly to Supabase Storage using JS client
      const { error: storageError } = await supabaseClient.storage
        .from('databank')
        .uploadToSignedUrl(filePath, urlData.token, file, {
          contentType: 'application/pdf',
        })
      if (storageError) throw new Error(`Storage upload failed: ${storageError.message}`)

      // Step 3: create DB record
      const docRes = await fetch('/api/databank/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          doc_type: docType,
          topic_id: topicId || null,
          file_path: filePath,
          file_name: file.name,
          file_size: file.size,
        }),
      })
      const docData = await docRes.json()
      if (!docRes.ok) throw new Error(docData.error || 'Failed to create document record')

      const newDoc: DatabankDoc = docData.document
      setDocuments(prev => [newDoc, ...prev])
      setTitle('')
      setDocType('past_paper')
      setTopicId('')
      setFile(null)
      if (fileRef.current) fileRef.current.value = ''

      setUploading(false)
      setProcessingId(newDoc.id)

      // Step 4: trigger processing
      const processRes = await fetch(`/api/databank/process/${newDoc.id}`, { method: 'POST' })
      const processData = await processRes.json()

      setDocuments(prev => prev.map(d =>
        d.id === newDoc.id
          ? {
              ...d,
              processing_status: processRes.ok ? 'completed' : 'failed',
              processing_error: processRes.ok ? null : processData.error,
              chunk_count: processData.chunks ?? 0,
              page_count: processData.pages ?? null,
            }
          : d
      ))
      setProcessingId(null)

    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed')
      setUploading(false)
      setProcessingId(null)
    }
  }

  const handleRetry = async (id: string) => {
    setProcessingId(id)
    setDocuments(prev => prev.map(d =>
      d.id === id ? { ...d, processing_status: 'processing', processing_error: null } : d
    ))

    const res = await fetch(`/api/databank/process/${id}`, { method: 'POST' })
    const data = await res.json()

    setDocuments(prev => prev.map(d =>
      d.id === id
        ? {
            ...d,
            processing_status: res.ok ? 'completed' : 'failed',
            processing_error: res.ok ? null : data.error,
            chunk_count: data.chunks ?? d.chunk_count,
            page_count: data.pages ?? d.page_count,
          }
        : d
    ))
    setProcessingId(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this document and all its chunks? This cannot be undone.')) return
    await fetch(`/api/databank/documents/${id}`, { method: 'DELETE' })
    setDocuments(prev => prev.filter(d => d.id !== id))
  }

  if (initialError) return (
    <div className="p-6 text-red-600 text-sm">Error: {initialError}</div>
  )

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">

      <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-5 space-y-4">
        <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">Upload document</div>

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 sm:col-span-1 space-y-1">
            <label className="text-xs text-gray-500">Title *</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Cambridge 0580 Paper 2 2023"
              className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-gray-500">Document type *</label>
            <select
              value={docType}
              onChange={e => setDocType(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {DOC_TYPES.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-gray-500">Topic (optional)</label>
            <select
              value={topicId}
              onChange={e => setTopicId(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All topics</option>
              {topics.map(t => (
                <option key={t.id} value={t.id}>{t.ref} — {t.name}</option>
              ))}
            </select>
          </div>

          <div className="col-span-2 space-y-1">
            <label className="text-xs text-gray-500">PDF file *</label>
            <input
              ref={fileRef}
              type="file"
              accept=".pdf"
              onChange={e => setFile(e.target.files?.[0] ?? null)}
              className="w-full text-sm text-gray-500 file:mr-3 file:px-3 file:py-1.5 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/30 dark:file:text-blue-400"
            />
          </div>
        </div>

        {uploadError && (
          <div className="text-xs text-red-600 dark:text-red-400">{uploadError}</div>
        )}

        <button
          onClick={handleUpload}
          disabled={uploading || !file || !title}
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
        >
          {uploading ? 'Uploading…' : processingId && !uploading ? 'Processing…' : 'Upload & process'}
        </button>
      </div>

      <div className="space-y-2">
        <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          {documents.length} document{documents.length !== 1 ? 's' : ''}
        </div>

        {documents.length === 0 && (
          <div className="text-sm text-gray-400 py-8 text-center border border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
            No documents yet — upload your first PDF above
          </div>
        )}

        {documents.map(doc => (
          <div
            key={doc.id}
            className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 flex items-start gap-4"
          >
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{doc.title}</span>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${STATUS_STYLES[doc.processing_status] ?? STATUS_STYLES.pending}`}>
                  {doc.processing_status === 'processing' && processingId === doc.id
                    ? 'processing…'
                    : doc.processing_status}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs text-gray-400 flex-wrap">
                <span>{DOC_TYPES.find(t => t.value === doc.doc_type)?.label ?? doc.doc_type}</span>
                {doc.topics && <span>{doc.topics.ref} · {doc.topics.name}</span>}
                <span>{formatBytes(doc.file_size)}</span>
                {doc.page_count && <span>{doc.page_count} pages</span>}
                {doc.chunk_count > 0 && <span>{doc.chunk_count} chunks</span>}
                <span>{new Date(doc.created_at).toLocaleDateString()}</span>
              </div>

              {doc.processing_error && (
                <div className="text-xs text-red-500 dark:text-red-400 mt-1">{doc.processing_error}</div>
              )}
            </div>

            <div className="flex gap-2 shrink-0">
              {doc.processing_status === 'failed' && (
                <button
                  onClick={() => handleRetry(doc.id)}
                  disabled={processingId === doc.id}
                  className="px-3 py-1 text-xs rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 disabled:opacity-50 transition-colors"
                >
                  Retry
                </button>
              )}
              {role === 'admin' && (
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="px-3 py-1 text-xs rounded border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
