/**
 * Tout le son est synthétisé en direct avec la Web Audio API : une petite musique lo-fi générative
 * et les bruitages. Aucun fichier audio à charger et aucun droit d'auteur à gérer.
 */

const freq = (midi: number) => 440 * 2 ** ((midi - 69) / 12)

// Fmaj7 · G6 · Em7 · Am7, deux mesures par accord
const CHORDS = [
  { pad: [53, 57, 60, 64], bass: 41, tones: [72, 76, 79, 81] },
  { pad: [55, 59, 62, 64], bass: 43, tones: [74, 79, 81, 83] },
  { pad: [52, 55, 59, 62], bass: 40, tones: [71, 74, 76, 79] },
  { pad: [57, 60, 64, 67], bass: 45, tones: [72, 76, 79, 81] },
]
const PENTA = [72, 74, 76, 79, 81, 84]
const EIGHTH = 60 / 84 / 2
const STEPS_PER_CHORD = 16

class SoundEngine {
  private ctx: AudioContext | null = null
  private master!: GainNode
  private music!: GainNode
  private sfx!: GainNode
  private reverbSend!: GainNode
  private delaySend!: GainNode
  private noise!: AudioBuffer
  private timer: number | null = null
  private nextTime = 0
  private stepIndex = 0
  private lastNote = 76
  private enabled = true

  /** À appeler depuis un geste de l'utilisateur (clic, touche) : les navigateurs l'exigent. */
  unlock() {
    if (!this.ctx) this.setup()
    if (this.ctx!.state === 'suspended') void this.ctx!.resume()
    if (this.enabled) this.startMusic()
  }

  setEnabled(on: boolean) {
    this.enabled = on
    if (!this.ctx) return
    this.master.gain.setTargetAtTime(on ? 0.9 : 0, this.ctx.currentTime, 0.15)
    if (on) this.startMusic()
    else this.stopMusic()
  }

  private setup() {
    const ctx = new AudioContext()
    this.ctx = ctx
    this.master = ctx.createGain()
    this.master.gain.value = this.enabled ? 0.9 : 0
    this.master.connect(ctx.destination)

    this.music = ctx.createGain()
    this.music.gain.value = 0.32
    this.music.connect(this.master)
    this.sfx = ctx.createGain()
    this.sfx.gain.value = 0.7
    this.sfx.connect(this.master)

    // Réverbération : réponse impulsionnelle générée (bruit qui décroît)
    const reverb = ctx.createConvolver()
    const len = ctx.sampleRate * 2.4
    const ir = ctx.createBuffer(2, len, ctx.sampleRate)
    for (let c = 0; c < 2; c++) {
      const data = ir.getChannelData(c)
      for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len) ** 3
    }
    reverb.buffer = ir
    this.reverbSend = ctx.createGain()
    this.reverbSend.gain.value = 0.35
    this.reverbSend.connect(reverb)
    reverb.connect(this.master)

    // Écho filtré sur la mélodie
    const delay = ctx.createDelay(1)
    delay.delayTime.value = EIGHTH * 1.5
    const feedback = ctx.createGain()
    feedback.gain.value = 0.32
    const tone = ctx.createBiquadFilter()
    tone.type = 'lowpass'
    tone.frequency.value = 1800
    this.delaySend = ctx.createGain()
    this.delaySend.gain.value = 0.28
    this.delaySend.connect(delay)
    delay.connect(tone)
    tone.connect(feedback)
    feedback.connect(delay)
    tone.connect(this.music)

