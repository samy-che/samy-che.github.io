import { useLayoutEffect, useMemo, useRef } from 'react'
import { BufferAttribute, BufferGeometry, Color, ExtrudeGeometry, InstancedMesh, Object3D, Shape, Vector3 } from 'three'
import { C, mat } from './parts'
import { HILL, ISLAND, ROAD_WIDTH, groundHeight, rand, roadCurve, distanceToRoad, COLLIDERS } from './layout'

function roundedRect(minX: number, minZ: number, maxX: number, maxZ: number, r: number) {
  const s = new Shape()
  s.moveTo(minX + r, minZ)
  s.lineTo(maxX - r, minZ)
  s.quadraticCurveTo(maxX, minZ, maxX, minZ + r)
  s.lineTo(maxX, maxZ - r)
  s.quadraticCurveTo(maxX, maxZ, maxX - r, maxZ)
  s.lineTo(minX + r, maxZ)
  s.quadraticCurveTo(minX, maxZ, minX, maxZ - r)
  s.lineTo(minX, minZ + r)
  s.quadraticCurveTo(minX, minZ, minX + r, minZ)
  return s
}

/** L'île flottante : dessus en herbe, flancs en terre, et une couche de roche en dessous. */
function Island() {
  const [top, under] = useMemo(() => {
    const { minX, minZ, maxX, maxZ, corner } = ISLAND
    const top = new ExtrudeGeometry(roundedRect(minX, minZ, maxX, maxZ, corner), { depth: 2.2, bevelEnabled: false, curveSegments: 6 })
    const i = 3
    const under = new ExtrudeGeometry(roundedRect(minX + i, minZ + i, maxX - i, maxZ - i, corner - 2), {
      depth: 3.5,
      bevelEnabled: false,
      curveSegments: 6,
    })
    return [top, under]
  }, [])
  return (
    <group>
      {/* Rotation de +90° autour de x : la forme (x, y) devient le sol (x, z) et l'extrusion descend. */}
      <mesh geometry={top} rotation={[Math.PI / 2, 0, 0]} material={[mat(C.grass), mat(C.earth)]} receiveShadow />
      <mesh geometry={under} rotation={[Math.PI / 2, 0, 0]} position={[0, -2.2, 0]} material={[mat(C.earthDark), mat(C.earthDark)]} />
    </group>
  )
}

/** Grille polaire qui épouse le relief, pour la colline et le sol du belvédère. */
function polarGeometry(cx: number, cz: number, radius: number, rings: number, segments: number, lift: number) {
  const pos: number[] = []
  const idx: number[] = []
  pos.push(cx, groundHeight(cx, cz) + lift, cz)
  for (let r = 1; r <= rings; r++) {
    for (let s = 0; s < segments; s++) {
      const a = (s / segments) * Math.PI * 2
      const x = cx + Math.cos(a) * (radius * r) / rings
      const z = cz + Math.sin(a) * (radius * r) / rings
      pos.push(x, groundHeight(x, z) + lift, z)
    }
  }
  for (let s = 0; s < segments; s++) idx.push(0, 1 + ((s + 1) % segments), 1 + s)
  for (let r = 1; r < rings; r++) {
    const a0 = 1 + (r - 1) * segments
    const a1 = 1 + r * segments
    for (let s = 0; s < segments; s++) {
      const n = (s + 1) % segments
      idx.push(a0 + s, a0 + n, a1 + s, a0 + n, a1 + n, a1 + s)
    }
  }
  const g = new BufferGeometry()
  g.setAttribute('position', new BufferAttribute(new Float32Array(pos), 3))
  g.setIndex(idx)
  g.computeVertexNormals()
  return g
}

function Hill() {
  const hill = useMemo(() => polarGeometry(HILL.x, HILL.z, HILL.radius + 0.4, 28, 72, 0.01), [])
  const plaza = useMemo(() => polarGeometry(HILL.x, HILL.z - 1, 5.6, 4, 24, 0.05), [])
  return (
    <group>
      <mesh geometry={hill} material={mat(C.grassDark)} receiveShadow />
      <mesh geometry={plaza} material={mat(C.road)} receiveShadow />
    </group>
  )
}

/** Sur la colline, la route est légèrement surélevée pour ne jamais passer sous le maillage du relief. */
const slopeLift = (x: number, z: number) => (groundHeight(x, z) > 0.001 ? 0.12 : 0)

/** Ruban de route qui suit la courbe et le relief. */
function ribbon(width: number, lift: number, samples: number) {
  const pts = roadCurve.getSpacedPoints(samples)
  const pos = new Float32Array(pts.length * 6)
  const idx: number[] = []
  const tangent = new Vector3()
  pts.forEach((p, i) => {
    roadCurve.getTangentAt(Math.min(i / samples, 1), tangent)
    const nx = -tangent.z
    const nz = tangent.x
    const len = Math.hypot(nx, nz) || 1
    const ox = (nx / len) * (width / 2)
    const oz = (nz / len) * (width / 2)
    const lx = p.x + ox
    const lz = p.z + oz
    const rx = p.x - ox
    const rz = p.z - oz
    pos.set([lx, groundHeight(lx, lz) + lift + slopeLift(lx, lz), lz, rx, groundHeight(rx, rz) + lift + slopeLift(rx, rz), rz], i * 6)
    if (i < pts.length - 1) {
      const a = i * 2
      idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3)
    }
  })
  const g = new BufferGeometry()
  g.setAttribute('position', new BufferAttribute(pos, 3))
  g.setIndex(idx)
  g.computeVertexNormals()
  return g
}

