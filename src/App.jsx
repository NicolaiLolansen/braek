import { useState, useCallback, useRef, useEffect, useMemo, memo } from 'react'
import {
  BUILDINGS,
  UPGRADES,
  ACHIEVEMENTS,
  getBuildingCost,
  getBuildingBulkCost,
  formatNumber,
  formatWhole,
  timeToAfford,
} from './gameData'

/* ═══════════════════════════════════════════════
   Save-slot system (3 slots, backwards-compatible)
   ═══════════════════════════════════════════════ */
const SLOT_COUNT = 3
const LEGACY_KEY = 'braek_save_v2'
const ACTIVE_SLOT_KEY = 'braek_active_slot'
const slotKey = (i) => `braek_slot_${i}`

function freshState() {
  return {
    pukes: 0,
    totalPukes: 0,
    totalClicks: 0,
    buildings: {},    // { [id]: count }
    upgrades: [],     // purchased upgrade ids
    achievements: [], // earned achievement ids
    startedAt: Date.now(),
  }
}

/** One-time migration: braek_save_v2 → slot 0 (preserves original key) */
function migrateLegacy() {
  if (localStorage.getItem('braek_migrated_v3')) return
  try {
    const legacy = localStorage.getItem(LEGACY_KEY)
    if (legacy && !localStorage.getItem(slotKey(0))) {
      localStorage.setItem(slotKey(0), legacy)
    }
    localStorage.setItem('braek_migrated_v3', '1')
  } catch { /* ignore */ }
}

function loadSlot(slot) {
  try {
    const raw = localStorage.getItem(slotKey(slot))
    if (!raw) return freshState()
    return { ...freshState(), ...JSON.parse(raw) }
  } catch {
    return freshState()
  }
}

function saveSlot(state, slot) {
  try {
    localStorage.setItem(slotKey(slot), JSON.stringify(state))
  } catch { /* quota */ }
}

function getActiveSlot() {
  const n = parseInt(localStorage.getItem(ACTIVE_SLOT_KEY), 10)
  return n >= 0 && n < SLOT_COUNT ? n : 0
}

function getSlotPreview(i) {
  try {
    const raw = localStorage.getItem(slotKey(i))
    if (!raw) return null
    const s = JSON.parse(raw)
    return { totalPukes: s.totalPukes || 0 }
  } catch {
    return null
  }
}

/* ═══════════════════════════════════════════════
   Game calculations (unchanged logic)
   ═══════════════════════════════════════════════ */
function calcPps(state) {
  let globalMult = 1
  for (const uid of state.upgrades) {
    const u = UPGRADES.find((x) => x.id === uid)
    if (u?.type === 'global_mult') globalMult *= u.value
  }

  let total = 0
  for (const b of BUILDINGS) {
    const count = state.buildings[b.id] || 0
    if (count === 0) continue
    let mult = 1
    for (const uid of state.upgrades) {
      const u = UPGRADES.find((x) => x.id === uid)
      if (u?.type === 'building_mult' && u.building === b.id) mult *= u.value
    }
    total += b.basePps * count * mult
  }
  return total * globalMult
}

function calcClickPower(state) {
  let power = 1
  let ppsBonusFrac = 0
  let globalMult = 1

  for (const uid of state.upgrades) {
    const u = UPGRADES.find((x) => x.id === uid)
    if (!u) continue
    if (u.type === 'click_mult') power *= u.value
    if (u.type === 'click_pps_bonus') ppsBonusFrac += u.value
    if (u.type === 'global_mult') globalMult *= u.value
  }

  const pps = calcPps(state) / globalMult // raw pps before global
  return (power + pps * ppsBonusFrac) * globalMult
}

function isUpgradeVisible(u, state) {
  if (state.upgrades.includes(u.id)) return false
  const r = u.require
  if (!r) return true
  if (r.upgrade && !state.upgrades.includes(r.upgrade)) return false
  if (r.building && (state.buildings[r.building] || 0) < (r.count || 1)) return false
  if (r.totalPukes && state.totalPukes < r.totalPukes * 0.5) return false
  if (r.clicks && state.totalClicks < r.clicks) return false
  return true
}

function isUpgradeAffordable(u, state) {
  return state.pukes >= u.cost
}

/* ═══════════════════════════════════════════════
   DOM-based visual effects (zero React re-renders)
   ═══════════════════════════════════════════════ */
