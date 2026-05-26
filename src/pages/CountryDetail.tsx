import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Shield, Swords, ArrowLeftRight, Atom, Globe2, Link as LinkIcon, LineChart as ChartIcon } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, LineChart, Line } from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { countries } from '@/data/countries'
import { armsTransfers } from '@/data/arms'
import { nuclearStates } from '@/data/alerts'
import { fetchWorldBankIndicator, type WBDataPoint } from '@/lib/api'
import { formatNumber, formatCurrency } from '@/lib/utils'

const tabs = [
  { id: 'overview', label: 'Overview', icon: Shield },
  { id: 'arsenal', label: 'Arsenal', icon: Swords },
  { id: 'trade', label: 'Arms Trade', icon: ArrowLeftRight },
  { id: 'nuclear', label: 'Nuclear', icon: Atom },
  { id: 'conflicts', label: 'Conflicts', icon: Globe2 },
]

export function CountryDetail() {
  const { countryCode } = useParams()
  const [activeTab, setActiveTab] = useState('overview')
  const country = countries.find(c => c.code === countryCode)

  const [spendingHistory, setSpendingHistory] = useState<WBDataPoint[]>([])
  const [gdpHistory, setGdpHistory] = useState<WBDataPoint[]>([])
  const [liveStatus, setLiveStatus] = useState<'loading' | 'connected' | 'offline'>('loading')
  const [liveGdp, setLiveGdp] = useState<number | null>(null)
  const [liveSpendingPercent, setLiveSpendingPercent] = useState<number | null>(null)

  useEffect(() => {
    if (!countryCode) return

    async function loadWorldBankData() {
      setLiveStatus('loading')
      
      // Fetch Spending % of GDP & absolute GDP in parallel
      const [spending, gdp] = await Promise.all([
        fetchWorldBankIndicator(countryCode!, 'MS.MIL.XPND.GD.ZS'),
        fetchWorldBankIndicator(countryCode!, 'NY.GDP.MKTP.CD')
      ])

      if (spending.length > 0 && gdp.length > 0) {
        setSpendingHistory(spending)
        setGdpHistory(gdp)
        
        // Take the latest valid year's records
        const latestGdp = gdp[gdp.length - 1]?.value
        const latestSpend = spending[spending.length - 1]?.value
        
        if (latestGdp) setLiveGdp(latestGdp)
        if (latestSpend) setLiveSpendingPercent(latestSpend)
        
        setLiveStatus('connected')
      } else {
        setLiveStatus('offline')
      }
    }

    loadWorldBankData()
  }, [countryCode])

  if (!country) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-muted-foreground">
        <Globe2 className="h-12 w-12 mb-4 opacity-30" />
        <p className="text-lg font-medium">Country not found</p>
        <Link to="/countries" className="text-primary text-sm mt-2 hover:underline">← Back to Countries</Link>
      </div>
    )
  }

  // Combined historic trend charting data
  const trendChartData = spendingHistory.map((item, idx) => {
    const correspondingGdp = gdpHistory[idx]?.value || country.gdp
    const absoluteSpendingUSD = item.value ? (item.value / 100) * correspondingGdp : null
    
    return {
      year: item.year,
      percentOfGdp: item.value ? parseFloat(item.value.toFixed(2)) : null,
      budgetBillions: absoluteSpendingUSD ? parseFloat((absoluteSpendingUSD / 1e9).toFixed(2)) : null
    }
  }).filter(d => d.percentOfGdp !== null)

  const imports = armsTransfers.filter(t => t.recipientCode === country.code)
  const exports = armsTransfers.filter(t => t.supplierCode === country.code)
  const nuclearData = nuclearStates.find(n => n.code === country.code)

  const displayGdp = liveGdp || country.gdp
  const displaySpendingPercent = liveSpendingPercent || ((country.militaryBudget / country.gdp) * 100)
  const displayBudget = liveSpendingPercent && liveGdp 
    ? (liveSpendingPercent / 100) * liveGdp
    : country.militaryBudget

  const arsenalData = [
    { category: 'Tanks', value: country.tanks },
    { category: 'Aircraft', value: country.aircraft },
    { category: 'Naval', value: country.navalAssets },
    { category: 'Missiles', value: country.missiles },
  ]

  const radarData = [
    { subject: 'Air Power', A: Math.min(100, (country.aircraft / 13247) * 100) },
    { subject: 'Ground', A: Math.min(100, (country.tanks / 12420) * 100) },
    { subject: 'Naval', A: Math.min(100, (country.navalAssets / 777) * 100) },
    { subject: 'Personnel', A: Math.min(100, (country.activeMilitary / 2035000) * 100) },
    { subject: 'Budget', A: Math.min(100, (displayBudget / 886000000000) * 100) },
    { subject: 'Missiles', A: Math.min(100, (country.missiles / 1588) * 100) },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
        <div className="flex items-center gap-3">
          <Link to="/countries" className="p-2 rounded-lg hover:bg-secondary transition-colors">
            <ArrowLeft className="h-4 w-4 text-muted-foreground" />
          </Link>
          <span className="text-4xl">{country.flag}</span>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{country.name}</h1>
            <p className="text-sm text-muted-foreground">{country.region} • GFP Rank #{country.globalFirepowerRank}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={country.nuclearStatus === 'nuclear' ? 'critical' : country.nuclearStatus === 'threshold' ? 'warning' : 'low'}>
              {country.nuclearStatus === 'nuclear' ? '☢ Nuclear State' : country.nuclearStatus === 'threshold' ? '⚠ Threshold State' : 'Non-Nuclear'}
            </Badge>
            {country.alliances.map(a => <Badge key={a} variant="info">{a}</Badge>)}
          </div>
        </div>

        <div>
          <Badge variant={liveStatus === 'connected' ? 'default' : liveStatus === 'loading' ? 'warning' : 'secondary'} className="gap-1">
            <LinkIcon className="h-3 w-3" />
            {liveStatus === 'connected' ? '● LIVE (WORLD BANK API)' : liveStatus === 'loading' ? 'FETCHING WORLD BANK...' : '● OFFLINE / MOCK DATA'}
          </Badge>
        </div>
      </div>

      <div className="flex items-center gap-1 border-b border-border">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4 bg-secondary/20">
                <p className="text-xs text-muted-foreground">Military Budget</p>
                <p className="text-xl font-bold text-foreground">{formatCurrency(displayBudget)}</p>
                <p className="text-[10px] text-primary">{displaySpendingPercent.toFixed(2)}% of GDP</p>
              </Card>
              <Card className="p-4 bg-secondary/20">
                <p className="text-xs text-muted-foreground">GDP</p>
                <p className="text-xl font-bold text-foreground">{formatCurrency(displayGdp)}</p>
              </Card>
              <Card className="p-4 bg-secondary/20">
                <p className="text-xs text-muted-foreground">Active Military</p>
                <p className="text-xl font-bold text-foreground">{formatNumber(country.activeMilitary)}</p>
              </Card>
              <Card className="p-4 bg-secondary/20">
                <p className="text-xs text-muted-foreground">Reserve Forces</p>
                <p className="text-xl font-bold text-foreground">{formatNumber(country.reserveMilitary)}</p>
              </Card>
            </div>

            {trendChartData.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                    <ChartIcon className="h-4 w-4 text-primary" />
                    World Bank Historical Expenditure Trend (GDP % vs USD Billions)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={260}>
                    <LineChart data={trendChartData}>
                      <XAxis dataKey="year" stroke="#525252" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis yAxisId="left" stroke="#3b82f6" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `$${v}B`} />
                      <YAxis yAxisId="right" orientation="right" stroke="#eab308" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} />
                      <Tooltip contentStyle={{ background: '#1a1b23', border: '1px solid #2e303a', borderRadius: '8px', fontSize: '11px' }} />
                      <Line yAxisId="left" type="monotone" dataKey="budgetBillions" stroke="#3b82f6" strokeWidth={2.5} name="Budget (USD Billions)" dot={{ r: 3 }} />
                      <Line yAxisId="right" type="monotone" dataKey="percentOfGdp" stroke="#eab308" strokeWidth={2} name="Share of GDP (%)" dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Military Capability Radar</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="#2e303a" />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                      <PolarRadiusAxis tick={false} axisLine={false} />
                      <Radar name={country.name} dataKey="A" stroke="#22c55e" fill="#22c55e" fillOpacity={0.2} strokeWidth={2} />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Alliance Memberships</CardTitle>
              </CardHeader>
              <CardContent>
                {country.alliances.length > 0 ? (
                  <div className="space-y-2">
                    {country.alliances.map(alliance => (
                      <div key={alliance} className="flex items-center gap-2 p-2 rounded-lg bg-secondary/30">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span className="text-sm text-foreground">{alliance}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No major alliance memberships</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Static Inventory Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: 'Armoured Tanks', value: formatNumber(country.tanks) },
                  { label: 'Combat Aircraft', value: formatNumber(country.aircraft) },
                  { label: 'Naval Flagships', value: formatNumber(country.navalAssets) },
                  { label: 'Missile Launch Silos', value: formatNumber(country.missiles) },
                ].map(stat => (
                  <div key={stat.label} className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{stat.label}</span>
                    <span className="text-sm font-bold text-foreground">{stat.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'arsenal' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Arsenal Inventory</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={arsenalData}>
                  <XAxis dataKey="category" stroke="#525252" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#525252" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: '#1a1b23', border: '1px solid #2e303a', borderRadius: '8px', fontSize: '12px' }} />
                  <Bar dataKey="value" fill="#22c55e" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {arsenalData.map(item => (
              <Card key={item.category} className="p-4 bg-secondary/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.category}</p>
                    <p className="text-xs text-muted-foreground">Active inventory status</p>
                  </div>
                  <p className="text-2xl font-bold text-primary">{formatNumber(item.value)}</p>
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${Math.min(100, (item.value / Math.max(...arsenalData.map(d => d.value))) * 100)}%` }}
                  />
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'trade' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Arms Imports ({imports.length} transfers)</CardTitle>
              </CardHeader>
              <CardContent>
                {imports.length > 0 ? (
                  <div className="space-y-2">
                    {imports.map(t => (
                      <div key={t.id} className="flex items-center justify-between p-2 rounded-lg bg-secondary/30">
                        <div>
                          <p className="text-sm font-medium text-foreground">{t.weaponSystem}</p>
                          <p className="text-xs text-muted-foreground">From {t.supplier} • {t.year}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-foreground">{formatCurrency(t.value)}</p>
                          <Badge variant={t.status === 'delivered' ? 'default' : t.status === 'ordered' ? 'warning' : 'info'} className="text-[10px]">
                            {t.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground py-8 text-center">No import data available</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Arms Exports ({exports.length} transfers)</CardTitle>
              </CardHeader>
              <CardContent>
                {exports.length > 0 ? (
                  <div className="space-y-2">
                    {exports.map(t => (
                      <div key={t.id} className="flex items-center justify-between p-2 rounded-lg bg-secondary/30">
                        <div>
                          <p className="text-sm font-medium text-foreground">{t.weaponSystem}</p>
                          <p className="text-xs text-muted-foreground">To {t.recipient} • {t.year}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-foreground">{formatCurrency(t.value)}</p>
                          <Badge variant={t.status === 'delivered' ? 'default' : 'warning'} className="text-[10px]">
                            {t.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground py-8 text-center">No export data available</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'nuclear' && (
        <div>
          {nuclearData ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Atom className="h-4 w-4 text-yellow-400" />
                    Nuclear Arsenal
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-6 rounded-xl bg-yellow-500/5 border border-yellow-500/20">
                    <p className="text-5xl font-bold text-yellow-400">{formatNumber(nuclearData.warheads)}</p>
                    <p className="text-sm text-muted-foreground mt-1">Estimated Warheads</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground">Doctrine</span>
                      <span className="text-xs font-medium text-foreground">{nuclearData.doctrine}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground">Last Test</span>
                      <span className="text-xs font-medium text-foreground">{nuclearData.lastTest}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground">Treaty Compliance</span>
                      <Badge variant={nuclearData.treatyCompliance === 'compliant' ? 'default' : nuclearData.treatyCompliance === 'partial' ? 'warning' : 'critical'}>
                        {nuclearData.treatyCompliance}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Systems</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {nuclearData.deliverySystems.map(sys => (
                      <div key={sys} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 border border-border">
                        <div className="w-3 h-3 rounded-full bg-yellow-400" />
                        <span className="text-sm font-medium text-foreground">{sys}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="p-12 text-center">
              <Atom className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-30" />
              <p className="text-lg font-medium text-muted-foreground">
                {country.nuclearStatus === 'threshold' ? 'Threshold nuclear state — limited data available' : 'This country does not possess nuclear weapons'}
              </p>
            </Card>
          )}
        </div>
      )}

      {activeTab === 'conflicts' && (
        <Card className="p-12 text-center">
          <Globe2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-30" />
          <p className="text-lg font-medium text-foreground">Conflict Participation Data</p>
          <p className="text-sm text-muted-foreground mt-1">Geolocated battlefield updates are actively loaded and mapped on the global system.</p>
          <Link to="/conflicts" className="inline-block mt-4 text-sm text-primary hover:underline">View Global Conflict Map →</Link>
        </Card>
      )}
    </div>
  )
}
