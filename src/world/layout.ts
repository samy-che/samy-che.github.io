import { CatmullRomCurve3, Vector3 } from 'three'
import type { StationId } from '../content/types'

/**
 * Plan de la ville. Axe x vers l'est, axe z vers le sud (vers la caméra).
 * La route forme un « S » : une première rue d'ouest en est (formation, premiers stages),
 * un virage, puis une seconde rue d'est en ouest (vie professionnelle) qui finit sur le belvédère.
 * Tous les bâtiments sont au nord de la route et font face à la caméra.
 */

export const ISLAND = { minX: -76, maxX: 72, minZ: -70, maxZ: 16, corner: 12 }
export const ROAD_WIDTH = 4.6
export const SPAWN = { x: -66, z: 0.5, yaw: Math.PI / 2 }

// ---------- Relief : une seule colline, celle du belvédère ----------

export const HILL = { x: -58, z: -55, radius: 12, height: 2.4 }

export function groundHeight(x: number, z: number) {
  const d = Math.hypot(x - HILL.x, z - HILL.z) / HILL.radius
  if (d >= 1) return 0
  const t = 1 - d
  return HILL.height * t * t * (3 - 2 * t)
}

// ---------- Route ----------

const ROAD_CONTROL: [number, number][] = [
  [-74, 0.5], [-50, 0], [-30, 0], [-10, 0], [10, 0], [30, 0], [46, 0],
  [56, -4], [60, -14], [60, -26], [56, -36], [46, -40],
  [30, -40], [10, -40], [-10, -40], [-30, -40], [-42, -40], [-50, -43], [-55, -49],
]

export const roadCurve = new CatmullRomCurve3(
  ROAD_CONTROL.map(([x, z]) => new Vector3(x, 0, z)),
  false,
  'centripetal',
)

/** Points de la route tous les ~2 m, utilisés par le trajet automatique. */
export const roadPath: { x: number; z: number }[] = roadCurve
  .getSpacedPoints(Math.round(roadCurve.getLength() / 2))
  .map((p) => ({ x: p.x, z: p.z }))

export function distanceToRoad(x: number, z: number) {
  let best = Infinity
  for (let i = 0; i < roadPath.length - 1; i++) {
    const a = roadPath[i]
    const b = roadPath[i + 1]
    const abx = b.x - a.x
    const abz = b.z - a.z
    const t = Math.max(0, Math.min(1, ((x - a.x) * abx + (z - a.z) * abz) / (abx * abx + abz * abz)))
    best = Math.min(best, Math.hypot(x - (a.x + abx * t), z - (a.z + abz * t)))
  }
  return best
}

// ---------- Étapes du parcours ----------

export interface StationPlace {
  /** Centre du bâtiment. */
  x: number
  z: number
  /** Zone devant le bâtiment où l'on « entre » dans l'étape. */
  trigger: { x: number; z: number; r: number }
}

export const PLACES: Record<StationId, StationPlace> = {
  start: { x: -62, z: -8, trigger: { x: -64, z: 0, r: 4.5 } },
  amiens: { x: -40, z: -11, trigger: { x: -40, z: -3.5, r: 4.5 } },
  evry: { x: -16, z: -11, trigger: { x: -16, z: -3.5, r: 4.5 } },
  // Formations d'abord (Amiens, Évry, Dauphine), puis les expériences à partir du Ministère
  dauphine: { x: 8, z: -11, trigger: { x: 8, z: -3.2, r: 4.5 } },
  ministere: { x: 32, z: -11, trigger: { x: 32, z: -3.2, r: 4.5 } },
  fastcube: { x: 40, z: -51, trigger: { x: 40, z: -43.5, r: 4.5 } },
  lab: { x: 16, z: -51, trigger: { x: 16, z: -43.5, r: 4.5 } },
  kpmg: { x: -8, z: -51, trigger: { x: -8, z: -43.5, r: 4.5 } },
  projects: { x: -30, z: -51, trigger: { x: -30, z: -46.5, r: 6 } },
  lookout: { x: -58, z: -56, trigger: { x: -56, z: -50, r: 5.5 } },
}

