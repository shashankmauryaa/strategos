import { Crosshair, Globe2, ArrowLeftRight, Atom, Siren, TrendingUp, Users, Plane } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'
import { StatCard } from '@/components/ui/stat-card'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { conflictEvents, conflictSummary } from '@/data/conflicts'
import { supplierRankings, expenditureTrend } from '@/data/arms'
import { alerts } from '@/data/alerts'
import { nuclearStates } from '@/data/alerts'
import { formatNumber, formatCurrency } from '@/lib/utils'
import { Link } from 'react-router-dom'

const COLORS = ['#22c55e', '#3b82f6', '#eab308', '#ef4444', '#8b5cf6', '#f97316', '#06b6d4', '#ec4899', '#14b8a6', '#f59e0b']

export function Dashboard() {
  const topConflicts = conflictEvents
    .filter(e => e.intensity === 'critical' || e.intensity === 'high')
    .sort((a, b) => b.fatalities - a.fatalities)
    .slice(0, 5)

  const recentAlerts = alerts.filter(a => !a.read).slice(0, 4)
  const totalWarheads = nuclearStates.reduce((sum, s) => sum + s.warheads, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Intelligence Dashboard</h1>
          <p className="text-sm text-muted-foreground">Global situational awareness • Real-time data</p>
        </div>
        <Badge variant="critical" className="animate-pulse">
          <span className="mr-1.5 h-2 w-2 rounded-full bg-red-500 inline-block" />
          {conflictSummary.criticalHotspots} Critical Hotspots
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Conflicts"
          value={conflictSummary.activeConflicts}
          change="+3 this month"
          changeType="negative"
          icon={Crosshair}
          iconColor="text-red-400"
        />
        <StatCard
          title="Countries Affected"
          value={conflictSummary.countriesAffected}
          change="+2 new"
          changeType="negative"
          icon={Globe2}
          iconColor="text-orange-400"
        />
        <StatCard
          title="Arms Transfers Today"
          value="12"
          change="$2.3B value"
          changeType="neutral"
          icon={ArrowLeftRight}
          iconColor="text-blue-400"
        />
        <StatCard
          title="Nuclear Arsenal"
          value={formatNumber(totalWarheads)}
          change="9 nuclear states"
          changeType="neutral"
          icon={Atom}
          iconColor="text-yellow-400"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                Global Military Expenditure ($ Millions)
              </span>
              <Link to="/arms-flow" className="text-xs text-primary hover:underline">View Details →</Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={expenditureTrend}>
                <defs>
                  <linearGradient id="colorGlobal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorNato" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorAsia" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#eab308" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#eab308" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="year" stroke="#525252" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#525252" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}B`} />
                <Tooltip
                  contentStyle={{ background: '#1a1b23', border: '1px solid #2e303a', borderRadius: '8px', fontSize: '12px' }}
                  labelStyle={{ color: '#fff' }}
                  formatter={(value: number) => [`$${formatNumber(value * 1000000)}`, '']}
                />
                <Area type="monotone" dataKey="global" stroke="#22c55e" fill="url(#colorGlobal)" strokeWidth={2} name="Global" />
                <Area type="monotone" dataKey="nato" stroke="#3b82f6" fill="url(#colorNato)" strokeWidth={2} name="NATO" />
                <Area type="monotone" dataKey="asia" stroke="#eab308" fill="url(#colorAsia)" strokeWidth={2} name="Asia-Pacific" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Siren className="h-4 w-4 text-red-400" />
              Active Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentAlerts.map((alert) => (
                <div key={alert.id} className="p-3 rounded-lg bg-secondary/50 border border-border hover:border-primary/20 transition-colors">
                  <div className="flex items-start justify-between mb-1">
                    <Badge variant={alert.severity === 'critical' ? 'critical' : alert.severity === 'warning' ? 'warning' : 'info'}>
                      {alert.severity}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground">{alert.region}</span>
                  </div>
                  <p className="text-xs font-medium text-foreground mt-1">{alert.title}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{alert.description}</p>
                </div>
              ))}
              <Link to="/alerts" className="block text-center text-xs text-primary hover:underline py-1">
                View all alerts →
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crosshair className="h-4 w-4 text-red-400" />
              Top Conflicts by Fatalities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topConflicts.map((conflict, i) => (
                <Link key={conflict.id} to={`/conflicts/${conflict.id}`} className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors">
                  <span className="text-xs font-bold text-muted-foreground w-4">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{conflict.name}</p>
                    <p className="text-xs text-muted-foreground">{conflict.country}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-red-400">{conflict.fatalities}</p>
                    <Badge variant={conflict.intensity as 'critical' | 'high' | 'medium' | 'low'} className="text-[10px]">
                      {conflict.intensity}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowLeftRight className="h-4 w-4 text-blue-400" />
              Top Arms Suppliers (Market Share)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={supplierRankings.slice(0, 6)}
                  dataKey="share"
                  nameKey="country"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  strokeWidth={0}
                >
                  {supplierRankings.slice(0, 6).map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#1a1b23', border: '1px solid #2e303a', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(value: number) => [`${value}%`, 'Share']}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-1 mt-2">
              {supplierRankings.slice(0, 6).map((s, i) => (
                <div key={s.code} className="flex items-center gap-1.5 text-xs">
                  <div className="w-2 h-2 rounded-full" style={{ background: COLORS[i] }} />
                  <span className="text-muted-foreground">{s.country}</span>
                  <span className="font-medium text-foreground ml-auto">{s.share}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              Military Personnel Rankings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                layout="vertical"
                data={[
                  { name: 'China', value: 2035 },
                  { name: 'India', value: 1455 },
                  { name: 'USA', value: 1388 },
                  { name: 'N. Korea', value: 1280 },
                  { name: 'Russia', value: 1330 },
                  { name: 'Ukraine', value: 900 },
                ]}
              >
                <XAxis type="number" stroke="#525252" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}K`} />
                <YAxis type="category" dataKey="name" stroke="#525252" fontSize={11} tickLine={false} axisLine={false} width={65} />
                <Tooltip
                  contentStyle={{ background: '#1a1b23', border: '1px solid #2e303a', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(value: number) => [`${formatNumber(value * 1000)} personnel`, '']}
                />
                <Bar dataKey="value" fill="#22c55e" radius={[0, 4, 4, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/20">
              <Plane className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">War Outcome Simulator</h3>
              <p className="text-sm text-muted-foreground">Run probabilistic conflict scenarios with Monte Carlo simulation</p>
            </div>
          </div>
          <Link
            to="/simulator"
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Launch Simulator →
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
