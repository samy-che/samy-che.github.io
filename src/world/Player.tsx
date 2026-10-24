import { useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'
import { Object3D, PerspectiveCamera, Vector3, type DirectionalLight, type Group } from 'three'
import { discoverSecret, onFirstVisit } from '../actions'
import { sound } from '../audio'
import { stationOrder } from '../content/stations'
import type { StationId } from '../content/types'
import { input } from '../input'
import { useStore } from '../store'
import { Avatar, type Motion } from './Avatar'
import { ARCADE, BAG, CHESS_PIECES, PLACES, SPAWN, chessPiecePosition, groundHeight, resolveCollisions, roadPath, segmentBlocked } from './layout'
import { bag, chessWobble, player } from './shared'

const WALK = 6.5
const RUN = 14
const RADIUS = 0.55
const CAMERA_OFFSET = new Vector3(0, 15, 20)
/** Vue plongeante utilisée quand un bâtiment masque le personnage. */
const STEEP_OFFSET = new Vector3(0, 23, 8)

/** Itinéraire du trajet automatique : rejoindre la route, la suivre, puis entrer dans la zone de l'étape. */
function buildRoute(from: { x: number; z: number }, id: StationId) {
  const nearest = (x: number, z: number) => {
    let best = 0
    let bestD = Infinity
    roadPath.forEach((p, i) => {
      const d = Math.hypot(p.x - x, p.z - z)
      if (d < bestD) {
        bestD = d
        best = i
      }
    })
    return best
  }
  const target = PLACES[id].trigger
  const a = nearest(from.x, from.z)
  const b = nearest(target.x, target.z)
  const pts: { x: number; z: number }[] = []
  const step = b >= a ? 1 : -1
  for (let i = a; i !== b; i += step) pts.push(roadPath[i])
  pts.push(roadPath[b], { x: target.x, z: target.z })
  return pts
}

const lerpAngle = (a: number, b: number, k: number) => {
  let d = b - a
  while (d > Math.PI) d -= Math.PI * 2
  while (d < -Math.PI) d += Math.PI * 2
  return a + d * k
}

export function Player() {
  const root = useRef<Group>(null)
  const sun = useRef<DirectionalLight>(null)
  const sunTarget = useRef(new Object3D())
  const motion = useRef<Motion>({ speed: 0, phase: 0, hopAt: -10, waveUntil: 0 })
  const yaw = useRef(SPAWN.yaw)
  const look = useRef(new Vector3(-2, 0, -26))
  const occlusion = useRef(0)
  const startedAt = useRef<number | null>(null)
  const steps = useRef({ dist: 0, alt: false })
  const sprint = useRef(false)
  const route = useRef<{ id: StationId; pts: { x: number; z: number }[]; stuck: number } | null>(null)
  const camera = useThree((s) => s.camera) as PerspectiveCamera
  const size = useThree((s) => s.size)

  if (player.position.lengthSq() === 0) player.position.set(SPAWN.x, 0, SPAWN.z)

  useFrame((state, rawDt) => {
    const dt = Math.min(rawDt, 1 / 20)
    const t = state.clock.elapsedTime
    const s = useStore.getState()
    const p = player.position
    const v = player.velocity
    const m = motion.current
    m.hopAt = player.hopAt
    m.waveUntil = player.waveUntil

    const portrait = size.width < size.height
    const fov = portrait ? 52 : 40
    // En course, le champ de vision s'élargit un peu pour donner une sensation de vitesse
    const sprinting = s.started && sprint.current
    const targetFov = fov + (sprinting ? 7 : 0)
    if (Math.abs(camera.fov - targetFov) > 0.01) {
      camera.fov += (targetFov - camera.fov) * (1 - Math.exp(-dt * 6))
      camera.updateProjectionMatrix()
    }

    // Lumière du soleil : suit le personnage pour garder des ombres nettes autour de lui
    sunTarget.current.position.set(p.x, 0, p.z)
    sun.current!.position.set(p.x - 18, 30, p.z + 14)
    sun.current!.target = sunTarget.current
    sunTarget.current.updateMatrixWorld()

    // Avant le départ : survol lent de toute la ville
    if (!s.started) {
      const a = t * 0.045 + 1.2
      camera.position.set(-2 + Math.cos(a) * 100, 72, -27 + Math.sin(a) * 100)
      look.current.set(-2, 0, -27)
      camera.lookAt(look.current)
      root.current!.position.copy(p)
      root.current!.rotation.y = yaw.current
      m.speed = 0
      return
    }
    if (startedAt.current === null) {
      startedAt.current = t
      player.waveUntil = t + 1.8
    }

    // ---- Commandes
    let ix = (input.right ? 1 : 0) - (input.left ? 1 : 0) + input.joy.x
    let iz = (input.down ? 1 : 0) - (input.up ? 1 : 0) - input.joy.y
    let mag = Math.hypot(ix, iz)
    if (mag > 1) {
      ix /= mag
      iz /= mag
      mag = 1
    }
    const manual = mag > 0.08
    let running = input.run || Math.hypot(input.joy.x, input.joy.y) > 0.95

    // ---- Trajet automatique (bouton « Y aller » ou menu Parcours)
    if (manual && s.autopilot) s.stopAutopilot()
    if (!manual && s.autopilot) {
      if (route.current?.id !== s.autopilot) route.current = { id: s.autopilot, pts: buildRoute(p, s.autopilot), stuck: 0 }
      const r = route.current
      while (r.pts.length > 1 && Math.hypot(r.pts[0].x - p.x, r.pts[0].z - p.z) < 1.2) r.pts.shift()
      const w = r.pts[0]
      const d = Math.hypot(w.x - p.x, w.z - p.z)
      if (r.pts.length === 1 && d < 0.8) {
        s.stopAutopilot()
        route.current = null
        s.openStation(r.id)
        sound.open()
      } else {
        ix = (w.x - p.x) / d
        iz = (w.z - p.z) / d
        mag = 1
        running = true
      }
    } else if (!s.autopilot) {
      route.current = null
    }

    // ---- Vitesse et collisions
    const speed = running ? RUN : WALK
    sprint.current = running && manual
    const k = 1 - Math.exp(-dt * 12)
    v.x += (ix * speed - v.x) * k
    v.z += (iz * speed - v.z) * k
    if (!manual && !s.autopilot && Math.hypot(v.x, v.z) < 0.05) v.set(0, 0, 0)
    const px = p.x
    const pz = p.z
    p.x += v.x * dt
    p.z += v.z * dt
    resolveCollisions(p, RADIUS)
    p.y = groundHeight(p.x, p.z)
    const moved = Math.hypot(p.x - px, p.z - pz)

    // Bloqué pendant un trajet automatique : on saute au point suivant plutôt que de forcer contre un obstacle
    if (route.current && s.autopilot) {
      route.current.stuck = moved < speed * dt * 0.25 ? route.current.stuck + dt : 0
      if (route.current.stuck > 0.6) {
        const w = route.current.pts[0]
        p.set(w.x, groundHeight(w.x, w.z), w.z)
        route.current.stuck = 0
      }
    }

    if (Math.hypot(v.x, v.z) > 0.4) yaw.current = lerpAngle(yaw.current, Math.atan2(v.x, v.z), 1 - Math.exp(-dt * 14))
    root.current!.position.copy(p)
    root.current!.rotation.y = yaw.current

    m.speed = moved / dt / WALK
    m.phase += moved * 2.3
    steps.current.dist += moved
    if (steps.current.dist > 1.3) {
      steps.current.dist = 0
      steps.current.alt = !steps.current.alt
      sound.step(steps.current.alt)
    }

    // ---- Étapes : zone la plus proche
    let near: StationId | null = null
    let best = Infinity
    for (const id of stationOrder) {
      const tr = PLACES[id].trigger
      const d = Math.hypot(p.x - tr.x, p.z - tr.z)
      if (d < tr.r && d < best) {
        best = d
        near = id
      }
    }
    if (near !== s.near) {
      s.setNear(near)
      if (near && s.visit(near)) onFirstVisit(near, t)
    }
    if (s.open) {
      const tr = PLACES[s.open].trigger
      if (Math.hypot(p.x - tr.x, p.z - tr.z) > tr.r + 3) {
        s.closeStation()
        sound.close()
      }
    }

    // ---- Secrets
    const playerSpeed = Math.hypot(v.x, v.z)
    if (Math.hypot(p.x - BAG.x, p.z - BAG.z) < 1.2 && t - bag.lastHit > 0.45 && playerSpeed > 1) {
      bag.lastHit = t
      bag.vx -= (v.z / playerSpeed) * 2.4
      bag.vz += (v.x / playerSpeed) * 2.4
      sound.punch()
      discoverSecret('boxing')
    }
    CHESS_PIECES.forEach((piece, i) => {
      const c = chessPiecePosition(piece.col, piece.row)
      const dx = c.x - p.x
      const dz = c.z - p.z
      const d = Math.hypot(dx, dz)
      const w = chessWobble[i]
      if (d < 1.15 && t - w.lastHit > 0.5 && playerSpeed > 0.8) {
        w.lastHit = t
        w.vx += (dz / d) * 3.2
        w.vz -= (dx / d) * 3.2
        sound.clack()
        discoverSecret('chess')
      }
    })
    const nearArcade = Math.hypot(p.x - ARCADE.x, p.z - (ARCADE.z + 1)) < ARCADE.r
    if (nearArcade !== s.nearArcade) s.setNearArcade(nearArcade)

    // ---- Caméra : suit le personnage ; décalée quand le panneau latéral est ouvert
    const zoom = portrait ? 1.45 : 1
    // Panneau ouvert sur la droite : on recentre le personnage dans la partie visible de l'écran
    const worldPerPx = (2 * CAMERA_OFFSET.length() * zoom * Math.tan((fov * Math.PI) / 360)) / size.height
    const shift = s.open && !portrait && size.width > 700 ? (Math.min(460, size.width - 24) / 2 + 6) * worldPerPx : 0
    const follow = 1 - Math.exp(-dt * (t - startedAt.current < 2.5 ? 1.6 : 4.5))
    // Si un bâtiment se trouve entre la caméra et le personnage, on passe en vue plus plongeante
    const head = { x: p.x, y: p.y + 1.2, z: p.z }
    const normalCam = { x: p.x + shift, y: p.y + CAMERA_OFFSET.y * zoom, z: p.z + CAMERA_OFFSET.z * zoom }
    const blocked = segmentBlocked(normalCam, head)
    occlusion.current += ((blocked ? 1 : 0) - occlusion.current) * (1 - Math.exp(-dt * 3))
    const offset = CAMERA_OFFSET.clone().lerp(STEEP_OFFSET, occlusion.current)
    const desired = new Vector3(p.x + shift, p.y, p.z).addScaledVector(offset, zoom)
    camera.position.lerp(desired, follow)
    look.current.lerp(new Vector3(p.x + shift, p.y + 1.2, p.z), follow)
    camera.lookAt(look.current)
  })

  return (
    <>
      <directionalLight
        ref={sun}
        color="#FFE5C4"
        intensity={1.75}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-34}
        shadow-camera-right={34}
        shadow-camera-top={34}
        shadow-camera-bottom={-34}
        shadow-camera-near={1}
        shadow-camera-far={90}
        shadow-bias={-0.0004}
        shadow-normalBias={0.04}
      />
      <primitive object={sunTarget.current} />
      <group ref={root}>
        <Avatar motion={motion} />
      </group>
    </>
  )
}
