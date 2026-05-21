import { useState, useMemo } from 'react'
import { Search, Globe2, Crosshair, ArrowLeftRight, Network, FileText } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { countries } from '@/data/countries'
import { conflictEvents } from '@/data/conflicts'
import { armsTransfers } from '@/data/arms'

type ResultType = 'country' | 'conflict' | 'transfer'

interface SearchResult {
  type: ResultType
  title: string
  subtitle: string
  link: string
  badge?: string
}

const typeIcons = { country: Globe2, conflict: Crosshair, transfer: ArrowLeftRight }

export function SearchPage() {
  const [query, setQuery] = useState('')

  const results = useMemo<SearchResult[]>(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()

    const countryResults: SearchResult[] = countries
      .filter(c => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q))
      .map(c => ({ type: 'country', title: `${c.flag} ${c.name}`, subtitle: `${c.region} • GFP #${c.globalFirepowerRank}`, link: `/countries/${c.code}`, badge: c.nuclearStatus }))

    const conflictResults: SearchResult[] = conflictEvents
      .filter(c => c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q) || c.actors.some(a => a.toLowerCase().includes(q)))
      .map(c => ({ type: 'conflict', title: c.name, subtitle: `${c.country} • ${c.date}`, link: `/conflicts/${c.id}`, badge: c.intensity }))

    const transferResults: SearchResult[] = armsTransfers
      .filter(t => t.weaponSystem.toLowerCase().includes(q) || t.supplier.toLowerCase().includes(q) || t.recipient.toLowerCase().includes(q))
      .map(t => ({ type: 'transfer', title: t.weaponSystem, subtitle: `${t.supplier} → ${t.recipient} • ${t.year}`, link: '/arms-flow', badge: t.weaponCategory }))

    return [...countryResults, ...conflictResults, ...transferResults].slice(0, 20)
  }, [query])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Global Intelligence Search</h1>
        <p className="text-sm text-muted-foreground">Search countries, conflicts, weapons, suppliers, and organizations</p>
      </div>

      <div className="relative max-w-2xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search everything — countries, conflicts, weapon systems, actors..."
          className="w-full rounded-xl border border-border bg-secondary/50 py-3.5 pl-12 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          autoFocus
        />
      </div>

      {query.trim() && (
        <p className="text-xs text-muted-foreground">{results.length} results for "{query}"</p>
      )}

      <div className="space-y-2 max-w-2xl">
        {results.map((result, i) => {
          const Icon = typeIcons[result.type]
          return (
            <Link key={i} to={result.link}>
              <Card className="hover:border-primary/30 transition-colors">
                <CardContent className="p-3 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-secondary">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{result.title}</p>
                    <p className="text-xs text-muted-foreground">{result.subtitle}</p>
                  </div>
                  {result.badge && <Badge variant="secondary" className="text-[10px]">{result.badge}</Badge>}
                </CardContent>
              </Card>
            </Link>
          )
        })}

        {query.trim() && results.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-10 w-10 mx-auto mb-3 text-muted-foreground opacity-30" />
            <p className="text-sm text-muted-foreground">No results found for "{query}"</p>
          </div>
        )}
      </div>

      {!query.trim() && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl">
          {[
            { icon: Globe2, label: 'Countries', count: countries.length },
            { icon: Crosshair, label: 'Conflict Events', count: conflictEvents.length },
            { icon: ArrowLeftRight, label: 'Arms Transfers', count: armsTransfers.length },
            { icon: Network, label: 'Alliances', count: 5 },
          ].map(cat => (
            <Card key={cat.label} className="p-4 text-center">
              <cat.icon className="h-5 w-5 mx-auto mb-2 text-primary" />
              <p className="text-lg font-bold text-foreground">{cat.count}</p>
              <p className="text-xs text-muted-foreground">{cat.label}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
