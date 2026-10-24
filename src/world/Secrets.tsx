import { Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { Group, Mesh } from 'three'
import { Box, C, Cyl, FONT_BOLD, mat, unitBox } from './parts'
import { ARCADE, BAG, CHESS, CHESS_PIECES, POND, RING, chessPiecePosition, type ChessKind } from './layout'
import { arcade, bag, chessWobble } from './shared'

// ---------------------------------------------------------------------------
// Boxe anglaise : un ring ouvert au sud et un sac de frappe qui réagit aux coups d'épaule
// ---------------------------------------------------------------------------

function BoxingRing() {
  const pivot = useRef<Group>(null)
  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 1 / 30)
    const stiffness = 7
    const damping = 1.1
    bag.vx += (-stiffness * bag.ax - damping * bag.vx) * dt
    bag.vz += (-stiffness * bag.az - damping * bag.vz) * dt
    bag.ax = Math.max(-0.9, Math.min(0.9, bag.ax + bag.vx * dt))
    bag.az = Math.max(-0.9, Math.min(0.9, bag.az + bag.vz * dt))
    pivot.current!.rotation.set(bag.ax, 0, bag.az)
  })
  const half = RING.size / 2
  const corners: [number, number, string][] = [
    [-half, -half, C.red],
    [half, -half, '#2D4BA0'],
    [-half, half, C.white],
    [half, half, C.white],
  ]
  const ropeColors = [C.red, C.white, '#2D4BA0']
  return (
    <group position={[RING.x, 0, RING.z]}>
      <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]} material={mat('#5B7BC9')} receiveShadow>
        <planeGeometry args={[RING.size, RING.size]} />
      </mesh>
      {corners.map(([x, z, c], i) => (
        <Cyl key={i} r={0.16} h={1.6} at={[x, 0, z]} color={c} seg={8} />
      ))}
      {ropeColors.map((c, i) => {
        const y = 0.55 + i * 0.4
        return (
          <group key={c}>
            <mesh geometry={unitBox} material={mat(c)} position={[0, y, -half]} scale={[RING.size, 0.06, 0.06]} />
            <mesh geometry={unitBox} material={mat(c)} position={[-half, y, 0]} scale={[0.06, 0.06, RING.size]} />
            <mesh geometry={unitBox} material={mat(c)} position={[half, y, 0]} scale={[0.06, 0.06, RING.size]} />
          </group>
        )
      })}
      {/* Potence et sac de frappe */}
      <group position={[BAG.x - RING.x, 0, BAG.z - RING.z]}>
        <Box size={[0.22, 3.8, 0.22]} at={[0, 0, -1.6]} color={C.navy} />
        <Box size={[0.2, 0.2, 1.8]} at={[0, 3.6, -0.8]} color={C.navy} />
        <group ref={pivot} position={[0, 3.6, 0]}>
          <mesh position={[0, -0.3, 0]} material={mat(C.slate)}>
            <cylinderGeometry args={[0.03, 0.03, 0.6, 6]} />
          </mesh>
          <mesh position={[0, -1.35, 0]} material={mat('#C8453B', { flat: false, roughness: 0.6 })} castShadow>
            <cylinderGeometry args={[0.42, 0.42, 1.5, 14]} />
          </mesh>
          <mesh position={[0, -0.58, 0]} material={mat('#2A2A30', { flat: false })}>
            <cylinderGeometry args={[0.43, 0.43, 0.12, 14]} />
          </mesh>
        </group>
      </group>
      {/* Gants posés dans un coin */}
      {[-0.25, 0.25].map((x) => (
        <mesh key={x} position={[half - 0.9 + x, 0.2, -half + 0.7]} material={mat(C.red, { flat: false })} castShadow>
          <sphereGeometry args={[0.2, 10, 8]} />
        </mesh>
      ))}
    </group>
  )
}

// ---------------------------------------------------------------------------
// Échecs : un échiquier géant et une partie en cours ; les pièces vacillent quand on les bouscule
// ---------------------------------------------------------------------------

