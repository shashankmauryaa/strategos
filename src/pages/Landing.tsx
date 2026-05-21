import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Shield, Map, Globe2, ArrowLeftRight, Bot, Crosshair, Activity, Atom, ChevronRight, Zap, Eye, Network } from 'lucide-react'
import { conflictSummary } from '@/data/conflicts'
import { formatNumber } from '@/lib/utils'

const features = [
  { icon: Map, title: 'Live Conflict Monitoring', desc: 'Real-time event tracking with ACLED data integration, heatmaps, and timeline replay' },
  { icon: Globe2, title: 'Country Intelligence', desc: 'Military profiles, arsenal inventories, and arms dependency analysis for 190+ nations' },
  { icon: ArrowLeftRight, title: 'Arms Trade Analytics', desc: 'Global arms flow visualization with Sankey diagrams, supplier networks, and trade timelines' },
  { icon: Bot, title: 'AI Intelligence Layer', desc: 'Natural language querying over military datasets with AI-generated reports and analysis' },
  { icon: Crosshair, title: 'War Outcome Simulator', desc: 'Monte Carlo simulation engine with Lanchester combat models and logistics degradation' },
  { icon: Atom, title: 'Nuclear Risk Dashboard', desc: 'Warhead tracking, treaty compliance monitoring, and regional escalation scoring' },
]

const stats = [
  { label: 'Active Conflicts', value: conflictSummary.activeConflicts, color: 'text-red-400' },
  { label: 'Countries Tracked', value: '190+', color: 'text-primary' },
  { label: 'Data Points', value: '2.4M+', color: 'text-info' },
  { label: 'Arms Transfers', value: '847', color: 'text-warning' },
]

export function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 w-full z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <span className="text-lg font-bold tracking-tight">STRATEGOS</span>
          </div>
          <div className="flex items-center gap-6">
            <Link
              to="/dashboard"
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Launch Platform
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative pt-32 pb-20 px-6">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-info/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-border/20 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-border/10 rounded-full" />
        </div>

        <div className="max-w-5xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-medium mb-6">
              <Zap className="w-3 h-3" />
              Real-time Intelligence • AI-Powered Analysis • Predictive Simulation
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6 leading-[1.1]">
              Geopolitical
              <br />
              <span className="text-primary">Intelligence Terminal</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
              The world's conflicts, arms trades, and military capabilities — unified in a single
              intelligence platform. Powered by ACLED, SIPRI, and AI analysis.
            </p>

            <div className="flex items-center justify-center gap-4">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                Enter Dashboard
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                to="/conflicts"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border bg-secondary text-foreground font-medium hover:bg-secondary/80 transition-colors"
              >
                <Eye className="w-4 h-4" />
                View Conflict Map
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="stats" className="py-12 px-6 border-y border-border bg-card/50">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="text-center"
            >
              <p className={`text-3xl md:text-4xl font-bold ${stat.color}`}>
                {typeof stat.value === 'number' ? formatNumber(stat.value) : stat.value}
              </p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-3">Intelligence Capabilities</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Six integrated modules forming a comprehensive geopolitical analysis platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                className="p-6 rounded-xl border border-border bg-card hover:border-primary/30 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center gap-8 mb-8 text-muted-foreground">
            <div className="flex items-center gap-2 text-sm">
              <Activity className="w-4 h-4 text-primary" />
              <span>ACLED Data</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <ArrowLeftRight className="w-4 h-4 text-primary" />
              <span>SIPRI Arms Database</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Network className="w-4 h-4 text-primary" />
              <span>UCDP Conflict Data</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Globe2 className="w-4 h-4 text-primary" />
              <span>World Bank</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            STRATEGOS Intelligence Platform • Built for analysts, researchers, and strategists
          </p>
        </div>
      </section>
    </div>
  )
}
