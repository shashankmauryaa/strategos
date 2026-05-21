import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Treemap } from 'recharts'
import { ArrowLeftRight, TrendingUp, Download } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { StatCard } from '@/components/ui/stat-card'
import { armsTransfers, armsFlowSummary, supplierRankings } from '@/data/arms'
import { formatCurrency } from '@/lib/utils'

const COLORS = ['#22c55e', '#3b82f6', '#eab308', '#ef4444', '#8b5cf6', '#f97316', '#06b6d4', '#ec4899']

const categoryData = armsTransfers.reduce<Record<string, number>>((acc, t) => {
  acc[t.weaponCategory] = (acc[t.weaponCategory] || 0) + t.value
  return acc
}, {})

const treemapData = Object.entries(categoryData).map(([name, value]) => ({ name, size: value }))

export function ArmsFlow() {
  const [selectedYear, setSelectedYear] = useState<number>(2024)

  const filteredTransfers = armsTransfers.filter(t => t.year === selectedYear)


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Global Arms Flow Explorer</h1>
          <p className="text-sm text-muted-foreground">Arms transfers, supplier networks, and trade analytics • SIPRI data</p>
        </div>
        <div className="flex items-center gap-2">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Transfers"
          value={armsFlowSummary.totalTransfers2024}
          change={`${selectedYear}`}
          icon={ArrowLeftRight}
          iconColor="text-blue-400"
        />
        <StatCard
          title="Total Value"
          value={formatCurrency(armsFlowSummary.totalValue2024)}
          change="+8.3% YoY"
          changeType="negative"
          icon={TrendingUp}
          iconColor="text-green-400"
        />
        <StatCard
          title="Top Supplier"
          value={armsFlowSummary.topSupplier}
          change="40% market share"
          icon={Download}
          iconColor="text-primary"
        />
        <StatCard
          title="Active Deals"
          value={armsFlowSummary.activeDeals}
          change="In progress"
          icon={ArrowLeftRight}
          iconColor="text-orange-400"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Top Arms Suppliers by Market Share (%)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={supplierRankings} layout="vertical">
                <XAxis type="number" stroke="#525252" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="country" stroke="#525252" fontSize={11} tickLine={false} axisLine={false} width={100} />
                <Tooltip
                  contentStyle={{ background: '#1a1b23', border: '1px solid #2e303a', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(value: number) => [`${value}%`, 'Market Share']}
                />
                <Bar dataKey="share" radius={[0, 4, 4, 0]} barSize={18}>
                  {supplierRankings.map((_, i) => (
                    <Bar key={i} dataKey="share" fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transfers by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
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
            <span>Recent Arms Transfers — {selectedYear}</span>
            <Badge variant="info">{filteredTransfers.length} transfers</Badge>
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
                  <th className="pb-3 text-xs font-medium text-muted-foreground text-right">Value</th>
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
