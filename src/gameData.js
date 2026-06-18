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
  // ── New late-game buildings ──
  {
    id: 'dimension',
    name: 'Bræk-Dimensionen',
    emoji: '🌀',
    baseCost: 5_100_000_000,
    basePps: 260_000,
    desc: 'Et parallelt univers af ren bræk',
  },
  {
    id: 'timeloop',
    name: 'Tidsbræk',
    emoji: '⏳',
    baseCost: 75_000_000_000,
    basePps: 1_600_000,
    desc: 'Bræk der transcenderer tid og rum',
  },
  {
    id: 'deity',
    name: 'Den Almægtige Bræk',
    emoji: '👼',
    baseCost: 1_000_000_000_000,
    basePps: 10_000_000,
    desc: 'Guddommeligt opkast fra oven',
  },
]

// ── Upgrades ──
export const UPGRADES = [
  // ═══════════════════════════════
  //  Click power upgrades
  // ═══════════════════════════════
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
  // Late-game click upgrades
  {
    id: 'click_250x',
    name: 'Atomklik',
    emoji: '⚛️',
    cost: 5_000_000,
    desc: '×250 bræk per klik',
    type: 'click_mult',
    value: 5,
    require: { upgrade: 'click_pps' },
  },
  {
    id: 'click_pps_2',
    name: 'Synergi II',
    emoji: '🔁',
    cost: 50_000_000,
    desc: '+5% af BPS tilføjes per klik',
    type: 'click_pps_bonus',
    value: 0.05,
    require: { upgrade: 'click_250x' },
  },
  {
    id: 'click_1000x',
    name: 'Kvanteklik',
    emoji: '🔮',
    cost: 500_000_000,
    desc: '×1.000 bræk per klik',
    type: 'click_mult',
    value: 4,
    require: { upgrade: 'click_pps_2' },
  },
  {
    id: 'click_pps_3',
    name: 'Synergi III',
    emoji: '♾️',
    cost: 10_000_000_000,
    desc: '+10% af BPS tilføjes per klik',
    type: 'click_pps_bonus',
    value: 0.10,
    require: { upgrade: 'click_1000x' },
  },

  // ═══════════════════════════════
  //  Building doublers — Tier 1 (at 10 owned)
  // ═══════════════════════════════
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
  {
    id: 'dimension_2x',
    name: 'Parallel Spaltning',
    emoji: '🌀',
    cost: 255_000_000_000,
    desc: 'Bræk-Dimensionen er dobbelt så effektiv',
    type: 'building_mult',
    building: 'dimension',
    value: 2,
    require: { building: 'dimension', count: 10 },
  },
  {
    id: 'timeloop_2x',
    name: 'Tidsparadoks',
    emoji: '⏳',
    cost: 3_750_000_000_000,
    desc: 'Tidsbræk er dobbelt så effektiv',
    type: 'building_mult',
    building: 'timeloop',
    value: 2,
    require: { building: 'timeloop', count: 10 },
  },
  {
    id: 'deity_2x',
    name: 'Hellig Vrede',
    emoji: '👼',
    cost: 50_000_000_000_000,
    desc: 'Den Almægtige Bræk er dobbelt så effektiv',
    type: 'building_mult',
    building: 'deity',
    value: 2,
    require: { building: 'deity', count: 10 },
  },

  // ═══════════════════════════════
  //  Building doublers — Tier 2 (at 25 owned)
  // ═══════════════════════════════
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
  // Filling in the missing tier 2 doublers
  {
    id: 'seasick_4x',
    name: 'Kategori 5 Storm',
    emoji: '🚢',
    cost: 6_000_000,
    desc: 'Søsyge er IGEN dobbelt så effektiv',
    type: 'building_mult',
    building: 'seasick',
    value: 2,
    require: { building: 'seasick', count: 25 },
  },
  {
    id: 'norovirus_4x',
    name: 'Biovåben',
    emoji: '🦠',
    cost: 65_000_000,
    desc: 'Norovirus er IGEN dobbelt så effektiv',
    type: 'building_mult',
    building: 'norovirus',
    value: 2,
    require: { building: 'norovirus', count: 25 },
  },
  {
    id: 'comet_4x',
    name: 'Asteroidebælte',
    emoji: '☄️',
    cost: 700_000_000,
    desc: 'Bræk-Kometen er IGEN dobbelt så effektiv',
    type: 'building_mult',
    building: 'comet',
    value: 2,
    require: { building: 'comet', count: 25 },
  },
  {
    id: 'volcano_4x',
    name: 'Magmakerne',
    emoji: '🌋',
    cost: 10_000_000_000,
    desc: 'Bræk-Vulkan er IGEN dobbelt så effektiv',
    type: 'building_mult',
    building: 'volcano',
    value: 2,
    require: { building: 'volcano', count: 25 },
  },
  {
    id: 'singularity_4x',
    name: 'Evighedsbræk',
    emoji: '🕳️',
    cost: 165_000_000_000,
    desc: 'Bræk-Singularitet er IGEN dobbelt',
    type: 'building_mult',
    building: 'singularity',
    value: 2,
    require: { building: 'singularity', count: 25 },
  },
  {
    id: 'dimension_4x',
    name: 'Uendelig Rifter',
    emoji: '🌀',
    cost: 2_550_000_000_000,
    desc: 'Bræk-Dimensionen er IGEN dobbelt',
    type: 'building_mult',
    building: 'dimension',
    value: 2,
    require: { building: 'dimension', count: 25 },
  },
  {
    id: 'timeloop_4x',
    name: 'Evig Gentagelse',
    emoji: '⏳',
    cost: 37_500_000_000_000,
    desc: 'Tidsbræk er IGEN dobbelt så effektiv',
    type: 'building_mult',
    building: 'timeloop',
    value: 2,
    require: { building: 'timeloop', count: 25 },
  },
  {
    id: 'deity_4x',
    name: 'Ragnarok',
    emoji: '👼',
    cost: 500_000_000_000_000,
    desc: 'Den Almægtige Bræk er IGEN dobbelt',
    type: 'building_mult',
    building: 'deity',
    value: 2,
    require: { building: 'deity', count: 25 },
  },

  // ═══════════════════════════════
  //  Building triplers — Tier 3 (at 50 owned)
  // ═══════════════════════════════
  {
    id: 'queasy_12x',
    name: 'Permanent Ubehag',
    emoji: '🤢',
    cost: 500_000,
    desc: 'Kvalme ×3 — det stopper aldrig',
    type: 'building_mult',
    building: 'queasy',
    value: 3,
    require: { building: 'queasy', count: 50 },
  },
  {
    id: 'finger_12x',
    name: 'Otte Arme',
    emoji: '👆',
    cost: 5_000_000,
    desc: 'Fingeren i Halsen ×3 — blæksprutte-teknik',
    type: 'building_mult',
    building: 'finger',
    value: 3,
    require: { building: 'finger', count: 50 },
  },
  {
    id: 'oyster_12x',
    name: 'Biologisk Fare',
    emoji: '🦪',
    cost: 50_000_000,
    desc: 'Dårlige Østers ×3 — dødelig dosis',
    type: 'building_mult',
    building: 'oyster',
    value: 3,
    require: { building: 'oyster', count: 50 },
  },
  {
    id: 'seasick_12x',
    name: 'Bermuda Trianglen',
    emoji: '🚢',
    cost: 500_000_000,
    desc: 'Søsyge ×3 — skibe forsvinder',
    type: 'building_mult',
    building: 'seasick',
    value: 3,
    require: { building: 'seasick', count: 50 },
  },
  {
    id: 'norovirus_12x',
    name: 'Patient Nul',
    emoji: '🦠',
    cost: 5_000_000_000,
    desc: 'Norovirus ×3 — global pandemi',
    type: 'building_mult',
    building: 'norovirus',
    value: 3,
    require: { building: 'norovirus', count: 50 },
  },
  {
    id: 'comet_12x',
    name: 'Extinction Event',
    emoji: '☄️',
    cost: 50_000_000_000,
    desc: 'Bræk-Kometen ×3 — dinosaurerne er færdige',
    type: 'building_mult',
    building: 'comet',
    value: 3,
    require: { building: 'comet', count: 50 },
  },
  {
    id: 'volcano_12x',
    name: 'Yellowstone',
    emoji: '🌋',
    cost: 500_000_000_000,
    desc: 'Bræk-Vulkan ×3 — supereruption',
    type: 'building_mult',
    building: 'volcano',
    value: 3,
    require: { building: 'volcano', count: 50 },
  },
  {
    id: 'singularity_12x',
    name: 'Big Bræk',
    emoji: '🕳️',
    cost: 5_000_000_000_000,
    desc: 'Singularitet ×3 — et nyt univers af bræk',
    type: 'building_mult',
    building: 'singularity',
    value: 3,
    require: { building: 'singularity', count: 50 },
  },

  // ═══════════════════════════════
  //  Building doublers — Tier 4 (at 100 owned)
  // ═══════════════════════════════
  {
    id: 'queasy_24x',
    name: 'Kvalme-Legende',
    emoji: '🤢',
    cost: 50_000_000,
    desc: 'Kvalme ×2 — den ultimative uro',
    type: 'building_mult',
    building: 'queasy',
    value: 2,
    require: { building: 'queasy', count: 100 },
  },
  {
    id: 'finger_24x',
    name: 'Tusind Fingre',
    emoji: '👆',
    cost: 500_000_000,
    desc: 'Fingeren i Halsen ×2 — en hær af fingre',
    type: 'building_mult',
    building: 'finger',
    value: 2,
    require: { building: 'finger', count: 100 },
  },
  {
    id: 'oyster_24x',
    name: 'Havets Forbandelse',
    emoji: '🦪',
    cost: 5_000_000_000,
    desc: 'Dårlige Østers ×2 — havet hævner sig',
    type: 'building_mult',
    building: 'oyster',
    value: 2,
    require: { building: 'oyster', count: 100 },
  },
  {
    id: 'seasick_24x',
    name: 'Poseidons Vrede',
    emoji: '🚢',
    cost: 50_000_000_000,
    desc: 'Søsyge ×2 — havguden er rasende',
    type: 'building_mult',
    building: 'seasick',
    value: 2,
    require: { building: 'seasick', count: 100 },
  },

  // ═══════════════════════════════
  //  Global multipliers
  // ═══════════════════════════════
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
  // Late-game global multipliers
  {
    id: 'global_16x',
    name: 'Ragnarok',
    emoji: '🔥',
    cost: 50_000_000_000,
    desc: 'ALT bræk ×2 — verden brænder',
    type: 'global_mult',
    value: 2,
    require: { totalPukes: 10_000_000_000 },
  },
  {
    id: 'global_32x',
    name: 'Big Bang Bræk',
    emoji: '💫',
    cost: 5_000_000_000_000,
    desc: 'ALT bræk ×2 — universets genfødsel',
    type: 'global_mult',
    value: 2,
    require: { totalPukes: 1_000_000_000_000 },
  },
  {
    id: 'global_64x',
    name: 'Omnibræk',
    emoji: '🌌',
    cost: 500_000_000_000_000,
    desc: 'ALT bræk ×2 — alt er bræk',
    type: 'global_mult',
    value: 2,
    require: { totalPukes: 100_000_000_000_000 },
  },
]