/** Bornes avec l'année, au bord sud de la route : la route sert de frise chronologique. */
/** Poteau indicateur (Formation, Expériences, Belvédère) au bord de la route, au départ. */
export const SIGNPOST = { x: PLACES.start.x + 6.5, z: PLACES.start.z + 12 }

export const MILESTONES = (['amiens', 'evry', 'dauphine', 'ministere', 'fastcube', 'kpmg'] as const).map((id) => ({
  id,
  x: PLACES[id].trigger.x + 4.6,
  z: PLACES[id].trigger.z > -20 ? 3.6 : -36.4,
}))

// ---------- Secrets ----------

export const CHESS = { x: -26, z: -25, cell: 1.2 }
export const POND = { x: -5, z: -24, r: 4 }
export const RING = { x: 12, z: -25, size: 6 }
export const BAG = { x: 12, z: -25.6 }
export const ARCADE = { x: 30, z: -24, r: 2.6 }

export type ChessKind = 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn'
/** Une partie en cours : (colonne, ligne) sur l'échiquier 8 × 8. */
export const CHESS_PIECES: { kind: ChessKind; white: boolean; col: number; row: number }[] = [
  { kind: 'king', white: true, col: 6, row: 0 },
  { kind: 'rook', white: true, col: 5, row: 0 },
  { kind: 'pawn', white: true, col: 5, row: 1 },
  { kind: 'pawn', white: true, col: 6, row: 1 },
  { kind: 'pawn', white: true, col: 7, row: 2 },
  { kind: 'knight', white: true, col: 5, row: 2 },
  { kind: 'queen', white: true, col: 3, row: 3 },
  { kind: 'bishop', white: true, col: 2, row: 3 },
  { kind: 'pawn', white: true, col: 4, row: 3 },
  { kind: 'king', white: false, col: 6, row: 7 },
  { kind: 'rook', white: false, col: 0, row: 7 },
  { kind: 'pawn', white: false, col: 6, row: 6 },
  { kind: 'pawn', white: false, col: 7, row: 5 },
  { kind: 'knight', white: false, col: 2, row: 5 },
  { kind: 'bishop', white: false, col: 4, row: 6 },
  { kind: 'queen', white: false, col: 3, row: 6 },
  { kind: 'pawn', white: false, col: 4, row: 4 },
]

export const chessPiecePosition = (col: number, row: number) => ({
  x: CHESS.x + (col - 3.5) * CHESS.cell,
  z: CHESS.z + (3.5 - row) * CHESS.cell,
})

// ---------- Place des projets ----------

export const PLAZA = { x: -30, z: -51, r: 9 }
export const KIOSKS = Array.from({ length: 6 }, (_, i) => {
  const a = ((-160 + i * 28) * Math.PI) / 180
  const x = PLAZA.x + Math.cos(a) * 6.6
  const z = PLAZA.z + 0.5 + Math.sin(a) * 6.6
  return { x, z, yaw: Math.atan2(PLAZA.x - x, PLAZA.z + 0.5 - z) }
})

// ---------- Mobilier urbain ----------

/** Lampadaires au bord sud des deux rues, en évitant les bornes. */
export const LAMPS: { x: number; z: number }[] = []
for (let x = -58; x <= 52; x += 12) {
  for (const z of [3.5, -36.5]) {
    if (z < 0 && x < -46) continue
    if (MILESTONES.some((m) => Math.abs(m.x - x) < 2.5 && Math.abs(m.z - z) < 2)) continue
    LAMPS.push({ x, z })
  }
}
LAMPS.push({ x: 63.5, z: -12 }, { x: 63.5, z: -28 })

export const BENCHES: { x: number; z: number; yaw: number }[] = [
  { x: -12, z: -19, yaw: 0 },
  { x: 2, z: -31, yaw: Math.PI },
  { x: 22, z: -19.5, yaw: 0 },
  { x: -37, z: -31, yaw: Math.PI },
  { x: -46, z: 5.5, yaw: Math.PI },
  { x: 40, z: 6, yaw: Math.PI },
]

