import type { ConflictEvent } from '@/types'

// Helper to resolve region from country name
function getRegionFromCountry(country: string): string {
  const c = country.toLowerCase()
  if (['ukraine', 'russia', 'belarus', 'poland'].some(x => c.includes(x))) return 'Eastern Europe'
  if (['sudan', 'somalia', 'ethiopia', 'kenya', 'uganda'].some(x => c.includes(x))) return 'East Africa'
  if (['gaza', 'palestine', 'israel', 'syria', 'iraq', 'iran', 'yemen', 'saudi arabia'].some(x => c.includes(x))) return 'Middle East'
  if (['myanmar', 'vietnam', 'thailand', 'philippines'].some(x => c.includes(x))) return 'Southeast Asia'
  if (['mali', 'nigeria', 'niger', 'burkina faso'].some(x => c.includes(x))) return 'West Africa'
  if (['pakistan', 'india', 'afghanistan', 'bangladesh'].some(x => c.includes(x))) return 'South Asia'
  if (['congo', 'drc', 'angola'].some(x => c.includes(x))) return 'Central Africa'
  return 'Global'
}

// Extends ACLED notes to find referenced weapons
function extractWeapons(notes: string): string[] {
  const list: string[] = []
  const text = notes.toLowerCase()
  if (text.includes('drone') || text.includes('uav')) list.push('Drones')
  if (text.includes('artillery') || text.includes('shelling') || text.includes('mortar')) list.push('Artillery')
  if (text.includes('missile') || text.includes('rocket') || text.includes('himars')) list.push('Missiles')
  if (text.includes('tank') || text.includes('armoured') || text.includes('apc')) list.push('Armour')
  if (text.includes('air strike') || text.includes('fighter jet') || text.includes('helicopter')) list.push('Air Support')
  if (list.length === 0) list.push('Small arms')
  return list
}

// Map ACLED event type string to our local type filter
function mapAcledType(type: string): string {
  const t = type.toLowerCase()
  if (t.includes('battle')) return 'battle'
  if (t.includes('explosion') || t.includes('remote violence')) return 'explosion'
  if (t.includes('protest') || t.includes('riot')) return 'protest'
  if (t.includes('violence against civilians')) return 'violence_against_civilians'
  return 'strategic_development'
}

export interface WBDataPoint {
  year: string
  value: number | null
}

export interface CommitData {
  id: string
  title: string
  author: string
  date: string
  url: string
  summary: string
  confidence: 'high' | 'medium' | 'low'
  type: 'satellite' | 'weapon_sighting' | 'battle_report' | 'dataset' | 'analysis'
  region: string
  source: string
}

/**
 * Fetches military spending and GDP trends from the keyless World Bank Open Data REST API.
 * Indictors:
 *   - Military Expenditure % of GDP: MS.MIL.XPND.GD.ZS
 *   - Absolute GDP (Current USD): NY.GDP.MKTP.CD
 *   - Arms Exports (SIPRI TIV proxy): MS.MIL.XPRT.KD
 */
export async function fetchWorldBankIndicator(countryCode: string, indicator: string): Promise<WBDataPoint[]> {
  try {
    const url = `https://api.worldbank.org/v2/country/${countryCode.toLowerCase()}/indicator/${indicator}?format=json&date=2010:2025&per_page=100`
    const res = await fetch(url)
    if (!res.ok) throw new Error(`World Bank HTTP error: ${res.status}`)
    const data = await res.json()
    
    if (Array.isArray(data) && data.length > 1 && Array.isArray(data[1])) {
      return data[1]
        .map((item: any) => ({
          year: item.date,
          value: item.value
        }))
        .filter((d: any) => d.value !== null)
        .reverse() // Output chronological
    }
    return []
  } catch (error) {
    console.error('Error fetching World Bank indicator:', error)
    return []
  }
}

/**
 * Fetches commits from public GitHub OSINT repositories in real-time
 * Default falls back to the danielrosehill repo.
 */