const splatEmojis = ['🤮', '🤢', '💚', '🟢', '🟩', '🤮']

function spawnFloatingText(x, y, text) {
  const el = document.createElement('div')
  el.className = 'floating-text'
  el.style.left = `${x}px`
  el.style.top = `${y}px`
  el.textContent = text
  document.body.appendChild(el)
  el.addEventListener('animationend', () => el.remove())
}

function spawnSplats(container, count) {
  if (!container) return
  for (let i = 0; i < count; i++) {
    const el = document.createElement('span')
    el.className = 'splat'
    const angle = (Math.random() * 160 - 80) * (Math.PI / 180) - Math.PI / 2
    const dist = 80 + Math.random() * 200
    el.style.setProperty('--start-x', `${Math.cos(angle) * 30}px`)
    el.style.setProperty('--start-y', `${Math.sin(angle) * 30}px`)
    el.style.setProperty('--end-x', `${Math.cos(angle) * dist}px`)
    el.style.setProperty('--end-y', `${Math.sin(angle) * dist}px`)
    el.style.setProperty('--rotate', `${Math.random() * 720 - 360}deg`)
    el.style.fontSize = `${18 + Math.random() * 24}px`
    el.textContent = splatEmojis[Math.floor(Math.random() * splatEmojis.length)]
    container.appendChild(el)
    el.addEventListener('animationend', () => el.remove())
  }
}

function spawnShockwave(container) {
  if (!container) return
  const el = document.createElement('div')
  el.className = 'shockwave'
  container.appendChild(el)
  el.addEventListener('animationend', () => el.remove())
}

function spawnStrikeSpark(container) {
  if (!container) return
  const el = document.createElement('div')
  el.className = 'orbiter-spark'
  container.appendChild(el)
  el.addEventListener('animationend', () => el.remove())
}

/* ═══════════════════════════════════════════════
   Small Components
   ═══════════════════════════════════════════════ */
function AchievementToast({ achievement }) {
  return (
    <div className="achievement-toast">
      <span className="achievement-toast-emoji">{achievement.emoji}</span>
      <div>
        <div className="achievement-toast-title">{achievement.name}</div>
        <div className="achievement-toast-desc">{achievement.desc}</div>
      </div>
    </div>
  )
}

/** Orbiting minions — visual representation of owned buildings */
const Orbiters = memo(function Orbiters({ buildings }) {
  const orbiters = useMemo(() => {
    const result = []
    BUILDINGS.forEach((b, tier) => {
      const count = buildings[b.id] || 0
      if (count === 0) return
      // 1 orbiter per type + 1 extra every 10 owned, max 3
      const visible = Math.min(1 + Math.floor(count / 10), 3)
      for (let i = 0; i < visible; i++) {
        result.push({
          key: `${b.id}-${i}`,
          emoji: b.emoji,
          radius: 85 + tier * 20 + i * 14,
          duration: 5 + tier * 1.2 + i * 2.8,
          offset: (tier * 45 + i * 137) % 360,
          reverse: i % 2 === 1,
        })
      }
    })
    return result
  }, [buildings])

  if (orbiters.length === 0) return null

  return (
    <div className="orbiters-container">
      {orbiters.map((o) => (
        <div
          key={o.key}
          className={`orbiter${o.reverse ? ' reverse' : ''}`}
          style={{
            '--radius': `${o.radius}px`,
            '--duration': `${o.duration}s`,
            '--offset': `-${(o.offset / 360) * o.duration}s`,
          }}
        >
          {o.emoji}
        </div>
      ))}
    </div>
  )
})

/* ═══════════════════════════════════════════════
   Tabs
   ═══════════════════════════════════════════════ */
const TABS = ['buildings', 'upgrades', 'stats']
const TAB_LABELS = { buildings: '🏗️ Bygninger', upgrades: '⬆️ Opgraderinger', stats: '📊 Statistik' }

/* ═══════════════════════════════════════════════
   Main App
   ═══════════════════════════════════════════════ */