    this.noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate)
    const n = this.noise.getChannelData(0)
    for (let i = 0; i < n.length; i++) n[i] = Math.random() * 2 - 1
  }

  // ---------- Musique ----------

  private startMusic() {
    if (!this.ctx || this.timer !== null) return
    this.nextTime = this.ctx.currentTime + 0.1
    this.timer = window.setInterval(() => this.schedule(), 60)
  }

  private stopMusic() {
    if (this.timer !== null) window.clearInterval(this.timer)
    this.timer = null
  }

  private schedule() {
    const ctx = this.ctx!
    while (this.nextTime < ctx.currentTime + 0.25) {
      this.playStep(this.stepIndex, this.nextTime)
      this.nextTime += EIGHTH
      this.stepIndex = (this.stepIndex + 1) % (STEPS_PER_CHORD * CHORDS.length)
    }
  }

  private playStep(step: number, t: number) {
    const chord = CHORDS[Math.floor(step / STEPS_PER_CHORD)]
    const s = step % STEPS_PER_CHORD
    if (s === 0) chord.pad.forEach((m, i) => this.pad(freq(m), t + i * 0.04, EIGHTH * STEPS_PER_CHORD))
    if (s % 8 === 0) this.bass(freq(chord.bass), t, 0.9)
    if (s % 8 === 5) this.bass(freq(chord.bass + 12), t, 0.35)
    if (s % 4 === 0) this.kick(t)
    if (s % 2 === 1) this.hat(t + 0.025)

    const restBar = Math.floor(step / 8) % 4 === 3
    if (!restBar && Math.random() < (s === 0 ? 0.6 : 0.3)) {
      const pool = Math.random() < 0.6 ? chord.tones : PENTA
      const candidates = pool.filter((m) => Math.abs(m - this.lastNote) <= 7)
      const note = (candidates.length ? candidates : pool)[Math.floor(Math.random() * (candidates.length || pool.length))]
      this.lastNote = note
      this.pluck(freq(note), t)
    }
  }

  private env(gain: GainNode, t: number, peak: number, attack: number, release: number) {
    gain.gain.setValueAtTime(0.0001, t)
    gain.gain.exponentialRampToValueAtTime(peak, t + attack)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + attack + release)
  }

  private pad(f: number, t: number, length: number) {
    const ctx = this.ctx!
    const out = ctx.createGain()
    const lp = ctx.createBiquadFilter()
    lp.type = 'lowpass'
    lp.frequency.value = 1100
    out.connect(lp)
    lp.connect(this.music)
    lp.connect(this.reverbSend)
    out.gain.setValueAtTime(0.0001, t)
    out.gain.exponentialRampToValueAtTime(0.05, t + 1.2)
    out.gain.setValueAtTime(0.05, t + length - 0.3)
    out.gain.exponentialRampToValueAtTime(0.0001, t + length + 1.4)
    for (const detune of [-7, 7]) {
      const o = ctx.createOscillator()
      o.type = 'triangle'
      o.frequency.value = f
      o.detune.value = detune
      o.connect(out)
      o.start(t)
      o.stop(t + length + 1.5)
    }
  }

  private pluck(f: number, t: number) {
    const ctx = this.ctx!
    const g = ctx.createGain()
    g.connect(this.music)
    g.connect(this.delaySend)
    g.connect(this.reverbSend)
    this.env(g, t, 0.09, 0.008, 0.7)
    const o = ctx.createOscillator()
    o.type = 'sine'
    o.frequency.value = f
    const o2 = ctx.createOscillator()
    o2.type = 'triangle'
    o2.frequency.value = f * 2
    const g2 = ctx.createGain()
    g2.gain.value = 0.25
    o2.connect(g2)
    g2.connect(g)
    o.connect(g)
    o.start(t)
    o2.start(t)
    o.stop(t + 0.9)
    o2.stop(t + 0.9)
  }

  private bass(f: number, t: number, length: number) {
    const ctx = this.ctx!
    const g = ctx.createGain()
    g.connect(this.music)
    this.env(g, t, 0.16, 0.02, length)
    const o = ctx.createOscillator()
    o.type = 'sine'
    o.frequency.value = f
    o.connect(g)
    o.start(t)
    o.stop(t + length + 0.1)
  }

  private kick(t: number) {
    const ctx = this.ctx!
    const g = ctx.createGain()
    g.connect(this.music)
    this.env(g, t, 0.18, 0.004, 0.22)
    const o = ctx.createOscillator()
    o.frequency.setValueAtTime(110, t)
    o.frequency.exponentialRampToValueAtTime(42, t + 0.18)
    o.connect(g)
    o.start(t)
    o.stop(t + 0.3)
  }

  private hat(t: number) {
    this.noiseBurst(t, { type: 'highpass', freq: 7000, gain: 0.018, decay: 0.04, bus: this.music })
  }

  private noiseBurst(
    t: number,
    o: { type: BiquadFilterType; freq: number; gain: number; decay: number; q?: number; rate?: number; bus?: AudioNode; sweepTo?: number },
  ) {
    const ctx = this.ctx!
    const src = ctx.createBufferSource()
    src.buffer = this.noise
    src.playbackRate.value = o.rate ?? 1
    const f = ctx.createBiquadFilter()
    f.type = o.type
    f.frequency.setValueAtTime(o.freq, t)
    if (o.sweepTo) f.frequency.exponentialRampToValueAtTime(o.sweepTo, t + o.decay)
    f.Q.value = o.q ?? 0.8
    const g = ctx.createGain()
    this.env(g, t, o.gain, 0.003, o.decay)
    src.connect(f)
    f.connect(g)
    g.connect(o.bus ?? this.sfx)
    src.start(t, Math.random() * 0.5)
    src.stop(t + o.decay + 0.05)
  }

  private tone(f: number, t: number, o: { type?: OscillatorType; gain: number; decay: number; to?: number; reverb?: boolean }) {
    const ctx = this.ctx!
    const g = ctx.createGain()
    g.connect(this.sfx)
    if (o.reverb) g.connect(this.reverbSend)
    this.env(g, t, o.gain, 0.005, o.decay)
    const osc = ctx.createOscillator()
    osc.type = o.type ?? 'sine'
    osc.frequency.setValueAtTime(f, t)
    if (o.to) osc.frequency.exponentialRampToValueAtTime(o.to, t + o.decay)
    osc.connect(g)
    osc.start(t)
    osc.stop(t + o.decay + 0.05)
  }

  // ---------- Bruitages ----------

  private ready() {
    return this.ctx !== null && this.enabled && this.ctx.state === 'running'
  }

  step(alt: boolean) {
    if (!this.ready()) return
    this.noiseBurst(this.ctx!.currentTime, {
      type: 'bandpass',
      freq: alt ? 950 : 750,
      q: 1.4,
      gain: 0.07,
      decay: 0.07,
      rate: 0.8 + Math.random() * 0.4,
    })
  }

  pickup() {
    if (!this.ready()) return
    const t = this.ctx!.currentTime
    ;[76, 79, 84, 88].forEach((m, i) => this.tone(freq(m), t + i * 0.07, { type: 'triangle', gain: 0.12, decay: 0.4, reverb: true }))
  }

  open() {
    if (!this.ready()) return
    const t = this.ctx!.currentTime
    this.noiseBurst(t, { type: 'bandpass', freq: 300, sweepTo: 1800, q: 1.2, gain: 0.06, decay: 0.28 })
    this.tone(freq(81), t + 0.05, { gain: 0.06, decay: 0.25, to: freq(88), reverb: true })
  }

  close() {
    if (!this.ready()) return
    this.noiseBurst(this.ctx!.currentTime, { type: 'bandpass', freq: 1500, sweepTo: 350, q: 1.2, gain: 0.045, decay: 0.22 })
  }

  click() {
    if (!this.ready()) return
    this.tone(1100, this.ctx!.currentTime, { gain: 0.05, decay: 0.05 })
  }

  punch() {
    if (!this.ready()) return
    const t = this.ctx!.currentTime
    this.tone(140, t, { gain: 0.5, decay: 0.22, to: 45 })
    this.noiseBurst(t, { type: 'lowpass', freq: 700, gain: 0.25, decay: 0.08 })
  }

  clack() {
    if (!this.ready()) return
    const t = this.ctx!.currentTime
    this.tone(1250, t, { gain: 0.12, decay: 0.05 })
    this.tone(2500, t, { type: 'triangle', gain: 0.04, decay: 0.03 })
    this.noiseBurst(t, { type: 'highpass', freq: 2500, gain: 0.05, decay: 0.03 })
  }

  arcade() {
    if (!this.ready()) return
    const t = this.ctx!.currentTime
    ;[64, 67, 72, 76, 79, 84].forEach((m, i) => this.tone(freq(m), t + i * 0.075, { type: 'square', gain: 0.035, decay: 0.09 }))
    this.tone(freq(88), t + 0.48, { type: 'square', gain: 0.04, decay: 0.45 })
  }

  secret() {
    if (!this.ready()) return
    const t = this.ctx!.currentTime
    ;[72, 76, 79, 81, 84, 88, 91].forEach((m, i) => this.tone(freq(m), t + i * 0.05, { type: 'triangle', gain: 0.07, decay: 0.5, reverb: true }))
  }
}

export const sound = new SoundEngine()
