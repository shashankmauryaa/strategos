import { Network, ArrowRight } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const graphRelationships = [
  { from: 'United States', relation: 'exports to', to: 'Saudi Arabia', type: 'F-15SA Eagle' },
  { from: 'Russia', relation: 'exports to', to: 'India', type: 'S-400 Triumf' },
  { from: 'China', relation: 'exports to', to: 'Pakistan', type: 'JF-17 Thunder' },
  { from: 'France', relation: 'exports to', to: 'India', type: 'Rafale' },
  { from: 'Turkey', relation: 'exports to', to: 'Ukraine', type: 'Bayraktar TB2' },
  { from: 'United States', relation: 'allied with', to: 'United Kingdom', type: 'NATO' },
  { from: 'Russia', relation: 'allied with', to: 'China', type: 'SCO' },
  { from: 'Ukraine', relation: 'in conflict with', to: 'Russia', type: 'Active War' },
  { from: 'Israel', relation: 'in conflict with', to: 'Hamas', type: 'Active Conflict' },
]

export function KnowledgeGraph() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Knowledge Graph Explorer</h1>
        <p className="text-sm text-muted-foreground">Neo4j-powered relationship exploration • Supply chain tracing • Alliance detection</p>
      </div>

      <Card className="p-8">
        <div className="flex flex-col items-center justify-center text-center mb-8">
          <div className="relative w-72 h-72 mb-4">
            <svg viewBox="0 0 300 300" className="w-full h-full">
              {[
                { x: 150, y: 40, label: 'US', color: '#3b82f6' },
                { x: 260, y: 100, label: 'SA', color: '#8b5cf6' },
                { x: 260, y: 200, label: 'IN', color: '#22c55e' },
                { x: 150, y: 260, label: 'CN', color: '#ef4444' },
                { x: 40, y: 200, label: 'RU', color: '#eab308' },
                { x: 40, y: 100, label: 'UA', color: '#06b6d4' },
              ].map((node, i, arr) => (
                <g key={node.label}>
                  {arr.slice(i + 1).map((target) => (
                    <line
                      key={`${node.label}-${target.label}`}
                      x1={node.x} y1={node.y} x2={target.x} y2={target.y}
                      stroke="#2e303a" strokeWidth={1} opacity={0.4}
                    />
                  ))}
                  <circle cx={node.x} cy={node.y} r={24} fill={node.color} opacity={0.2} />
                  <circle cx={node.x} cy={node.y} r={20} fill={node.color} opacity={0.4} />
                  <text x={node.x} y={node.y + 5} textAnchor="middle" fill="#fff" fontSize={12} fontWeight={700}>
                    {node.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>
          <p className="text-sm text-muted-foreground max-w-md">
            Full interactive graph visualization with Cytoscape.js will enable node exploration,
            relationship filtering, and supply chain tracing through the Neo4j knowledge graph.
          </p>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="h-4 w-4 text-primary" />
            Sample Graph Relationships
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {graphRelationships.map((rel, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/20 hover:bg-secondary/40 transition-colors">
                <Badge variant="info" className="min-w-[100px] justify-center">{rel.from}</Badge>
                <div className="flex items-center gap-1 text-xs text-muted-foreground flex-1 justify-center">
                  <span>—</span>
                  <span className="font-medium text-foreground">{rel.relation}</span>
                  <ArrowRight className="h-3 w-3" />
                </div>
                <Badge variant="secondary" className="min-w-[100px] justify-center">{rel.to}</Badge>
                <Badge variant="outline" className="text-[10px] ml-2">{rel.type}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: 'Entity Types', items: ['Countries (190+)', 'Weapon Systems', 'Organizations', 'Conflicts', 'Treaties', 'Actors'] },
          { title: 'Relationship Types', items: ['exports_to', 'imports_from', 'allied_with', 'in_conflict', 'manufactures', 'sanctions'] },
          { title: 'Query Capabilities', items: ['Supply chain tracing', 'Alliance clustering', 'Conflict networks', 'Shortest path', 'Community detection', 'Centrality analysis'] },
        ].map(section => (
          <Card key={section.title}>
            <CardHeader><CardTitle className="text-xs">{section.title}</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-1.5">
                {section.items.map(item => (
                  <div key={item} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span className="text-xs text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
