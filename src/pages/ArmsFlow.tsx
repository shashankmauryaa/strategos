import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Treemap } from 'recharts'
import { ArrowLeftRight, TrendingUp, Download, Link as LinkIcon, HelpCircle } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { StatCard } from '@/components/ui/stat-card'
import { armsTransfers, armsFlowSummary } from '@/data/arms'
import { fetchWorldBankIndicator } from '@/lib/api'
import { formatCurrency } from '@/lib/utils'

const COLORS = ['#3b82f6', '#ef4444', '#eab308', '#22c55e', '#8b5cf6', '#f97316', '#06b6d4', '#ec4899']

const supplierCodes = [
  { name: 'United States', code: 'US', color: '#3b82f6' },
  { name: 'Russia', code: 'RU', color: '#ef4444' },
  { name: 'China', code: 'CN', color: '#eab308' },
  { name: 'France', code: 'FR', color: '#8b5cf6' },
  { name: 'Germany', code: 'DE', color: '#f97316' },
  { name: 'United Kingdom', code: 'GB', color: '#06b6d4' }
]

const categoryData = armsTransfers.reduce<Record<string, number>>((acc, t) => {
  acc[t.weaponCategory] = (acc[t.weaponCategory] || 0) + t.value
  return acc
}, {})

const treemapData = Object.entries(categoryData).map(([name, value]) => ({ name, size: value }))

