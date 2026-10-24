import { RoundedBox } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { Shape, type Group } from 'three'
import { mat } from './parts'

/**
 * Mini-Samy : personnage aux proportions « chibi » (grosse tête), en costume.
 * Cheveux noirs bouclés, teint bronzé, yeux marron foncé, pas de lunettes.
 * L'animation lit `motion` (vitesse, phase de marche) mis à jour par le contrôleur.
 */

const SKIN = '#C68A5B'
const SKIN_SHADE = '#B07448'
const HAIR = '#211A16'
const EYES = '#2E1A10'
const SUIT = '#26355A'
const SUIT_DARK = '#1B2645'
const TROUSERS = '#2A3148'
const SHIRT = '#FFFFFF'
const TIE = '#C8553D'
const SHOES = '#17171C'

const skin = mat(SKIN, { flat: false, roughness: 0.7 })
const suit = mat(SUIT, { flat: false, roughness: 0.75 })
const hair = mat(HAIR, { roughness: 0.55 })

export interface Motion {
  /** 0 = immobile, 1 = marche, ~1.6 = course */
  speed: number
  /** phase du cycle de marche, avance avec la distance parcourue */
  phase: number
  hopAt: number
  waveUntil: number
}

/** Boucles de cheveux réparties sur le dessus et l'arrière du crâne, jamais sur le visage. */
function useCurls() {
  return useMemo(() => {
    let seed = 7
    const rnd = () => {
      seed = (seed * 16807) % 2147483647
      return seed / 2147483647
    }
    const curls: { p: [number, number, number]; r: number }[] = []
    let guard = 0
    while (curls.length < 46 && guard++ < 2000) {
      const u = rnd() * 2 - 1
      const a = rnd() * Math.PI * 2
      const s = Math.sqrt(1 - u * u)
      const x = s * Math.cos(a)
      const y = u
      const z = s * Math.sin(a)
      if (y < -0.1) continue // pas sous les oreilles
      if (z > 0.2 && y < 0.5) continue // dégage le visage et le front
      if (Math.abs(x) > 0.85 && y < 0.25 && z > -0.3) continue // dégage les oreilles
      curls.push({ p: [x * 0.47, y * 0.47 + 0.03, z * 0.47 - 0.02], r: 0.12 + rnd() * 0.06 })
    }
    return curls
  }, [])
}

