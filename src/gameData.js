// ── Buildings (auto-pukers) ──
// Cost formula: baseCost * 1.15^owned
export const BUILDINGS = [
  {
    id: 'queasy',
    name: 'Kvalme',
    emoji: '🤢',
    baseCost: 15,
    basePps: 0.1,
    desc: 'En let uro i maven',
  },
  {
    id: 'finger',
    name: 'Fingeren i Halsen',
    emoji: '👆',
    baseCost: 100,
    basePps: 1,
    desc: 'Den klassiske teknik',
  },
  {
    id: 'oyster',
    name: 'Dårlig Østers',
    emoji: '🦪',
    baseCost: 1_100,
    basePps: 8,
    desc: 'Skulle IKKE have spist den',
  },
  {
    id: 'seasick',
    name: 'Søsyge',
    emoji: '🚢',
    baseCost: 12_000,
    basePps: 47,
    desc: 'Uroligt hav forude',
  },
  {
    id: 'norovirus',
    name: 'Norovirus',
    emoji: '🦠',
    baseCost: 130_000,
    basePps: 260,
    desc: 'Spreder kærligheden',
  },
  {
    id: 'comet',
    name: 'Bræk-Kometen',
    emoji: '☄️',
    baseCost: 1_400_000,
    basePps: 1_400,
    desc: 'Nul tyngdekraft, nul mavekontrol',
  },
  {
    id: 'volcano',
    name: 'Bræk-Vulkan',
    emoji: '🌋',
    baseCost: 20_000_000,
    basePps: 7_800,
    desc: 'Et udbrud af bibelske proportioner',
  },
  {
    id: 'singularity',
    name: 'Bræk-Singularitet',
    emoji: '🕳️',
    baseCost: 330_000_000,
    basePps: 44_000,
    desc: 'Et sort hul af opkast',
  },
]

