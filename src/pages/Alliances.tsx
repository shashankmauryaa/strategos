import { Network, Globe2, Users, DollarSign } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { topAlliances } from '@/data/countries'
import { countries } from '@/data/countries'
import { formatNumber, formatCurrency } from '@/lib/utils'

const allianceColors: Record<string, string> = {
  NATO: '#3b82f6',
  CSTO: '#ef4444',
  SCO: '#eab308',
  AUKUS: '#8b5cf6',
  Quad: '#22c55e',
}

export function Alliances() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Alliance & Influence Mapping</h1>
        <p className="text-sm text-muted-foreground">Geopolitical clusters, arms dependency graphs, and influence zones</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {topAlliances.map(alliance => {
          const memberCountries = countries.filter(c => c.alliances.includes(alliance.name))
          return (
            <Card key={alliance.name} className="hover:border-primary/30 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: allianceColors[alliance.name] || '#6b7280' }} />
                    <span>{alliance.name}</span>
                  </div>
                  <Badge variant="info">{alliance.members} members</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-secondary/30 text-center">
                    <DollarSign className="h-4 w-4 mx-auto text-primary mb-1" />
                    <p className="text-sm font-bold text-foreground">{formatCurrency(alliance.totalBudget)}</p>
                    <p className="text-[10px] text-muted-foreground">Combined Budget</p>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/30 text-center">
                    <Users className="h-4 w-4 mx-auto text-blue-400 mb-1" />
                    <p className="text-sm font-bold text-foreground">{formatNumber(alliance.totalPersonnel)}</p>
                    <p className="text-[10px] text-muted-foreground">Total Personnel</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-2">Member Nations in Database:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {memberCountries.map(c => (
                      <span key={c.code} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-secondary text-[11px] text-foreground">
                        {c.flag} {c.name}
                      </span>
                    ))}
                    {memberCountries.length === 0 && (
                      <span className="text-xs text-muted-foreground">No tracked members</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="h-4 w-4 text-primary" />
            Alliance Network Graph
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="relative w-64 h-64 mb-6">
              {topAlliances.map((alliance, i) => {
                const angle = (i * 2 * Math.PI) / topAlliances.length - Math.PI / 2
                const x = 50 + 35 * Math.cos(angle)
                const y = 50 + 35 * Math.sin(angle)
                return (
                  <div
                    key={alliance.name}
                    className="absolute w-16 h-16 rounded-full border-2 flex items-center justify-center text-xs font-bold text-foreground"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      transform: 'translate(-50%, -50%)',
                      borderColor: allianceColors[alliance.name] || '#6b7280',
                      background: `${allianceColors[alliance.name]}20`,
                    }}
                  >
                    {alliance.name}
                  </div>
                )
              })}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Globe2 className="h-6 w-6 text-primary" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Interactive force-directed graph visualization will use Cytoscape.js for full network exploration
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
