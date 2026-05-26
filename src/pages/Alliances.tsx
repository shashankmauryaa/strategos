import { useMemo } from 'react'
import { Network, Globe2, Users, DollarSign, ShieldAlert } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { topAlliances, countries } from '@/data/countries'
import { armsTransfers } from '@/data/arms'
import { formatNumber, formatCurrency } from '@/lib/utils'

const allianceColors: Record<string, string> = {
  NATO: '#3b82f6',
  CSTO: '#ef4444',
  SCO: '#eab308',
  AUKUS: '#8b5cf6',
  Quad: '#22c55e',
}

export function Alliances() {
  // Compute Arms Dependency Index dynamically for tracked countries:
  // Ratio = (Imports from highest single supplier) / (Total Imports)
  // Flag countries with >80% dependency on a single supplier!
  const dependencyRisks = useMemo(() => {
    const list: { country: string; flag: string; supplier: string; totalVal: number; ratio: number; status: 'vulnerable' | 'balanced' }[] = []
    
    countries.forEach(c => {
      const countryImports = armsTransfers.filter(t => t.recipientCode === c.code)
      if (countryImports.length === 0) return
      
      const totalImportVal = countryImports.reduce((sum, t) => sum + t.value, 0)
      
      // Group by supplier
      const supplierGroups: Record<string, number> = {}
      countryImports.forEach(t => {
        supplierGroups[t.supplier] = (supplierGroups[t.supplier] || 0) + t.value
      })
      
      // Find highest single supplier
      let maxSupplier = ''
      let maxVal = 0
      Object.entries(supplierGroups).forEach(([sup, val]) => {
        if (val > maxVal) {
          maxVal = val
          maxSupplier = sup
        }
      })
      
      const ratio = maxVal / totalImportVal
      if (ratio >= 0.8) {
        list.push({
          country: c.name,
          flag: c.flag,
          supplier: maxSupplier,
          totalVal: totalImportVal,
          ratio: ratio,
          status: 'vulnerable'
        })
      }
    })
    
    return list.sort((a, b) => b.ratio - a.ratio)
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Alliance & Influence Mapping</h1>
        <p className="text-sm text-muted-foreground">Geopolitical clusters, dynamic arms dependency indicators, and vulnerability maps</p>
      </div>

      {dependencyRisks.length > 0 && (
        <Card className="border-red-500/20 bg-red-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-xs font-bold text-red-400">
              <ShieldAlert className="h-4.5 w-4.5" />
              Dynamic Security Warning: High Arms Dependency Ratios (&gt;80%)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-[11px] text-muted-foreground">
              These countries import over 80% of their total military systems from a single foreign supplier, representing high strategic vulnerability:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {dependencyRisks.map((risk, i) => (
                <div key={i} className="p-3 rounded-lg bg-secondary/35 border border-border flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground">{risk.flag} {risk.country}</span>
                    <Badge variant="critical" className="text-[9px]">{(risk.ratio * 100).toFixed(0)}% DEPENDENT</Badge>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Primary Supplier: <strong className="text-foreground">{risk.supplier}</strong>
                  </p>
                  <p className="text-[9px] text-muted-foreground">
                    Total tracked acquisitions: {formatCurrency(risk.totalVal)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

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
                  <div className="p-3 rounded-lg bg-secondary/30 text-center border border-border/20">
                    <DollarSign className="h-4 w-4 mx-auto text-primary mb-1" />
                    <p className="text-sm font-bold text-foreground">{formatCurrency(alliance.totalBudget)}</p>
                    <p className="text-[10px] text-muted-foreground">Combined Budget</p>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/30 text-center border border-border/20">
                    <Users className="h-4 w-4 mx-auto text-blue-400 mb-1" />
                    <p className="text-sm font-bold text-foreground">{formatNumber(alliance.totalPersonnel)}</p>
                    <p className="text-[10px] text-muted-foreground">Total Personnel</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-2">Member Nations in database:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {memberCountries.map(c => (
                      <span key={c.code} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-secondary text-[11px] text-foreground font-semibold border border-border/30">
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
          <CardTitle className="flex items-center gap-2 text-sm font-semibold">
            <Network className="h-4 w-4 text-primary" />
            Strategic Influence Spheres & Alliances Graph
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="relative w-64 h-64 mb-6">
              {topAlliances.map((alliance, i) => {
                const angle = (i * 2 * Math.PI) / topAlliances.length - Math.PI / 2
                const x = 50 + 35 * Math.cos(angle)
                const y = 50 + 35 * Math.sin(angle)
                return (
                  <div
                    key={alliance.name}
                    className="absolute w-16 h-16 rounded-full border-2 flex items-center justify-center text-xs font-bold text-foreground shadow-lg transition-transform hover:scale-110"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      transform: 'translate(-50%, -50%)',
                      borderColor: allianceColors[alliance.name] || '#6b7280',
                      background: `${allianceColors[alliance.name]}15`,
                    }}
                  >
                    {alliance.name}
                  </div>
                )
              })}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shadow-lg border border-primary/30">
                <Globe2 className="h-5 w-5 text-primary animate-pulse" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground max-w-sm">
              Visual mapping illustrates geopolitical clustering. Force-directed links display relative coalition weight and supply inter-dependencies.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
