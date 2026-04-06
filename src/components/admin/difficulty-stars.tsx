import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

export function DifficultyStars({ value }: { value: number }) {
  return (
    <span className="flex gap-0.5" aria-label={`Difficulty ${value} of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={cn(
            'h-3 w-3',
            i < value
              ? 'fill-amber-400 text-amber-400'
              : 'fill-none text-muted-foreground/20',
          )}
        />
      ))}
    </span>
  )
}
