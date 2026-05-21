import type { ConflictEvent } from '@/types'

export const conflictEvents: ConflictEvent[] = [
  {
    id: 'c1', name: 'Khartoum Offensive', country: 'Sudan', region: 'East Africa',
    lat: 15.5007, lng: 32.5599, fatalities: 234, date: '2024-12-15',
    type: 'battle', actors: ['RSF', 'SAF'], weapons: ['Small arms', 'Artillery'],
    intensity: 'critical', description: 'Heavy fighting between RSF and SAF forces in central Khartoum'
  },
  {
    id: 'c2', name: 'Donetsk Front Line', country: 'Ukraine', region: 'Eastern Europe',
    lat: 48.0159, lng: 37.8028, fatalities: 187, date: '2024-12-14',
    type: 'battle', actors: ['UA Forces', 'RU Forces'], weapons: ['Artillery', 'Drones', 'MLRS'],
    intensity: 'critical', description: 'Continued artillery exchanges along the Donetsk front line'
  },
  {
    id: 'c3', name: 'Gaza Strikes', country: 'Palestine', region: 'Middle East',
    lat: 31.3547, lng: 34.3088, fatalities: 156, date: '2024-12-14',
    type: 'explosion', actors: ['IDF', 'Hamas'], weapons: ['Air strikes', 'Rockets'],
    intensity: 'critical', description: 'Aerial bombardment and ground operations in northern Gaza'
  },
  {
    id: 'c4', name: 'Tigray Clashes', country: 'Ethiopia', region: 'East Africa',
    lat: 13.4960, lng: 39.4753, fatalities: 89, date: '2024-12-13',
    type: 'battle', actors: ['TPLF', 'ENDF'], weapons: ['Small arms', 'Technicals'],
    intensity: 'high', description: 'Renewed clashes in western Tigray region'
  },
  {
    id: 'c5', name: 'Cabo Delgado Insurgency', country: 'Mozambique', region: 'Southern Africa',
    lat: -12.3500, lng: 40.3500, fatalities: 45, date: '2024-12-12',
    type: 'violence_against_civilians', actors: ['ASWJ', 'FADM'], weapons: ['Small arms', 'IEDs'],
    intensity: 'high', description: 'Insurgent attacks on civilian settlements in Cabo Delgado province'
  },
  {
    id: 'c6', name: 'Sahel Operations', country: 'Mali', region: 'West Africa',
    lat: 14.6005, lng: -2.1310, fatalities: 67, date: '2024-12-11',
    type: 'battle', actors: ['JNIM', 'FAMa', 'Wagner'], weapons: ['Small arms', 'Drones'],
    intensity: 'high', description: 'Joint military operations against JNIM militants in central Mali'
  },
  {
    id: 'c7', name: 'Myanmar Resistance', country: 'Myanmar', region: 'Southeast Asia',
    lat: 21.9162, lng: 95.9560, fatalities: 78, date: '2024-12-10',
    type: 'battle', actors: ['PDF', 'Tatmadaw'], weapons: ['Small arms', 'Artillery'],
    intensity: 'high', description: 'Resistance forces engage military junta in Sagaing Region'
  },
  {
    id: 'c8', name: 'Zaporizhzhia Drone Strikes', country: 'Ukraine', region: 'Eastern Europe',
    lat: 47.8388, lng: 35.1396, fatalities: 12, date: '2024-12-14',
    type: 'explosion', actors: ['UA Forces', 'RU Forces'], weapons: ['FPV Drones', 'Shahed-136'],
    intensity: 'medium', description: 'Drone warfare along the Zaporizhzhia front'
  },
  {
    id: 'c9', name: 'Kivu Conflict', country: 'DRC', region: 'Central Africa',
    lat: -1.6809, lng: 29.2284, fatalities: 112, date: '2024-12-09',
    type: 'battle', actors: ['M23', 'FARDC', 'FDLR'], weapons: ['Small arms', 'Mortars'],
    intensity: 'high', description: 'M23 rebel advances in North Kivu province'
  },
  {
    id: 'c10', name: 'Balochistan Attack', country: 'Pakistan', region: 'South Asia',
    lat: 30.3753, lng: 66.9750, fatalities: 23, date: '2024-12-08',
    type: 'explosion', actors: ['BLA', 'Pakistan Army'], weapons: ['IEDs', 'Small arms'],
    intensity: 'medium', description: 'Separatist attack on military convoy in Balochistan'
  },
  {
    id: 'c11', name: 'Idlib Shelling', country: 'Syria', region: 'Middle East',
    lat: 35.9310, lng: 36.6340, fatalities: 34, date: '2024-12-07',
    type: 'explosion', actors: ['SAA', 'HTS'], weapons: ['Artillery', 'Barrel bombs'],
    intensity: 'medium', description: 'Syrian army shelling of opposition-held Idlib'
  },
  {
    id: 'c12', name: 'Boko Haram Raid', country: 'Nigeria', region: 'West Africa',
    lat: 11.8469, lng: 13.1510, fatalities: 56, date: '2024-12-06',
    type: 'violence_against_civilians', actors: ['ISWAP', 'Nigerian Army'], weapons: ['Small arms', 'RPGs'],
    intensity: 'high', description: 'ISWAP raid on fishing communities near Lake Chad'
  },
  {
    id: 'c13', name: 'Kherson Counterattack', country: 'Ukraine', region: 'Eastern Europe',
    lat: 46.6354, lng: 32.6169, fatalities: 45, date: '2024-12-13',
    type: 'battle', actors: ['UA Forces', 'RU Forces'], weapons: ['HIMARS', 'Artillery', 'Tanks'],
    intensity: 'high', description: 'Ukrainian counteroffensive operations near Kherson'
  },
  {
    id: 'c14', name: 'Al-Shabaab Ambush', country: 'Somalia', region: 'East Africa',
    lat: 2.0469, lng: 45.3182, fatalities: 38, date: '2024-12-05',
    type: 'battle', actors: ['Al-Shabaab', 'SNA', 'AMISOM'], weapons: ['Small arms', 'VBIED'],
    intensity: 'medium', description: 'Al-Shabaab ambush on government convoy near Beledweyne'
  },
  {
    id: 'c15', name: 'Nagorno-Karabakh Tensions', country: 'Armenia', region: 'South Caucasus',
    lat: 39.8136, lng: 46.7519, fatalities: 0, date: '2024-12-04',
    type: 'strategic_development', actors: ['Armenia', 'Azerbaijan'], weapons: [],
    intensity: 'low', description: 'Military buildup detected along the border'
  },
]

export const conflictSummary = {
  activeConflicts: 32,
  countriesAffected: 47,
  totalFatalities2024: 187432,
  criticalHotspots: 8,
  newEventsToday: 156,
  droneStrikesToday: 23,
}
