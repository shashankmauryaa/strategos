import type { Alert, OSINTItem, NuclearState } from '@/types'

export const alerts: Alert[] = [
  { id: 'a1', type: 'escalation', severity: 'critical', title: 'Rapid Force Buildup Detected', description: 'Satellite imagery shows significant military buildup along the Russia-Ukraine border near Kharkiv', region: 'Eastern Europe', timestamp: '2024-12-15T08:30:00Z', read: false },
  { id: 'a2', type: 'arms_race', severity: 'warning', title: 'Unusual Procurement Spike', description: 'China has increased submarine orders by 300% compared to 2023 averages', region: 'East Asia', timestamp: '2024-12-15T06:15:00Z', read: false },
  { id: 'a3', type: 'nuclear', severity: 'critical', title: 'Nuclear Test Preparations', description: 'Tunneling activity detected at North Korean Punggye-ri nuclear test site', region: 'East Asia', timestamp: '2024-12-14T22:00:00Z', read: false },
  { id: 'a4', type: 'conflict', severity: 'warning', title: 'New Front Opened in Sudan', description: 'RSF forces have opened a new offensive front in Al Jazirah state', region: 'East Africa', timestamp: '2024-12-14T18:45:00Z', read: true },
  { id: 'a5', type: 'anomaly', severity: 'info', title: 'AI Anomaly: Trade Pattern Shift', description: 'Detected unusual arms trade routing through third-party nations in Southeast Asia', region: 'Southeast Asia', timestamp: '2024-12-14T14:20:00Z', read: true },
  { id: 'a6', type: 'escalation', severity: 'warning', title: 'Naval Exercises Escalation', description: 'China conducting largest naval exercises near Taiwan in 6 months', region: 'East Asia', timestamp: '2024-12-14T10:00:00Z', read: true },
  { id: 'a7', type: 'arms_race', severity: 'info', title: 'Hypersonic Missile Development', description: 'Multiple nations accelerating hypersonic weapons programs simultaneously', region: 'Global', timestamp: '2024-12-13T16:30:00Z', read: true },
  { id: 'a8', type: 'conflict', severity: 'critical', title: 'Mass Casualty Event', description: 'Major aerial bombardment reported in northern Gaza with significant civilian casualties', region: 'Middle East', timestamp: '2024-12-13T12:00:00Z', read: false },
]

export const osintFeed: OSINTItem[] = [
  { id: 'o1', title: 'New satellite imagery reveals military base expansion', source: 'Sentinel Hub', type: 'satellite', date: '2024-12-15', region: 'East Asia', confidence: 'high', summary: 'Commercial satellite imagery shows construction of new hardened aircraft shelters at Chinese military base in the South China Sea' },
  { id: 'o2', title: 'OSINT analysis of weapons in Khartoum footage', source: 'GitHub/conflict-weapons', type: 'weapon_sighting', date: '2024-12-15', region: 'East Africa', confidence: 'medium', summary: 'Open-source analysis identifies Iranian-made Mohajer-6 drones in Sudan conflict footage' },
  { id: 'o3', title: 'Battle damage assessment: Donetsk sector', source: 'Telegram OSINT', type: 'battle_report', date: '2024-12-14', region: 'Eastern Europe', confidence: 'medium', summary: 'Geolocated imagery confirms destruction of ammunition depot near Makeevka' },
  { id: 'o4', title: 'ACLED dataset updated with December events', source: 'ACLED', type: 'dataset', date: '2024-12-14', region: 'Global', confidence: 'high', summary: 'Monthly update includes 12,400 new conflict events across 45 countries' },
  { id: 'o5', title: 'Analysis: Shifting alliance patterns in Sahel', source: 'Crisis Group', type: 'analysis', date: '2024-12-13', region: 'West Africa', confidence: 'high', summary: 'Wagner Group presence correlating with increased civilian targeting in Mali' },
]

export const nuclearStates: NuclearState[] = [
  { country: 'United States', code: 'US', warheads: 5244, deliverySystems: ['ICBM', 'SLBM', 'Bomber'], lastTest: '1992', doctrine: 'Flexible Response', treatyCompliance: 'compliant' },
  { country: 'Russia', code: 'RU', warheads: 5889, deliverySystems: ['ICBM', 'SLBM', 'Bomber', 'Hypersonic'], lastTest: '1990', doctrine: 'Escalate to De-escalate', treatyCompliance: 'partial' },
  { country: 'China', code: 'CN', warheads: 500, deliverySystems: ['ICBM', 'SLBM', 'Bomber'], lastTest: '1996', doctrine: 'No First Use', treatyCompliance: 'compliant' },
  { country: 'France', code: 'FR', warheads: 290, deliverySystems: ['SLBM', 'Bomber'], lastTest: '1996', doctrine: 'Minimum Deterrence', treatyCompliance: 'compliant' },
  { country: 'United Kingdom', code: 'GB', warheads: 225, deliverySystems: ['SLBM'], lastTest: '1991', doctrine: 'Minimum Deterrence', treatyCompliance: 'compliant' },
  { country: 'Pakistan', code: 'PK', warheads: 170, deliverySystems: ['Ballistic Missile', 'Cruise Missile'], lastTest: '1998', doctrine: 'First Use', treatyCompliance: 'non-compliant' },
  { country: 'India', code: 'IN', warheads: 172, deliverySystems: ['ICBM', 'SLBM', 'Bomber'], lastTest: '1998', doctrine: 'No First Use', treatyCompliance: 'non-compliant' },
  { country: 'Israel', code: 'IL', warheads: 90, deliverySystems: ['ICBM', 'SLBM', 'Bomber'], lastTest: 'N/A', doctrine: 'Opacity/Ambiguity', treatyCompliance: 'non-compliant' },
  { country: 'North Korea', code: 'KP', warheads: 50, deliverySystems: ['ICBM', 'MRBM'], lastTest: '2017', doctrine: 'Preemptive Use', treatyCompliance: 'non-compliant' },
]
