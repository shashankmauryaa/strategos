import { useState, useMemo, useEffect } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import { Link } from 'react-router-dom'
import { Filter, Crosshair, Clock, ChevronDown, ShieldAlert, Zap } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { conflictEvents as fallbackEvents, conflictSummary as fallbackSummary } from '@/data/conflicts'
import { fetchACLEDLiveEvents } from '@/lib/api'
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

// Known Strategic/Nuclear Sites for Proximity Checking
interface NuclearSite {
  name: string
  type: 'reactor' | 'test_site' | 'weapons_depot'
  country: string
  lat: number
  lng: number
  description: string
}

const NUCLEAR_SITES: NuclearSite[] = [
  { name: 'Zaporizhzhia NPP', type: 'reactor', country: 'Ukraine', lat: 47.5112, lng: 34.5861, description: 'Europe largest nuclear power plant, active frontline military occupation.' },
  { name: 'Punggye-ri Site', type: 'test_site', country: 'North Korea', lat: 41.2794, lng: 129.0871, description: 'Active underground nuclear weapon test chambers.' },
  { name: 'Dimona Reactor', type: 'reactor', country: 'Israel', lat: 31.0014, lng: 35.1455, description: 'Negev Nuclear Research Center.' },
  { name: 'Kharkiv Physics Institute', type: 'weapons_depot', country: 'Ukraine', lat: 50.0051, lng: 36.2292, description: 'Experimental reactor facility containing nuclear fuel.' },
  { name: 'Kahuta Enrichment Plant', type: 'weapons_depot', country: 'Pakistan', lat: 33.5910, lng: 73.3861, description: 'High-grade centrifuge uranium enrichment facility.' },
  { name: 'Pokhran Site', type: 'test_site', country: 'India', lat: 26.9124, lng: 71.7533, description: 'Historic military nuclear test grounds.' },
]

