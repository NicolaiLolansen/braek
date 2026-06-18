/**
 * bræk.dk — Procedural Music Engine
 *
 * Layers unlock as PPS grows:
 *   PPS > 0      → Kick (four on the floor)
 *   PPS > 5      → Hi-hat (offbeat 8ths)
 *   PPS > 50     → Sub bass (root notes)
 *   PPS > 500    → Arpeggio (cycling chord tones)
 *   PPS > 5000   → Pad (sustained chords)
 *   PPS > 50000  → Lead melody
 *
 * Clicks play ascending pentatonic notes.
 * Rapid clicking brightens the arp filter (click energy).
 * BPM scales gently with PPS (125 → 140).
 */

const M = (n) => 440 * Math.pow(2, (n - 69) / 12)

// Chord progression (4 bars) — Cm → Eb → Ab → Gm
const CHORDS = [
  { root: 36, arp: [60, 63, 67, 72] },  // Cm  (C2 bass, C4-Eb4-G4-C5 arp)
  { root: 39, arp: [63, 67, 70, 75] },  // Eb  (Eb2 bass, Eb4-G4-Bb4-Eb5 arp)
  { root: 32, arp: [56, 60, 63, 68] },  // Ab  (Ab1 bass, Ab3-C4-Eb4-Ab4 arp)
  { root: 31, arp: [55, 58, 62, 67] },  // Gm  (G1 bass, G3-Bb3-D4-G4 arp)
]

// Step patterns (16 steps per bar at 16th-note resolution)
const HIHAT = [0,0,1,0, 0,0,1,0, 0,0,1,0, 0,0,1,0]
const ARP_P = [1,0,1,0, 1,0,1,1, 1,0,1,0, 1,0,1,1]

// Lead melody (64 steps, -1 = rest)
const LEAD = [
  72,-1,-1,-1, 67,-1,63,-1, -1,-1,-1,-1, 65,-1,67,-1,
  70,-1,-1,-1, -1,-1,67,-1, -1,-1,-1,-1, -1,-1,-1,-1,
  68,-1,-1,-1, -1,-1,63,-1, -1,-1,65,-1, -1,-1,-1,-1,
  67,-1,-1,-1, -1,-1,70,-1, 72,-1,-1,-1, -1,-1,-1,-1,
]

// Click pentatonic scale (C minor pentatonic, 2 octaves)
const CLICK_SCALE = [60, 63, 65, 67, 70, 72, 75, 77]

class BraekAudio {
  constructor() {
    this.ctx = null
    this.masterGain = null
    this.playing = false
    this.bpm = 125
    this.step = 0
    this.nextTime = 0
    this.timer = null
    this.layers = new Set()
    this.clickIdx = 0
    this.lastClick = 0
    this.clickEnergy = 0
    this.noiseBuffer = null
  }

  // ── Init (call on first user gesture) ──
  init() {
    if (this.ctx) return
    this.ctx = new (window.AudioContext || window.webkitAudioContext)()

    // Master: gain → compressor → destination
    const comp = this.ctx.createDynamicsCompressor()
    comp.threshold.value = -12
    comp.knee.value = 10
    comp.ratio.value = 4
    comp.connect(this.ctx.destination)

    this.masterGain = this.ctx.createGain()
    this.masterGain.gain.value = 0.45
    this.masterGain.connect(comp)

    // Reverb send
    this.reverbGain = this.ctx.createGain()
    this.reverbGain.gain.value = 0.25
    const reverb = this._makeReverb(1.8, 2.5)
    this.reverbGain.connect(reverb)
    reverb.connect(this.masterGain)

    // Pre-create noise buffer for hi-hats
    this.noiseBuffer = this._makeNoise(0.06)
  }