function Piece({ kind, white }: { kind: ChessKind; white: boolean }) {
  const m = mat(white ? '#F7F1E3' : '#3A3540', { flat: false, roughness: 0.5 })
  const base = (
    <mesh position={[0, 0.09, 0]} material={m} castShadow>
      <cylinderGeometry args={[0.38, 0.42, 0.18, 14]} />
    </mesh>
  )
  switch (kind) {
    case 'pawn':
      return (
        <group>
          {base}
          <mesh position={[0, 0.45, 0]} material={m} castShadow>
            <cylinderGeometry args={[0.14, 0.28, 0.55, 12]} />
          </mesh>
          <mesh position={[0, 0.88, 0]} material={m} castShadow>
            <sphereGeometry args={[0.22, 14, 10]} />
          </mesh>
        </group>
      )
    case 'rook':
      return (
        <group>
          {base}
          <mesh position={[0, 0.6, 0]} material={m} castShadow>
            <cylinderGeometry args={[0.27, 0.32, 0.85, 12]} />
          </mesh>
          <mesh position={[0, 1.12, 0]} material={m} castShadow>
            <cylinderGeometry args={[0.36, 0.33, 0.24, 12]} />
          </mesh>
          {[0, 1, 2, 3].map((i) => (
            <mesh key={i} position={[Math.cos((i * Math.PI) / 2) * 0.25, 1.32, Math.sin((i * Math.PI) / 2) * 0.25]} material={m} castShadow>
              <boxGeometry args={[0.16, 0.18, 0.16]} />
            </mesh>
          ))}
        </group>
      )
    case 'bishop':
      return (
        <group>
          {base}
          <mesh position={[0, 0.6, 0]} material={m} castShadow>
            <cylinderGeometry args={[0.13, 0.3, 0.85, 12]} />
          </mesh>
          <mesh position={[0, 1.2, 0]} scale={[1, 1.4, 1]} material={m} castShadow>
            <sphereGeometry args={[0.22, 14, 10]} />
          </mesh>
          <mesh position={[0, 1.56, 0]} material={m}>
            <sphereGeometry args={[0.07, 8, 6]} />
          </mesh>
        </group>
      )
    case 'knight':
      return (
        <group rotation={[0, white ? 0 : Math.PI, 0]}>
          {base}
          <mesh position={[0, 0.45, 0]} material={m} castShadow>
            <cylinderGeometry args={[0.24, 0.32, 0.55, 12]} />
          </mesh>
          <mesh position={[0, 0.95, -0.02]} rotation={[-0.25, 0, 0]} material={m} castShadow>
            <boxGeometry args={[0.32, 0.75, 0.42]} />
          </mesh>
          <mesh position={[0, 1.12, 0.26]} rotation={[0.5, 0, 0]} material={m} castShadow>
            <boxGeometry args={[0.28, 0.3, 0.45]} />
          </mesh>
          {[-0.09, 0.09].map((x) => (
            <mesh key={x} position={[x, 1.4, -0.08]} material={m}>
              <coneGeometry args={[0.06, 0.16, 4]} />
            </mesh>
          ))}
        </group>
      )
    case 'queen':
    case 'king':
      return (
        <group>
          {base}
          <mesh position={[0, 0.72, 0]} material={m} castShadow>
            <cylinderGeometry args={[0.16, 0.32, 1.1, 12]} />
          </mesh>
          <mesh position={[0, 1.34, 0]} material={m} castShadow>
            <cylinderGeometry args={[0.32, 0.2, 0.22, 12]} />
          </mesh>
          {kind === 'queen' ? (
            <>
              {Array.from({ length: 6 }, (_, i) => (
                <mesh key={i} position={[Math.cos((i * Math.PI) / 3) * 0.26, 1.52, Math.sin((i * Math.PI) / 3) * 0.26]} material={m}>
                  <sphereGeometry args={[0.06, 8, 6]} />
                </mesh>
              ))}
              <mesh position={[0, 1.58, 0]} material={m}>
                <sphereGeometry args={[0.12, 10, 8]} />
              </mesh>
            </>
          ) : (
            <>
              <mesh position={[0, 1.7, 0]} material={m} castShadow>
                <boxGeometry args={[0.1, 0.5, 0.1]} />
              </mesh>
              <mesh position={[0, 1.76, 0]} material={m}>
                <boxGeometry args={[0.32, 0.1, 0.1]} />
              </mesh>
            </>
          )}
        </group>
      )
  }
}

