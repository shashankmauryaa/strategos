import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/store/useAppStore'
import {
  LayoutDashboard, Map, Globe2, ArrowLeftRight, Crosshair,
  Shield, RadioTower, Bot, Siren, Network, Atom,
  Search, ChevronLeft, ChevronRight, Activity
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Conflict Map', path: '/conflicts', icon: Map },
  { label: 'Countries', path: '/countries', icon: Globe2 },
  { label: 'Arms Flow', path: '/arms-flow', icon: ArrowLeftRight },
  { label: 'Simulator', path: '/simulator', icon: Crosshair },
  { label: 'Nuclear', path: '/nuclear', icon: Atom },
  { label: 'Alliances', path: '/alliances', icon: Network },
  { label: 'OSINT Feed', path: '/osint', icon: RadioTower },
  { label: 'AI Console', path: '/ai', icon: Bot },
  { label: 'Alerts', path: '/alerts', icon: Siren },
  { label: 'Arms Race', path: '/arms-race', icon: Activity },
  { label: 'Search', path: '/search', icon: Search },
  { label: 'Knowledge Graph', path: '/graph', icon: Shield },
]

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebarCollapse } = useAppStore()

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen border-r border-border bg-card flex flex-col transition-all duration-300',
        sidebarCollapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!sidebarCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-foreground tracking-tight">STRATEGOS</h1>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Intelligence Platform</p>
            </div>
          </div>
        )}
        {sidebarCollapsed && (
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center mx-auto">
            <Shield className="w-5 h-5 text-primary" />
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-2 px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-secondary',
                isActive
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'text-muted-foreground hover:text-foreground border border-transparent',
                sidebarCollapsed && 'justify-center px-2'
              )
            }
            title={sidebarCollapsed ? item.label : undefined}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {!sidebarCollapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-border p-2">
        <button
          onClick={toggleSidebarCollapse}
          className="flex items-center justify-center w-full rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : (
            <>
              <ChevronLeft className="h-4 w-4 mr-2" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  )
}
