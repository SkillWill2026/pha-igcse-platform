import { cn } from '@/lib/utils'

const STATUS_STYLES: Record<string, string> = {
  draft:    'bg-gray-100   text-gray-700  border border-gray-200',
  approved: 'bg-green-100  text-green-800 border border-green-200',
  rejected: 'bg-red-100    text-red-800   border border-red-200',
}

const STATUS_LABELS: Record<string, string> = {
  draft:    'Draft',
  approved: 'Approved',
  rejected: 'Rejected',
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        STATUS_STYLES[status] ?? 'bg-muted text-muted-foreground',
      )}
    >
      {STATUS_LABELS[status] ?? status}
    </span>
  )
}