function Chess() {
  const pieces = useRef<Group>(null)
  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 1 / 30)
    pieces.current!.children.forEach((g, i) => {
      const w = chessWobble[i]
      w.vx += (-28 * w.tx - 2.2 * w.vx) * dt
      w.vz += (-28 * w.tz - 2.2 * w.vz) * dt
      w.tx += w.vx * dt
      w.tz += w.vz * dt
      g.rotation.set(w.tx, 0, w.tz)
    })
  })
  const squares = []
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if ((r + c) % 2 === 0) continue
      const { x, z } = chessPiecePosition(c, r)
      squares.push(<mesh key={`${r}-${c}`} geometry={unitBox} material={mat('#F6EBD6')} position={[x, 0.09, z]} scale={[CHESS.cell, 0.04, CHESS.cell]} receiveShadow />)
    }
  }
  const size = CHESS.cell * 8
  return (
    <group>
      <Box size={[size + 0.8, 0.08, size + 0.8]} at={[CHESS.x, 0, CHESS.z]} color={C.woodDark} shadow={false} />
      <Box size={[size, 0.1, size]} at={[CHESS.x, 0, CHESS.z]} color="#8C6A52" shadow={false} />
      {squares}
      <group ref={pieces}>
        {CHESS_PIECES.map((p, i) => {
          const { x, z } = chessPiecePosition(p.col, p.row)
          return (
            <group key={i} position={[x, 0.11, z]}>
              <Piece kind={p.kind} white={p.white} />
            </group>
          )
        })}
      </group>
    </group>
  )
}

// ---------------------------------------------------------------------------
// Jeux vidéo : une borne d'arcade qui s'anime quand on y joue
// ---------------------------------------------------------------------------

const INVADER = ['00100100', '00011000', '00111100', '01011010', '11111111', '10111101', '10100101', '00011000']

function ArcadeCabinet() {
  const screen = useRef<Mesh>(null)
  const invaders = useRef<Group>(null)
  const screenIdle = mat('#1B1E3A', { emissive: '#1B1E3A', emissiveIntensity: 0.6 })
  const flashes = ['#EE7B30', '#4FA59A', '#7B6CC0', '#E9B44C'].map((c) => mat(c, { emissive: c, emissiveIntensity: 0.9 }))
  const pixel = mat('#7CF2B4', { emissive: '#7CF2B4', emissiveIntensity: 1.2 })

  useFrame(({ clock }) => {
    const now = performance.now() / 1000
    const since = now - arcade.playedAt
    const playing = since < 1.6
    screen.current!.material = playing ? flashes[Math.floor(since * 10) % flashes.length] : screenIdle
    const t = clock.elapsedTime
    invaders.current!.position.x = Math.sin(t * (playing ? 8 : 1.2)) * 0.18
    invaders.current!.position.y = playing ? Math.abs(Math.sin(t * 10)) * 0.08 : 0
  })

  const pixels: [number, number][] = []
  INVADER.forEach((row, y) => row.split('').forEach((v, x) => v === '1' && pixels.push([x, y])))

  return (
    <group position={[ARCADE.x, 0, ARCADE.z]}>
      <Box size={[1.7, 2.7, 1.3]} color="#6B4FA0" />
      <Box size={[1.72, 0.5, 1.32]} at={[0, 2.7, 0]} material={mat('#F7D25C', { emissive: '#F7D25C', emissiveIntensity: 0.5 })} />
      <Text font={FONT_BOLD} fontSize={0.3} color={C.navy} position={[0, 2.95, 0.67]} anchorX="center" anchorY="middle">
        ARCADE
      </Text>
      {/* Écran incliné */}
      <group position={[0, 1.95, 0.6]} rotation={[-0.25, 0, 0]}>
        <mesh ref={screen} geometry={unitBox} material={screenIdle} scale={[1.3, 0.95, 0.06]} />
        <group ref={invaders} position={[0, 0, 0.05]}>
          {pixels.map(([x, y]) => (
            <mesh key={`${x}-${y}`} geometry={unitBox} material={pixel} position={[(x - 3.5) * 0.07, (3.5 - y) * 0.07, 0]} scale={[0.065, 0.065, 0.02]} />
          ))}
        </group>
      </group>
      {/* Pupitre : joystick et boutons */}
      <mesh position={[0, 1.3, 0.78]} rotation={[0.35, 0, 0]} material={mat('#4A3780')} castShadow>
        <boxGeometry args={[1.7, 0.12, 0.6]} />
      </mesh>
      <mesh position={[-0.4, 1.47, 0.8]} material={mat(C.navy)}>
        <cylinderGeometry args={[0.03, 0.03, 0.25, 6]} />
      </mesh>
      <mesh position={[-0.4, 1.62, 0.8]} material={mat(C.red, { flat: false })}>
        <sphereGeometry args={[0.08, 10, 8]} />
      </mesh>
      {[0.15, 0.4].map((x, i) => (
        <mesh key={x} position={[x, 1.41, 0.82]} rotation={[0.35, 0, 0]} material={mat(i ? '#4FA59A' : C.orange, { flat: false })}>
          <cylinderGeometry args={[0.07, 0.07, 0.06, 10]} />
        </mesh>
      ))}
    </group>
  )
}

