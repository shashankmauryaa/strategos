import { Search, Bell, Wifi } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { alerts } from '@/data/alerts'
import { Badge } from '@/components/ui/badge'

export function TopBar() {
  const { searchQuery, setSearchQuery } = useAppStore()
  const unreadAlerts = alerts.filter(a => !a.read).length

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-border bg-card/80 backdrop-blur-sm px-6">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Wifi className="h-3 w-3 text-primary animate-pulse" />
        <span className="uppercase tracking-wider font-medium">Live Intelligence Feed</span>
        <Badge variant="default" className="ml-1">Active</Badge>
      </div>

      <div className="flex-1 flex justify-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search countries, conflicts, weapons, alliances..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-border bg-secondary/50 py-2 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground bg-secondary px-1.5 py-0.5 rounded border border-border">⌘K</kbd>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse-glow" />
          <span>32 Active Conflicts</span>
        </div>
        <button className="relative p-2 rounded-lg hover:bg-secondary transition-colors">
          <Bell className="h-4 w-4 text-muted-foreground" />
          {unreadAlerts > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
              {unreadAlerts}
            </span>
          )}
        </button>
      </div>
    </header>
  )
}