// ---------- Collisions ----------

export interface BoxCollider { kind: 'box'; x: number; z: number; hw: number; hd: number }
export interface CircleCollider { kind: 'circle'; x: number; z: number; r: number }
export type Collider = BoxCollider | CircleCollider

const box = (x: number, z: number, hw: number, hd: number): BoxCollider => ({ kind: 'box', x, z, hw, hd })
const circle = (x: number, z: number, r: number): CircleCollider => ({ kind: 'circle', x, z, r })

const P = PLACES
export const STATIC_COLLIDERS: Collider[] = [
  // Départ : panneau d'accueil et poteau indicateur
  box(P.start.x, P.start.z, 4.2, 0.4),
  circle(SIGNPOST.x, SIGNPOST.z, 0.3),
  // Amiens : bâtiment + tour
  box(P.amiens.x, P.amiens.z, 5.5, 3.5),
  box(P.amiens.x + 7.4, P.amiens.z - 0.5, 1.5, 1.5),
  // Évry
  box(P.evry.x, P.evry.z, 6, 4),
  // Ministère (soubassement et plaque au sol compris)
  box(P.ministere.x, P.ministere.z + 0.25, 6.8, 5.1),
  // Dauphine + piliers de l'auvent
  box(P.dauphine.x, P.dauphine.z, 7.5, 3.5),
  circle(P.dauphine.x - 2, P.dauphine.z + 5, 0.3),
  circle(P.dauphine.x + 2, P.dauphine.z + 5, 0.3),
  // Fastcube : cube, baies serveurs, écran
  box(P.fastcube.x, P.fastcube.z, 4.5, 4.5),
  box(P.fastcube.x + 7, P.fastcube.z + 1, 0.7, 2.1),
  box(P.fastcube.x - 7, P.fastcube.z + 1.5, 2, 0.35),
  // Labo + convoyeur
  box(P.lab.x, P.lab.z, 5, 3.5),
  box(P.lab.x - 9, P.lab.z + 1.5, 3.4, 0.7),
  circle(P.lab.x - 7.8, P.lab.z + 3, 0.85),
  // KPMG + tours voisines
  box(P.kpmg.x, P.kpmg.z, 4.5, 4),
  box(P.kpmg.x - 9, P.kpmg.z - 9, 2, 2),
  box(P.kpmg.x + 9, P.kpmg.z - 10, 2.5, 2.5),
  box(P.kpmg.x - 18, P.kpmg.z - 11, 1.8, 1.8),
  // Place des projets : fontaine et kiosques
  circle(PLAZA.x, PLAZA.z + 0.5, 1.9),
  ...KIOSKS.map((k) => circle(k.x, k.z, 1.25)),
  // Belvédère : colonnes du kiosque, longue-vue, banc, boîte aux lettres
  ...Array.from({ length: 6 }, (_, i) => {
    const a = (i / 6) * Math.PI * 2 + Math.PI / 6
    return circle(P.lookout.x + Math.cos(a) * 2.8, P.lookout.z + Math.sin(a) * 2.8, 0.3)
  }),
  circle(P.lookout.x + 4.2, P.lookout.z - 1.2, 0.6),
  box(P.lookout.x - 4.6, P.lookout.z + 0.6, 1.1, 0.4),
  circle(P.lookout.x + 3.6, P.lookout.z + 3, 0.4),
  // Secrets
  circle(POND.x, POND.z, POND.r + 0.3),
  box(ARCADE.x, ARCADE.z, 0.9, 0.7),
  // Ring : trois côtés de cordes, ouvert au sud
  box(RING.x, RING.z - RING.size / 2, RING.size / 2, 0.15),
  box(RING.x - RING.size / 2, RING.z, 0.15, RING.size / 2),
  box(RING.x + RING.size / 2, RING.z, 0.15, RING.size / 2),
  circle(RING.x - RING.size / 2, RING.z + RING.size / 2, 0.25),
  circle(RING.x + RING.size / 2, RING.z + RING.size / 2, 0.25),
  circle(BAG.x, BAG.z, 0.5),
  ...MILESTONES.map((m) => box(m.x, m.z, 0.6, 0.3)),
  ...LAMPS.map((l) => circle(l.x, l.z, 0.22)),
  ...BENCHES.map((b) => box(b.x, b.z, 1.1, 0.35)),
  ...CHESS_PIECES.map((p) => {
    const { x, z } = chessPiecePosition(p.col, p.row)
    return circle(x, z, 0.38)
  }),
]