// ── Achievements ──
export const ACHIEVEMENTS = [
  // Click milestones
  { id: 'first_puke', name: 'Første Bræk', emoji: '🎉', desc: 'Bræk for første gang', check: (s) => s.totalClicks >= 1 },
  { id: 'puke_10', name: 'Begynder', emoji: '🥉', desc: 'Klik 10 gange', check: (s) => s.totalClicks >= 10 },
  { id: 'puke_100', name: 'Øvet', emoji: '🥈', desc: 'Klik 100 gange', check: (s) => s.totalClicks >= 100 },
  { id: 'puke_1000', name: 'Bræk-Mester', emoji: '🥇', desc: 'Klik 1.000 gange', check: (s) => s.totalClicks >= 1000 },
  { id: 'puke_10000', name: 'Bræk-Legende', emoji: '🏆', desc: 'Klik 10.000 gange', check: (s) => s.totalClicks >= 10_000 },
  { id: 'puke_100000', name: 'Bræk-Gud', emoji: '⭐', desc: 'Klik 100.000 gange', check: (s) => s.totalClicks >= 100_000 },

  // Earnings milestones
  { id: 'earn_1k', name: 'Tusind Bræk', emoji: '💰', desc: 'Tjen 1.000 bræk totalt', check: (s) => s.totalPukes >= 1_000 },
  { id: 'earn_1m', name: 'Millionær', emoji: '💎', desc: 'Tjen 1.000.000 bræk totalt', check: (s) => s.totalPukes >= 1_000_000 },
  { id: 'earn_1b', name: 'Milliardær', emoji: '👑', desc: 'Tjen 1.000.000.000 bræk totalt', check: (s) => s.totalPukes >= 1_000_000_000 },
  { id: 'earn_1t', name: 'Billionær', emoji: '🌟', desc: 'Tjen 1.000.000.000.000 bræk totalt', check: (s) => s.totalPukes >= 1_000_000_000_000 },
  { id: 'earn_1q', name: 'Bræk-Transcendens', emoji: '🔱', desc: 'Tjen 1 billiard bræk totalt', check: (s) => s.totalPukes >= 1_000_000_000_000_000 },

  // PPS milestones
  { id: 'bps_10', name: 'Automatiseret', emoji: '⚙️', desc: 'Nå 10 bræk per sekund', check: (s) => s.pps >= 10 },
  { id: 'bps_100', name: 'Fabrik', emoji: '🏭', desc: 'Nå 100 bræk per sekund', check: (s) => s.pps >= 100 },
  { id: 'bps_1k', name: 'Industriel Bræk', emoji: '🔧', desc: 'Nå 1.000 bræk per sekund', check: (s) => s.pps >= 1_000 },
  { id: 'bps_10k', name: 'Bræk-Imperium', emoji: '🏰', desc: 'Nå 10.000 bræk per sekund', check: (s) => s.pps >= 10_000 },
  { id: 'bps_100k', name: 'Bræk-Civilisation', emoji: '🌍', desc: 'Nå 100.000 bræk per sekund', check: (s) => s.pps >= 100_000 },
  { id: 'bps_1m', name: 'Bræk-Galakse', emoji: '🌌', desc: 'Nå 1.000.000 bræk per sekund', check: (s) => s.pps >= 1_000_000 },
  { id: 'bps_10m', name: 'Bræk-Univers', emoji: '🪐', desc: 'Nå 10.000.000 bræk per sekund', check: (s) => s.pps >= 10_000_000 },

  // Building milestones
  { id: 'buildings_50', name: 'Bygherre', emoji: '🏗️', desc: 'Ej 50 bygninger totalt', check: (s) => Object.values(s.buildings).reduce((a, b) => a + b, 0) >= 50 },
  { id: 'buildings_100', name: 'Mogul', emoji: '🏛️', desc: 'Ej 100 bygninger totalt', check: (s) => Object.values(s.buildings).reduce((a, b) => a + b, 0) >= 100 },
  { id: 'buildings_200', name: 'Tycoon', emoji: '🗼', desc: 'Ej 200 bygninger totalt', check: (s) => Object.values(s.buildings).reduce((a, b) => a + b, 0) >= 200 },
  { id: 'buildings_500', name: 'Verdenshersker', emoji: '🌐', desc: 'Ej 500 bygninger totalt', check: (s) => Object.values(s.buildings).reduce((a, b) => a + b, 0) >= 500 },
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
  if (n < 1_000_000_000_000_000) return (n / 1_000_000_000_000).toFixed(2) + 'T'
  if (n < 1_000_000_000_000_000_000) return (n / 1_000_000_000_000_000).toFixed(2) + 'Qa'
  return (n / 1_000_000_000_000_000_000).toFixed(2) + 'Qi'
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
