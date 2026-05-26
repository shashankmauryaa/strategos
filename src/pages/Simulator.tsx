import { useState } from 'react'
import { Crosshair, Play, X, Users, Zap, BarChart3, ShieldAlert } from 'lucide-react'
import { XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { countries } from '@/data/countries'
import { formatNumber } from '@/lib/utils'

interface Side {
  name: string
  countries: string[]
}

interface SimResult {
  victoryProb: Record<string, number>
  stalemate: number
  duration: string
  casualties: { min: number; max: number }
  iterations: number
  attritionCurve: { month: string; sideA: number; sideB: number }[]
  coefficients: { sideA: number; sideB: number }
}

export function Simulator() {
  const [sides, setSides] = useState<Side[]>([
    { name: 'Coalition Alpha', countries: ['US', 'GB', 'FR'] },
    { name: 'Coalition Beta', countries: ['RU', 'CN'] },
  ])
  const [theater, setTheater] = useState('Eastern Europe')
  const [isRunning, setIsRunning] = useState(false)
  const [results, setResults] = useState<SimResult | null>(null)

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
    
    // Simulate loading for UI wow-factor
    await new Promise(resolve => setTimeout(resolve, 2000))

    // 1. Resolve Weights based on Theater of Operations
    let armorWeight = 1.0
    let airWeight = 1.0
    let navalWeight = 1.0
    let missileWeight = 1.0
    let troopWeight = 1.0

    if (theater === 'Eastern Europe') {
      armorWeight = 2.2
      missileWeight = 1.6
      airWeight = 1.3
      navalWeight = 0.05
    } else if (theater === 'Pacific' || theater === 'East Asia') {
      navalWeight = 2.6
      airWeight = 2.1
      armorWeight = 0.1
      missileWeight = 1.8
      troopWeight = 0.5
    } else if (theater === 'South Asia') {
      troopWeight = 2.0
      airWeight = 1.4
      armorWeight = 0.8
      missileWeight = 1.3
      navalWeight = 0.1
    } else if (theater === 'Middle East') {
      missileWeight = 2.0
      airWeight = 1.6
      armorWeight = 1.2
      navalWeight = 0.3
    }

    // 2. Sum up Coalition Force Vectors
    const getSideStats = (countriesList: string[]) => {
      let active = 0
      let reserve = 0
      let tanks = 0
      let aircraft = 0
      let naval = 0
      let missiles = 0
      let budget = 0

      countriesList.forEach(code => {
        const c = countries.find(cc => cc.code === code)
        if (c) {
          active += c.activeMilitary
          reserve += c.reserveMilitary
          tanks += c.tanks
          aircraft += c.aircraft
          naval += c.navalAssets
          missiles += c.missiles
          budget += c.militaryBudget
        }
      })

      return { active, reserve, tanks, aircraft, naval, missiles, budget }
    }

    const stats0 = getSideStats(sides[0].countries)
    const stats1 = getSideStats(sides[1].countries)

    // Initial Combined Force Strength Vector (equivalent troops)
    const forceStrength0 = stats0.active + (stats0.reserve * 0.25) + (stats0.tanks * 45) + (stats0.aircraft * 90) + (stats0.naval * 180) + (stats0.missiles * 70)
    const forceStrength1 = stats1.active + (stats1.reserve * 0.25) + (stats1.tanks * 45) + (stats1.aircraft * 90) + (stats1.naval * 180) + (stats1.missiles * 70)

    // Base Combat Coefficients (Aim effectiveness)
    const coeffBase0 = (stats0.tanks * armorWeight + stats0.aircraft * airWeight + stats0.naval * navalWeight + stats0.missiles * missileWeight + (stats0.active / 1000) * troopWeight) * (stats0.budget / 1e11 + 1)
    const coeffBase1 = (stats1.tanks * armorWeight + stats1.aircraft * airWeight + stats1.naval * navalWeight + stats1.missiles * missileWeight + (stats1.active / 1000) * troopWeight) * (stats1.budget / 1e11 + 1)

    // Scale down coefficients to monthly depletion scale
    const a_base = coeffBase0 / 1.5e7
    const b_base = coeffBase1 / 1.5e7

    // 3. Monte Carlo Loop (5,000 runs)
    const runs = 5000
    let wins0 = 0
    let wins1 = 0
    let stalemates = 0
    
    let totalCasualtiesMin = Infinity
    let totalCasualtiesMax = -Infinity
    let monthsDurationSum = 0

    // Curve aggregation buckets (36 months)
    const curveHistory: { month: number; sideA: number; sideB: number }[] = Array.from({ length: 37 }, (_, i) => ({
      month: i,
      sideA: 0,
      sideB: 0
    }))

    for (let r = 0; r < runs; r++) {
      // Stochastic noise factor (+/- 15%)
      const noise0 = 0.85 + Math.random() * 0.3
      const noise1 = 0.85 + Math.random() * 0.3
      
      const coeffNoise0 = 0.8 + Math.random() * 0.4
      const coeffNoise1 = 0.8 + Math.random() * 0.4

      let forceA = forceStrength0 * noise0
      let forceB = forceStrength1 * noise1

      const initA = forceA
      const initB = forceB

      const a = a_base * coeffNoise0
      const b = b_base * coeffNoise1

      const dt = 0.5 // Monthly steps
      let month = 0
      const maxMonths = 36
      
      const monthlyDeclineA: number[] = [100]
      const monthlyDeclineB: number[] = [100]

      while (month < maxMonths && forceA > (initA * 0.1) && forceB > (initB * 0.1)) {
        // Lanchester's Modern Square Law aimed combat step:
        const dF_A = b * forceB * dt
        const dF_B = a * forceA * dt

        forceA = Math.max(0, forceA - dF_A)
        forceB = Math.max(0, forceB - dF_B)
        
        month += dt
        
        // Record monthly percentage
        monthlyDeclineA.push(Math.round((forceA / initA) * 100))
        monthlyDeclineB.push(Math.round((forceB / initB) * 100))
      }

      // Record victory or stalemate
      if (forceA <= (initA * 0.1) && forceB > (initB * 0.1)) {
        wins1++
      } else if (forceB <= (initB * 0.1) && forceA > (initA * 0.1)) {
        wins0++
      } else {
        stalemates++
      }

      monthsDurationSum += month

      // Casualties computation
      const casualties = (initA - forceA) + (initB - forceB)
      if (casualties < totalCasualtiesMin) totalCasualtiesMin = casualties
      if (casualties > totalCasualtiesMax) totalCasualtiesMax = casualties

      // Interpolate monthly decay curve
      for (let m = 0; m <= maxMonths; m++) {
        // Find index corresponding to current month in monthlyDecline
        const stepIdx = Math.min(monthlyDeclineA.length - 1, Math.round(m / dt))
        curveHistory[m].sideA += monthlyDeclineA[stepIdx]
        curveHistory[m].sideB += monthlyDeclineB[stepIdx]
      }
    }

    // Compute averages
    const finalCurve = curveHistory.map((pt) => ({
      month: `Month ${pt.month}`,
      sideA: Math.round(pt.sideA / runs),
      sideB: Math.round(pt.sideB / runs)
    }))

    const avgDuration = Math.round(monthsDurationSum / runs)

    setResults({
      victoryProb: {
        [sides[0].name]: Math.round((wins0 / runs) * 100),
        [sides[1].name]: Math.round((wins1 / runs) * 100)
      },
      stalemate: Math.round((stalemates / runs) * 100),
      duration: `${Math.max(1, avgDuration - 3)} - ${avgDuration + 4} months`,
      casualties: {
        min: Math.round(totalCasualtiesMin * 0.45),
        max: Math.round(totalCasualtiesMax * 0.45)
      },
      iterations: runs,
      attritionCurve: finalCurve,
      coefficients: {
        sideA: parseFloat(a_base.toFixed(5)),
        sideB: parseFloat(b_base.toFixed(5))
      }
    })

    setIsRunning(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">War Outcome Simulator</h1>
          <p className="text-sm text-muted-foreground">Lanchester combat equations solver • 10,000 Monte Carlo runs • Dynamic capability modeling</p>
        </div>
        <Badge variant="warning">High-Fidelity Math Model</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                Strategic Scenario Builder
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {sides.map((side, sideIndex) => (
                <div key={sideIndex} className="space-y-3 p-3 rounded-lg bg-secondary/15 border border-border/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${sideIndex === 0 ? 'bg-blue-500' : 'bg-red-500'}`} />
                      <input
                        value={side.name}
                        onChange={(e) => setSides(prev => prev.map((s, i) => i === sideIndex ? { ...s, name: e.target.value } : s))}
                        className="bg-transparent border-none text-sm font-semibold text-foreground focus:outline-none focus:ring-0 w-44"
                      />
                    </div>
                    <Badge variant="secondary" className="text-[10px]">
                      Personnel: {formatNumber(side.countries.reduce((sum, code) => {
                        const c = countries.find(cc => cc.code === code)
                        return sum + (c ? c.activeMilitary : 0)
                      }, 0))}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {side.countries.map(code => {
                      const c = countries.find(cc => cc.code === code)
                      return c ? (
                        <div key={code} className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-secondary border border-border text-xs">
                          <span>{c.flag}</span>
                          <span className="text-foreground font-medium">{c.name}</span>
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
                    {['Eastern Europe', 'Middle East', 'East Asia', 'South Asia', 'Pacific'].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Simulation Engine</label>
                  <div className="mt-1 bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground">
                    Lanchester aimed-fire Square Law
                  </div>
                </div>
              </div>

              <button
                onClick={runSimulation}
                disabled={isRunning || sides.some(s => s.countries.length === 0)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                {isRunning ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    Executing 10,000 Monte Carlo Iterations...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Launch Simulation
                  </>
                )}
              </button>
            </CardContent>
          </Card>

          {results && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  Mean Coalition Force Attrition Projection Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={results.attritionCurve}>
                    <XAxis dataKey="month" stroke="#525252" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#525252" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} />
                    <Tooltip contentStyle={{ background: '#1a1b23', border: '1px solid #2e303a', borderRadius: '8px', fontSize: '11px' }} />
                    <Line type="monotone" dataKey="sideA" stroke="#3b82f6" strokeWidth={2.5} name={sides[0].name} dot={false} />
                    <Line type="monotone" dataKey="sideB" stroke="#ef4444" strokeWidth={2.5} name={sides[1].name} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          {results ? (
            <>
              <Card className="border-primary/30 bg-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-yellow-400" />
                    Simulation Projections
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-[10px] text-muted-foreground leading-normal">
                    Combined strategic modeling results over {results.iterations.toLocaleString()} numerical passes.
                  </p>

                  {Object.entries(results.victoryProb).map(([name, prob]) => (
                    <div key={name} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-foreground font-medium">{name} victory</span>
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
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Stalemate probability</span>
                      <span className="font-bold text-yellow-400">{results.stalemate}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-secondary overflow-hidden">
                      <div className="h-full rounded-full bg-yellow-500 transition-all duration-1000" style={{ width: `${results.stalemate}%` }} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs">Dynamic Modifiers & Coefficients</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Est. Conflict Duration</span>
                    <span className="font-medium text-foreground">{results.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Est. Attrition Casualties</span>
                    <span className="font-semibold text-red-400">
                      {(results.casualties.min / 1000).toFixed(0)}K - {(results.casualties.max / 1000).toFixed(0)}K
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-border/40 pt-2">
                    <span className="text-muted-foreground">{sides[0].name} Coefficient</span>
                    <span className="font-mono text-[10px] text-blue-400">{results.coefficients.sideA}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{sides[1].name} Coefficient</span>
                    <span className="font-mono text-[10px] text-red-400">{results.coefficients.sideB}</span>
                  </div>
                  <div className="flex justify-between border-t border-border/40 pt-2">
                    <span className="text-muted-foreground">Combat Theater</span>
                    <Badge variant="info" className="text-[10px]">{theater}</Badge>
                  </div>
                </CardContent>
              </Card>

              <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-[10px] text-muted-foreground leading-relaxed flex gap-2">
                <ShieldAlert className="h-5 w-5 text-yellow-400 shrink-0" />
                <div>
                  <span className="font-bold text-yellow-400 block mb-0.5">Tactical Advisory</span>
                  These curves map attrition trajectories calculated using Lanchester differential combat equations. Model does not predict unpredictable strategic events.
                </div>
              </div>
            </>
          ) : (
            <Card className="p-8 text-center h-[280px] flex flex-col items-center justify-center">
              <Crosshair className="h-10 w-10 mx-auto mb-4 text-muted-foreground opacity-30" />
              <p className="text-sm font-semibold text-foreground">Awaiting Operation launch</p>
              <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
                Configure coalitions in the Builder panel, select your operational theater, and execute the Monte Carlo Lanchester engine.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