export function Avatar({ motion }: { motion: React.RefObject<Motion> }) {
  const body = useRef<Group>(null)
  const head = useRef<Group>(null)
  const legL = useRef<Group>(null)
  const legR = useRef<Group>(null)
  const armL = useRef<Group>(null)
  const armR = useRef<Group>(null)
  const eyes = useRef<Group>(null)
  const curls = useCurls()

  const vShape = useMemo(() => {
    const s = new Shape()
    s.moveTo(-0.14, 0.16)
    s.lineTo(0.14, 0.16)
    s.lineTo(0, -0.17)
    s.closePath()
    return s
  }, [])

  useFrame(({ clock }) => {
    const m = motion.current
    if (!m) return
    const t = clock.elapsedTime
    const sp = Math.min(m.speed, 1.6)
    const swing = Math.sin(m.phase)
    const amp = Math.min(sp, 1)

    legL.current!.rotation.x = swing * 0.75 * amp
    legR.current!.rotation.x = -swing * 0.75 * amp
    armL.current!.rotation.x = -swing * 0.6 * amp
    armL.current!.rotation.z = 0.08
    const waving = t < m.waveUntil
    if (waving) {
      armR.current!.rotation.x = 0
      armR.current!.rotation.z = -2.6 + Math.sin(t * 12) * 0.35
    } else {
      armR.current!.rotation.x = swing * 0.6 * amp
      armR.current!.rotation.z = -0.08
    }

    // petit saut de joie quand on débloque des compétences
    const hopT = t - m.hopAt
    const hop = hopT >= 0 && hopT < 0.45 ? Math.sin((hopT / 0.45) * Math.PI) * 0.55 : 0
    const bob = Math.abs(Math.sin(m.phase)) * 0.07 * amp
    const breath = Math.sin(t * 2) * 0.012 * (1 - amp)
    body.current!.position.y = bob + hop + breath
    body.current!.rotation.x = sp > 1.2 ? 0.12 : 0.04 * amp

    // la tête regarde un peu autour quand on est immobile
    head.current!.rotation.y = (1 - amp) * Math.sin(t * 0.6) * 0.25
    head.current!.rotation.z = Math.sin(m.phase * 0.5) * 0.03 * amp

    // clignement des yeux
    const blink = t % 3.7 < 0.12 ? 0.15 : 1
    eyes.current!.scale.y = blink
  })

  return (
    <group ref={body}>
      {/* Jambes et chaussures */}
      {[
        { ref: legL, x: -0.17 },
        { ref: legR, x: 0.17 },
      ].map(({ ref, x }) => (
        <group key={x} ref={ref} position={[x, 0.66, 0]}>
          <mesh position={[0, -0.3, 0]} material={mat(TROUSERS, { flat: false })} castShadow>
            <boxGeometry args={[0.24, 0.56, 0.26]} />
          </mesh>
          <mesh position={[0, -0.6, 0.06]} material={mat(SHOES, { flat: false, roughness: 0.4 })} castShadow>
            <boxGeometry args={[0.26, 0.14, 0.4]} />
          </mesh>
        </group>
      ))}

      {/* Buste : veste, chemise, cravate */}
      <RoundedBox args={[0.8, 0.7, 0.48]} radius={0.12} smoothness={3} position={[0, 0.98, 0]} material={suit} castShadow />
      <mesh position={[0, 1.13, 0.243]} material={mat(SHIRT, { flat: false })}>
        <shapeGeometry args={[vShape]} />
      </mesh>
      <mesh position={[0, 1.07, 0.25]} material={mat(TIE, { flat: false })} castShadow>
        <boxGeometry args={[0.075, 0.24, 0.02]} />
      </mesh>
      <mesh position={[0, 1.22, 0.25]} material={mat(TIE, { flat: false })}>
        <boxGeometry args={[0.09, 0.06, 0.03]} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.1, 1.12, 0.248]} rotation={[0, 0, s * 0.42]} material={mat(SUIT_DARK, { flat: false })}>
          <boxGeometry args={[0.05, 0.36, 0.02]} />
        </mesh>
      ))}
      {[0.86, 0.74].map((y) => (
        <mesh key={y} position={[0, y, 0.245]} material={mat(SUIT_DARK, { flat: false })}>
          <sphereGeometry args={[0.025, 8, 6]} />
        </mesh>
      ))}

      {/* Bras : manche, poignet de chemise, main */}
      {[
        { ref: armL, x: -0.47 },
        { ref: armR, x: 0.47 },
      ].map(({ ref, x }) => (
        <group key={x} ref={ref} position={[x, 1.24, 0]}>
          <RoundedBox args={[0.2, 0.56, 0.22]} radius={0.08} smoothness={2} position={[0, -0.27, 0]} material={suit} castShadow />
          <mesh position={[0, -0.56, 0]} material={mat(SHIRT, { flat: false })}>
            <cylinderGeometry args={[0.085, 0.085, 0.06, 10]} />
          </mesh>
          <mesh position={[0, -0.64, 0]} material={skin} castShadow>
            <sphereGeometry args={[0.1, 12, 10]} />
          </mesh>
        </group>
      ))}

      {/* Cou et col */}
      <mesh position={[0, 1.36, 0]} material={skin}>
        <cylinderGeometry args={[0.1, 0.11, 0.14, 10]} />
      </mesh>
      <mesh position={[0, 1.33, 0.01]} material={mat(SHIRT, { flat: false })}>
        <cylinderGeometry args={[0.135, 0.15, 0.07, 12]} />
      </mesh>

      {/* Tête */}
      <group ref={head} position={[0, 1.8, 0]}>
        <mesh material={skin} scale={[1, 0.95, 0.95]} castShadow>
          <sphereGeometry args={[0.48, 24, 18]} />
        </mesh>
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * 0.46, -0.03, 0]} scale={[0.55, 1, 0.8]} material={skin}>
            <sphereGeometry args={[0.1, 10, 8]} />
          </mesh>
        ))}
        <group ref={eyes} position={[0, 0.01, 0]}>
          {[-1, 1].map((s) => (
            <group key={s}>
              <mesh position={[s * 0.16, 0, 0.42]} scale={[1, 1.3, 0.55]} material={mat(EYES, { flat: false, roughness: 0.3 })}>
                <sphereGeometry args={[0.065, 12, 10]} />
              </mesh>
              <mesh position={[s * 0.16 + 0.022, 0.035, 0.452]} material={mat('#FFFFFF', { flat: false })}>
                <sphereGeometry args={[0.018, 8, 6]} />
              </mesh>
            </group>
          ))}
        </group>
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * 0.16, 0.14, 0.43]} rotation={[0, 0, s * -0.12]} material={mat(HAIR)}>
            <boxGeometry args={[0.15, 0.035, 0.03]} />
          </mesh>
        ))}
        <mesh position={[0, -0.07, 0.455]} material={mat(SKIN_SHADE, { flat: false })}>
          <sphereGeometry args={[0.045, 10, 8]} />
        </mesh>
        <mesh position={[0, -0.17, 0.42]} rotation={[0.15, 0, Math.PI]} material={mat('#6B2E22', { flat: false })}>
          <torusGeometry args={[0.07, 0.016, 6, 12, Math.PI]} />
        </mesh>

        {/* Cheveux : calotte + boucles */}
        <mesh position={[0, 0.06, -0.03]} rotation={[-0.35, 0, 0]} material={hair} castShadow>
          <sphereGeometry args={[0.5, 16, 10, 0, Math.PI * 2, 0, Math.PI * 0.42]} />
        </mesh>
        {curls.map((c, i) => (
          <mesh key={i} position={c.p} material={hair} castShadow>
            <icosahedronGeometry args={[c.r, 0]} />
          </mesh>
        ))}
      </group>
    </group>
  )
}
