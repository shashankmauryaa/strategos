import { cn } from '@/lib/utils'
import { Card } from './card'
import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  icon: LucideIcon
  iconColor?: string
  className?: string
}

export function StatCard({ title, value, change, changeType = 'neutral', icon: Icon, iconColor = 'text-primary', className }: StatCardProps) {
  return (
    <Card className={cn('p-4 hover:border-primary/30 transition-colors', className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          {change && (
            <p className={cn(
              'text-xs font-medium',
              changeType === 'positive' && 'text-green-400',
              changeType === 'negative' && 'text-red-400',
              changeType === 'neutral' && 'text-muted-foreground',
            )}>
              {change}
            </p>
          )}
        </div>
        <div className={cn('p-2 rounded-lg bg-secondary', iconColor)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  )
}
