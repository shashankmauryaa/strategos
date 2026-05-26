import { useMemo } from 'react'
import { Atom, AlertTriangle, ShieldAlert, Swords } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { nuclearStates } from '@/data/alerts'
import { conflictEvents } from '@/data/conflicts'

const totalWarheads = nuclearStates.reduce((s, n) => s + n.warheads, 0)
const chartData = nuclearStates.map(n => ({ name: n.country, warheads: n.warheads })).sort((a, b) => b.warheads - a.warheads)

// Known coordinates of nuclear installations
const NUCLEAR_SITES = [
  { name: 'Zaporizhzhia NPP', type: 'reactor', country: 'Ukraine', lat: 47.5112, lng: 34.5861 },
  { name: 'Punggye-ri Site', type: 'test_site', country: 'North Korea', lat: 41.2794, lng: 129.0871 },
  { name: 'Dimona Reactor', type: 'reactor', country: 'Israel', lat: 31.0014, lng: 35.1455 },
  { name: 'Kharkiv Physics Institute', type: 'depot', country: 'Ukraine', lat: 50.0051, lng: 36.2292 },
  { name: 'Kahuta Centrifuges', type: 'enrichment', country: 'Pakistan', lat: 33.5910, lng: 73.3861 }
]

function getDistanceKM(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export function Nuclear() {
  // Compute active nuclear proximity alerts
  const activeProximityAlerts = useMemo(() => {
    const list: { eventName: string; country: string; siteName: string; dist: number; fatalities: number; date: string }[] = []
    
    conflictEvents.forEach(e => {
      NUCLEAR_SITES.forEach(site => {
        const d = getDistanceKM(e.lat, e.lng, site.lat, site.lng)
        if (d <= 150) {
          list.push({
            eventName: e.name,
            country: e.country,
            siteName: site.name,
            dist: d,
            fatalities: e.fatalities,
            date: e.date
          })
        }
      })
    })
    
    return list.sort((a, b) => a.dist - b.dist)
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Nuclear Risk Dashboard</h1>
          <p className="text-sm text-muted-foreground">Global nuclear arsenal tracking • Proximity alerts • Tactical risk levels</p>
        </div>
        <Badge variant="critical">
          <Atom className="h-3 w-3 mr-1" />
          {totalWarheads.toLocaleString()} Active Warheads
        </Badge>
      </div>

      {activeProximityAlerts.length > 0 && (
        <Card className="border-red-500/30 bg-red-950/15">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-xs font-bold text-red-400">
              <ShieldAlert className="h-4.5 w-4.5 animate-pulse" />
              CRITICAL: Armed Hostilities Detected in Proximity to Nuclear Zones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {activeProximityAlerts.map((alert, i) => (
                <div key={i} className="p-3 rounded bg-secondary/35 border border-red-500/20 text-xs flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-foreground">☣️ Threat near {alert.siteName}</span>
                    <Badge variant="critical" className="text-[9px] font-bold">
                      {alert.dist.toFixed(1)}KM DISTANCE
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-[11px] mt-1 leading-normal">
                    Factions engaged: <strong className="text-foreground">{alert.eventName}</strong> ({alert.country})
                  </p>
                  <p className="text-[10px] text-red-400 flex items-center gap-1.5 mt-0.5">
                    <Swords className="h-3 w-3" /> Recent Fatalities: {alert.fatalities} • Date: {alert.date}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle>Global Nuclear Stockpile Distribution</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" stroke="#525252" fontSize={11} tickLine={false} axisLine={false} angle={-20} textAnchor="end" height={60} />
              <YAxis stroke="#525252" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: '#1a1b23', border: '1px solid #2e303a', borderRadius: '8px', fontSize: '11px' }} />
              <Bar dataKey="warheads" fill="#eab308" radius={[4, 4, 0, 0]} barSize={26} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {nuclearStates.map(state => (
          <Card key={state.code} className="p-4 hover:border-yellow-500/30 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-xs font-bold text-foreground">{state.country}</h3>
              <Badge variant={state.treatyCompliance === 'compliant' ? 'default' : state.treatyCompliance === 'partial' ? 'warning' : 'critical'} className="text-[9px]">
                {state.treatyCompliance.toUpperCase()}
              </Badge>
            </div>
            <div className="text-center my-3">
              <p className="text-3xl font-bold text-yellow-400">{state.warheads.toLocaleString()}</p>
              <p className="text-[10px] text-muted-foreground">Estimated Warheads</p>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Doctrine</span>
                <span className="text-foreground font-semibold">{state.doctrine}</span>
              </div>
              <div className="flex justify-between border-t border-border/30 pt-1.5">
                <span className="text-muted-foreground">Last Armed Test</span>
                <span className="text-foreground">{state.lastTest}</span>
              </div>
              <div className="border-t border-border/30 pt-1.5">
                <span className="text-muted-foreground block mb-1">Delivery Platforms:</span>
                <div className="flex flex-wrap gap-1">
                  {state.deliverySystems.map(s => <Badge key={s} variant="secondary" className="text-[9px]">{s}</Badge>)}
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
            <h3 className="text-sm font-semibold text-foreground mb-1">Nuclear Proximity Advisory</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Global risk indexes remain elevated due to operational engagements occurring within strike ranges of strategic warhead stockpiles or nuclear power installations. Proximity maps calculate immediate theater warnings if battles coordinates breach containment boundaries.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
