import { Atom, AlertTriangle } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { nuclearStates } from '@/data/alerts'

const totalWarheads = nuclearStates.reduce((s, n) => s + n.warheads, 0)
const chartData = nuclearStates.map(n => ({ name: n.country, warheads: n.warheads })).sort((a, b) => b.warheads - a.warheads)

export function Nuclear() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Nuclear Risk Dashboard</h1>
          <p className="text-sm text-muted-foreground">Global nuclear arsenal tracking • Treaty compliance • Risk assessment</p>
        </div>
        <Badge variant="critical">
          <Atom className="h-3 w-3 mr-1" />
          {totalWarheads.toLocaleString()} Total Warheads
        </Badge>
      </div>

      <Card>
        <CardHeader><CardTitle>Global Nuclear Arsenal Distribution</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" stroke="#525252" fontSize={11} tickLine={false} axisLine={false} angle={-20} textAnchor="end" height={60} />
              <YAxis stroke="#525252" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: '#1a1b23', border: '1px solid #2e303a', borderRadius: '8px', fontSize: '12px' }} />
              <Bar dataKey="warheads" fill="#eab308" radius={[4, 4, 0, 0]} barSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {nuclearStates.map(state => (
          <Card key={state.code} className="p-4 hover:border-yellow-500/30 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground">{state.country}</h3>
              <Badge variant={state.treatyCompliance === 'compliant' ? 'default' : state.treatyCompliance === 'partial' ? 'warning' : 'critical'}>
                {state.treatyCompliance}
              </Badge>
            </div>
            <div className="text-center my-4">
              <p className="text-3xl font-bold text-yellow-400">{state.warheads.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Estimated Warheads</p>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Doctrine</span>
                <span className="text-foreground font-medium">{state.doctrine}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Test</span>
                <span className="text-foreground">{state.lastTest}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Delivery Systems:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {state.deliverySystems.map(s => <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>)}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="border-yellow-500/20 bg-yellow-500/5 p-6">
        <div className="flex items-start gap-4">
          <AlertTriangle className="h-6 w-6 text-yellow-400 shrink-0" />
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-1">Nuclear Risk Assessment</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Current global nuclear risk level is assessed as ELEVATED. Key factors: ongoing Russia-Ukraine conflict with nuclear rhetoric,
              North Korean ICBM testing program, expanding Chinese nuclear arsenal, and tensions in the India-Pakistan corridor.
              The nuclear risk scoring engine integrates treaty compliance, conflict proximity, arsenal modernization, and doctrine signals.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
