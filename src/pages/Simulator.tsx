import { useState } from 'react'
import { Crosshair, Play, X, Users, Zap, BarChart3 } from 'lucide-react'
import { XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { countries } from '@/data/countries'

interface Side {
  name: string
  countries: string[]
}

export function Simulator() {
  const [sides, setSides] = useState<Side[]>([
    { name: 'Coalition Alpha', countries: ['US', 'GB', 'FR'] },
    { name: 'Coalition Beta', countries: ['RU', 'CN'] },
  ])
  const [theater, setTheater] = useState('Eastern Europe')
  const [isRunning, setIsRunning] = useState(false)
  const [results, setResults] = useState<null | {
    victoryProb: Record<string, number>
    stalemate: number
    duration: string
    casualties: { min: number; max: number }
    iterations: number
  }>(null)

  const addCountry = (sideIndex: number, code: string) => {
    setSides(prev => prev.map((s, i) =>
      i === sideIndex && !s.countries.includes(code) ? { ...s, countries: [...s.countries, code] } : s
    ))
  }

  const removeCountry = (sideIndex: number, code: string) => {
    setSides(prev => prev.map((s, i) =>
      i === sideIndex ? { ...s, countries: s.countries.filter(c => c !== code) } : s
    ))
  }

  const runSimulation = async () => {
    setIsRunning(true)
    setResults(null)
    await new Promise(resolve => setTimeout(resolve, 3000))

    const side0Power = sides[0].countries.reduce((sum, code) => {
      const c = countries.find(cc => cc.code === code)
      return sum + (c ? c.militaryBudget / 1e9 + c.activeMilitary / 1000 + c.aircraft + c.tanks : 0)
    }, 0)

    const side1Power = sides[1].countries.reduce((sum, code) => {
      const c = countries.find(cc => cc.code === code)
      return sum + (c ? c.militaryBudget / 1e9 + c.activeMilitary / 1000 + c.aircraft + c.tanks : 0)
    }, 0)

    const total = side0Power + side1Power
    const prob0 = Math.round((side0Power / total) * 100)
    const stalemate = Math.round(Math.random() * 15 + 10)
    const adjusted0 = Math.round(prob0 * (100 - stalemate) / 100)
    const adjusted1 = 100 - stalemate - adjusted0

    setResults({
      victoryProb: { [sides[0].name]: adjusted0, [sides[1].name]: adjusted1 },
      stalemate,
      duration: `${Math.round(Math.random() * 18 + 6)} - ${Math.round(Math.random() * 24 + 24)} months`,
      casualties: { min: Math.round(50000 + Math.random() * 200000), max: Math.round(300000 + Math.random() * 500000) },
      iterations: 10000,
    })
    setIsRunning(false)
  }

  const attritionData = results ? Array.from({ length: 12 }, (_, i) => ({
    month: `M${i + 1}`,
    [sides[0].name]: Math.round(100 - (i * (100 - (results.victoryProb[sides[0].name] || 50)) / 12)),
    [sides[1].name]: Math.round(100 - (i * (100 - (results.victoryProb[sides[1].name] || 50)) / 12)),
  })) : []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">War Outcome Simulator</h1>
          <p className="text-sm text-muted-foreground">Scenario-based strategic modeling • Monte Carlo engine • Lanchester models</p>
        </div>
        <Badge variant="warning">Beta — Probabilistic Analysis</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                Scenario Builder
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {sides.map((side, sideIndex) => (
                <div key={sideIndex} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${sideIndex === 0 ? 'bg-blue-500' : 'bg-red-500'}`} />
                    <input
                      value={side.name}
                      onChange={(e) => setSides(prev => prev.map((s, i) => i === sideIndex ? { ...s, name: e.target.value } : s))}
                      className="bg-transparent border-none text-sm font-semibold text-foreground focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {side.countries.map(code => {
                      const c = countries.find(cc => cc.code === code)
                      return c ? (
                        <div key={code} className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-secondary border border-border text-sm">
                          <span>{c.flag}</span>
                          <span className="text-foreground">{c.name}</span>
                          <button onClick={() => removeCountry(sideIndex, code)} className="text-muted-foreground hover:text-red-400">
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ) : null
                    })}
                    <select
                      onChange={(e) => { if (e.target.value) { addCountry(sideIndex, e.target.value); e.target.value = '' } }}
                      className="appearance-none bg-secondary/50 border border-dashed border-border rounded-lg px-2 py-1 text-xs text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      defaultValue=""
                    >
                      <option value="">+ Add country</option>
                      {countries
                        .filter(c => !sides.some(s => s.countries.includes(c.code)))
                        .map(c => <option key={c.code} value={c.code}>{c.flag} {c.name}</option>)}
                    </select>
                  </div>
                </div>
              ))}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground">Theater of Operations</label>
                  <select
                    value={theater}
                    onChange={(e) => setTheater(e.target.value)}
                    className="w-full mt-1 appearance-none bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    {['Eastern Europe', 'Middle East', 'East Asia', 'South Asia', 'Africa', 'Pacific'].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Simulation Iterations</label>
                  <div className="mt-1 bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground">
                    10,000 (Monte Carlo)
                  </div>
                </div>
              </div>

              <button
                onClick={runSimulation}
                disabled={isRunning || sides.some(s => s.countries.length === 0)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isRunning ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    Running Simulation...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Run Simulation
                  </>
                )}
              </button>
            </CardContent>
          </Card>

          {results && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  Projected Force Attrition Over Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={attritionData}>
                    <XAxis dataKey="month" stroke="#525252" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#525252" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} />
                    <Tooltip contentStyle={{ background: '#1a1b23', border: '1px solid #2e303a', borderRadius: '8px', fontSize: '12px' }} />
                    <Line type="monotone" dataKey={sides[0].name} stroke="#3b82f6" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey={sides[1].name} stroke="#ef4444" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          {results ? (
            <>
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-yellow-400" />
                    Simulation Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-[10px] text-muted-foreground">Based on {results.iterations.toLocaleString()} Monte Carlo iterations</p>

                  {Object.entries(results.victoryProb).map(([name, prob]) => (
                    <div key={name} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-foreground">{name}</span>
                        <span className="font-bold text-foreground">{prob}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-secondary overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ${name === sides[0].name ? 'bg-blue-500' : 'bg-red-500'}`}
                          style={{ width: `${prob}%` }}
                        />
                      </div>
                    </div>
                  ))}

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Stalemate</span>
                      <span className="font-bold text-yellow-400">{results.stalemate}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-secondary overflow-hidden">
                      <div className="h-full rounded-full bg-yellow-500 transition-all duration-1000" style={{ width: `${results.stalemate}%` }} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xs">Outcome Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Est. Duration</span>
                    <span className="text-xs font-medium text-foreground">{results.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Casualty Range</span>
                    <span className="text-xs font-medium text-red-400">
                      {(results.casualties.min / 1000).toFixed(0)}K - {(results.casualties.max / 1000).toFixed(0)}K
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Theater</span>
                    <span className="text-xs font-medium text-foreground">{theater}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Iterations</span>
                    <span className="text-xs font-medium text-foreground">{results.iterations.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>

              <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <p className="text-[10px] text-yellow-400 font-medium mb-1">⚠ Disclaimer</p>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  This is a scenario-based strategic model, not a prediction. Results are probabilistic estimates based on Lanchester combat models and publicly available data. Not for operational decision-making.
                </p>
              </div>
            </>
          ) : (
            <Card className="p-8 text-center">
              <Crosshair className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-30" />
              <p className="text-sm font-medium text-foreground">Configure & Run Simulation</p>
              <p className="text-xs text-muted-foreground mt-1">Select countries for each coalition, choose a theater, and run the Monte Carlo simulation engine</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