// Haversine distance calculator in KM
function getDistanceKM(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371 // radius of Earth in km
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

export function ConflictMap() {
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedIntensity, setSelectedIntensity] = useState<string>('all')
  const [selectedRegion, setSelectedRegion] = useState<string>('all')

  const [events, setEvents] = useState<any[]>(fallbackEvents)
  const [liveStatus, setLiveStatus] = useState<'local' | 'fetching' | 'live' | 'failed'>('local')
  const [summary, setSummary] = useState(fallbackSummary)

  useEffect(() => {
    async function loadLiveACLED() {
      setLiveStatus('fetching')
      const liveData = await fetchACLEDLiveEvents(120)
      if (liveData && liveData.length > 0) {
        setEvents(liveData)
        setLiveStatus('live')
        
        // Recalculate summary metrics from live feed
        const activeNum = [...new Set(liveData.map(e => e.country))].length
        const totalF = liveData.reduce((s, e) => s + e.fatalities, 0)
        setSummary({
          activeConflicts: activeNum,
          countriesAffected: activeNum + 5,
          totalFatalities2024: totalF * 12, // Annualized scale
          criticalHotspots: liveData.filter(e => e.fatalities > 30).length,
          newEventsToday: Math.round(liveData.length / 5),
          droneStrikesToday: liveData.filter(e => e.weapons.includes('Drones')).length,
        })
      } else {
        setLiveStatus(import.meta.env.VITE_ACLED_EMAIL ? 'failed' : 'local')
      }
    }
    loadLiveACLED()
  }, [])

  const regions = useMemo(() => [...new Set(events.map((e) => e.region))], [events])

  const filtered = useMemo(() => {
    return events.filter((e) => {
      if (selectedType !== 'all' && e.type !== selectedType) return false
      if (selectedIntensity !== 'all' && e.intensity !== selectedIntensity) return false
      if (selectedRegion !== 'all' && e.region !== selectedRegion) return false
      return true
    })
  }, [events, selectedType, selectedIntensity, selectedRegion])

  // Compute live proximity alerts (within 150km of any known nuclear site)
  const proximityAlerts = useMemo(() => {
    const alertsList: { eventName: string; country: string; date: string; siteName: string; dist: number; severity: string }[] = []
    
    events.forEach(e => {
      NUCLEAR_SITES.forEach(site => {
        const d = getDistanceKM(e.lat, e.lng, site.lat, site.lng)
        if (d <= 150) {
          alertsList.push({
            eventName: e.name,
            country: e.country,
            date: e.date,
            siteName: site.name,
            dist: d,
            severity: d < 30 ? 'critical' : 'warning'
          })
        }
      })
    })
    
    return alertsList.sort((a, b) => a.dist - b.dist).slice(0, 8)
  }, [events])

  const totalFatalities = filtered.reduce((sum, e) => sum + e.fatalities, 0)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Live Conflict Map</h1>
          <p className="text-sm text-muted-foreground flex items-center gap-1.5">
            Real-time conflict event monitoring 
            <span className="inline-flex items-center gap-1">
              <span className={`h-2 w-2 rounded-full inline-block ${liveStatus === 'live' ? 'bg-green-500 animate-pulse' : liveStatus === 'fetching' ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="text-xs uppercase font-semibold">
                {liveStatus === 'live' ? '● LIVE (ACLED API)' : liveStatus === 'fetching' ? '● SYNCING WITH ACLED...' : '● LOCAL DATA (DEMO MODE)'}
              </span>
            </span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="critical">
            <span className="mr-1.5 h-2 w-2 rounded-full bg-red-500 inline-block animate-pulse" />
            {summary.activeConflicts} Active
          </Badge>
          <Badge variant="warning">{summary.newEventsToday} events loaded</Badge>
        </div>
      </div>

      {proximityAlerts.length > 0 && (
        <div className="bg-red-950/20 border border-red-500/30 p-3 rounded-lg flex items-start gap-3 animate-pulse">
          <ShieldAlert className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-red-400">CRITICAL: Nuclear Proximity Alerts Triggered!</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Active conflict strikes or armed engagements detected within 150km of strategic global nuclear assets:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
              {proximityAlerts.slice(0, 3).map((a, i) => (
                <div key={i} className="bg-red-500/5 border border-red-500/20 p-2 rounded text-[10px] text-foreground">
                  <span className="font-semibold text-red-400">[{a.siteName}]</span> {a.dist.toFixed(1)}km away from fighting in <span className="font-medium">{a.country}</span> ({a.date})
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

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
            <option value="critical">Critical (&gt;50 deaths)</option>
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
            center={[25, 25]}
            zoom={2.2}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={true}
            zoomControl={false}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
            />
            
            {/* Draw known nuclear hazard nodes */}
            {NUCLEAR_SITES.map((site) => (
              <CircleMarker
                key={site.name}
                center={[site.lat, site.lng]}
                radius={8}
                pathOptions={{
                  color: '#eab308',
                  fillColor: '#eab308',
                  fillOpacity: 0.8,
                  weight: 2,
                  dashArray: '3, 6'
                }}
              >
                <Popup>
                  <div className="text-xs space-y-1 min-w-[200px]" style={{ color: '#1a1b23' }}>
                    <p className="font-bold text-sm text-yellow-600">☢️ Nuclear Asset: {site.name}</p>
                    <p><strong>Country:</strong> {site.country}</p>
                    <p><strong>Category:</strong> {site.type.replace('_', ' ').toUpperCase()}</p>
                    <p className="mt-1">{site.description}</p>
                  </div>
                </Popup>
              </CircleMarker>
            ))}

            {filtered.map((event) => {
              // Find if this event is near a nuclear site
              const isNearNuke = NUCLEAR_SITES.some(
                (s) => getDistanceKM(event.lat, event.lng, s.lat, s.lng) <= 150
              )

              return (
                <CircleMarker
                  key={event.id}
                  center={[event.lat, event.lng]}
                  radius={Math.max(6, Math.sqrt(event.fatalities) * 1.5)}
                  pathOptions={{
                    color: isNearNuke ? '#ef4444' : intensityColors[event.intensity],
                    fillColor: isNearNuke ? '#f43f5e' : intensityColors[event.intensity],
                    fillOpacity: 0.65,
                    weight: isNearNuke ? 3 : 1,
                  }}
                >
                  <Popup>
                    <div className="text-xs space-y-1 min-w-[200px]" style={{ color: '#1a1b23' }}>
                      <p className="font-bold text-sm flex items-center gap-1.5">
                        {isNearNuke && <span className="animate-ping w-2 h-2 rounded-full bg-red-500 inline-block" />}
                        {event.name}
                      </p>
                      <p><strong>Country:</strong> {event.country}</p>
                      <p><strong>Type:</strong> {typeLabels[event.type] || event.type}</p>
                      <p><strong>Fatalities:</strong> {event.fatalities}</p>
                      <p><strong>Actors:</strong> {event.actors?.join(', ') || 'Various'}</p>
                      <p><strong>Weapons used:</strong> {event.weapons?.join(', ') || 'Small arms'}</p>
                      <p><strong>Date:</strong> {event.date}</p>
                      <p className="mt-1 leading-normal italic text-muted-foreground">{event.description}</p>
                    </div>
                  </Popup>
                </CircleMarker>
              )
            })}
          </MapContainer>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-xs">
                <Crosshair className="h-3.5 w-3.5 text-red-400" />
                Live Event Heat Summary
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
              {summary.droneStrikesToday > 0 && (
                <div className="mt-2 pt-2 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1 text-primary"><Zap className="h-3.5 w-3.5 text-yellow-400" /> Drones deployed</span>
                  <span className="font-bold text-foreground">{summary.droneStrikesToday} incidents</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-xs">
                <Clock className="h-3.5 w-3.5 text-primary" />
                Latest Frontline Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {filtered.slice(0, 6).map(event => (
                  <Link
                    key={event.id}
                    to={`/conflicts/${event.id}`}
                    className="block p-2 rounded-lg hover:bg-secondary/50 transition-colors border border-transparent hover:border-border"
                  >
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-foreground truncate">{event.name}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{event.country} • {event.date}</p>
                      </div>
                      <Badge
                        variant={event.intensity as 'critical' | 'high' | 'medium' | 'low'}
                        className="text-[9px] px-1.5 shrink-0 ml-1"
                      >
                        {event.fatalities}
                      </Badge>
                    </div>
                  </Link>
                ))}
                {filtered.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-6">No conflicts match filters</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