export async function fetchGitHubOSINTCommits(owner: string = 'danielrosehill', repo: string = 'Iran-Israel-War-2026-OSINT-Data'): Promise<CommitData[]> {
  try {
    const url = `https://api.github.com/repos/${owner}/${repo}/commits?per_page=10`
    const res = await fetch(url)
    if (!res.ok) throw new Error(`GitHub OSINT HTTP error: ${res.status}`)
    const commits = await res.json()
    
    if (Array.isArray(commits)) {
      return commits.map((item: any, i: number) => {
        const msg = item.commit?.message || 'OSINT Update'
        const firstLine = msg.split('\n')[0]
        const dateStr = item.commit?.author?.date || new Date().toISOString()
        const author = item.commit?.author?.name || 'Anonymous OSINT'
        
        // Auto classify based on commit message keywords
        let type: CommitData['type'] = 'analysis'
        let confidence: CommitData['confidence'] = 'medium'
        if (msg.toLowerCase().includes('satellite') || msg.toLowerCase().includes('imagery')) {
          type = 'satellite'
          confidence = 'high'
        } else if (msg.toLowerCase().includes('weapon') || msg.toLowerCase().includes('missile') || msg.toLowerCase().includes('defense')) {
          type = 'weapon_sighting'
          confidence = 'high'
        } else if (msg.toLowerCase().includes('battle') || msg.toLowerCase().includes('strike') || msg.toLowerCase().includes('clash')) {
          type = 'battle_report'
          confidence = 'high'
        } else if (msg.toLowerCase().includes('data') || msg.toLowerCase().includes('csv') || msg.toLowerCase().includes('json')) {
          type = 'dataset'
        }
        
        return {
          id: item.sha || `commit-${i}`,
          title: firstLine.length > 60 ? firstLine.substring(0, 57) + '...' : firstLine,
          author: author,
          date: dateStr.split('T')[0],
          url: item.html_url || `https://github.com/${owner}/${repo}`,
          summary: msg,
          confidence: confidence,
          type: type,
          region: getRegionFromCountry(msg + ' ' + repo),
          source: `GitHub (${owner}/${repo.substring(0, 10)}...)`
        }
      })
    }
    return []
  } catch (error) {
    console.error('Error fetching GitHub OSINT commits:', error)
    return []
  }
}

/**
 * Syncs real-time events from ACLED API using VITE_ACLED_EMAIL & VITE_ACLED_TOKEN
 * Uses AllOrigins CORS proxy. Falls back to null if keys aren't present or call fails.
 */
export async function fetchACLEDLiveEvents(limit: number = 100): Promise<ConflictEvent[] | null> {
  const email = import.meta.env.VITE_ACLED_EMAIL
  const token = import.meta.env.VITE_ACLED_TOKEN
  
  if (!email || !token) {
    console.info('ACLED API credentials not set. Falling back to local offline dataset.')
    return null
  }
  
  try {
    const acledUrl = `https://api.acleddata.com/acled/read.json?email=${encodeURIComponent(email)}&key=${encodeURIComponent(token)}&limit=${limit}`
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(acledUrl)}`
    
    const res = await fetch(proxyUrl)
    if (!res.ok) throw new Error(`ACLED Proxy HTTP error: ${res.status}`)
    const data = await res.json()
    
    if (data && Array.isArray(data.data)) {
      return data.data.map((e: any, index: number) => {
        const fatalitiesCount = parseInt(e.fatalities) || 0
        
        return {
          id: e.event_id_cnty || `acled-${index}`,
          name: `${e.actor1 || 'Combatants'} vs ${e.actor2 || 'Forces'}`,
          country: e.country || 'Unknown',
          region: getRegionFromCountry(e.country || ''),
          lat: parseFloat(e.latitude) || 0.0,
          lng: parseFloat(e.longitude) || 0.0,
          fatalities: fatalitiesCount,
          date: e.event_date || new Date().toISOString().split('T')[0],
          type: mapAcledType(e.event_type || ''),
          actors: [e.actor1, e.actor2].filter(Boolean),
          weapons: extractWeapons(e.notes || ''),
          intensity: fatalitiesCount > 50 ? 'critical' : fatalitiesCount > 10 ? 'high' : fatalitiesCount > 0 ? 'medium' : 'low',
          description: e.notes || 'No description provided.'
        }
      })
    }
    return null
  } catch (error) {
    console.error('Failed to fetch ACLED live events:', error)
    return null
  }
}