// ---------- Volumes qui peuvent cacher le personnage à la caméra ----------

/** Boîtes englobantes des bâtiments (centre, demi-largeurs, hauteur). */
export const OCCLUDERS: { x: number; z: number; hw: number; hd: number; h: number }[] = [
  { x: P.start.x, z: P.start.z, hw: 4.2, hd: 0.4, h: 5 },
  { x: P.amiens.x, z: P.amiens.z, hw: 5.7, hd: 3.7, h: 7.9 },
  { x: P.amiens.x + 7.4, z: P.amiens.z - 0.5, hw: 1.7, hd: 1.7, h: 13.6 },
  { x: P.evry.x, z: P.evry.z, hw: 6, hd: 4, h: 7.6 },
  { x: P.ministere.x, z: P.ministere.z - 1.2, hw: 6.1, hd: 3.6, h: 8.4 },
  { x: P.ministere.x, z: P.ministere.z + 3.1, hw: 4.5, hd: 1.1, h: 8.4 },
  { x: P.dauphine.x, z: P.dauphine.z, hw: 7.7, hd: 3.7, h: 6.8 },
  { x: P.fastcube.x, z: P.fastcube.z, hw: 4.5, hd: 4.5, h: 9 },
  { x: P.lab.x, z: P.lab.z, hw: 5.2, hd: 3.7, h: 6.6 },
  { x: P.kpmg.x, z: P.kpmg.z - 0.5, hw: 3.3, hd: 3.3, h: 29 },
  { x: P.kpmg.x - 9, z: P.kpmg.z - 9, hw: 2, hd: 2, h: 13 },
  { x: P.kpmg.x + 9, z: P.kpmg.z - 10, hw: 2.5, hd: 2.5, h: 16 },
  { x: P.kpmg.x - 18, z: P.kpmg.z - 11, hw: 1.8, hd: 1.8, h: 9 },
]

/** Le segment (a → b) traverse-t-il un bâtiment ? (méthode des « slabs » sur chaque boîte) */
export function segmentBlocked(a: { x: number; y: number; z: number }, b: { x: number; y: number; z: number }) {
  const d = { x: b.x - a.x, y: b.y - a.y, z: b.z - a.z }
  return OCCLUDERS.some((o) => {
    let tmin = 0
    let tmax = 1
    const axes: [number, number, number, number][] = [
      [a.x, d.x, o.x - o.hw, o.x + o.hw],
      [a.y, d.y, 0, o.h],
      [a.z, d.z, o.z - o.hd, o.z + o.hd],
    ]
    for (const [origin, dir, lo, hi] of axes) {
      if (Math.abs(dir) < 1e-6) {
        if (origin < lo || origin > hi) return false
      } else {
        let t1 = (lo - origin) / dir
        let t2 = (hi - origin) / dir
        if (t1 > t2) [t1, t2] = [t2, t1]
        tmin = Math.max(tmin, t1)
        tmax = Math.min(tmax, t2)
        if (tmin > tmax) return false
      }
    }
    return true
  })
}

// ---------- Arbres, générés une fois de façon déterministe ----------

function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
export const rand = mulberry32(2026)

const insideCollider = (x: number, z: number, margin: number) =>
  STATIC_COLLIDERS.some((c) =>
    c.kind === 'box'
      ? Math.abs(x - c.x) < c.hw + margin && Math.abs(z - c.z) < c.hd + margin
      : Math.hypot(x - c.x, z - c.z) < c.r + margin,
  )

