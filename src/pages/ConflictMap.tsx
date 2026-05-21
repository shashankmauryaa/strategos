import { useState, useMemo } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import { Link } from 'react-router-dom'
import { Filter, Crosshair, Clock, ChevronDown } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { conflictEvents, conflictSummary } from '@/data/conflicts'
import { formatNumber } from '@/lib/utils'
import 'leaflet/dist/leaflet.css'

const intensityColors: Record<string, string> = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#22c55e',
}

const typeLabels: Record<string, string> = {
  battle: 'Battle',
  explosion: 'Explosion/Remote Violence',
  protest: 'Protest',
  violence_against_civilians: 'Violence Against Civilians',
  strategic_development: 'Strategic Development',
}

export function ConflictMap() {
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedIntensity, setSelectedIntensity] = useState<string>('all')
  const [selectedRegion, setSelectedRegion] = useState<string>('all')

  const regions = useMemo(() => [...new Set(conflictEvents.map(e => e.region))], [])

  const filtered = useMemo(() => {
    return conflictEvents.filter(e => {
      if (selectedType !== 'all' && e.type !== selectedType) return false
      if (selectedIntensity !== 'all' && e.intensity !== selectedIntensity) return false
      if (selectedRegion !== 'all' && e.region !== selectedRegion) return false
      return true
    })
  }, [selectedType, selectedIntensity, selectedRegion])

  const totalFatalities = filtered.reduce((sum, e) => sum + e.fatalities, 0)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Live Conflict Map</h1>
          <p className="text-sm text-muted-foreground">Real-time conflict event monitoring • ACLED integrated</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="critical">
            <span className="mr-1.5 h-2 w-2 rounded-full bg-red-500 inline-block animate-pulse" />
            {conflictSummary.activeConflicts} Active
          </Badge>
          <Badge variant="warning">{conflictSummary.newEventsToday} events today</Badge>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Filter className="h-3.5 w-3.5" />
          Filters:
        </div>

        <div className="relative">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="appearance-none bg-secondary border border-border rounded-lg px-3 py-1.5 text-xs text-foreground pr-7 focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">All Types</option>
            {Object.entries(typeLabels).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none" />
        </div>

        <div className="relative">
          <select
            value={selectedIntensity}
            onChange={(e) => setSelectedIntensity(e.target.value)}
            className="appearance-none bg-secondary border border-border rounded-lg px-3 py-1.5 text-xs text-foreground pr-7 focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">All Intensities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none" />
        </div>

        <div className="relative">
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="appearance-none bg-secondary border border-border rounded-lg px-3 py-1.5 text-xs text-foreground pr-7 focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">All Regions</option>
            {regions.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none" />
        </div>

        <div className="ml-auto flex items-center gap-4 text-xs text-muted-foreground">
          <span><strong className="text-foreground">{filtered.length}</strong> events</span>
          <span><strong className="text-red-400">{formatNumber(totalFatalities)}</strong> fatalities</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 rounded-xl overflow-hidden border border-border" style={{ height: '600px' }}>
          <MapContainer
            center={[20, 30]}
            zoom={2.5}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={true}
            zoomControl={false}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
            />
            {filtered.map((event) => (
              <CircleMarker
                key={event.id}
                center={[event.lat, event.lng]}
                radius={Math.max(6, Math.sqrt(event.fatalities) * 1.5)}
                pathOptions={{
                  color: intensityColors[event.intensity],
                  fillColor: intensityColors[event.intensity],
                  fillOpacity: 0.6,
                  weight: 1,
                }}
              >
                <Popup>
                  <div className="text-xs space-y-1 min-w-[200px]" style={{ color: '#1a1b23' }}>
                    <p className="font-bold text-sm">{event.name}</p>
                    <p><strong>Country:</strong> {event.country}</p>
                    <p><strong>Type:</strong> {typeLabels[event.type]}</p>
                    <p><strong>Fatalities:</strong> {event.fatalities}</p>
                    <p><strong>Actors:</strong> {event.actors.join(', ')}</p>
                    <p><strong>Date:</strong> {event.date}</p>
                    <p className="mt-1">{event.description}</p>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-xs">
                <Crosshair className="h-3.5 w-3.5 text-red-400" />
                Event Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {['critical', 'high', 'medium', 'low'].map(intensity => {
                const count = filtered.filter(e => e.intensity === intensity).length
                return (
                  <div key={intensity} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: intensityColors[intensity] }} />
                      <span className="text-xs capitalize text-muted-foreground">{intensity}</span>
                    </div>
                    <span className="text-xs font-medium text-foreground">{count}</span>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-xs">
                <Clock className="h-3.5 w-3.5 text-primary" />
                Recent Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {filtered.slice(0, 6).map(event => (
                  <Link
                    key={event.id}
                    to={`/conflicts/${event.id}`}
                    className="block p-2 rounded-lg hover:bg-secondary/50 transition-colors border border-transparent hover:border-border"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-medium text-foreground">{event.name}</p>
                        <p className="text-[10px] text-muted-foreground">{event.country} • {event.date}</p>
                      </div>
                      <Badge
                        variant={event.intensity as 'critical' | 'high' | 'medium' | 'low'}
                        className="text-[10px] shrink-0"
                      >
                        {event.fatalities}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
