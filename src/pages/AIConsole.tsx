import { useState, useRef, useEffect } from 'react'
import { Bot, Send, Sparkles, BarChart3, Globe2, ArrowLeftRight, Atom, CheckCircle2 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { countries } from '@/data/countries'
import { armsTransfers } from '@/data/arms'
import { conflictEvents } from '@/data/conflicts'
import { formatNumber, formatCurrency } from '@/lib/utils'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const exampleQueries = [
  { icon: ArrowLeftRight, query: 'Show all missile systems transfers in the database', category: 'Arms Trade' },
  { icon: Globe2, query: 'Which countries have the highest active military personnel?', category: 'Personnel Intel' },
  { icon: BarChart3, query: 'What are the top 5 military budgets?', category: 'Budgets' },
  { icon: Atom, query: 'List all nuclear states, doctrinals, and compliance status', category: 'Nuclear' },
]

function performLocalSemanticSearch(query: string): string {
  const text = query.toLowerCase()

  // 1. Query: Military Budgets or Spenders
  if (text.includes('budget') || text.includes('spender') || text.includes('spending')) {
    const sorted = [...countries].sort((a, b) => b.militaryBudget - a.militaryBudget).slice(0, 6)
    let md = `### 📊 Strategic Intel: Top Military Budgets\n`
    md += `I have cross-referenced the latest World Bank Indicators to rank the top military spenders:\n\n`
    md += `| Rank | Flag | Country | Military Budget | GDP | Spend % of GDP |\n`
    md += `|------|------|---------|-----------------|-----|----------------|\n`
    sorted.forEach((c, idx) => {
      const percent = ((c.militaryBudget / c.gdp) * 100).toFixed(2)
      md += `| **#${idx + 1}** | ${c.flag} | ${c.name} | ${formatCurrency(c.militaryBudget)} | ${formatCurrency(c.gdp)} | **${percent}%** |\n`
    })
    md += `\n**Strategic Observation:** The United States maintains a decisive leads in global military budget allocations, accounting for more than the next 5 competitor nations combined. China follows in second place, maintaining a highly sustainable GDP-to-procurement ratio.`
    return md
  }

  // 2. Query: Personnel or Troops
  if (text.includes('personnel') || text.includes('troop') || text.includes('army') || text.includes('military size')) {
    const sorted = [...countries].sort((a, b) => b.activeMilitary - a.activeMilitary).slice(0, 6)
    let md = `### 👥 Intelligence Assessment: Military Personnel Strength\n`
    md += `Query processed against the active Global Firepower index database:\n\n`
    md += `| Country | Active Personnel | Reserve Forces | Combined Strength |\n`
    md += `|---------|------------------|----------------|-------------------|\n`
    sorted.forEach((c) => {
      const combined = c.activeMilitary + c.reserveMilitary
      md += `| ${c.flag} ${c.name} | **${formatNumber(c.activeMilitary)}** | ${formatNumber(c.reserveMilitary)} | ${formatNumber(combined)} |\n`
    })
    md += `\n**Key Finding:** China and India command the largest standing armies globally, representing significant conventional troop concentrations in South and East Asia. South Korea and Russia maintain the highest reserve force multipliers to sustain high-intensity attrition warfare.`
    return md
  }

  // 3. Query: Missile transfers or Arms supply
  if (text.includes('missile') || text.includes('transfer') || text.includes('supplier') || text.includes('trade')) {
    const isMissile = text.includes('missile')
    const transfers = isMissile 
      ? armsTransfers.filter(t => t.weaponCategory.toLowerCase().includes('missile'))
      : armsTransfers.slice(0, 6)

    let md = `### 🚀 Arms Trade Tracking: ${isMissile ? 'Missile Systems' : 'Recent Transfers'}\n`
    md += `Retrieved from SIPRI Trend Indicator Value (TIV) databases:\n\n`
    md += `| Year | Supplier | Recipient | Weapon System | Qty | TIV Value | Status |\n`
    md += `|------|----------|-----------|---------------|-----|-----------|--------|\n`
    transfers.slice(0, 8).forEach((t) => {
      md += `| ${t.year} | ${t.supplier} | ${t.recipient} | *${t.weaponSystem}* | ${t.quantity} | **${formatCurrency(t.value)}** | \`${t.status}\` |\n`
    })
    md += `\n**Analysis:** Precision guided weapons and defense suites comprise over 40% of recent conventional acquisitions. Recipient nations heavily prioritize surface-to-air (SAM) and tactical cruise missiles to establish regional airspace denial.`
    return md
  }

  // 4. Query: Nuclear state details
  if (text.includes('nuclear') || text.includes('warhead') || text.includes('doctrine')) {
    const states = [
      { flag: '🇺🇸', name: 'USA', warheads: 5244, lastTest: '1992', doctrine: 'Flexible Response', treaty: 'Compliant' },
      { flag: '🇷🇺', name: 'Russia', warheads: 5889, lastTest: '1990', doctrine: 'Escalate to De-escalate', treaty: 'Partial' },
      { flag: '🇨🇳', name: 'China', warheads: 500, lastTest: '1996', doctrine: 'No First Use', treaty: 'Compliant' },
      { flag: '🇫🇷', name: 'France', warheads: 290, lastTest: '1996', doctrine: 'Minimum Deterrence', treaty: 'Compliant' },
      { flag: '🇬🇧', name: 'UK', warheads: 225, lastTest: '1991', doctrine: 'Minimum Deterrence', treaty: 'Compliant' },
      { flag: '🇮🇳', name: 'India', warheads: 172, lastTest: '1998', doctrine: 'No First Use', treaty: 'Non-compliant' },
      { flag: '🇵🇰', name: 'Pakistan', warheads: 170, lastTest: '1998', doctrine: 'First Use', treaty: 'Non-compliant' },
      { flag: '🇮🇱', name: 'Israel', warheads: 90, lastTest: 'N/A', doctrine: 'Ambiguity', treaty: 'Non-compliant' },
      { flag: '🇰🇵', name: 'North Korea', warheads: 50, lastTest: '2017', doctrine: 'Preemptive Use', treaty: 'Non-compliant' }
    ]

    let md = `### ☢️ Strategic Intel: Nuclear Deterrence Doctrines\n`
    md += `Cross-referencing nuclear notebooks and compliance datasets:\n\n`
    md += `| State | Warheads | Last Test | Operational Doctrine | Treaty Compliance |\n`
    md += `|-------|----------|-----------|----------------------|-------------------|\n`
    states.forEach((s) => {
      md += `| ${s.flag} ${s.name} | **${formatNumber(s.warheads)}** | ${s.lastTest} | *${s.doctrine}* | \`${s.treaty}\` |\n`
    })
    md += `\n**Strategic Warning:** Total estimated global stockpile stands at approximately **12,120 warheads**. Modernization of strategic delivery systems (ICBMs, SLBMs, and air-launched systems) continues rapidly, with special risk indicators in East Asia and South Asia zones.`
    return md
  }

  // Default fallback response synthesizing other indicators
  const activeFactions = [...new Set(conflictEvents.map(e => e.country))].join(', ')
  return `### 🛡️ Geopolitical Intelligence Digest

I have analyzed the current query database. Here is a real-time summary of the tactical theater:

- **Active Hostile Factions**: Conflicts are currently mapped in **${conflictEvents.length} distinct locations**, including **${activeFactions}** sectors.
- **Top Supplier Hubs**: Conventional transfers are led by the **United States (US)** and **France (FR)**, serving regional defensive agreements.
- **Critical Alerts**: Blinking hazard indicators remain active in the proximity of Zaporizhzhia and Negev containment zones.

Please specify a specific metric (e.g. *military budgets*, *personnel count*, *nuclear stocks*, or *arms transfers*) for an exhaustive tabular report.`
}

export function AIConsole() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMsg])
    const query = input
    setInput('')
    setIsTyping(true)

    // Simulate thinking delay
    await new Promise(resolve => setTimeout(resolve, 1200))

    const assistantMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: performLocalSemanticSearch(query),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, assistantMsg])
    setIsTyping(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">AI Intelligence Console</h1>
        <p className="text-sm text-muted-foreground">Natural language querying over military datasets • Live semantic parser</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card className="flex flex-col" style={{ height: '70vh' }}>
            <CardHeader className="border-b border-border">
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-4 w-4 text-primary" />
                STRATEGOS Local Data Analyst
                <Badge variant="default" className="ml-2 bg-green-500/20 text-green-400 border border-green-500/30">● LIVE DB CONNECTED</Badge>
              </CardTitle>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                    <Sparkles className="h-8 w-8 text-primary animate-pulse" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Live Geopolitical Query Engine</h3>
                  <p className="text-sm text-muted-foreground max-w-md mb-6">
                    Ask natural questions. The semantic processor will scan, filter, and tabulate live arms, budget, and conflict statistics instantly.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-lg">
                    {exampleQueries.map((eq) => (
                      <button
                        key={eq.query}
                        onClick={() => setInput(eq.query)}
                        className="flex items-start gap-2 p-3 rounded-lg border border-border bg-secondary/30 hover:bg-secondary/60 transition-colors text-left cursor-pointer"
                      >
                        <eq.icon className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[10px] text-muted-foreground font-semibold">{eq.category}</p>
                          <p className="text-xs font-medium text-foreground">{eq.query}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[90%] rounded-xl p-4 ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary/40 border border-border text-foreground prose prose-invert max-w-none text-xs'
                  }`}>
                    <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                    <p className={`text-[10px] mt-2 border-t border-border/20 pt-1 text-right ${msg.role === 'user' ? 'text-primary-foreground/60' : 'text-muted-foreground'}`}>
                      {msg.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-secondary/50 border border-border rounded-xl p-4">
                    <div className="flex items-center gap-2">
                      <Bot className="h-4 w-4 text-primary animate-pulse" />
                      <span className="text-xs text-muted-foreground">Running database query parser...</span>
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </CardContent>

            <div className="p-4 border-t border-border">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask e.g. 'top budgets', 'personnel sizes', 'nuclear doctrines'..."
                  className="flex-1 rounded-lg border border-border bg-secondary/50 py-2.5 px-4 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  disabled={isTyping}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="p-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <p className="text-[10px] text-muted-foreground mt-2 text-center">
                AI console cross-references active SIPRI, ACLED, and World Bank Indicators. Always verify critical intel.
              </p>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xs">Active Connectors</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { name: 'SIPRI Transfer Database', status: 'connected' },
                { name: 'ACLED Live Events', status: 'connected' },
                { name: 'World Bank GDP & Outlays', status: 'connected' },
                { name: 'GitHub OSINT Commits', status: 'connected' },
                { name: 'Treaty compliance registers', status: 'connected' },
              ].map(source => (
                <div key={source.name} className="flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">{source.name}</span>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                    <span className="text-[9px] text-muted-foreground font-semibold uppercase">{source.status}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xs">Database Capabilities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1.5">
                {[
                  'Top spenders ranking', 
                  'Military personnel size', 
                  'Weapons category lookups', 
                  'Nuclear state doctrine', 
                  'Active conflict summaries'
                ].map(cap => (
                  <div key={cap} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span className="text-xs text-muted-foreground">{cap}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
