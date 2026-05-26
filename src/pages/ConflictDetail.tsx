import { useParams, Link } from 'react-router-dom'
import { MapContainer, TileLayer, CircleMarker } from 'react-leaflet'
import { ArrowLeft, Users, Crosshair, Calendar, MapPin, Swords, Clock, TrendingUp } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { conflictEvents } from '@/data/conflicts'
import 'leaflet/dist/leaflet.css'

const intensityColors: Record<string, string> = {
  critical: '#ef4444', high: '#f97316', medium: '#eab308', low: '#22c55e',
}

// Tactical phase and weapon introduction milestones by region
interface TimelineMilestone {
  date: string
  title: string
  description: string
  weaponIntroduced?: string
  intensity: 'low' | 'medium' | 'high' | 'critical'
}

const HISTORICAL_TIMELINES: Record<string, TimelineMilestone[]> = {
  'Eastern Europe': [
    { date: '2022-02-24', title: 'Operational Outbreak', description: 'Large-scale maneuvers begin across multiple axes.', intensity: 'critical' },
    { date: '2022-04-10', title: 'Drone Warfare Surge', description: 'Widespread tactical deployment of Bayraktar TB2 and reconnaissance UAVs.', weaponIntroduced: 'Bayraktar TB2', intensity: 'high' },
    { date: '2022-06-15', title: 'Precision Fires Introduction', description: 'Long-range rocket systems deployed behind active lines.', weaponIntroduced: 'HIMARS / MLRS', intensity: 'critical' },
    { date: '2023-01-20', title: 'Armor Modernization', description: 'Main battle tanks introduced to spearhead offensive armor columns.', weaponIntroduced: 'Leopard 2A6 / Challenger 2', intensity: 'high' },
    { date: '2024-03-05', title: 'FPV Strike Proliferation', description: 'Unprecedented proliferation of FPV drone swarms targeting field defenses.', weaponIntroduced: 'First Person View (FPV) Drones', intensity: 'critical' },
    { date: '2024-12-14', title: 'Active Artillery Attrition', description: 'Heavy reciprocal exchanges targeting frontline fortifications near Donetsk.', intensity: 'high' }
  ],
  'Middle East': [
    { date: '2023-10-07', title: 'Hostilities Erupt', description: 'Surprise high-intensity rocket salvos breach regional security perimeters.', intensity: 'critical' },
    { date: '2023-11-15', title: 'Active Air Defenses Engaged', description: 'Multilayered missile interceptor batteries operating continuously.', weaponIntroduced: 'Iron Dome / Arrow 3', intensity: 'critical' },
    { date: '2024-04-13', title: 'Unmanned Salvos Swarms', description: 'Mass synchronized drone and ballistic launches.', weaponIntroduced: 'Shahed-136 / Cruise Missiles', intensity: 'critical' },
    { date: '2024-10-26', title: 'Precision Aerial Strike Campaigns', description: 'High-altitude precision aerial bombardment strikes.', weaponIntroduced: 'F-35I Adir stealth strikes', intensity: 'high' }
  ],
  'East Africa': [
    { date: '2023-04-15', title: 'Khartoum Engagement Outbreak', description: 'Heavy fighting erupts in Khartoum between paramilitary RSF and national SAF forces.', intensity: 'critical' },
    { date: '2023-08-10', title: 'UAV Deployments', description: 'Introduction of medium-altitude armed drones in urban areas.', weaponIntroduced: 'Mohajer-6 armed UAVs', intensity: 'high' },
    { date: '2024-05-12', title: 'Technicals Offensive', description: 'Highly mobile motorized columns armed with heavy machine guns coordinate wide flanking maneuvers.', weaponIntroduced: 'Heavy Technicals / RPGs', intensity: 'high' }
  ],
  'Southeast Asia': [
    { date: '2021-02-01', title: 'Resistance Mobilization', description: 'Nationwide civil conflicts mobilize resistance forces against military government control.', intensity: 'medium' },
    { date: '2022-09-10', title: 'Improvised Drone Actions', description: 'Resistance cells deploy adapted commercial quadcopters for aerial drop munitions.', weaponIntroduced: 'Adapted quadcopters / 3D-printed mortars', intensity: 'high' }
  ]
}

