import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Shield, Swords, ArrowLeftRight, Atom, Globe2 } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { countries } from '@/data/countries'
import { armsTransfers } from '@/data/arms'
import { nuclearStates } from '@/data/alerts'
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

  if (!country) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-muted-foreground">
        <Globe2 className="h-12 w-12 mb-4 opacity-30" />
        <p className="text-lg font-medium">Country not found</p>
        <Link to="/countries" className="text-primary text-sm mt-2 hover:underline">← Back to Countries</Link>
      </div>
    )
  }

  const imports = armsTransfers.filter(t => t.recipientCode === country.code)
  const exports = armsTransfers.filter(t => t.supplierCode === country.code)
  const nuclearData = nuclearStates.find(n => n.code === country.code)

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
    { subject: 'Budget', A: Math.min(100, (country.militaryBudget / 886000000000) * 100) },
    { subject: 'Missiles', A: Math.min(100, (country.missiles / 1588) * 100) },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/countries" className="p-2 rounded-lg hover:bg-secondary transition-colors">
          <ArrowLeft className="h-4 w-4 text-muted-foreground" />
        </Link>
        <span className="text-4xl">{country.flag}</span>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{country.name}</h1>
          <p className="text-sm text-muted-foreground">{country.region} • GFP Rank #{country.globalFirepowerRank}</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Badge variant={country.nuclearStatus === 'nuclear' ? 'critical' : country.nuclearStatus === 'threshold' ? 'warning' : 'low'}>
            {country.nuclearStatus === 'nuclear' ? '☢ Nuclear State' : country.nuclearStatus === 'threshold' ? '⚠ Threshold State' : 'Non-Nuclear'}
          </Badge>
          {country.alliances.map(a => <Badge key={a} variant="info">{a}</Badge>)}
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
              <Card className="p-4">
                <p className="text-xs text-muted-foreground">Military Budget</p>
                <p className="text-xl font-bold text-foreground">{formatCurrency(country.militaryBudget)}</p>
                <p className="text-[10px] text-muted-foreground">{((country.militaryBudget / country.gdp) * 100).toFixed(1)}% of GDP</p>
              </Card>
              <Card className="p-4">
                <p className="text-xs text-muted-foreground">GDP</p>
                <p className="text-xl font-bold text-foreground">{formatCurrency(country.gdp)}</p>
              </Card>
              <Card className="p-4">
                <p className="text-xs text-muted-foreground">Active Military</p>
                <p className="text-xl font-bold text-foreground">{formatNumber(country.activeMilitary)}</p>
              </Card>
              <Card className="p-4">
                <p className="text-xs text-muted-foreground">Reserve Forces</p>
                <p className="text-xl font-bold text-foreground">{formatNumber(country.reserveMilitary)}</p>
              </Card>
            </div>

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
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: 'Tanks', value: formatNumber(country.tanks) },
                  { label: 'Aircraft', value: formatNumber(country.aircraft) },
                  { label: 'Naval Assets', value: formatNumber(country.navalAssets) },
                  { label: 'Missile Systems', value: formatNumber(country.missiles) },
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
              <Card key={item.category} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.category}</p>
                    <p className="text-xs text-muted-foreground">Active inventory</p>
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
          <p className="text-sm text-muted-foreground mt-1">Historical and active conflict involvement data will be integrated from ACLED and UCDP sources</p>
          <Link to="/conflicts" className="inline-block mt-4 text-sm text-primary hover:underline">View Global Conflict Map →</Link>
        </Card>
      )}
    </div>
  )
}