  _makeReverb(dur, decay) {
    const len = this.ctx.sampleRate * dur
    const buf = this.ctx.createBuffer(2, len, this.ctx.sampleRate)
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch)
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay)
    }
    const conv = this.ctx.createConvolver()
    conv.buffer = buf
    return conv
  }

  _makeNoise(dur) {
    const len = this.ctx.sampleRate * dur
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate)
    const d = buf.getChannelData(0)
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1
    return buf
  }

  // ── Start / Stop / Toggle ──
  start() {
    if (!this.ctx) this.init()
    if (this.ctx.state === 'suspended') this.ctx.resume()
    if (this.playing) return
    this.playing = true
    this.step = 0
    this.nextTime = this.ctx.currentTime + 0.05
    this._loop()
  }

  stop() {
    this.playing = false
    if (this.timer) { clearTimeout(this.timer); this.timer = null }
  }

  toggle() {
    this.playing ? this.stop() : this.start()
    return this.playing
  }

  setVolume(v) {
    if (this.masterGain) this.masterGain.gain.value = Math.max(0, Math.min(1, v))
  }

  // ── Update layers based on PPS ──
  updateLayers(pps) {
    this.layers.clear()
    if (pps > 0)     this.layers.add('kick')
    if (pps >= 5)    this.layers.add('hihat')
    if (pps >= 50)   this.layers.add('bass')
    if (pps >= 500)  this.layers.add('arp')
    if (pps >= 5000) this.layers.add('pad')
    if (pps >= 50000) this.layers.add('lead')
    this.bpm = Math.min(140, 125 + Math.floor(pps / 20000))
  }

  // ── Sequencer loop ──
  _loop() {
    if (!this.playing) return

    // Decay click energy
    this.clickEnergy = Math.max(0, this.clickEnergy - 0.15)

    // Guard: if tab was backgrounded and we're way behind, catch up
    if (this.ctx.currentTime > this.nextTime + 0.5) {
      this.nextTime = this.ctx.currentTime + 0.05
    }

    const ahead = 0.1
    while (this.nextTime < this.ctx.currentTime + ahead) {
      this._scheduleStep(this.step, this.nextTime)
      this.nextTime += 60.0 / this.bpm / 4 // 16th note
      this.step = (this.step + 1) % 64
    }
    this.timer = setTimeout(() => this._loop(), 25)
  }

  _scheduleStep(step, t) {
    const bar = Math.floor(step / 16)
    const beat = step % 16
    const ch = CHORDS[bar]

    // Kick — quarter notes
    if (this.layers.has('kick') && beat % 4 === 0) this._kick(t)

    // Hi-hat — offbeat pattern
    if (this.layers.has('hihat') && HIHAT[beat]) this._hihat(t)

    // Bass — quarter notes on root
    if (this.layers.has('bass') && beat % 4 === 0) this._bass(ch.root, t)

    // Arp — pattern-driven, cycling chord tones
    if (this.layers.has('arp') && ARP_P[beat]) {
      const idx = ch.arp.length > 0 ? (step % ch.arp.length) : 0
      this._arp(ch.arp[idx], t, bar)
    }

    // Pad — once per bar
    if (this.layers.has('pad') && beat === 0) this._pad(ch.arp.slice(0, 3), t)

    // Lead — sparse melody
    if (this.layers.has('lead') && LEAD[step] >= 0) this._lead(LEAD[step], t)
  }

  // ── Instruments ──

  _kick(t) {
    const c = this.ctx
    const o = c.createOscillator()
    const g = c.createGain()
    o.type = 'sine'
    o.frequency.setValueAtTime(150, t)
    o.frequency.exponentialRampToValueAtTime(35, t + 0.05)
    g.gain.setValueAtTime(0.7, t)
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.25)
    o.connect(g); g.connect(this.masterGain)
    o.start(t); o.stop(t + 0.25)
  }

  _hihat(t) {
    const c = this.ctx
    const src = c.createBufferSource()
    src.buffer = this.noiseBuffer
    const hp = c.createBiquadFilter()
    hp.type = 'highpass'; hp.frequency.value = 7500
    const g = c.createGain()
    g.gain.setValueAtTime(0.14, t)
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.04)
    src.connect(hp); hp.connect(g); g.connect(this.masterGain)
    src.start(t); src.stop(t + 0.06)
  }

  _bass(note, t) {
    const c = this.ctx
    const o = c.createOscillator()
    const f = c.createBiquadFilter()
    const g = c.createGain()
    o.type = 'sawtooth'; o.frequency.value = M(note)
    f.type = 'lowpass'
    f.frequency.setValueAtTime(700, t)
    f.frequency.exponentialRampToValueAtTime(150, t + 0.15)
    g.gain.setValueAtTime(0.18, t)
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.2)
    o.connect(f); f.connect(g); g.connect(this.masterGain)
    o.start(t); o.stop(t + 0.22)
  }

  _arp(note, t, bar) {
    const c = this.ctx
    const o = c.createOscillator()
    const f = c.createBiquadFilter()
    const g = c.createGain()
    o.type = 'square'; o.frequency.value = M(note)
    f.type = 'lowpass'; f.Q.value = 4
    // Click energy boosts cutoff; bar position adds slow sweep
    const cutoff = 1200 + (bar / 3) * 1500 + this.clickEnergy * 250
    f.frequency.setValueAtTime(Math.min(cutoff, 8000), t)
    f.frequency.exponentialRampToValueAtTime(400, t + 0.1)
    g.gain.setValueAtTime(0.07, t)
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.12)
    o.connect(f); f.connect(g)
    g.connect(this.masterGain); g.connect(this.reverbGain)
    o.start(t); o.stop(t + 0.15)
  }

  _pad(notes, t) {
    const c = this.ctx
    const barDur = (60.0 / this.bpm / 4) * 16
    const pg = c.createGain()
    pg.gain.setValueAtTime(0, t)
    pg.gain.linearRampToValueAtTime(0.045, t + 0.4)
    pg.gain.setValueAtTime(0.04, t + barDur * 0.6)
    pg.gain.linearRampToValueAtTime(0, t + barDur * 0.95)
    pg.connect(this.masterGain); pg.connect(this.reverbGain)

    for (const n of notes) {
      for (const det of [-6, 6]) {
        const o = c.createOscillator()
        o.type = 'sine'; o.frequency.value = M(n + 12); o.detune.value = det
        o.connect(pg); o.start(t); o.stop(t + barDur)
      }
    }
  }

  _lead(note, t) {
    const c = this.ctx
    const o1 = c.createOscillator()
    const o2 = c.createOscillator()
    const f = c.createBiquadFilter()
    const g = c.createGain()
    o1.type = 'sawtooth'; o1.frequency.value = M(note)
    o2.type = 'sawtooth'; o2.frequency.value = M(note) * 1.004
    f.type = 'lowpass'; f.frequency.setValueAtTime(2200, t)
    f.frequency.exponentialRampToValueAtTime(500, t + 0.3); f.Q.value = 3
    g.gain.setValueAtTime(0.06, t)
    g.gain.linearRampToValueAtTime(0.04, t + 0.15)
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.4)
    o1.connect(f); o2.connect(f); f.connect(g)
    g.connect(this.masterGain); g.connect(this.reverbGain)
    o1.start(t); o2.start(t); o1.stop(t + 0.45); o2.stop(t + 0.45)
  }

  // ── Click sound (pentatonic, ascending with rapid clicks) ──
  playClick() {
    if (!this.ctx || !this.playing) return
    const now = this.ctx.currentTime

    // Reset sequence after 1.5s pause
    if (now - this.lastClick > 1.5) this.clickIdx = 0
    this.lastClick = now
    this.clickEnergy = Math.min(20, this.clickEnergy + 1.5)

    const note = CLICK_SCALE[this.clickIdx % CLICK_SCALE.length]
    this.clickIdx++

    const c = this.ctx
    const o = c.createOscillator()
    const f = c.createBiquadFilter()
    const g = c.createGain()
    o.type = 'triangle'; o.frequency.value = M(note)
    f.type = 'lowpass'
    f.frequency.setValueAtTime(5000, now)
    f.frequency.exponentialRampToValueAtTime(800, now + 0.08)
    g.gain.setValueAtTime(0.13, now)
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.12)
    o.connect(f); f.connect(g)
    g.connect(this.masterGain); g.connect(this.reverbGain)
    o.start(now); o.stop(now + 0.15)
  }
}

/** Singleton */
export const audio = new BraekAudio()
