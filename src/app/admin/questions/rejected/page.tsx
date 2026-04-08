import { StatusQuestionsLibrary } from '../status-library'

export const dynamic = 'force-dynamic'

export default function RejectedQuestionsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Rejected Questions</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Questions that have been rejected. Restore to active or permanently delete.
      </p>
      <StatusQuestionsLibrary mode="rejected" />
    </div>
  )
}