export default function App() {
  // ── Init: migrate legacy save, load active slot ──
  const [activeSlot, setActiveSlot] = useState(() => {
    migrateLegacy()
    return getActiveSlot()
  })
  const [state, setState] = useState(() => loadSlot(getActiveSlot()))
  const [tab, setTab] = useState('buildings')
  const [toasts, setToasts] = useState([])
  const [buyAmount, setBuyAmount] = useState(1)
  const [showShop, setShowShop] = useState(true)

  const stateRef = useRef(state)
  const effectsRef = useRef(null)
  const gameRef = useRef(null)
  const btnRef = useRef(null)
  const idRef = useRef(0)
  const pukeTimer = useRef(null)

  // Keep ref in sync
  useEffect(() => { stateRef.current = state }, [state])

  // ── Derived values ──
  const pps = useMemo(() => calcPps(state), [state.buildings, state.upgrades])
  const clickPower = useMemo(() => calcClickPower(state), [state.upgrades, state.buildings])

  // ── Game tick (time-delta based — no PPS pause during clicks) ──
  useEffect(() => {
    let lastTime = performance.now()
    const interval = setInterval(() => {
      const now = performance.now()
      const dt = (now - lastTime) / 1000
      lastTime = now
      setState((prev) => {
        const currentPps = calcPps(prev)
        if (currentPps === 0) return prev
        const gain = currentPps * dt
        return {
          ...prev,
          pukes: prev.pukes + gain,
          totalPukes: prev.totalPukes + gain,
        }
      })
    }, 50)
    return () => clearInterval(interval)
  }, [])

  // ── Auto-save every 30s ──
  useEffect(() => {
    const slot = activeSlot
    const interval = setInterval(() => saveSlot(stateRef.current, slot), 30_000)
    const handleUnload = () => saveSlot(stateRef.current, slot)
    window.addEventListener('beforeunload', handleUnload)
    return () => {
      clearInterval(interval)
      window.removeEventListener('beforeunload', handleUnload)
    }
  }, [activeSlot])

  // ── Check achievements ──
  useEffect(() => {
    const checkState = { ...state, pps }
    const newAchievements = ACHIEVEMENTS.filter(
      (a) => !state.achievements.includes(a.id) && a.check(checkState)
    )
    if (newAchievements.length > 0) {
      setState((prev) => ({
        ...prev,
        achievements: [...prev.achievements, ...newAchievements.map((a) => a.id)],
      }))
      newAchievements.forEach((a, i) => {
        const toastId = idRef.current++
        setTimeout(() => {
          setToasts((prev) => [...prev, { ...a, toastId }])
          setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.toastId !== toastId))
          }, 3500)
        }, i * 500)
      })
    }
  }, [Math.floor(state.totalPukes / 100), state.totalClicks, state.buildings, pps])

  // ── Orbiter attack effect (visual strikes every 2s) ──
  useEffect(() => {
    const interval = setInterval(() => {
      const s = stateRef.current
      const owned = BUILDINGS.filter((b) => (s.buildings[b.id] || 0) > 0)
      if (owned.length === 0 || !effectsRef.current) return

      const b = owned[Math.floor(Math.random() * owned.length)]
      const tier = BUILDINGS.indexOf(b)

      // Spawn strike projectile (emoji flies inward toward center)
      const el = document.createElement('div')
      el.className = 'orbiter-strike'
      el.textContent = b.emoji
      el.style.setProperty('--angle', `${Math.random() * 360}deg`)
      el.style.setProperty('--radius', `${85 + tier * 20}px`)
      effectsRef.current.appendChild(el)
      el.addEventListener('animationend', () => el.remove())

      // Spawn a spark at center on impact
      setTimeout(() => spawnStrikeSpark(effectsRef.current), 400)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  // ── Click handler (optimized: 1 setState + DOM effects) ──
  const handlePuke = useCallback((e) => {
    e.preventDefault()
    const cp = calcClickPower(stateRef.current)

    // Single React state update for game logic
    setState((prev) => ({
      ...prev,
      pukes: prev.pukes + cp,
      totalPukes: prev.totalPukes + cp,
      totalClicks: prev.totalClicks + 1,
    }))

    // Button pulse (DOM class toggle — no re-render)
    const btn = btnRef.current
    if (btn) {
      btn.classList.add('puking')
      clearTimeout(pukeTimer.current)
      pukeTimer.current = setTimeout(() => btn.classList.remove('puking'), 200)
    }

    // Screen shake (DOM class toggle)
    const game = gameRef.current
    if (game) {
      game.classList.remove('shake')
      void game.offsetWidth // force reflow to restart animation
      game.classList.add('shake')
    }

    // Floating text (DOM)
    const rect = btn?.getBoundingClientRect()
    const fx = rect ? rect.left + rect.width / 2 + (Math.random() - 0.5) * 60 : window.innerWidth / 2
    const fy = rect ? rect.top + (Math.random() - 0.5) * 40 : window.innerHeight / 2
    spawnFloatingText(fx, fy, `+${formatWhole(cp)}`)

    // Splats + shockwave (DOM)
    spawnSplats(effectsRef.current, 3 + Math.floor(Math.random() * 4))
    spawnShockwave(effectsRef.current)
  }, [])

  // ── Buy building ──
  const buyBuilding = useCallback((building) => {
    setState((prev) => {
      const owned = prev.buildings[building.id] || 0
      const amount = buyAmount === -1 ? (() => {
        let n = 0
        let cost = 0
        while (cost + getBuildingCost(building, owned + n) <= prev.pukes) {
          cost += getBuildingCost(building, owned + n)
          n++
        }
        return n
      })() : buyAmount
      if (amount <= 0) return prev
      const totalCost = getBuildingBulkCost(building, owned, amount)
      if (prev.pukes < totalCost) return prev
      return {
        ...prev,
        pukes: prev.pukes - totalCost,
        buildings: { ...prev.buildings, [building.id]: owned + amount },
      }
    })
  }, [buyAmount])

  // ── Buy upgrade ──
  const buyUpgrade = useCallback((upgrade) => {
    setState((prev) => {
      if (prev.pukes < upgrade.cost) return prev
      if (prev.upgrades.includes(upgrade.id)) return prev
      return {
        ...prev,
        pukes: prev.pukes - upgrade.cost,
        upgrades: [...prev.upgrades, upgrade.id],
      }
    })
  }, [])

  // ── Switch save slot ──
  const switchSlot = useCallback((newSlot) => {
    if (newSlot === activeSlot) return
    // Save current game before switching
    saveSlot(stateRef.current, activeSlot)
    // Load new slot
    const newState = loadSlot(newSlot)
    setState(newState)
    setActiveSlot(newSlot)
    localStorage.setItem(ACTIVE_SLOT_KEY, String(newSlot))
  }, [activeSlot])

  // ── Export save as JSON ──
  const exportSave = useCallback(() => {
    const data = JSON.stringify(stateRef.current, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `braek-plads-${activeSlot + 1}-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }, [activeSlot])

  // ── Import save from JSON file ──
  const importSave = useCallback(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = e.target.files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target.result)
          if (typeof data.totalPukes !== 'number') {
            alert('Ugyldig gem-fil!')
            return
          }
          const merged = { ...freshState(), ...data }
          setState(merged)
          saveSlot(merged, activeSlot)
          alert('Importeret!')
        } catch {
          alert('Kunne ikke læse filen!')
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }, [activeSlot])

  // ── Reset current slot ──
  const resetGame = useCallback(() => {
    if (window.confirm('Er du sikker? Alt fremskridt for denne plads slettes!')) {
      const fresh = freshState()
      setState(fresh)
      saveSlot(fresh, activeSlot)
    }
  }, [activeSlot])

  // ── Visible upgrades ──
  const visibleUpgrades = UPGRADES.filter((u) => isUpgradeVisible(u, state))

  // ── Render ──
  const playTime = Math.floor((Date.now() - state.startedAt) / 1000)
  const totalBuildings = Object.values(state.buildings).reduce((a, b) => a + b, 0)

  return (
    <div className="game" ref={gameRef}>
      {/* Background effects */}
      <div className="aurora" />
      <div className="particles">
        {Array.from({ length: 15 }, (_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              '--x': `${Math.random() * 100}%`,
              '--y': `${Math.random() * 100}%`,
              '--duration': `${3 + Math.random() * 7}s`,
              '--delay': `${Math.random() * 5}s`,
              '--size': `${2 + Math.random() * 4}px`,
            }}
          />
        ))}
      </div>

      {/* Main play area */}
      <div className="play-area">
        {/* Header stats */}
        <div className="header">
          {/* Save slot picker */}
          <div className="slot-picker">
            {Array.from({ length: SLOT_COUNT }, (_, i) => {
              const preview = getSlotPreview(i)
              return (
                <button
                  key={i}
                  className={`slot-btn${activeSlot === i ? ' active' : ''}${!preview ? ' empty' : ''}`}
                  onClick={() => switchSlot(i)}
                  title={preview ? `${formatNumber(preview.totalPukes)} bræk total` : 'Tom plads'}
                >
                  {i + 1}
                </button>
              )
            })}
          </div>

          <div className="pukes-display">
            <span className="pukes-count">{formatNumber(state.pukes)}</span>
            <span className="pukes-label"> bræk 🤮</span>
          </div>
          <div className="pps-display">
            per sekund: {formatNumber(pps)} | per klik: {formatNumber(clickPower)}
          </div>
        </div>

        {/* Effects layer (managed by direct DOM manipulation) */}
        <div className="effects-layer" ref={effectsRef} />

        {/* Orbiting minions */}
        <Orbiters buildings={state.buildings} />

        {/* The big puke button */}
        <button
          ref={btnRef}
          className="puke-btn"
          onPointerDown={handlePuke}
          aria-label="puke"
        >
          🤮
        </button>

        {/* Mobile shop toggle */}
        <button className="shop-toggle" onClick={() => setShowShop((s) => !s)}>
          {showShop ? '✕' : '🛒'}
        </button>
      </div>

      {/* Shop panel */}
      <div className={`shop${showShop ? ' open' : ''}`}>
        <div className="shop-tabs">
          {TABS.map((t) => (
            <button
              key={t}
              className={`shop-tab${tab === t ? ' active' : ''}`}
              onClick={() => setTab(t)}
            >
              {TAB_LABELS[t]}
            </button>
          ))}
        </div>

        <div className="shop-content">
          {/* Buildings tab */}
          {tab === 'buildings' && (
            <>
              <div className="buy-amount-row">
                {[1, 10, 100, -1].map((n) => (
                  <button
                    key={n}
                    className={`buy-amount-btn${buyAmount === n ? ' active' : ''}`}
                    onClick={() => setBuyAmount(n)}
                  >
                    {n === -1 ? 'Max' : `×${n}`}
                  </button>
                ))}
              </div>
              <div className="shop-list">
                {BUILDINGS.map((b) => {
                  const owned = state.buildings[b.id] || 0
                  const amount = buyAmount === -1 ? (() => {
                    let n = 0, cost = 0
                    while (cost + getBuildingCost(b, owned + n) <= state.pukes) {
                      cost += getBuildingCost(b, owned + n)
                      n++
                    }
                    return n
                  })() : buyAmount
                  const cost = buyAmount === -1
                    ? getBuildingBulkCost(b, owned, amount)
                    : getBuildingBulkCost(b, owned, buyAmount)
                  const canAfford = state.pukes >= cost && amount > 0
                  const bMult = state.upgrades.reduce((m, uid) => {
                    const u = UPGRADES.find((x) => x.id === uid)
                    return u?.type === 'building_mult' && u.building === b.id ? m * u.value : m
                  }, 1)
                  const globalMult = state.upgrades.reduce((m, uid) => {
                    const u = UPGRADES.find((x) => x.id === uid)
                    return u?.type === 'global_mult' ? m * u.value : m
                  }, 1)
                  const eachPps = b.basePps * bMult * globalMult
                  const visible = owned > 0 || state.totalPukes >= b.baseCost * 0.5
                  if (!visible) return null

                  return (
                    <button
                      key={b.id}
                      className={`shop-item${canAfford ? ' affordable' : ''}`}
                      onClick={() => buyBuilding(b)}
                      disabled={!canAfford}
                    >
                      <span className="shop-item-emoji">{b.emoji}</span>
                      <div className="shop-item-info">
                        <div className="shop-item-name">
                          {b.name}
                          <span className="shop-item-owned">{owned}</span>
                        </div>
                        <div className="shop-item-cost">
                          🤮 {formatNumber(cost)}
                          {buyAmount !== 1 && amount > 0 && <span className="shop-item-amount"> (×{amount})</span>}
                        </div>
                        <div className="shop-item-pps">
                          hver: {formatNumber(eachPps)}/s
                          {!canAfford && pps > 0 && (
                            <span className="shop-item-eta"> · {timeToAfford(cost, state.pukes, pps)}</span>
                          )}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </>
          )}

          {/* Upgrades tab */}
          {tab === 'upgrades' && (
            <div className="shop-list">
              {visibleUpgrades.length === 0 && (
                <div className="shop-empty">Ingen opgraderinger tilgængelige endnu...</div>
              )}
              {visibleUpgrades.map((u) => {
                const canAfford = isUpgradeAffordable(u, state)
                return (
                  <button
                    key={u.id}
                    className={`shop-item upgrade-item${canAfford ? ' affordable' : ''}`}
                    onClick={() => buyUpgrade(u)}
                    disabled={!canAfford}
                  >
                    <span className="shop-item-emoji">{u.emoji}</span>
                    <div className="shop-item-info">
                      <div className="shop-item-name">{u.name}</div>
                      <div className="shop-item-cost">🤮 {formatNumber(u.cost)}</div>
                      <div className="shop-item-desc">{u.desc}</div>
                    </div>
                  </button>
                )
              })}
              {/* Purchased upgrades */}
              {state.upgrades.length > 0 && (
                <div className="purchased-section">
                  <div className="purchased-title">Købte opgraderinger</div>
                  <div className="purchased-grid">
                    {state.upgrades.map((uid) => {
                      const u = UPGRADES.find((x) => x.id === uid)
                      if (!u) return null
                      return (
                        <span key={uid} className="purchased-badge" title={`${u.name}: ${u.desc}`}>
                          {u.emoji}
                        </span>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Stats tab */}
          {tab === 'stats' && (
            <div className="stats-panel">
              <div className="stat-row">
                <span>Bræk i alt</span>
                <span>{formatWhole(state.totalPukes)}</span>
              </div>
              <div className="stat-row">
                <span>Klik i alt</span>
                <span>{state.totalClicks.toLocaleString()}</span>
              </div>
              <div className="stat-row">
                <span>Bræk per sekund</span>
                <span>{formatNumber(pps)}</span>
              </div>
              <div className="stat-row">
                <span>Bræk per klik</span>
                <span>{formatNumber(clickPower)}</span>
              </div>
              <div className="stat-row">
                <span>Bygninger</span>
                <span>{totalBuildings}</span>
              </div>
              <div className="stat-row">
                <span>Opgraderinger</span>
                <span>{state.upgrades.length} / {UPGRADES.length}</span>
              </div>
              <div className="stat-row">
                <span>Bedrifter</span>
                <span>{state.achievements.length} / {ACHIEVEMENTS.length}</span>
              </div>
              <div className="stat-row">
                <span>Spilletid</span>
                <span>
                  {Math.floor(playTime / 3600)}t {Math.floor((playTime % 3600) / 60)}m
                </span>
              </div>

              {/* Achievements section */}
              <div className="achievements-section">
                <h3>Bedrifter</h3>
                <div className="achievements-grid">
                  {ACHIEVEMENTS.map((a) => {
                    const earned = state.achievements.includes(a.id)
                    return (
                      <div
                        key={a.id}
                        className={`achievement${earned ? ' earned' : ''}`}
                        title={`${a.name}: ${a.desc}`}
                      >
                        <span className="achievement-emoji">{earned ? a.emoji : '❓'}</span>
                        <span className="achievement-name">{earned ? a.name : '???'}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Save / Export / Import / Reset */}
              <div className="stats-actions">
                <button className="save-btn" onClick={() => { saveSlot(state, activeSlot); alert('Gemt!') }}>
                  💾 Gem
                </button>
                <button className="save-btn" onClick={exportSave}>
                  📤 Eksportér
                </button>
                <button className="save-btn" onClick={importSave}>
                  📥 Importér
                </button>
                <button className="reset-btn" onClick={resetGame}>
                  🗑️ Nulstil
                </button>
              </div>

              {/* Privacy / storage notice */}
              <div className="privacy-notice">
                <p>⚠️ Dit fremskridt gemmes <strong>kun lokalt</strong> i din browser (localStorage).</p>
                <p>Vi gemmer ikke dine data på nogen server. Hvis du rydder browserdata, sletter du dit spil.</p>
                <p>Brug <strong>Eksportér</strong> til at sikkerhedskopiere dit fremskridt regelmæssigt.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Achievement toasts */}
      <div className="toast-container">
        {toasts.map((t) => (
          <AchievementToast key={t.toastId} achievement={t} />
        ))}
      </div>
    </div>
  )
}