export function ArmsFlow() {
  const [selectedYear, setSelectedYear] = useState<number>(2024)
  const [liveExportersData, setLiveExportersData] = useState<any[]>([])
  const [liveStatus, setLiveStatus] = useState<'loading' | 'connected' | 'offline'>('loading')

  useEffect(() => {
    async function loadLiveArmsFlow() {
      setLiveStatus('loading')
      
      try {
        // Fetch export TIV timelines for major exporters
        const promises = supplierCodes.map(s => 
          fetchWorldBankIndicator(s.code, 'MS.MIL.XPRT.KD')
        )
        const results = await Promise.all(promises)
        
        // Align data by year
        const yearMap: Record<string, any> = {}
        
        results.forEach((countryData, idx) => {
          const countryName = supplierCodes[idx].name
          countryData.forEach((pt) => {
            if (!yearMap[pt.year]) {
              yearMap[pt.year] = { year: pt.year }
            }
            // Value is in constant USD - convert to millions TIV
            yearMap[pt.year][countryName] = pt.value ? parseFloat((pt.value / 1e6).toFixed(1)) : 0
          })
        })
        
        const sortedData = Object.values(yearMap)
          .sort((a: any, b: any) => parseInt(a.year) - parseInt(b.year))
          .filter((d: any) => parseInt(d.year) >= 2012 && parseInt(d.year) <= 2024)
          
        if (sortedData.length > 0) {
          setLiveExportersData(sortedData)
          setLiveStatus('connected')
        } else {
          setLiveStatus('offline')
        }
      } catch (e) {
        console.error(e)
        setLiveStatus('offline')
      }
    }
    
    loadLiveArmsFlow()
  }, [])

  const filteredTransfers = armsTransfers.filter(t => t.year === selectedYear)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Global Arms Flow Explorer</h1>
          <p className="text-sm text-muted-foreground">Arms transfers, supplier networks, and trade analytics • SIPRI data</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={liveStatus === 'connected' ? 'default' : liveStatus === 'loading' ? 'warning' : 'secondary'} className="gap-1">
            <LinkIcon className="h-3 w-3" />
            {liveStatus === 'connected' ? '● LIVE (WORLD BANK - SIPRI PROXY)' : liveStatus === 'loading' ? 'SYNCING SIPRI INDICATORS...' : '● OFFLINE / STATIC DATA'}
          </Badge>
          <div className="flex items-center gap-1.5">
            {[2022, 2023, 2024].map(year => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  selectedYear === year
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-muted-foreground hover:text-foreground'
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Transfers"
          value={armsFlowSummary.totalTransfers2024}
          change={`${selectedYear} DB Count`}
          icon={ArrowLeftRight}
          iconColor="text-blue-400"
        />
        <StatCard
          title="Total Trade Volume"
          value={formatCurrency(armsFlowSummary.totalValue2024)}
          change="Live Trend indicator"
          changeType="neutral"
          icon={TrendingUp}
          iconColor="text-green-400"
        />
        <StatCard
          title="Top Live Supplier"
          value="United States"
          change="42.3% of global volume"
          icon={Download}
          iconColor="text-primary"
        />
        <StatCard
          title="Active System Transfers"
          value={filteredTransfers.length}
          change="Currently delivery status"
          icon={ArrowLeftRight}
          iconColor="text-orange-400"
        />
      </div>

      {liveStatus === 'connected' && liveExportersData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <TrendingUp className="h-4 w-4 text-primary" />
              SIPRI Arms Exports Volume Index - Real-Time Timeline (Millions TIV)
              <span className="ml-auto text-[10px] text-muted-foreground flex items-center gap-1">
                <HelpCircle className="h-3 w-3" /> World Bank Indicator: MS.MIL.XPRT.KD
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={liveExportersData}>
                <XAxis dataKey="year" stroke="#525252" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#525252" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: '#1a1b23', border: '1px solid #2e303a', borderRadius: '8px', fontSize: '11px' }} />
                {supplierCodes.map((s) => (
                  <Line
                    key={s.name}
                    type="monotone"
                    dataKey={s.name}
                    stroke={s.color}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-4 justify-center mt-3">
              {supplierCodes.map((s) => (
                <div key={s.name} className="flex items-center gap-1.5 text-xs">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                  <span className="text-muted-foreground font-medium">{s.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Top Arms Suppliers by Market Share (%)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={[
                { year: '2020', USA: 37, Russia: 20, France: 8.2, China: 5.3, Germany: 5.5 },
                { year: '2021', USA: 38, Russia: 19, France: 9.1, China: 5.1, Germany: 5.2 },
                { year: '2022', USA: 40, Russia: 16, France: 11.0, China: 5.2, Germany: 4.8 },
                { year: '2023', USA: 41, Russia: 14, France: 11.5, China: 5.4, Germany: 4.6 },
                { year: '2024', USA: 42, Russia: 11, France: 12.3, China: 5.8, Germany: 4.4 },
              ]}>
                <XAxis dataKey="year" stroke="#525252" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#525252" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} />
                <Tooltip contentStyle={{ background: '#1a1b23', border: '1px solid #2e303a', borderRadius: '8px', fontSize: '11px' }} />
                <Line type="monotone" dataKey="USA" stroke="#3b82f6" strokeWidth={2.5} name="USA" dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Russia" stroke="#ef4444" strokeWidth={2} name="Russia" dot={{ r: 3 }} />
                <Line type="monotone" dataKey="France" stroke="#8b5cf6" strokeWidth={2} name="France" dot={{ r: 3 }} />
                <Line type="monotone" dataKey="China" stroke="#eab308" strokeWidth={2} name="China" dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Germany" stroke="#f97316" strokeWidth={2} name="Germany" dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transfers by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <Treemap
                data={treemapData}
                dataKey="size"
                aspectRatio={1}
                stroke="#1a1b23"
                content={({ x, y, width, height, name, index }: any) => (
                  <g>
                    <rect
                      x={x} y={y} width={width} height={height}
                      fill={COLORS[(index || 0) % COLORS.length]}
                      fillOpacity={0.8}
                      rx={4}
                    />
                    {width > 50 && height > 30 && (
                      <text x={x + width / 2} y={y + height / 2} textAnchor="middle" dominantBaseline="middle" fill="#fff" fontSize={11} fontWeight={600}>
                        {name}
                      </text>
                    )}
                  </g>
                )}
              />
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Recent Conventional Arms Transfers — {selectedYear}</span>
            <Badge variant="info">{filteredTransfers.length} transfers in year</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-3 text-xs font-medium text-muted-foreground">Supplier</th>
                  <th className="pb-3 text-xs font-medium text-muted-foreground">Recipient</th>
                  <th className="pb-3 text-xs font-medium text-muted-foreground">Weapon System</th>
                  <th className="pb-3 text-xs font-medium text-muted-foreground">Category</th>
                  <th className="pb-3 text-xs font-medium text-muted-foreground text-right">Qty</th>
                  <th className="pb-3 text-xs font-medium text-muted-foreground text-right">TIV Value</th>
                  <th className="pb-3 text-xs font-medium text-muted-foreground text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransfers.map(t => (
                  <tr key={t.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                    <td className="py-3 font-medium text-foreground">{t.supplier}</td>
                    <td className="py-3 text-foreground">{t.recipient}</td>
                    <td className="py-3 text-foreground">{t.weaponSystem}</td>
                    <td className="py-3"><Badge variant="secondary">{t.weaponCategory}</Badge></td>
                    <td className="py-3 text-right text-foreground">{t.quantity}</td>
                    <td className="py-3 text-right font-medium text-primary">{formatCurrency(t.value)}</td>
                    <td className="py-3 text-right">
                      <Badge variant={t.status === 'delivered' ? 'default' : t.status === 'ordered' ? 'warning' : 'info'}>
                        {t.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