// ---------------------------------------------------------------------------
// Une mare, des nénuphars et un canard (pour le plaisir)
// ---------------------------------------------------------------------------

function Pond() {
  const duck = useRef<Group>(null)
  useFrame(({ clock }) => {
    const a = clock.elapsedTime * 0.25
    duck.current!.position.set(POND.x + Math.cos(a) * 2.2, 0.12 + Math.sin(clock.elapsedTime * 2) * 0.02, POND.z + Math.sin(a) * 2.2)
    duck.current!.rotation.y = -a
  })
  return (
    <group>
      <mesh position={[POND.x, 0.04, POND.z]} rotation={[-Math.PI / 2, 0, 0]} material={mat('#8CCFE0', { roughness: 0.2 })} receiveShadow>
        <circleGeometry args={[POND.r, 18]} />
      </mesh>
      <mesh position={[POND.x, 0.05, POND.z]} rotation={[-Math.PI / 2, 0, 0]} material={mat(C.stone)}>
        <ringGeometry args={[POND.r, POND.r + 0.5, 18]} />
      </mesh>
      {[
        [1.6, -1.2],
        [-1.8, 0.9],
        [0.4, 2.1],
      ].map(([x, z], i) => (
        <mesh key={i} position={[POND.x + x, 0.06, POND.z + z]} rotation={[-Math.PI / 2, 0, i]} material={mat('#6FA35F')}>
          <circleGeometry args={[0.45, 7, 0.4, Math.PI * 1.8]} />
        </mesh>
      ))}
      <group ref={duck}>
        <mesh position={[0, 0.2, 0]} scale={[1, 0.75, 1.3]} material={mat('#FFFFFF', { flat: false })} castShadow>
          <sphereGeometry args={[0.32, 12, 10]} />
        </mesh>
        <mesh position={[0, 0.52, 0.3]} material={mat('#3F7A4E', { flat: false })} castShadow>
          <sphereGeometry args={[0.18, 12, 10]} />
        </mesh>
        <mesh position={[0, 0.48, 0.5]} rotation={[Math.PI / 2, 0, 0]} material={mat(C.orange)}>
          <coneGeometry args={[0.07, 0.18, 6]} />
        </mesh>
      </group>
    </group>
  )
}

export function Secrets() {
  return (
    <group>
      <BoxingRing />
      <Chess />
      <ArcadeCabinet />
      <Pond />
    </group>
  )
}
