import { StatusQuestionsLibrary } from '../status-library'

export const dynamic = 'force-dynamic'

export default function DeletedQuestionsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Deleted Questions</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Soft-deleted questions. Restore to active or to rejected.
      </p>
      <StatusQuestionsLibrary mode="deleted" />
    </div>
  )
}
