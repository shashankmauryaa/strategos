import { useState, useRef, useEffect } from 'react'
import { Bot, Send, Sparkles, BarChart3, Globe2, ArrowLeftRight, Atom } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const exampleQueries = [
  { icon: ArrowLeftRight, query: 'Show missile suppliers to Iran since 2015', category: 'Arms Trade' },
  { icon: Globe2, query: 'Compare NATO vs CSTO air power capabilities', category: 'Military Intel' },
  { icon: BarChart3, query: 'What are the top 5 military spenders in Asia?', category: 'Analytics' },
  { icon: Atom, query: 'Which nuclear states have No First Use policies?', category: 'Nuclear' },
]

const mockResponses: Record<string, string> = {
  default: `Based on the available intelligence data, here's my analysis:

**Key Findings:**
- The query has been processed against our integrated datasets (SIPRI, ACLED, UCDP, World Bank)
- Multiple data points were cross-referenced for accuracy
- Confidence level: **High** (87%)

**Strategic Assessment:**
This analysis draws from verified open-source intelligence and should be considered alongside regional context factors. The data pipeline was last updated within the past 24 hours.

*Note: This is a demo response. In production, this would be powered by the AI Intelligence Layer with real-time data retrieval and LLM synthesis.*`,

  'nato': `## NATO vs CSTO Air Power Comparison

| Metric | NATO | CSTO |
|--------|------|------|
| Total Aircraft | ~20,000 | ~4,800 |
| Fighter Jets | ~5,200 | ~1,900 |
| Attack Helicopters | ~2,100 | ~800 |
| 5th Gen Fighters | ~600+ | ~30 |

**Key Assessment:**
- NATO maintains a **4:1 superiority** in total air assets
- 5th generation fighter gap is **20:1** in NATO's favor
- CSTO relies heavily on Russian air power (85% of total)
- NATO's distributed basing provides significant strategic depth

**Confidence:** 91% | **Sources:** IISS Military Balance, FlightGlobal`,

  'nuclear': `## Nuclear States with No First Use (NFU) Policies

| Country | Warheads | NFU Policy | Notes |
|---------|----------|------------|-------|
| 🇨🇳 China | ~500 | ✅ Declared NFU | Since 1964, unconditional |
| 🇮🇳 India | ~172 | ✅ Declared NFU | Since 2003, with caveats |

**States WITHOUT NFU:**
- 🇺🇸 USA — "Flexible Response" doctrine
- 🇷🇺 Russia — "Escalate to De-escalate"
- 🇵🇰 Pakistan — Explicit "First Use" policy
- 🇰🇵 North Korea — "Preemptive Use" doctrine

**Confidence:** 95% | **Sources:** FAS Nuclear Notebook, SIPRI Yearbook`,
}

function getResponse(query: string): string {
  const lower = query.toLowerCase()
  if (lower.includes('nato') || lower.includes('csto')) return mockResponses['nato']
  if (lower.includes('nuclear') || lower.includes('first use')) return mockResponses['nuclear']
  return mockResponses['default']
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

    await new Promise(resolve => setTimeout(resolve, 1500))

    const assistantMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: getResponse(query),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, assistantMsg])
    setIsTyping(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">AI Intelligence Console</h1>
        <p className="text-sm text-muted-foreground">Natural language querying over military datasets • AI-generated analysis</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card className="flex flex-col" style={{ height: '70vh' }}>
            <CardHeader className="border-b border-border">
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-4 w-4 text-primary" />
                STRATEGOS AI Analyst
                <Badge variant="default" className="ml-2">GPT-4 + RAG</Badge>
              </CardTitle>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                    <Sparkles className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Intelligence Query Engine</h3>
                  <p className="text-sm text-muted-foreground max-w-md mb-6">
                    Ask questions about military capabilities, arms transfers, conflict data, nuclear arsenals, and geopolitical analysis.
                  </p>
                  <div className="grid grid-cols-2 gap-3 w-full max-w-lg">
                    {exampleQueries.map((eq) => (
                      <button
                        key={eq.query}
                        onClick={() => setInput(eq.query)}
                        className="flex items-start gap-2 p-3 rounded-lg border border-border bg-secondary/30 hover:bg-secondary/60 transition-colors text-left"
                      >
                        <eq.icon className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs text-muted-foreground">{eq.category}</p>
                          <p className="text-xs font-medium text-foreground">{eq.query}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-xl p-4 ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary/50 border border-border text-foreground'
                  }`}>
                    <div className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                    <p className={`text-[10px] mt-2 ${msg.role === 'user' ? 'text-primary-foreground/60' : 'text-muted-foreground'}`}>
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
                      <span className="text-sm text-muted-foreground">Analyzing intelligence data...</span>
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
                  placeholder="Ask about conflicts, arms transfers, military capabilities..."
                  className="flex-1 rounded-lg border border-border bg-secondary/50 py-2.5 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  disabled={isTyping}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="p-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <p className="text-[10px] text-muted-foreground mt-2 text-center">
                AI responses are generated from SIPRI, ACLED, and UCDP datasets. Always verify critical intelligence.
              </p>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xs">Data Sources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { name: 'SIPRI Arms Transfers', status: 'connected' },
                { name: 'ACLED Conflict Data', status: 'connected' },
                { name: 'UCDP Dataset', status: 'connected' },
                { name: 'World Bank', status: 'connected' },
                { name: 'GDELT Events', status: 'syncing' },
                { name: 'OSINT Repos', status: 'connected' },
              ].map(source => (
                <div key={source.name} className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{source.name}</span>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${source.status === 'connected' ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`} />
                    <span className="text-[10px] text-muted-foreground">{source.status}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xs">Query Capabilities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1.5">
                {['Arms trade analysis', 'Military comparisons', 'Conflict timelines', 'Nuclear intelligence', 'Alliance mapping', 'Trend forecasting'].map(cap => (
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