function Road() {
  const samples = Math.round(roadCurve.getLength() * 1.5)
  const edge = useMemo(() => ribbon(ROAD_WIDTH + 0.9, 0.03, samples), [samples])
  const road = useMemo(() => ribbon(ROAD_WIDTH, 0.05, samples), [samples])
  const dashes = useRef<InstancedMesh>(null)
  const count = Math.floor(roadCurve.getLength() / 3.4) - 2

  useLayoutEffect(() => {
    const o = new Object3D()
    const t = new Vector3()
    for (let i = 0; i < count; i++) {
      const u = (i + 1) / (count + 2)
      const p = roadCurve.getPointAt(u)
      roadCurve.getTangentAt(u, t)
      o.position.set(p.x, groundHeight(p.x, p.z) + 0.07, p.z)
      o.rotation.set(0, Math.atan2(t.x, t.z), 0)
      o.scale.set(0.18, 0.02, 1.4)
      o.updateMatrix()
      dashes.current!.setMatrixAt(i, o.matrix)
    }
    dashes.current!.instanceMatrix.needsUpdate = true
  }, [count])

  return (
    <group>
      <mesh geometry={edge} material={mat(C.roadEdge)} receiveShadow />
      <mesh geometry={road} material={mat(C.road)} receiveShadow />
      <instancedMesh ref={dashes} args={[undefined, undefined, count]} material={mat(C.roadLine)}>
        <boxGeometry />
      </instancedMesh>
    </group>
  )
}

/** Petits chemins de terre qui mènent au parc central, entre les deux rues. */
function Footpaths() {
  const paths: [number, number, number, number][] = [
    // x, z, largeur, longueur (orientés nord-sud)
    [-28, -9.5, 2, 13],
    [20, -9.5, 2, 13],
    [4, -35.5, 2, 5],
    [-19, -35.5, 2, 5],
    [22, -35.5, 2, 5],
  ]
  return (
    <group>
      {paths.map(([x, z, w, l], i) => (
        <mesh key={i} position={[x, 0.025, z]} rotation={[-Math.PI / 2, 0, 0]} material={mat(C.road)} receiveShadow>
          <planeGeometry args={[w, l]} />
        </mesh>
      ))}
    </group>
  )
}

/** Touffes d'herbe plus sombre et fleurs, pour casser l'uniformité du sol. */
function GroundDetails() {
  const patches = useRef<InstancedMesh>(null)
  const flowers = useRef<InstancedMesh>(null)
  const { patchList, flowerList } = useMemo(() => {
    const free = (x: number, z: number, m: number) =>
      distanceToRoad(x, z) > 3.5 &&
      !COLLIDERS.some((c) =>
        c.kind === 'box' ? Math.abs(x - c.x) < c.hw + m && Math.abs(z - c.z) < c.hd + m : Math.hypot(x - c.x, z - c.z) < c.r + m,
      ) &&
      Math.hypot(x - HILL.x, z - HILL.z) > HILL.radius
    const patchList: [number, number, number][] = []
    const flowerList: [number, number, string][] = []
    const palette = ['#F7D25C', '#F4A6A0', '#FFFFFF', '#C9B6F2', '#EE7B30']
    for (let i = 0; i < 400; i++) {
      const x = ISLAND.minX + 4 + rand() * (ISLAND.maxX - ISLAND.minX - 8)
      const z = ISLAND.minZ + 4 + rand() * (ISLAND.maxZ - ISLAND.minZ - 8)
      if (!free(x, z, 0.8)) continue
      if (patchList.length < 70 && rand() < 0.4) patchList.push([x, z, 1.2 + rand() * 2.5])
      else if (flowerList.length < 160) flowerList.push([x, z, palette[Math.floor(rand() * palette.length)]])
    }
    return { patchList, flowerList }
  }, [])

  useLayoutEffect(() => {
    const o = new Object3D()
    patchList.forEach(([x, z, s], i) => {
      o.position.set(x, 0.015, z)
      o.rotation.set(-Math.PI / 2, 0, rand() * Math.PI)
      o.scale.set(s, s * (0.6 + rand() * 0.4), 1)
      o.updateMatrix()
      patches.current!.setMatrixAt(i, o.matrix)
    })
    patches.current!.instanceMatrix.needsUpdate = true
    flowerList.forEach(([x, z, color], i) => {
      o.position.set(x, 0.12, z)
      o.rotation.set(0, 0, 0)
      o.scale.setScalar(0.7 + rand() * 0.5)
      o.updateMatrix()
      flowers.current!.setMatrixAt(i, o.matrix)
      flowers.current!.setColorAt(i, new Color(color))
    })
    flowers.current!.instanceMatrix.needsUpdate = true
    if (flowers.current!.instanceColor) flowers.current!.instanceColor.needsUpdate = true
  }, [patchList, flowerList])

  return (
    <group>
      <instancedMesh ref={patches} args={[undefined, undefined, patchList.length]} material={mat(C.grassDark)} receiveShadow>
        <circleGeometry args={[1, 7]} />
      </instancedMesh>
      <instancedMesh ref={flowers} args={[undefined, undefined, flowerList.length]} material={mat('#ffffff')}>
        <icosahedronGeometry args={[0.13, 0]} />
      </instancedMesh>
    </group>
  )
}

export function Ground() {
  return (
    <group>
      <Island />
      <Hill />
      <Road />
      <Footpaths />
      <GroundDetails />
    </group>
  )
}
