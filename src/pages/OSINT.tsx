import { RadioTower, ExternalLink, Eye } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { osintFeed } from '@/data/alerts'

const typeIcons: Record<string, string> = {
  satellite: '🛰️',
  weapon_sighting: '🔫',
  battle_report: '⚔️',
  dataset: '📊',
  analysis: '📝',
}

export function OSINT() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">OSINT Intelligence Feed</h1>
          <p className="text-sm text-muted-foreground">Open-source intelligence aggregation • Auto-classified • AI-tagged</p>
        </div>
        <Badge variant="default">
          <RadioTower className="h-3 w-3 mr-1" />
          Live Feed
        </Badge>
      </div>

      <div className="space-y-4">
        {osintFeed.map(item => (
          <Card key={item.id} className="hover:border-primary/20 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="text-2xl mt-1">{typeIcons[item.type] || '📄'}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-[10px]">{item.type.replace(/_/g, ' ')}</Badge>
                        <span className="text-xs text-muted-foreground">{item.source}</span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">{item.date}</span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">{item.region}</span>
                      </div>
                    </div>
                    <Badge variant={item.confidence === 'high' ? 'default' : item.confidence === 'medium' ? 'warning' : 'critical'}>
                      {item.confidence} confidence
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{item.summary}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <button className="flex items-center gap-1 text-xs text-primary hover:underline">
                      <Eye className="h-3 w-3" /> View Details
                    </button>
                    {item.url && (
                      <a href={item.url} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                        <ExternalLink className="h-3 w-3" /> Source
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-primary/20 bg-primary/5 p-6 text-center">
        <RadioTower className="h-8 w-8 mx-auto mb-3 text-primary" />
        <h3 className="text-sm font-semibold text-foreground mb-1">OSINT Repository Explorer</h3>
        <p className="text-xs text-muted-foreground max-w-md mx-auto">
          GitHub repository monitoring, dataset change tracking, and contributor analytics will be integrated in Phase 2.
          The system will auto-scan trending OSINT repos and extract geopolitical datasets.
        </p>
      </Card>
    </div>
  )
}
