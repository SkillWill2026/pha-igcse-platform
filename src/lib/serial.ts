export function displayQuestionSerial(serial: string | null, status: string): string {
  if (!serial) return '—'
  const prefix = status === 'rejected' ? 'R' : status === 'deleted' ? 'D' : ''
  return prefix + serial
}

export function displayAnswerSerial(serial: string | null, status: string): string {
  if (!serial) return '—'
  const prefix = status === 'rejected' ? 'R' : status === 'deleted' ? 'D' : ''
  return prefix + serial
}

export function serialBadgeColor(status: string): string {
  if (status === 'rejected') return 'bg-amber-100 text-amber-800'
  if (status === 'deleted') return 'bg-red-100 text-red-800'
  return 'bg-blue-100 text-blue-800'
}
