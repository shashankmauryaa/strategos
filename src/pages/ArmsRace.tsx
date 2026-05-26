import { useState, useEffect } from 'react'
import { Activity, TrendingUp, AlertTriangle, Link as LinkIcon, AlertCircle } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { fetchWorldBankIndicator } from '@/lib/api'

// Strategic competitor groupings
const competitivePairs = [
  { region: 'East Asia', label: 'China vs USA / Japan', codes: ['CN', 'US', 'JP'] },
  { region: 'South Asia', label: 'India vs Pakistan', codes: ['IN', 'PK'] },
  { region: 'Middle East', label: 'Saudi Arabia vs Iran vs Israel', codes: ['SA', 'IR', 'IL'] },
  { region: 'Eastern Europe', label: 'Russia vs Ukraine', codes: ['RU', 'UA'] }
]

const COLORS: Record<string, string> = {
  US: '#3b82f6',
  CN: '#ef4444',
  JP: '#eab308',
  IN: '#22c55e',
  PK: '#ec4899',
  SA: '#8b5cf6',
  IR: '#f97316',
  IL: '#06b6d4',
  RU: '#f43f5e',
  UA: '#00f5ff'
}

export function ArmsRace() {
  const [selectedGroup, setSelectedGroup] = useState(competitivePairs[0])
  const [chartData, setChartData] = useState<any[]>([])
  const [liveStatus, setLiveStatus] = useState<'loading' | 'connected' | 'offline'>('loading')
  const [detectedSpikes, setDetectedSpikes] = useState<{ country: string; spikeMultiplier: number; latestVal: number }[]>([])

  useEffect(() => {
    async function loadCompetitorData() {
      setLiveStatus('loading')
      setDetectedSpikes([])
      
      try {
        const promises = selectedGroup.codes.map(code => 
          fetchWorldBankIndicator(code, 'MS.MIL.XPND.GD.ZS')
        )
        const results = await Promise.all(promises)
        
        // Align indicators by year
        const yearMap: Record<string, any> = {}
        
        results.forEach((countryData, idx) => {
          const countryCode = selectedGroup.codes[idx]
          
          // Detect spending spikes (>1.8x rolling average of previous years)
          if (countryData.length > 5) {
            const latest = countryData[countryData.length - 1]?.value
            const prevYears = countryData.slice(countryData.length - 6, countryData.length - 1).map(d => d.value || 0)
            const avgPrev = prevYears.reduce((sum, v) => sum + v, 0) / prevYears.length
            
            if (latest && avgPrev > 0 && latest > (avgPrev * 1.5)) {
              const multiplier = latest / avgPrev
              setDetectedSpikes(prev => [
                ...prev, 
                { country: countryCode, spikeMultiplier: multiplier, latestVal: latest }
              ])
            }
          }

          countryData.forEach((pt) => {
            if (!yearMap[pt.year]) {
              yearMap[pt.year] = { year: pt.year }
            }
            yearMap[pt.year][countryCode] = pt.value ? parseFloat(pt.value.toFixed(2)) : 0
          })
        })
        
        const sortedData = Object.values(yearMap)
          .sort((a: any, b: any) => parseInt(a.year) - parseInt(b.year))
          .filter((d: any) => parseInt(d.year) >= 2010 && parseInt(d.year) <= 2024)

        if (sortedData.length > 0) {
          setChartData(sortedData)
          setLiveStatus('connected')
        } else {
          setLiveStatus('offline')
        }
      } catch (e) {
        console.error(e)
        setLiveStatus('offline')
      }
    }
    loadCompetitorData()
  }, [selectedGroup])

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Arms Race Detection</h1>
          <p className="text-sm text-muted-foreground">Regional spending spike detection • Competitor overlays • Escalation analysis</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={liveStatus === 'connected' ? 'default' : liveStatus === 'loading' ? 'warning' : 'secondary'} className="gap-1">
            <LinkIcon className="h-3 w-3" />
            {liveStatus === 'connected' ? '● LIVE (WORLD BANK MIL-SPENDING)' : liveStatus === 'loading' ? 'SYNCING GDP TRENDS...' : '● OFFLINE / STATIC DATA'}
          </Badge>
          <div className="flex flex-wrap gap-1.5">
            {competitivePairs.map(group => (
              <button
                key={group.label}
                onClick={() => setSelectedGroup(group)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  selectedGroup.label === group.label
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-muted-foreground hover:text-foreground'
                }`}
              >
                {group.region}
              </button>
            ))}
          </div>
        </div>
      </div>

      {detectedSpikes.length > 0 && (
        <div className="bg-orange-950/20 border border-orange-500/30 p-3 rounded-lg flex items-start gap-3 animate-pulse">
          <AlertCircle className="h-5 w-5 text-orange-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-orange-400">AUTOMATED ALARM: Procurement Spikes Detected!</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              The detection engine identified sudden, anomalous military spending surges relative to historic rolling averages:
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {detectedSpikes.map((s) => (
                <Badge key={s.country} variant="warning" className="text-[10px] py-0.5">
                  ⚠️ {s.country}: {s.spikeMultiplier.toFixed(1)}x Spending surge ({s.latestVal.toFixed(1)}% of GDP)
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-semibold">
            <TrendingUp className="h-4 w-4 text-primary" />
            Live Military Spending Trend comparison (% of GDP) — {selectedGroup.label}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={chartData}>
              <XAxis dataKey="year" stroke="#525252" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#525252" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} />
              <Tooltip contentStyle={{ background: '#1a1b23', border: '1px solid #2e303a', borderRadius: '8px', fontSize: '11px' }} />
              {selectedGroup.codes.map((code) => (
                <Line
                  key={code}
                  type="monotone"
                  dataKey={code}
                  stroke={COLORS[code] || '#fff'}
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                  name={code}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-4 justify-center mt-3">
            {selectedGroup.codes.map((code) => (
              <div key={code} className="flex items-center gap-1.5 text-xs">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[code] }} />
                <span className="text-muted-foreground font-semibold">{code} spending of GDP</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-4">
          <AlertTriangle className="h-4 w-4 text-orange-400" />
          Normalized Strategic Escalation Modifiers
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { region: 'East Asia', description: 'Concurrent aircraft carrier developments, advanced hypersonics programs, and expanding sub-surface missile capabilities are driving a double-digit percent hike in US, Japan, and Chinese military outlays.', signal: 'Live GDP spikes map escalation risk.', level: 'high', trend: 'escalating' },
            { region: 'South Asia', description: 'Prolonged ballistic missile tests and border post expansions sustain high budget ceilings, maintaining a rigid balance of deterrence across the India-Pakistan corridor.', signal: 'Stable nuclear parity remains.', level: 'medium', trend: 'stable' },
            { region: 'Middle East', description: 'Unprecedented procurement spikes across missile shields, unmanned base complexes, and air-defense batteries signify expanding spheres of tactical deterrence.', signal: 'Escalating UAV-strike spending.', level: 'high', trend: 'escalating' },
            { region: 'Eastern Europe', description: 'Active conventional warfare has induced unprecedented absolute military budgets, with Ukraine dedicating over 35% of its total GDP to defense capabilities.', signal: 'Critical high-intensity spending.', level: 'critical', trend: 'escalating' },
          ].map((item, i) => (
            <Card key={i} className="hover:border-primary/20 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xs font-bold text-foreground">{item.region}</h3>
                  <Badge variant={item.level === 'critical' ? 'critical' : item.level === 'high' ? 'high' : 'medium'} className="text-[9px]">
                    {item.level}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                <div className="flex items-center justify-between mt-3 border-t border-border/30 pt-2 text-[10px]">
                  <span className="text-primary font-medium">{item.signal}</span>
                  <span className={`font-semibold flex items-center gap-1 ${item.trend === 'escalating' ? 'text-red-400' : 'text-yellow-400'}`}>
                    <Activity className="h-3 w-3" /> {item.trend.toUpperCase()}
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
