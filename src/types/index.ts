export interface ConflictEvent {
  id: string
  name: string
  country: string
  region: string
  lat: number
  lng: number
  fatalities: number
  date: string
  type: 'battle' | 'explosion' | 'protest' | 'violence_against_civilians' | 'strategic_development'
  actors: string[]
  weapons: string[]
  intensity: 'low' | 'medium' | 'high' | 'critical'
  description: string
}

export interface Country {
  code: string
  name: string
  flag: string
  region: string
  militaryBudget: number
  gdp: number
  activeMilitary: number
  reserveMilitary: number
  nuclearStatus: 'nuclear' | 'threshold' | 'non-nuclear'
  alliances: string[]
  globalFirepowerRank: number
  tanks: number
  aircraft: number
  navalAssets: number
  missiles: number
}

export interface ArmsTransfer {
  id: string
  supplier: string
  supplierCode: string
  recipient: string
  recipientCode: string
  weaponCategory: string
  weaponSystem: string
  quantity: number
  year: number
  value: number
  status: 'delivered' | 'ordered' | 'in-transit'
}

export interface Alliance {
  id: string
  name: string
  members: string[]
  type: 'military' | 'economic' | 'political'
  founded: number
}

export interface NuclearState {
  country: string
  code: string
  warheads: number
  deliverySystems: string[]
  lastTest: string
  doctrine: string
  treatyCompliance: 'compliant' | 'partial' | 'non-compliant'
}

export interface OSINTItem {
  id: string
  title: string
  source: string
  type: 'satellite' | 'weapon_sighting' | 'battle_report' | 'dataset' | 'analysis'
  date: string
  region: string
  confidence: 'high' | 'medium' | 'low'
  summary: string
  url?: string
}

export interface SimulationScenario {
  id: string
  name: string
  sides: { name: string; countries: string[] }[]
  theater: string
  terrain: string
  status: 'draft' | 'running' | 'completed'
  createdAt: string
}

export interface SimulationResult {
  scenarioId: string
  victoryProbability: Record<string, number>
  stalemateProbability: number
  estimatedDuration: string
  casualtyRange: { min: number; max: number }
  economicCollapseProbability: Record<string, number>
  iterations: number
}

export interface Alert {
  id: string
  type: 'escalation' | 'arms_race' | 'nuclear' | 'conflict' | 'anomaly'
  severity: 'info' | 'warning' | 'critical'
  title: string
  description: string
  region: string
  timestamp: string
  read: boolean
}
