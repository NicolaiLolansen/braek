# bræk.dk — Architecture Overview

## Tech Stack
- **Frontend**: React 18 + Vite (SPA, fully client-side)
- **Serving**: Nginx Alpine (static files)
- **Deployment**: Docker + Traefik (reverse proxy, Let's Encrypt SSL)
- **Domain**: `xn--brk-zla.dk` (punycode for bræk.dk)

## File Structure
```
src/
  main.jsx            React entry point (StrictMode → App)
  App.jsx             Main game component: state, UI, effects, save system
  gameData.js         Game data: buildings, upgrades, achievements, helpers
  index.css           All styles, animations, responsive breakpoints
nginx/
  default.conf        SPA routing + static asset caching (7d)
Dockerfile            Multi-stage: node:20-alpine build → nginx:alpine serve
docker-compose.prod.yml   Traefik-integrated production deployment
index.html            HTML shell (lang=da, theme=#0a0a0a, favicon=puke emoji)
```

## Game State Model
All game state is a single JSON-serializable object:
```
{
  pukes          number   Current spendable currency
  totalPukes     number   Lifetime earnings (never decreases)
  totalClicks    number   Total manual clicks
  buildings      object   { buildingId: ownedCount }
  upgrades       array    Purchased upgrade IDs
  achievements   array    Earned achievement IDs
  startedAt      number   Unix timestamp of game start
}
```

### Backwards Compatibility
The state shape is frozen. New features must be additive — new fields get defaults
via `{ ...freshState(), ...savedData }` spread on load.

## Save System
- **3 save slots**: `braek_slot_0`, `braek_slot_1`, `braek_slot_2` (localStorage)
- **Active slot**: `braek_active_slot` (localStorage)
- **Legacy migration**: On first load, `braek_save_v2` is copied to slot 0
  (the original key is preserved, never deleted)
- **Auto-save**: Every 30 seconds + on `beforeunload`
- **Export/Import**: JSON file download/upload per slot

## Game Loop

### Passive Income (PPS)
- `setInterval` every 50ms
- Uses **time-delta** (`performance.now()`) to calculate gain: `pps * elapsedSeconds`
- This ensures no income is lost during heavy rendering or tab switching

### Click Income
- `onPointerDown` on the puke button
- Calculates click power from upgrades + PPS bonus
- **Single** `setState` call per click (game logic only)
- All visual effects (splats, shockwaves, floating text) use **direct DOM manipulation** — zero React re-renders

### Achievement Detection
- `useEffect` with coarse dependency array (every 100 pukes, click count, buildings, PPS)
- New achievements trigger toast notifications (3.5s display)

## Progression System

| Phase | Mechanic |
|-------|----------|
| Early | Click to earn pukes manually |
| Mid   | Buy buildings for passive PPS |
| Late  | Purchase upgrades (click ×, building ×, global ×) |
| End   | Stack global multipliers (×2, ×4, ×8) |

### Buildings (8 tiers)
- Cost scales: `baseCost * 1.15^owned`
- PPS from each: `basePps * count * buildingMult * globalMult`

### Upgrades (3 categories)
1. **Click multipliers**: Chain of ×2, ×2.5, ×2, ×5 + PPS synergy bonus
2. **Building multipliers**: ×2 at 10 owned, ×2 again at 25 owned
3. **Global multipliers**: ×2 at 10K / 1M / 100M total pukes

## Visual System

### Orbiting Minions
- Each owned building type spawns orbiting emojis around the puke button
- Count: 1 + floor(owned/10), max 3 per type (max 24 total)
- CSS `@keyframes orbit` with per-orbiter radius, duration, direction
- Periodic "strike" animation: random orbiter dashes inward + spark flash
- Purely decorative — PPS is handled by the game tick

### Click Effects (DOM-managed)
| Effect | Duration | Method |
|--------|----------|--------|
| Floating text (+damage) | 1.1s | `document.createElement` → `animationend` cleanup |
| Splat emojis (3-6) | 1.0s | Same |
| Shockwave ring | 0.7s | Same |
| Button scale pulse | 0.2s | CSS class toggle |
| Screen shake | 0.25s | CSS class toggle |

### Background
- Aurora: Two blurred radial gradients with `auroraMove` animation (10s)
- Particles: 15 dots with `particleFloat` animation (3-10s each)

## Performance Architecture
The key insight: **visual effects never trigger React re-renders.**

- Game state (`pukes`, `buildings`, etc.) → React `useState` → re-renders shop/stats
- Visual effects (splats, shockwaves, floats) → direct DOM → zero re-renders
- Button/shake animation → CSS class toggle → zero re-renders
- Orbiters → `React.memo` → only re-renders when buildings change

This means rapid clicking causes exactly **1 React re-render per click** instead of 6+.

## Deployment
```bash
# Build & deploy
cd ~/Desktop/deployments/braek
docker compose -f docker-compose.prod.yml build --no-cache
docker compose -f docker-compose.prod.yml up -d
```

- Traefik handles TLS termination (Let's Encrypt)
- Nginx serves static files with 7-day cache headers
- SPA routing via `try_files $uri /index.html`

## Privacy
- **No server-side storage** — all data is in the browser's localStorage
- **No cookies, no analytics, no tracking**
- Users can export their data as JSON files for backup
- Clear in-app notice: "Your progress is stored locally only"