const keepClear = [
  ...Object.values(PLACES).map((p) => ({ x: p.trigger.x, z: p.trigger.z, r: p.trigger.r + 1.5 })),
  { x: CHESS.x, z: CHESS.z, r: 7.5 },
  { x: RING.x, z: RING.z, r: 5.5 },
  { x: ARCADE.x, z: ARCADE.z, r: 3.5 },
  { x: PLAZA.x, z: PLAZA.z, r: PLAZA.r + 1.5 },
  { x: HILL.x, z: HILL.z, r: 8 },
  { x: P.fastcube.x, z: P.fastcube.z, r: 10 },
  { x: P.lab.x - 9, z: P.lab.z + 1.5, r: 5 },
  // Rien entre la caméra (au sud) et les petits panneaux : leur texte doit rester lisible
  { x: SIGNPOST.x + 1, z: SIGNPOST.z + 3.5, r: 5 },
  ...MILESTONES.map((m) => ({ x: m.x, z: m.z + 3, r: 3.5 })),
]

export type TreeKind = 'round' | 'pine'
export const TREES: { x: number; z: number; s: number; kind: TreeKind; tint: number }[] = []
for (let i = 0; i < 900 && TREES.length < 150; i++) {
  const x = ISLAND.minX + 3 + rand() * (ISLAND.maxX - ISLAND.minX - 6)
  const z = ISLAND.minZ + 3 + rand() * (ISLAND.maxZ - ISLAND.minZ - 6)
  if (distanceToRoad(x, z) < ROAD_WIDTH / 2 + 2.2) continue
  if (insideCollider(x, z, 2)) continue
  if (keepClear.some((k) => Math.hypot(x - k.x, z - k.z) < k.r)) continue
  if (TREES.some((t) => Math.hypot(x - t.x, z - t.z) < 3.2)) continue
  TREES.push({ x, z, s: 0.8 + rand() * 0.6, kind: rand() < 0.35 ? 'pine' : 'round', tint: rand() })
}

export const COLLIDERS: Collider[] = [...STATIC_COLLIDERS, ...TREES.map((t) => circle(t.x, t.z, 0.45 * t.s))]

/** Repousse un cercle (le personnage) hors des obstacles et le garde sur l'île. */
export function resolveCollisions(p: { x: number; z: number }, r: number, extra: Collider[] = []) {
  for (const c of extra.length ? [...COLLIDERS, ...extra] : COLLIDERS) {
    if (c.kind === 'circle') {
      const dx = p.x - c.x
      const dz = p.z - c.z
      const d = Math.hypot(dx, dz)
      const min = c.r + r
      if (d < min && d > 1e-5) {
        p.x = c.x + (dx / d) * min
        p.z = c.z + (dz / d) * min
      }
    } else {
      const cx = Math.max(c.x - c.hw, Math.min(p.x, c.x + c.hw))
      const cz = Math.max(c.z - c.hd, Math.min(p.z, c.z + c.hd))
      const dx = p.x - cx
      const dz = p.z - cz
      const d = Math.hypot(dx, dz)
      if (d < r) {
        if (d > 1e-5) {
          p.x = cx + (dx / d) * r
          p.z = cz + (dz / d) * r
        } else {
          // centre à l'intérieur de la boîte : sortie par le côté le plus proche
          const ox = c.hw - Math.abs(p.x - c.x)
          const oz = c.hd - Math.abs(p.z - c.z)
          if (ox < oz) p.x = c.x + Math.sign(p.x - c.x || 1) * (c.hw + r)
          else p.z = c.z + Math.sign(p.z - c.z || 1) * (c.hd + r)
        }
      }
    }
  }
  // Bords de l'île : rectangle aux coins arrondis
  const m = 1.2
  const R = ISLAND.corner
  const qx = Math.max(ISLAND.minX + m + R, Math.min(p.x, ISLAND.maxX - m - R))
  const qz = Math.max(ISLAND.minZ + m + R, Math.min(p.z, ISLAND.maxZ - m - R))
  const dx = p.x - qx
  const dz = p.z - qz
  const d = Math.hypot(dx, dz)
  if (d > R) {
    p.x = qx + (dx / d) * R
    p.z = qz + (dz / d) * R
  }
}
