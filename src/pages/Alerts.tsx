import { Siren, CheckCircle2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { alerts } from '@/data/alerts'

const typeIcons: Record<string, string> = {
  escalation: '📈', arms_race: '🏗️', nuclear: '☢️', conflict: '⚔️', anomaly: '🤖',
}

export function Alerts() {
  const unread = alerts.filter(a => !a.read)
  const read = alerts.filter(a => a.read)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Intelligence Alerts</h1>
          <p className="text-sm text-muted-foreground">Real-time escalation alerts, arms race warnings, and AI anomaly detection</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="critical">{unread.length} unread</Badge>
          <Badge variant="secondary">{alerts.length} total</Badge>
        </div>
      </div>

      {unread.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Siren className="h-4 w-4 text-red-400" />
            Unread Alerts
          </h2>
          {unread.map(alert => (
            <Card key={alert.id} className="border-l-4 hover:bg-secondary/20 transition-colors" style={{
              borderLeftColor: alert.severity === 'critical' ? '#ef4444' : alert.severity === 'warning' ? '#eab308' : '#3b82f6'
            }}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <span className="text-xl mt-0.5">{typeIcons[alert.type]}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-foreground">{alert.title}</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant={alert.severity === 'critical' ? 'critical' : alert.severity === 'warning' ? 'warning' : 'info'}>
                          {alert.severity}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">{new Date(alert.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{alert.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-[10px]">{alert.type.replace(/_/g, ' ')}</Badge>
                      <Badge variant="outline" className="text-[10px]">{alert.region}</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {read.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Previous Alerts
          </h2>
          {read.map(alert => (
            <Card key={alert.id} className="opacity-60 hover:opacity-100 transition-opacity">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <span className="text-xl mt-0.5">{typeIcons[alert.type]}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-foreground">{alert.title}</h3>
                      <span className="text-[10px] text-muted-foreground">{new Date(alert.timestamp).toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{alert.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