export function ConflictDetail() {
  const { conflictId } = useParams()
  const conflict = conflictEvents.find(e => e.id === conflictId)

  if (!conflict) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-muted-foreground">
        <Crosshair className="h-12 w-12 mb-4 opacity-30" />
        <p className="text-lg font-medium">Conflict dossier not found</p>
        <Link to="/conflicts" className="text-primary text-sm mt-2 hover:underline">← Back to Conflict Map</Link>
      </div>
    )
  }

  const relatedEvents = conflictEvents.filter(e => e.country === conflict.country && e.id !== conflict.id)

  // Retrieve chronological timeline milestones
  const timelineMilestones = HISTORICAL_TIMELINES[conflict.region] || [
    { date: conflict.date, title: 'Operational Update', description: conflict.description, intensity: conflict.intensity }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/conflicts" className="p-2 rounded-lg hover:bg-secondary transition-colors">
          <ArrowLeft className="h-4 w-4 text-muted-foreground" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{conflict.name}</h1>
          <p className="text-sm text-muted-foreground">{conflict.country} • {conflict.region}</p>
        </div>
        <Badge variant={conflict.intensity as 'critical' | 'high' | 'medium' | 'low'} className="ml-auto text-sm font-bold">
          {conflict.intensity.toUpperCase()} INTENSITY
        </Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center bg-secondary/15 border-border/60">
          <Crosshair className="h-5 w-5 text-red-400 mx-auto mb-1" />
          <p className="text-2xl font-bold text-red-400">{conflict.fatalities}</p>
          <p className="text-xs text-muted-foreground">Recent Fatalities</p>
        </Card>
        <Card className="p-4 text-center bg-secondary/15 border-border/60">
          <Users className="h-5 w-5 text-blue-400 mx-auto mb-1" />
          <p className="text-2xl font-bold text-foreground">{conflict.actors.length}</p>
          <p className="text-xs text-muted-foreground">Active Factions</p>
        </Card>
        <Card className="p-4 text-center bg-secondary/15 border-border/60">
          <Swords className="h-5 w-5 text-orange-400 mx-auto mb-1" />
          <p className="text-2xl font-bold text-foreground">{conflict.weapons.length}</p>
          <p className="text-xs text-muted-foreground">Weapon Categories</p>
        </Card>
        <Card className="p-4 text-center bg-secondary/15 border-border/60">
          <Calendar className="h-5 w-5 text-primary mx-auto mb-1" />
          <p className="text-base font-bold text-foreground truncate">{conflict.date}</p>
          <p className="text-xs text-muted-foreground">Incident Date</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <Clock className="h-4 w-4 text-primary" />
                Conflict Timeline Reconstructor (Tactical Phases)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative border-l border-border pl-6 ml-3 space-y-6">
                {timelineMilestones.map((m, idx) => (
                  <div key={idx} className="relative group">
                    {/* Visual node marker */}
                    <span 
                      className="absolute -left-[31px] top-1 h-4 w-4 rounded-full border-2 border-background flex items-center justify-center transition-transform group-hover:scale-125"
                      style={{ background: intensityColors[m.intensity] }}
                    />
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                          {m.date}
                        </span>
                        <h4 className="text-xs font-bold text-foreground">{m.title}</h4>
                      </div>
                      
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {m.description}
                      </p>
                      
                      {m.weaponIntroduced && (
                        <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-orange-400 font-semibold bg-orange-950/15 border border-orange-500/20 px-2.5 py-0.5 rounded w-fit">
                          <Swords className="h-3 w-3" /> Weapon Entry: {m.weaponIntroduced}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <MapPin className="h-4 w-4 text-primary" />
                Geolocated Incident Sector
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl overflow-hidden border border-border animate-fade-in" style={{ height: '300px' }}>
                <MapContainer
                  center={[conflict.lat, conflict.lng]}
                  zoom={7}
                  style={{ height: '100%', width: '100%' }}
                  scrollWheelZoom={true}
                  zoomControl={false}
                >
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; OSM &copy; CARTO'
                  />
                  <CircleMarker
                    center={[conflict.lat, conflict.lng]}
                    radius={15}
                    pathOptions={{
                      color: intensityColors[conflict.intensity],
                      fillColor: intensityColors[conflict.intensity],
                      fillOpacity: 0.5,
                      weight: 2,
                    }}
                  />
                </MapContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dossier Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-muted-foreground leading-relaxed">{conflict.description}</p>
              <div className="p-3 rounded bg-secondary/35 border border-border text-[11px] text-muted-foreground leading-normal space-y-1.5">
                <div className="text-primary font-bold flex items-center gap-1 text-[10px] uppercase">
                  <TrendingUp className="h-3.5 w-3.5 text-primary" /> Tactical Signal
                </div>
                <span>
                  Combative operations remain concentrated near coordinate vectors **[{conflict.lat.toFixed(4)}, {conflict.lng.toFixed(4)}]** with a casualty intensity threshold of **{conflict.fatalities}**. 
                  Weapon entries confirm expanding regional stockpiles.
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xs">
                <Users className="h-4 w-4 text-blue-400" />
                Key Combatants
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {conflict.actors.map(actor => (
                  <div key={actor} className="flex items-center gap-2 p-2 rounded bg-secondary/30 text-xs text-foreground font-semibold">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    {actor}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {relatedEvents.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xs">Related Operations in {conflict.country}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {relatedEvents.slice(0, 5).map(ev => (
                    <Link
                      key={ev.id}
                      to={`/conflicts/${ev.id}`}
                      className="block p-2 rounded-lg hover:bg-secondary/50 border border-transparent hover:border-border transition-colors"
                    >
                      <p className="text-xs font-semibold text-foreground truncate">{ev.name}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{ev.date} • {ev.fatalities} fatalities</p>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