// ── Upgrades ──
export const UPGRADES = [
  // Click power upgrades
  {
    id: 'click_2x',
    name: 'Stærkere Fingre',
    emoji: '💪',
    cost: 100,
    desc: 'Dobbelt bræk per klik',
    type: 'click_mult',
    value: 2,
    require: { clicks: 0 },
  },
  {
    id: 'click_5x',
    name: 'Ipecac Sirup',
    emoji: '🧴',
    cost: 500,
    desc: '×5 bræk per klik',
    type: 'click_mult',
    value: 2.5,
    require: { upgrade: 'click_2x' },
  },
  {
    id: 'click_10x',
    name: 'Jern-Mave',
    emoji: '🫃',
    cost: 10_000,
    desc: '×10 bræk per klik',
    type: 'click_mult',
    value: 2,
    require: { upgrade: 'click_5x' },
  },
  {
    id: 'click_50x',
    name: 'Eksplosiv Refleks',
    emoji: '💥',
    cost: 100_000,
    desc: '×50 bræk per klik',
    type: 'click_mult',
    value: 5,
    require: { upgrade: 'click_10x' },
  },
  {
    id: 'click_pps',
    name: 'Synergibræk',
    emoji: '🔄',
    cost: 500_000,
    desc: '+1% af BPS tilføjes per klik',
    type: 'click_pps_bonus',
    value: 0.01,
    require: { upgrade: 'click_50x' },
  },

  // Building doublers — unlocked at 10 of each building
  {
    id: 'queasy_2x',
    name: 'Dybere Uro',
    emoji: '🤢',
    cost: 1_000,
    desc: 'Kvalme er dobbelt så effektive',
    type: 'building_mult',
    building: 'queasy',
    value: 2,
    require: { building: 'queasy', count: 10 },
  },
  {
    id: 'finger_2x',
    name: 'Længere Fingre',
    emoji: '👆',
    cost: 5_000,
    desc: 'Fingeren i Halsen er dobbelt så effektiv',
    type: 'building_mult',
    building: 'finger',
    value: 2,
    require: { building: 'finger', count: 10 },
  },
  {
    id: 'oyster_2x',
    name: 'Ekstra Rådden',
    emoji: '🦪',
    cost: 55_000,
    desc: 'Dårlige Østers er dobbelt så effektive',
    type: 'building_mult',
    building: 'oyster',
    value: 2,
    require: { building: 'oyster', count: 10 },
  },
  {
    id: 'seasick_2x',
    name: 'Orkan Styrke',
    emoji: '🚢',
    cost: 600_000,
    desc: 'Søsyge er dobbelt så effektiv',
    type: 'building_mult',
    building: 'seasick',
    value: 2,
    require: { building: 'seasick', count: 10 },
  },
  {
    id: 'norovirus_2x',
    name: 'Mutation',
    emoji: '🦠',
    cost: 6_500_000,
    desc: 'Norovirus er dobbelt så effektiv',
    type: 'building_mult',
    building: 'norovirus',
    value: 2,
    require: { building: 'norovirus', count: 10 },
  },
  {
    id: 'comet_2x',
    name: 'Meteor Regn',
    emoji: '☄️',
    cost: 70_000_000,
    desc: 'Bræk-Kometen er dobbelt så effektiv',
    type: 'building_mult',
    building: 'comet',
    value: 2,
    require: { building: 'comet', count: 10 },
  },
  {
    id: 'volcano_2x',
    name: 'Supervulkan',
    emoji: '🌋',
    cost: 1_000_000_000,
    desc: 'Bræk-Vulkan er dobbelt så effektiv',
    type: 'building_mult',
    building: 'volcano',
    value: 2,
    require: { building: 'volcano', count: 10 },
  },
  {
    id: 'singularity_2x',
    name: 'Multiversum Bræk',
    emoji: '🕳️',
    cost: 16_500_000_000,
    desc: 'Bræk-Singularitet er dobbelt så effektiv',
    type: 'building_mult',
    building: 'singularity',
    value: 2,
    require: { building: 'singularity', count: 10 },
  },

  // Second tier doublers at 25
  {
    id: 'queasy_4x',
    name: 'Kronisk Kvalme',
    emoji: '🤢',
    cost: 10_000,
    desc: 'Kvalme er IGEN dobbelt så effektive',
    type: 'building_mult',
    building: 'queasy',
    value: 2,
    require: { building: 'queasy', count: 25 },
  },
  {
    id: 'finger_4x',
    name: 'Dobbelt-Fist',
    emoji: '👆',
    cost: 50_000,
    desc: 'Fingeren i Halsen er IGEN dobbelt',
    type: 'building_mult',
    building: 'finger',
    value: 2,
    require: { building: 'finger', count: 25 },
  },
  {
    id: 'oyster_4x',
    name: 'Giftig Cocktail',
    emoji: '🦪',
    cost: 550_000,
    desc: 'Dårlige Østers er IGEN dobbelt',
    type: 'building_mult',
    building: 'oyster',
    value: 2,
    require: { building: 'oyster', count: 25 },
  },

  // Global multipliers
  {
    id: 'global_2x',
    name: 'Bræk-Feber',
    emoji: '🌡️',
    cost: 50_000,
    desc: 'ALT bræk ×2',
    type: 'global_mult',
    value: 2,
    require: { totalPukes: 10_000 },
  },
  {
    id: 'global_4x',
    name: 'Pandemi',
    emoji: '😷',
    cost: 5_000_000,
    desc: 'ALT bræk ×2 igen',
    type: 'global_mult',
    value: 2,
    require: { totalPukes: 1_000_000 },
  },
  {
    id: 'global_8x',
    name: 'Apokalypse',
    emoji: '☠️',
    cost: 500_000_000,
    desc: 'ALT bræk ×2 igen',
    type: 'global_mult',
    value: 2,
    require: { totalPukes: 100_000_000 },
  },
]

