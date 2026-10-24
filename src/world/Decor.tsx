import { useFrame } from '@react-three/fiber'
import { useLayoutEffect, useMemo, useRef } from 'react'
import { Color, Object3D, type Group, type InstancedMesh } from 'three'
import { Box, C, mat } from './parts'
import { BENCHES, ISLAND, LAMPS, TREES } from './layout'

// Octobre : un mélange de verts et de feuillages d'automne
const GREENS = ['#7DB36A', '#8CC27A', '#6FA35F', '#9CCB86']
const AUTUMN = ['#F0B45B', '#E8914F', '#DD7A47', '#F3CC6B']
const PINES = ['#5E9A62', '#6BA86C', '#558F5A']

function Trees() {
  const trunks = useRef<InstancedMesh>(null)
  const crowns = useRef<InstancedMesh>(null)
  const pinesLow = useRef<InstancedMesh>(null)
  const pinesHigh = useRef<InstancedMesh>(null)
  const round = useMemo(() => TREES.filter((t) => t.kind === 'round'), [])
  const pines = useMemo(() => TREES.filter((t) => t.kind === 'pine'), [])

  useLayoutEffect(() => {
    const o = new Object3D()
    const color = new Color()
    TREES.forEach((t, i) => {
      o.position.set(t.x, 0, t.z)
      o.rotation.set(0, t.tint * 6, 0)
      o.scale.set(t.s, t.s * (t.kind === 'pine' ? 1.1 : 1), t.s)
      o.updateMatrix()
      trunks.current!.setMatrixAt(i, o.matrix)
    })
    round.forEach((t, i) => {
      o.position.set(t.x, 2.3 * t.s, t.z)
      o.rotation.set(t.tint * 3, t.tint * 6, 0)
      o.scale.set(t.s * 1.5, t.s * 1.35, t.s * 1.5)
      o.updateMatrix()
      crowns.current!.setMatrixAt(i, o.matrix)
      const palette = t.tint < 0.55 ? GREENS : AUTUMN
      crowns.current!.setColorAt(i, color.set(palette[Math.floor(t.tint * 97) % palette.length]))
    })
    pines.forEach((t, i) => {
      for (const [ref, y, s] of [
        [pinesLow, 1.7, 1.25],
        [pinesHigh, 2.9, 0.9],
      ] as const) {
        o.position.set(t.x, y * t.s, t.z)
        o.rotation.set(0, t.tint * 6, 0)
        o.scale.set(t.s * s, t.s * s, t.s * s)
        o.updateMatrix()
        ref.current!.setMatrixAt(i, o.matrix)
        ref.current!.setColorAt(i, color.set(PINES[Math.floor(t.tint * 53) % PINES.length]))
      }
    })
    for (const r of [trunks, crowns, pinesLow, pinesHigh]) {
      r.current!.instanceMatrix.needsUpdate = true
      if (r.current!.instanceColor) r.current!.instanceColor.needsUpdate = true
    }
  }, [round, pines])

  return (
    <group>
      <instancedMesh ref={trunks} args={[undefined, undefined, TREES.length]} material={mat(C.woodDark)} castShadow receiveShadow>
        <cylinderGeometry args={[0.18, 0.26, 1.8, 6]} />
      </instancedMesh>
      <instancedMesh ref={crowns} args={[undefined, undefined, round.length]} material={mat('#ffffff')} castShadow receiveShadow>
        <icosahedronGeometry args={[1, 0]} />
      </instancedMesh>
      <instancedMesh ref={pinesLow} args={[undefined, undefined, pines.length]} material={mat('#ffffff')} castShadow receiveShadow>
        <coneGeometry args={[1.3, 2.2, 7]} />
      </instancedMesh>
      <instancedMesh ref={pinesHigh} args={[undefined, undefined, pines.length]} material={mat('#ffffff')} castShadow receiveShadow>
        <coneGeometry args={[1.1, 1.9, 7]} />
      </instancedMesh>
    </group>
  )
}

function Lamps() {
  return (
    <group>
      {LAMPS.map((l, i) => (
        <group key={i} position={[l.x, 0, l.z]}>
          <Box size={[0.16, 3, 0.16]} color={C.navy} />
          <Box size={[0.5, 0.55, 0.5]} at={[0, 3, 0]} material={mat('#FFF1C9', { emissive: '#FFD98A', emissiveIntensity: 0.55 })} />
          <Box size={[0.66, 0.12, 0.66]} at={[0, 3.55, 0]} color={C.navy} />
        </group>
      ))}
    </group>
  )
}

function Benches() {
  return (
    <group>
      {BENCHES.map((b, i) => (
        <group key={i} position={[b.x, 0, b.z]} rotation={[0, b.yaw, 0]}>
          <Box size={[2.2, 0.12, 0.6]} at={[0, 0.45, 0]} color={C.wood} />
          <Box size={[2.2, 0.5, 0.1]} at={[0, 0.6, -0.28]} color={C.wood} />
          {[-0.9, 0.9].map((x) => (
            <Box key={x} size={[0.1, 0.45, 0.5]} at={[x, 0, 0]} color={C.navy} />
          ))}
        </group>
      ))}
    </group>
  )
}

/** Nuages en contrebas de l'île, devant et derrière, pour l'effet « île flottante ». */
function Clouds() {
  const group = useRef<Group>(null)
  const clouds = useMemo(() => {
    let seed = 11
    const r = () => {
      seed = (seed * 16807) % 2147483647
      return seed / 2147483647
    }
    const list = []
    for (let i = 0; i < 10; i++) {
      const x = ISLAND.minX - 20 + r() * (ISLAND.maxX - ISLAND.minX + 40)
      const z = i % 2 ? ISLAND.maxZ + 8 + r() * 14 : ISLAND.minZ - 10 - r() * 14
      list.push({
        x,
        y: -6 + r() * 4,
        z,
        s: 2 + r() * 1.8,
        speed: 0.4 + r() * 0.6,
        puffs: Array.from({ length: 4 }, (_, j) => ({ x: (j - 1.5) * 1.3 + r() * 0.4, y: r() * 0.5, z: r() * 0.8, s: 0.9 + r() * 0.7 })),
      })
    }
    return list
  }, [])
  const span = ISLAND.maxX - ISLAND.minX + 60
  useFrame((_, dt) => {
    group.current!.children.forEach((c, i) => {
      c.position.x += clouds[i].speed * dt
      if (c.position.x > ISLAND.maxX + 30) c.position.x -= span
    })
  })
  const cloudMat = mat('#FFFFFF', { roughness: 1 })
  return (
    <group ref={group}>
      {clouds.map((c, i) => (
        <group key={i} position={[c.x, c.y, c.z]} scale={c.s}>
          {c.puffs.map((p, j) => (
            <mesh key={j} position={[p.x, p.y, p.z]} scale={p.s} material={cloudMat}>
              <icosahedronGeometry args={[1, 0]} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}

export function Decor() {
  return (
    <group>
      <Trees />
      <Lamps />
      <Benches />
      <Clouds />
    </group>
  )
}
