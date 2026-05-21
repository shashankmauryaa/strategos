import { useParams, Link } from 'react-router-dom'
import { MapContainer, TileLayer, CircleMarker } from 'react-leaflet'
import { ArrowLeft, Users, Crosshair, Calendar, MapPin, Swords } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { conflictEvents } from '@/data/conflicts'
import 'leaflet/dist/leaflet.css'

const intensityColors: Record<string, string> = {
  critical: '#ef4444', high: '#f97316', medium: '#eab308', low: '#22c55e',
}

export function ConflictDetail() {
  const { conflictId } = useParams()
  const conflict = conflictEvents.find(e => e.id === conflictId)

  if (!conflict) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-muted-foreground">
        <Crosshair className="h-12 w-12 mb-4 opacity-30" />
        <p className="text-lg font-medium">Conflict not found</p>
        <Link to="/conflicts" className="text-primary text-sm mt-2 hover:underline">← Back to Conflict Map</Link>
      </div>
    )
  }

  const relatedEvents = conflictEvents.filter(e => e.country === conflict.country && e.id !== conflict.id)

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
        <Badge variant={conflict.intensity as 'critical' | 'high' | 'medium' | 'low'} className="ml-auto text-sm">
          {conflict.intensity.toUpperCase()}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <Crosshair className="h-5 w-5 text-red-400 mx-auto mb-1" />
          <p className="text-2xl font-bold text-red-400">{conflict.fatalities}</p>
          <p className="text-xs text-muted-foreground">Fatalities</p>
        </Card>
        <Card className="p-4 text-center">
          <Users className="h-5 w-5 text-blue-400 mx-auto mb-1" />
          <p className="text-2xl font-bold text-foreground">{conflict.actors.length}</p>
          <p className="text-xs text-muted-foreground">Actors Involved</p>
        </Card>
        <Card className="p-4 text-center">
          <Swords className="h-5 w-5 text-orange-400 mx-auto mb-1" />
          <p className="text-2xl font-bold text-foreground">{conflict.weapons.length}</p>
          <p className="text-xs text-muted-foreground">Weapon Types</p>
        </Card>
        <Card className="p-4 text-center">
          <Calendar className="h-5 w-5 text-primary mx-auto mb-1" />
          <p className="text-lg font-bold text-foreground">{conflict.date}</p>
          <p className="text-xs text-muted-foreground">Last Updated</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                Event Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl overflow-hidden border border-border" style={{ height: '350px' }}>
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

          <Card>
            <CardHeader>
              <CardTitle>Event Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">{conflict.description}</p>
              <div className="mt-4 p-4 rounded-lg bg-secondary/50 border border-border">
                <p className="text-xs font-medium text-primary mb-2">AI-Generated Strategic Summary</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  This event represents a {conflict.intensity}-intensity {conflict.type.replace(/_/g, ' ')} engagement
                  in {conflict.country}. The conflict involves {conflict.actors.join(' and ')} with reported use of{' '}
                  {conflict.weapons.join(', ')}. Current fatality count stands at {conflict.fatalities}, indicating
                  {conflict.intensity === 'critical' ? ' severe escalation requiring immediate monitoring' :
                   conflict.intensity === 'high' ? ' significant conflict activity' :
                   ' moderate but concerning levels of violence'}.
                  Regional implications extend to the broader {conflict.region} security environment.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-400" />
                Key Actors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {conflict.actors.map(actor => (
                  <div key={actor} className="flex items-center gap-2 p-2 rounded-lg bg-secondary/30">
                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                    <span className="text-sm text-foreground">{actor}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Swords className="h-4 w-4 text-orange-400" />
                Weapon Systems
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {conflict.weapons.map(weapon => (
                  <Badge key={weapon} variant="secondary">{weapon}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {relatedEvents.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Related Events in {conflict.country}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {relatedEvents.slice(0, 5).map(ev => (
                    <Link
                      key={ev.id}
                      to={`/conflicts/${ev.id}`}
                      className="block p-2 rounded-lg hover:bg-secondary/50 transition-colors"
                    >
                      <p className="text-xs font-medium text-foreground">{ev.name}</p>
                      <p className="text-[10px] text-muted-foreground">{ev.date} • {ev.fatalities} fatalities</p>
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