// ── Achievements ──
export const ACHIEVEMENTS = [
  { id: 'first_puke', name: 'Første Bræk', emoji: '🎉', desc: 'Bræk for første gang', check: (s) => s.totalClicks >= 1 },
  { id: 'puke_10', name: 'Begynder', emoji: '🥉', desc: 'Klik 10 gange', check: (s) => s.totalClicks >= 10 },
  { id: 'puke_100', name: 'Øvet', emoji: '🥈', desc: 'Klik 100 gange', check: (s) => s.totalClicks >= 100 },
  { id: 'puke_1000', name: 'Bræk-Mester', emoji: '🥇', desc: 'Klik 1.000 gange', check: (s) => s.totalClicks >= 1000 },
  { id: 'earn_1k', name: 'Tusind Bræk', emoji: '💰', desc: 'Tjen 1.000 bræk totalt', check: (s) => s.totalPukes >= 1_000 },
  { id: 'earn_1m', name: 'Millionær', emoji: '💎', desc: 'Tjen 1.000.000 bræk totalt', check: (s) => s.totalPukes >= 1_000_000 },
  { id: 'earn_1b', name: 'Milliardær', emoji: '👑', desc: 'Tjen 1.000.000.000 bræk totalt', check: (s) => s.totalPukes >= 1_000_000_000 },
  { id: 'bps_10', name: 'Automatiseret', emoji: '⚙️', desc: 'Nå 10 bræk per sekund', check: (s) => s.pps >= 10 },
  { id: 'bps_100', name: 'Fabrik', emoji: '🏭', desc: 'Nå 100 bræk per sekund', check: (s) => s.pps >= 100 },
  { id: 'bps_1k', name: 'Industriel Bræk', emoji: '🔧', desc: 'Nå 1.000 bræk per sekund', check: (s) => s.pps >= 1_000 },
  { id: 'bps_10k', name: 'Bræk-Imperium', emoji: '🏰', desc: 'Nå 10.000 bræk per sekund', check: (s) => s.pps >= 10_000 },
  { id: 'buildings_50', name: 'Bygherre', emoji: '🏗️', desc: 'Ej 50 bygninger totalt', check: (s) => Object.values(s.buildings).reduce((a, b) => a + b, 0) >= 50 },
  { id: 'buildings_100', name: 'Mogul', emoji: '🏛️', desc: 'Ej 100 bygninger totalt', check: (s) => Object.values(s.buildings).reduce((a, b) => a + b, 0) >= 100 },
]

// ── Helpers ──
export function getBuildingCost(building, owned) {
  return Math.floor(building.baseCost * Math.pow(1.15, owned))
}

export function getBuildingBulkCost(building, owned, amount) {
  let total = 0
  for (let i = 0; i < amount; i++) {
    total += getBuildingCost(building, owned + i)
  }
  return total
}

export function formatNumber(n) {
  if (n < 0) return '-' + formatNumber(-n)
  if (n < 1_000) return n < 10 ? n.toFixed(1) : Math.floor(n).toString()
  if (n < 1_000_000) return (n / 1_000).toFixed(1) + 'K'
  if (n < 1_000_000_000) return (n / 1_000_000).toFixed(2) + 'M'
  if (n < 1_000_000_000_000) return (n / 1_000_000_000).toFixed(2) + 'B'
  return (n / 1_000_000_000_000).toFixed(2) + 'T'
}

export function formatWhole(n) {
  if (n < 1_000) return Math.floor(n).toLocaleString()
  return formatNumber(n)
}

// How long until you can afford `cost` at `pps` rate
export function timeToAfford(cost, current, pps) {
  if (current >= cost) return 'nu!'
  if (pps <= 0) return '∞'
  const secs = (cost - current) / pps
  if (secs < 60) return `${Math.ceil(secs)}s`
  if (secs < 3600) return `${Math.floor(secs / 60)}m ${Math.ceil(secs % 60)}s`
  if (secs < 86400) return `${Math.floor(secs / 3600)}t ${Math.floor((secs % 3600) / 60)}m`
  return `${Math.floor(secs / 86400)}d ${Math.floor((secs % 86400) / 3600)}t`
}
