import type { ArmsTransfer } from '@/types'

export const armsTransfers: ArmsTransfer[] = [
  { id: 'at1', supplier: 'United States', supplierCode: 'US', recipient: 'Saudi Arabia', recipientCode: 'SA', weaponCategory: 'Aircraft', weaponSystem: 'F-15SA Eagle', quantity: 84, year: 2024, value: 29_400_000_000, status: 'delivered' },
  { id: 'at2', supplier: 'Russia', supplierCode: 'RU', recipient: 'India', recipientCode: 'IN', weaponCategory: 'Air Defense', weaponSystem: 'S-400 Triumf', quantity: 5, year: 2024, value: 5_430_000_000, status: 'delivered' },
  { id: 'at3', supplier: 'United States', supplierCode: 'US', recipient: 'Taiwan', recipientCode: 'TW', weaponCategory: 'Aircraft', weaponSystem: 'F-16V Block 70', quantity: 66, year: 2024, value: 8_000_000_000, status: 'in-transit' },
  { id: 'at4', supplier: 'France', supplierCode: 'FR', recipient: 'India', recipientCode: 'IN', weaponCategory: 'Aircraft', weaponSystem: 'Rafale', quantity: 36, year: 2023, value: 8_700_000_000, status: 'delivered' },
  { id: 'at5', supplier: 'China', supplierCode: 'CN', recipient: 'Pakistan', recipientCode: 'PK', weaponCategory: 'Aircraft', weaponSystem: 'JF-17 Thunder', quantity: 50, year: 2024, value: 2_500_000_000, status: 'delivered' },
  { id: 'at6', supplier: 'United States', supplierCode: 'US', recipient: 'Japan', recipientCode: 'JP', weaponCategory: 'Missiles', weaponSystem: 'Tomahawk', quantity: 400, year: 2024, value: 2_350_000_000, status: 'ordered' },
  { id: 'at7', supplier: 'Germany', supplierCode: 'DE', recipient: 'South Korea', recipientCode: 'KR', weaponCategory: 'Naval', weaponSystem: 'Type 214 Submarine', quantity: 3, year: 2023, value: 1_800_000_000, status: 'delivered' },
  { id: 'at8', supplier: 'Turkey', supplierCode: 'TR', recipient: 'Ukraine', recipientCode: 'UA', weaponCategory: 'Drones', weaponSystem: 'Bayraktar TB2', quantity: 50, year: 2024, value: 350_000_000, status: 'delivered' },
  { id: 'at9', supplier: 'Russia', supplierCode: 'RU', recipient: 'China', recipientCode: 'CN', weaponCategory: 'Aircraft', weaponSystem: 'Su-35', quantity: 24, year: 2023, value: 2_000_000_000, status: 'delivered' },
  { id: 'at10', supplier: 'United States', supplierCode: 'US', recipient: 'Australia', recipientCode: 'AU', weaponCategory: 'Naval', weaponSystem: 'Virginia-class Submarine', quantity: 3, year: 2024, value: 22_000_000_000, status: 'ordered' },
  { id: 'at11', supplier: 'Israel', supplierCode: 'IL', recipient: 'India', recipientCode: 'IN', weaponCategory: 'Missiles', weaponSystem: 'Barak-8', quantity: 100, year: 2024, value: 2_600_000_000, status: 'in-transit' },
  { id: 'at12', supplier: 'United States', supplierCode: 'US', recipient: 'Poland', recipientCode: 'PL', weaponCategory: 'Tanks', weaponSystem: 'M1A2 Abrams', quantity: 250, year: 2024, value: 4_750_000_000, status: 'in-transit' },
  { id: 'at13', supplier: 'China', supplierCode: 'CN', recipient: 'Bangladesh', recipientCode: 'BD', weaponCategory: 'Naval', weaponSystem: 'Type 053H3 Frigate', quantity: 2, year: 2023, value: 400_000_000, status: 'delivered' },
  { id: 'at14', supplier: 'Russia', supplierCode: 'RU', recipient: 'Egypt', recipientCode: 'EG', weaponCategory: 'Air Defense', weaponSystem: 'S-300VM', quantity: 2, year: 2023, value: 3_500_000_000, status: 'delivered' },
  { id: 'at15', supplier: 'United States', supplierCode: 'US', recipient: 'Israel', recipientCode: 'IL', weaponCategory: 'Aircraft', weaponSystem: 'F-35I Adir', quantity: 25, year: 2024, value: 3_000_000_000, status: 'delivered' },
]

export const armsFlowSummary = {
  totalTransfers2024: 847,
  totalValue2024: 112_000_000_000,
  topSupplier: 'United States',
  topRecipient: 'Saudi Arabia',
  mostTradedCategory: 'Aircraft',
  activeDeals: 234,
}

export const supplierRankings = [
  { country: 'United States', code: 'US', share: 40, value: 44_800_000_000 },
  { country: 'Russia', code: 'RU', share: 16, value: 17_920_000_000 },
  { country: 'France', code: 'FR', share: 11, value: 12_320_000_000 },
  { country: 'China', code: 'CN', share: 8, value: 8_960_000_000 },
  { country: 'Germany', code: 'DE', share: 5, value: 5_600_000_000 },
  { country: 'Italy', code: 'IT', share: 4, value: 4_480_000_000 },
  { country: 'United Kingdom', code: 'GB', share: 4, value: 4_480_000_000 },
  { country: 'Israel', code: 'IL', share: 3, value: 3_360_000_000 },
  { country: 'South Korea', code: 'KR', share: 3, value: 3_360_000_000 },
  { country: 'Turkey', code: 'TR', share: 2, value: 2_240_000_000 },
]

export const expenditureTrend = [
  { year: 2015, global: 1_676_000, nato: 892_000, asia: 436_000, middleEast: 152_000 },
  { year: 2016, global: 1_739_000, nato: 913_000, asia: 457_000, middleEast: 148_000 },
  { year: 2017, global: 1_791_000, nato: 936_000, asia: 477_000, middleEast: 145_000 },
  { year: 2018, global: 1_822_000, nato: 963_000, asia: 501_000, middleEast: 139_000 },
  { year: 2019, global: 1_917_000, nato: 1_008_000, asia: 523_000, middleEast: 142_000 },
  { year: 2020, global: 1_981_000, nato: 1_044_000, asia: 548_000, middleEast: 136_000 },
  { year: 2021, global: 2_113_000, nato: 1_107_000, asia: 586_000, middleEast: 144_000 },
  { year: 2022, global: 2_240_000, nato: 1_174_000, asia: 612_000, middleEast: 153_000 },
  { year: 2023, global: 2_443_000, nato: 1_261_000, asia: 648_000, middleEast: 162_000 },
  { year: 2024, global: 2_560_000, nato: 1_340_000, asia: 690_000, middleEast: 171_000 },
]
