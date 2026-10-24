import { useFrame } from '@react-three/fiber'
import { useLayoutEffect, useMemo, useRef } from 'react'
import { Color, Object3D, type Group, type InstancedMesh, type Mesh } from 'three'
import { skills } from '../content/skills'
import { stationOrder } from '../content/stations'
import type { SkillLevel } from '../content/types'
import { useStore } from '../store'
import { mat } from './parts'
import { PLACES, groundHeight } from './layout'
import { collectedAt } from './shared'

export const LEVEL_COLORS: Record<SkillLevel, string> = {
  mission: '#EE8F35',
  formation: '#3E9C8F',
  discovery: '#8B7BC0',
}

/**
 * Les badges de compétences flottent devant chaque bâtiment ; à la première visite,
 * ils s'envolent (et rejoignent le « sac à compétences » de l'interface).
 */
export function Badges() {
  const ref = useRef<InstancedMesh>(null)
  const coins = useMemo(() => {
    const byStation = new Map<string, typeof skills>()
    skills.forEach((s) => byStation.set(s.station, [...(byStation.get(s.station) ?? []), s]))
    const list: { station: string; x: number; y: number; z: number; color: string; phase: number }[] = []
    byStation.forEach((items, station) => {
      const tr = PLACES[station as keyof typeof PLACES].trigger
      // en arc, entre la route et la façade
      items.forEach((s, i) => {
        const u = items.length === 1 ? 0 : i / (items.length - 1) - 0.5
        const x = tr.x + u * Math.min(items.length * 0.85, 7)
        const z = tr.z - 2 - Math.cos(u * Math.PI) * 0.6
        list.push({ station, x, y: groundHeight(x, z) + 1.9, z, color: LEVEL_COLORS[s.level], phase: i * 0.7 })
      })
    })
    return list
  }, [])

  useLayoutEffect(() => {
    const c = new Color()
    coins.forEach((coin, i) => ref.current!.setColorAt(i, c.set(coin.color)))
    ref.current!.instanceColor!.needsUpdate = true
  }, [coins])

  const o = useMemo(() => new Object3D(), [])
  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    coins.forEach((coin, i) => {
      const at = collectedAt[coin.station]
      let y = coin.y + Math.sin(t * 2 + coin.phase) * 0.15
      let s = 1
      if (at !== undefined) {
        const k = (t - at - coin.phase * 0.08) / 0.9
        if (k > 0) {
          y += k * k * 5
          s = Math.max(0, 1 - k)
        }
      }
      o.position.set(coin.x, y, coin.z)
      o.rotation.set(Math.PI / 2, 0, t * 1.6 + coin.phase)
      o.scale.setScalar(s)
      o.updateMatrix()
      ref.current!.setMatrixAt(i, o.matrix)
    })
    ref.current!.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, coins.length]} material={mat('#ffffff', { emissive: '#3a2a10', emissiveIntensity: 0.25, roughness: 0.4 })} castShadow>
      <cylinderGeometry args={[0.32, 0.32, 0.1, 8]} />
    </instancedMesh>
  )
}

/** Flèche orange au-dessus de la prochaine étape à visiter (ou de la destination du trajet automatique). */
export function Guide() {
  const group = useRef<Group>(null)
  const ring = useRef<Mesh>(null)
  const started = useStore((s) => s.started)
  const visited = useStore((s) => s.visited)
  const autopilot = useStore((s) => s.autopilot)
  const near = useStore((s) => s.near)
  const target = autopilot ?? stationOrder.find((id) => !visited.includes(id)) ?? null
  const place = target ? PLACES[target].trigger : null

  useFrame(({ clock }) => {
    if (!group.current || !place) return
    const t = clock.elapsedTime
    group.current.position.set(place.x, groundHeight(place.x, place.z) + 3.4 + Math.sin(t * 2.4) * 0.3, place.z)
    group.current.rotation.y = t * 1.2
    const k = (t * 0.8) % 1
    ring.current!.scale.setScalar(1 + k * 1.6)
    ;(ring.current!.material as typeof ringMat).opacity = 0.6 * (1 - k)
    ring.current!.position.y = -3.3 - Math.sin(t * 2.4) * 0.3
  })

  if (!started || !place || (near === target && !autopilot)) return null
  return (
    <group ref={group}>
      <mesh rotation={[Math.PI, 0, 0]} material={arrowMat} castShadow>
        <coneGeometry args={[0.55, 1.1, 4]} />
      </mesh>
      <mesh position={[0, 0.85, 0]} material={arrowMat}>
        <boxGeometry args={[0.32, 0.8, 0.32]} />
      </mesh>
      <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]} material={ringMat}>
        <ringGeometry args={[0.9, 1.15, 24]} />
      </mesh>
    </group>
  )
}

const arrowMat = mat('#EE7B30', { emissive: '#EE7B30', emissiveIntensity: 0.35 })
const ringMat = mat('#EE7B30', { transparent: true, opacity: 0.6, emissive: '#EE7B30', emissiveIntensity: 0.4 }).clone()
