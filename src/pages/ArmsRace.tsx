import { Activity, TrendingUp, AlertTriangle } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const procurementData = [
  { year: '2019', china: 45, india: 32, usa: 80, russia: 38, saudiArabia: 25 },
  { year: '2020', china: 52, india: 35, usa: 78, russia: 36, saudiArabia: 22 },
  { year: '2021', china: 61, india: 42, usa: 82, russia: 40, saudiArabia: 28 },
  { year: '2022', china: 78, india: 55, usa: 95, russia: 65, saudiArabia: 35 },
  { year: '2023', china: 95, india: 62, usa: 98, russia: 58, saudiArabia: 42 },
  { year: '2024', china: 120, india: 75, usa: 105, russia: 52, saudiArabia: 48 },
]

const escalationAlerts = [
  { region: 'East Asia', countries: ['China', 'Taiwan'], level: 'high', signal: 'Naval procurement surge +300% in submarine orders', trend: 'escalating' },
  { region: 'South Asia', countries: ['India', 'Pakistan'], level: 'medium', signal: 'Missile testing frequency increased 2x in 2024', trend: 'stable' },
  { region: 'Middle East', countries: ['Iran', 'Saudi Arabia'], level: 'high', signal: 'Concurrent air defense and missile system acquisitions', trend: 'escalating' },
  { region: 'Eastern Europe', countries: ['Russia', 'NATO'], level: 'critical', signal: 'Active conflict driving unprecedented procurement rates', trend: 'escalating' },
]

export function ArmsRace() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Arms Race Detection</h1>
        <p className="text-sm text-muted-foreground">Procurement spike detection • Regional escalation alerts • Correlation analysis</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            Military Procurement Index (Normalized)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={procurementData}>
              <XAxis dataKey="year" stroke="#525252" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#525252" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: '#1a1b23', border: '1px solid #2e303a', borderRadius: '8px', fontSize: '12px' }} />
              <Line type="monotone" dataKey="china" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} name="China" />
              <Line type="monotone" dataKey="india" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} name="India" />
              <Line type="monotone" dataKey="usa" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} name="USA" />
              <Line type="monotone" dataKey="russia" stroke="#eab308" strokeWidth={2} dot={{ r: 3 }} name="Russia" />
              <Line type="monotone" dataKey="saudiArabia" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} name="Saudi Arabia" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-4">
          <AlertTriangle className="h-4 w-4 text-orange-400" />
          Regional Escalation Alerts
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {escalationAlerts.map((alert, i) => (
            <Card key={i} className="hover:border-primary/20 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-sm font-semibold text-foreground">{alert.region}</h3>
                  <Badge variant={alert.level === 'critical' ? 'critical' : alert.level === 'high' ? 'high' : 'medium'}>
                    {alert.level}
                  </Badge>
                </div>
                <div className="flex gap-1.5 mb-2">
                  {alert.countries.map(c => (
                    <Badge key={c} variant="secondary" className="text-[10px]">{c}</Badge>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">{alert.signal}</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <Activity className="h-3 w-3 text-muted-foreground" />
                  <span className={`text-[10px] font-medium ${alert.trend === 'escalating' ? 'text-red-400' : 'text-yellow-400'}`}>
                    {alert.trend}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
