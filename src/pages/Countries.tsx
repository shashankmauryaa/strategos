import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Search, ChevronDown, ArrowUpDown } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { countries } from '@/data/countries'
import { formatNumber, formatCurrency } from '@/lib/utils'

type SortKey = 'globalFirepowerRank' | 'militaryBudget' | 'activeMilitary' | 'name'

export function Countries() {
  const [search, setSearch] = useState('')
  const [regionFilter, setRegionFilter] = useState('all')
  const [sortBy, setSortBy] = useState<SortKey>('globalFirepowerRank')

  const regions = useMemo(() => [...new Set(countries.map(c => c.region))], [])

  const filtered = useMemo(() => {
    let result = countries.filter(c => {
      if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false
      if (regionFilter !== 'all' && c.region !== regionFilter) return false
      return true
    })

    result.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'globalFirepowerRank') return a.globalFirepowerRank - b.globalFirepowerRank
      return b[sortBy] - a[sortBy]
    })

    return result
  }, [search, regionFilter, sortBy])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Country Military Intelligence</h1>
        <p className="text-sm text-muted-foreground">Military profiles, arsenal data, and strategic capabilities for {countries.length} nations</p>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search countries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-secondary/50 py-2 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="relative">
          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="appearance-none bg-secondary border border-border rounded-lg px-3 py-2 text-xs text-foreground pr-7 focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">All Regions</option>
            {regions.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none" />
        </div>

        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortKey)}
            className="appearance-none bg-secondary border border-border rounded-lg px-3 py-2 text-xs text-foreground pr-7 focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="globalFirepowerRank">Sort: Global Rank</option>
            <option value="militaryBudget">Sort: Budget</option>
            <option value="activeMilitary">Sort: Personnel</option>
            <option value="name">Sort: Name</option>
          </select>
          <ArrowUpDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none" />
        </div>

        <span className="ml-auto text-xs text-muted-foreground">{filtered.length} countries</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(country => (
          <Link key={country.code} to={`/countries/${country.code}`}>
            <Card className="p-4 hover:border-primary/30 transition-all group cursor-pointer h-full">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{country.flag}</span>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                      {country.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">{country.region}</p>
                  </div>
                </div>
                <Badge variant={country.nuclearStatus === 'nuclear' ? 'critical' : country.nuclearStatus === 'threshold' ? 'warning' : 'low'}>
                  {country.nuclearStatus === 'nuclear' ? '☢ Nuclear' : country.nuclearStatus === 'threshold' ? '⚠ Threshold' : 'Non-Nuclear'}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-muted-foreground">GFP Rank</p>
                  <p className="font-bold text-foreground text-lg">#{country.globalFirepowerRank}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Military Budget</p>
                  <p className="font-bold text-foreground">{formatCurrency(country.militaryBudget)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Active Personnel</p>
                  <p className="font-bold text-foreground">{formatNumber(country.activeMilitary)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Alliances</p>
                  <p className="font-bold text-foreground">{country.alliances.length > 0 ? country.alliances[0] : 'None'}</p>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-border flex items-center gap-4 text-[10px] text-muted-foreground">
                <span>🛡 {formatNumber(country.tanks)} tanks</span>
                <span>✈ {formatNumber(country.aircraft)} aircraft</span>
                <span>🚢 {formatNumber(country.navalAssets)} naval</span>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
