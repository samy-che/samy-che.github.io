import { Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { ExtrudeGeometry, Shape, type Group, type Mesh } from 'three'
import { stations } from '../content/stations'
import { projects } from '../content/projects'
import { useStore } from '../store'
import { Arrow, Box, C, Cyl, FONT_BOLD, Sign, Windows, mat, unitBox } from './parts'
import { KIOSKS, MILESTONES, PLACES, PLAZA, SIGNPOST, groundHeight } from './layout'

const useLang = () => useStore((s) => s.lang)

/** Pignon ou fronton triangulaire de largeur w et hauteur h, extrudé sur d vers +z depuis `at`. */
function Gable({ w, h, d, at, color }: { w: number; h: number; d: number; at: [number, number, number]; color: string }) {
  const geometry = useMemo(() => {
    const s = new Shape()
    s.moveTo(-w / 2, 0)
    s.lineTo(w / 2, 0)
    s.lineTo(0, h)
    s.closePath()
    return new ExtrudeGeometry(s, { depth: d, bevelEnabled: false })
  }, [w, h, d])
  return <mesh geometry={geometry} position={at} material={mat(color)} castShadow receiveShadow />
}

// ---------------------------------------------------------------------------
// Départ : grand panneau d'accueil et poteau indicateur
// ---------------------------------------------------------------------------

function Start() {
  const lang = useLang()
  const p = PLACES.start
  return (
    <group position={[p.x, 0, p.z]}>
      <Box size={[0.4, 3.2, 0.4]} at={[-3.6, 0, 0]} color={C.woodDark} />
      <Box size={[0.4, 3.2, 0.4]} at={[3.6, 0, 0]} color={C.woodDark} />
      <Box size={[8.4, 3.4, 0.3]} at={[0, 1.6, 0]} color={C.navy} />
      <Text font={FONT_BOLD} fontSize={1.05} color={C.cream} position={[0, 3.95, 0.17]} anchorX="center" anchorY="middle">
        Samy Cherief
      </Text>
      <Text font={FONT_BOLD} fontSize={0.5} color={C.orangeSoft} position={[0, 2.85, 0.17]} anchorX="center" anchorY="middle">
        {lang === 'fr' ? 'Consultant SAP · KPMG France' : 'SAP Consultant · KPMG France'}
      </Text>
      <Text font={FONT_BOLD} fontSize={0.4} color={C.cream} fillOpacity={0.85} position={[1.25, 2.1, 0.17]} anchorX="right" anchorY="middle">
        {lang === 'fr' ? 'Suivez la route' : 'Follow the road'}
      </Text>
      <Arrow at={[1.75, 2.1, 0.17]} size={0.42} color={C.cream} />
      {/* Poteau indicateur au bord de la route */}
      <group position={[SIGNPOST.x - p.x, 0, SIGNPOST.z - p.z]}>
        <Box size={[0.25, 3, 0.25]} color={C.wood} />
        {[
          { y: 2.5, fr: 'Formation', en: 'Education', dir: 1 },
          { y: 1.9, fr: 'Expériences', en: 'Experience', dir: 1 },
          { y: 1.3, fr: 'Belvédère', en: 'Lookout', dir: 1 },
        ].map((a) => (
          <group key={a.fr} position={[0.95 * a.dir, a.y, 0.15]}>
            <mesh geometry={unitBox} material={mat(C.cream)} scale={[1.9, 0.45, 0.1]} castShadow />
            <mesh position={[1.05, 0, 0]} rotation={[0, 0, -Math.PI / 2]} material={mat(C.cream)} castShadow>
              <cylinderGeometry args={[0, 0.26, 0.25, 3]} />
            </mesh>
            <Text font={FONT_BOLD} fontSize={0.24} color={C.navy} position={[0, 0, 0.06]} anchorX="center" anchorY="middle">
              {a[lang]}
            </Text>
          </group>
        ))}
      </group>
    </group>
  )
}

// ---------------------------------------------------------------------------
// 1. Université de Picardie Jules Verne (Amiens) : brique et clocher gothique
// ---------------------------------------------------------------------------

function Amiens() {
  const lang = useLang()
  const p = PLACES.amiens
  const brick = '#D9805F'
  return (
    <group position={[p.x, 0, p.z]}>
      <Box size={[11, 5, 7]} color={brick} />
      <Box size={[11.4, 0.35, 7.4]} at={[0, 5, 0]} color={C.stone} />
      <Gable w={11.6} h={2.6} d={7.4} at={[0, 5.35, -3.7]} color={C.slate} />
      <Windows cols={4} rows={2} w={1.1} h={1.3} gapX={2.4} gapY={2.1} at={[0, 1.1, 3.51]} frame={C.stone} />
      {/* Porte en arc */}
      <Box size={[2.2, 2.6, 0.3]} at={[0, 0, 3.55]} color={C.stone} />
      <Box size={[1.5, 2.1, 0.32]} at={[0, 0, 3.6]} color={C.woodDark} />
      <Sign title={stations.amiens.sign[lang]} subtitle="Amiens · L1" at={[0, 3.55, 3.75]} width={6.6} size={0.5} />
      {/* Clocher façon cathédrale d'Amiens */}
      <group position={[7.4, 0, -0.5]}>
        <Box size={[3, 8, 3]} color={C.stone} />
        <Box size={[3.4, 0.4, 3.4]} at={[0, 8, 0]} color={C.stone} />
        <Windows cols={1} rows={2} w={0.8} h={1.6} gapX={0} gapY={3} at={[0, 2.4, 1.51]} color={C.glassDark} />
        <mesh position={[0, 8.4 + 2.6, 0]} material={mat(C.slate)} castShadow>
          <coneGeometry args={[1.7, 5.2, 4]} />
        </mesh>
      </group>
    </group>
  )
}

// ---------------------------------------------------------------------------
// 2. Université d'Évry Paris-Saclay : campus moderne en deux volumes
// ---------------------------------------------------------------------------

function Evry() {
  const lang = useLang()
  const p = PLACES.evry
  return (
    <group position={[p.x, 0, p.z]}>
      <Box size={[12, 4, 8]} color={C.cream} />
      <Box size={[12.1, 0.7, 8.1]} at={[0, 1.4, 0]} color={C.teal} />
      <Box size={[9, 3.6, 6.5]} at={[-1, 4, -0.5]} color={C.teal} />
      <Windows cols={5} rows={1} w={1.4} h={1.2} gapX={2.2} gapY={0} at={[-1, 4.9, 2.76]} color={C.glass} />
      <Windows cols={2} rows={1} w={2.4} h={1.1} gapX={7.6} gapY={0} at={[0, 2.5, 4.01]} color={C.glass} />
      {/* Panneaux solaires sur le toit */}
      {[-3.5, -1, 1.5].map((x) => (
        <mesh key={x} position={[x, 7.9, -1]} rotation={[-0.5, 0, 0]} material={mat('#3C4E7A', { roughness: 0.35 })} castShadow>
          <boxGeometry args={[2, 0.08, 1.4]} />
        </mesh>
      ))}
      <Box size={[3, 2.4, 0.3]} at={[0, 0, 4.02]} color={C.glassDark} />
      <Box size={[4, 0.25, 1.6]} at={[0, 2.5, 4.6]} color={C.cream} />
      <Sign title={stations.evry.sign[lang]} subtitle="Paris-Saclay · L2 – L3 MIAGE" at={[0, 3.25, 5.5]} width={6.8} size={0.48} />
    </group>
  )
}

// ---------------------------------------------------------------------------
// 3. Ministère de la Justice : bâtiment classique à colonnes et drapeau
// ---------------------------------------------------------------------------

function Flag({ at }: { at: [number, number, number] }) {
  const cloth = useRef<Group>(null)
  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    cloth.current!.children.forEach((c, i) => {
      c.rotation.y = Math.sin(t * 3 - i * 0.7) * 0.18
      c.position.z = Math.sin(t * 3 - i * 0.9) * 0.08 * i
    })
  })
  return (
    <group position={at}>
      <Cyl r={0.07} h={4.5} color={C.white} seg={6} />
      <group ref={cloth} position={[0, 3.6, 0]}>
        {['#2D4BA0', '#FFFFFF', '#D9453B'].map((c, i) => (
          <mesh key={c} position={[0.35 + i * 0.62, 0.38, 0]} material={mat(c, { flat: false })} castShadow>
            <boxGeometry args={[0.62, 0.78, 0.04]} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

function Ministere() {
  const lang = useLang()
  const p = PLACES.ministere
  return (
    <group position={[p.x, 0, p.z]}>
      {/* Soubassement à trois marches */}
      <Box size={[13.6, 0.25, 9.4]} color={C.stone} />
      <Box size={[13, 0.25, 8.8]} at={[0, 0.25, -0.2]} color={C.stone} />
      <Box size={[12.4, 0.25, 8.2]} at={[0, 0.5, -0.4]} color={C.stone} />
      <Box size={[11.6, 5.4, 6.6]} at={[0, 0.75, -1.2]} color="#F6EBD6" />
      <Box size={[12.2, 0.4, 7.2]} at={[0, 6.15, -1.2]} color={C.stone} />
      <Box size={[11, 1.4, 6]} at={[0, 6.55, -1.5]} color="#7C8BB0" />
      <Windows cols={2} rows={2} w={1} h={1.5} gapX={8.6} gapY={2.3} at={[0, 1.6, 2.11]} color={C.glassDark} frame={C.stone} />
      {/* Colonnes du portique */}
      {Array.from({ length: 6 }, (_, i) => (
        <group key={i} position={[-3.75 + i * 1.5, 0.75, 3.1]}>
          <Cyl r={0.32} h={0.25} color={C.stone} />
          <Cyl r={0.26} h={4.9} at={[0, 0.25, 0]} color={C.white} seg={10} />
          <Box size={[0.75, 0.25, 0.75]} at={[0, 5.15, 0]} color={C.stone} />
        </group>
      ))}
      <Box size={[9, 0.45, 2.2]} at={[0, 6.15, 3.1]} color={C.stone} />
      <Gable w={9.6} h={1.8} d={2.4} at={[0, 6.6, 2]} color={C.stone} />
      {/* Balance de la justice, dorée, sur le fronton */}
      <group position={[0, 7.25, 4.45]}>
        <Box size={[1.2, 0.06, 0.06]} at={[0, 0.3, 0]} material={mat(C.gold, { metalness: 0.4, roughness: 0.4 })} shadow={false} />
        <Box size={[0.06, 0.45, 0.06]} at={[0, 0, 0]} material={mat(C.gold, { metalness: 0.4, roughness: 0.4 })} shadow={false} />
        {[-0.55, 0.55].map((x) => (
          <mesh key={x} position={[x, 0.12, 0]} material={mat(C.gold, { metalness: 0.4, roughness: 0.4 })}>
            <cylinderGeometry args={[0.18, 0.1, 0.08, 8]} />
          </mesh>
        ))}
      </group>
      <Box size={[1.8, 3, 0.2]} at={[0, 0.75, 2.12]} color={C.woodDark} />
      <Sign title={stations.ministere.sign[lang]} subtitle={lang === 'fr' ? 'Stage AMOA · 2024' : 'AMOA internship · 2024'} at={[0, 0.95, 5.25]} width={6.6} size={0.46} />
      <Flag at={[6.2, 0.75, 3.4]} />
    </group>
  )
}

// ---------------------------------------------------------------------------
// 4. Université Paris Dauphine-PSL : longue barre moderne et toque de diplômé
// ---------------------------------------------------------------------------

function GradCap({ at }: { at: [number, number, number] }) {
  const ref = useRef<Group>(null)
  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    ref.current!.rotation.y = t * 0.5
    ref.current!.position.y = at[1] + Math.sin(t * 1.4) * 0.25
  })
  return (
    <group ref={ref} position={at}>
      <Cyl r={0.75} rTop={0.85} h={0.7} color={C.navy} seg={12} />
      <mesh position={[0, 0.78, 0]} rotation={[0, Math.PI / 4, 0]} material={mat(C.navy)} castShadow>
        <boxGeometry args={[2.3, 0.14, 2.3]} />
      </mesh>
      <mesh position={[0, 0.9, 0]} material={mat(C.gold)}>
        <sphereGeometry args={[0.1, 8, 6]} />
      </mesh>
      <mesh position={[0.75, 0.45, 0.75]} material={mat(C.gold)}>
        <cylinderGeometry args={[0.04, 0.09, 0.8, 6]} />
      </mesh>
    </group>
  )
}

function Dauphine() {
  const lang = useLang()
  const p = PLACES.dauphine
  return (
    <group position={[p.x, 0, p.z]}>
      <Box size={[15, 6.4, 7]} color="#F4F2EE" />
      {[1.2, 2.7, 4.2].map((y) => (
        <Box key={y} size={[14.2, 0.9, 0.1]} at={[0, y, 3.52]} color="#45597F" />
      ))}
      {Array.from({ length: 13 }, (_, i) => (
        <Box key={i} size={[0.12, 4.6, 0.14]} at={[-6.6 + i * 1.1, 0.9, 3.56]} color="#F4F2EE" shadow={false} />
      ))}
      <Box size={[15.4, 0.4, 7.4]} at={[0, 6.4, 0]} color="#E2DED6" />
      {/* Auvent bleu PSL */}
      <Box size={[5.2, 0.3, 2.4]} at={[0, 2.6, 4.4]} color="#2E4A8F" />
      <Cyl r={0.12} h={2.6} at={[-2, 0, 5]} color={C.white} seg={6} />
      <Cyl r={0.12} h={2.6} at={[2, 0, 5]} color={C.white} seg={6} />
      <Box size={[3, 2.4, 0.2]} at={[0, 0, 3.6]} color={C.glassDark} />
      <Sign title={stations.dauphine.sign[lang]} subtitle={lang === 'fr' ? 'Master MIAGE · 2024 – 2026' : "MIAGE Master's · 2024 – 2026"} at={[0, 3.6, 5.7]} width={7.2} size={0.5} />
      <GradCap at={[0, 8.6, 0]} />
    </group>
  )
}

// ---------------------------------------------------------------------------
// 5. Fastcube : un cube de données lumineux, baies serveurs et écran de supervision
// ---------------------------------------------------------------------------

function DataCube() {
  const orbit = useRef<Group>(null)
  const edges = useMemo(() => {
    const s = 4.55
    const list: { p: [number, number, number]; sc: [number, number, number] }[] = []
    for (const a of [-s, s]) for (const b of [-s, s]) {
      list.push({ p: [a, 4.5, b], sc: [0.14, 9.1, 0.14] })
      list.push({ p: [a, 4.5 + b, 0], sc: [0.14, 0.14, 9.1] })
      list.push({ p: [0, 4.5 + a, b], sc: [9.1, 0.14, 0.14] })
    }
    return list
  }, [])
  useFrame(({ clock }) => {
    orbit.current!.rotation.y = clock.elapsedTime * 0.35
    orbit.current!.children.forEach((c, i) => {
      c.position.y = 6 + Math.sin(clock.elapsedTime * 1.3 + i) * 1.2
      c.rotation.x = c.rotation.z = clock.elapsedTime * (0.5 + i * 0.1)
    })
  })
  const glow = mat('#58D6C9', { emissive: '#3FD0C0', emissiveIntensity: 0.9 })
  return (
    <group>
      <Box size={[9, 9, 9]} color="#2B3656" />
      {edges.map((e, i) => (
        <mesh key={i} geometry={unitBox} material={glow} position={e.p} scale={e.sc} />
      ))}
      {/* Lignes de données sur la façade */}
      {[2.2, 3.6, 5, 6.4].map((y, i) => (
        <mesh key={y} geometry={unitBox} material={glow} position={[-1 + (i % 2) * 1.6, y, 4.52]} scale={[4 + (i % 3), 0.08, 0.04]} />
      ))}
      <Box size={[2.2, 2.8, 0.2]} at={[0, 0, 4.52]} color={C.glassDark} />
      <group ref={orbit}>
        {[0, 1, 2, 3].map((i) => {
          const a = (i / 4) * Math.PI * 2
          return (
            <mesh key={i} position={[Math.cos(a) * 7, 6, Math.sin(a) * 7]} material={glow} castShadow>
              <boxGeometry args={[0.7, 0.7, 0.7]} />
            </mesh>
          )
        })}
      </group>
    </group>
  )
}

function Racks() {
  const leds = useRef<Mesh[]>([])
  useFrame(({ clock }) => {
    leds.current.forEach((m, i) => {
      m.material = Math.sin(clock.elapsedTime * (2 + (i % 5)) + i * 1.7) > 0.2 ? ledOn : ledOff
    })
  })
  return (
    <group>
      {[0, 1.4, 2.8].map((z, r) => (
        <group key={z} position={[0, 0, z - 1.4]}>
          <Box size={[1.2, 2.4, 1.2]} color="#39445F" />
          {Array.from({ length: 5 }, (_, i) => (
            <mesh
              key={i}
              ref={(m) => {
                if (m) leds.current[r * 5 + i] = m
              }}
              geometry={unitBox}
              material={ledOn}
              position={[0.61, 0.5 + i * 0.4, 0.3 - (i % 2) * 0.5]}
              scale={[0.04, 0.08, 0.16]}
            />
          ))}
        </group>
      ))}
    </group>
  )
}
const ledOn = mat('#7CF2B4', { emissive: '#5BE69A', emissiveIntensity: 1.4 })
const ledOff = mat('#2C4A3C')

function Dashboard() {
  const bars = useRef<Group>(null)
  useFrame(({ clock }) => {
    bars.current!.children.forEach((b, i) => {
      b.scale.y = 0.4 + Math.abs(Math.sin(clock.elapsedTime * 0.8 + i * 0.9)) * 1.1
    })
  })
  return (
    <group>
      <Box size={[0.2, 1.4, 0.2]} at={[-1.3, 0, 0]} color={C.slate} />
      <Box size={[0.2, 1.4, 0.2]} at={[1.3, 0, 0]} color={C.slate} />
      <Box size={[4, 2.6, 0.25]} at={[0, 1.3, 0]} color="#1C2238" />
      <group ref={bars} position={[-1.4, 1.65, 0.14]}>
        {Array.from({ length: 8 }, (_, i) => (
          <mesh key={i} geometry={unitBox} material={i === 5 ? mat('#F08A5D', { emissive: '#F08A5D', emissiveIntensity: 0.8 }) : mat('#73BF69', { emissive: '#73BF69', emissiveIntensity: 0.6 })} position={[i * 0.4, 0, 0]} scale={[0.26, 1, 0.04]} />
        ))}
      </group>
      <mesh geometry={unitBox} material={mat('#F2CC0C', { emissive: '#F2CC0C', emissiveIntensity: 0.6 })} position={[0, 3.45, 0.14]} scale={[3.5, 0.06, 0.04]} />
    </group>
  )
}

function Fastcube() {
  const lang = useLang()
  const p = PLACES.fastcube
  return (
    <group position={[p.x, 0, p.z]}>
      <DataCube />
      <Sign title={stations.fastcube.sign[lang]} subtitle="Data Management · 2025" at={[0, 3.6, 4.75]} width={5} size={0.55} color="#E9FBF8" />
      <group position={[7, 0, 1]}>
        <Racks />
      </group>
      <group position={[-7, 0, 1.5]}>
        <Dashboard />
      </group>
    </group>
  )
}

// ---------------------------------------------------------------------------
// 6. Labo Data Quality : la chaîne de contrôle des données mise en scène
// ---------------------------------------------------------------------------

/** Petits cubes de données sur un convoyeur ; certains échouent au contrôle et partent à la corbeille. */
function Conveyor() {
  const cubes = useRef<Group>(null)
  const alarm = useRef<Mesh>(null)
  const N = 6
  const bad = useMemo(() => [false, false, true, false, false, true], [])
  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    let alert = false
    cubes.current!.children.forEach((c, i) => {
      const m = c as Mesh
      const u = (t * 0.18 + i / N) % 1 // 0 → 1 le long du convoyeur, contrôle à mi-chemin
      if (bad[i] && u > 0.52) {
        // anomalie détectée : le cube saute dans la corbeille, devant le convoyeur
        const k = Math.min((u - 0.52) / 0.2, 1)
        m.position.set(0.13 + (BIN.x - 0.13) * k, 1.25 + Math.sin(k * Math.PI) * 1.1 - k * 0.4, BIN.z * k)
        m.visible = k < 1
        m.material = badMat
        if (k < 1) alert = true
      } else {
        m.position.set(-3.2 + u * 6.4, 1.25, 0)
        m.visible = true
        m.material = u > 0.5 ? goodMat : rawMat
      }
      m.rotation.y = t * 0.6 + i
    })
    alarm.current!.material = alert && Math.sin(t * 20) > 0 ? alarmOn : alarmOff
  })
  return (
    <group>
      {/* Bande et pieds */}
      <Box size={[6.8, 0.25, 1.2]} at={[0, 0.85, 0]} color="#59627E" />
      {[-3, -1, 1, 3].map((x) => (
        <Box key={x} size={[0.2, 0.85, 0.9]} at={[x, 0, 0]} color={C.slate} />
      ))}
      {/* Portique de contrôle */}
      <Box size={[0.25, 2.6, 0.25]} at={[-0.1, 0.85, -0.7]} color={C.navy} />
      <Box size={[0.25, 2.6, 0.25]} at={[-0.1, 0.85, 0.7]} color={C.navy} />
      <Box size={[0.4, 0.4, 1.7]} at={[-0.1, 3.3, 0]} color={C.navy} />
      <mesh position={[-0.1, 3.2, 0]} material={mat('#58D6C9', { emissive: '#3FD0C0', emissiveIntensity: 1 })}>
        <boxGeometry args={[0.1, 0.1, 1.4]} />
      </mesh>
      <mesh ref={alarm} position={[-0.1, 3.75, 0]} material={alarmOff}>
        <sphereGeometry args={[0.22, 10, 8]} />
      </mesh>
      <group ref={cubes}>
        {Array.from({ length: N }, (_, i) => (
          <mesh key={i} material={rawMat} castShadow>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
          </mesh>
        ))}
      </group>
      {/* Corbeille des anomalies */}
      <group position={[BIN.x, 0, BIN.z]}>
        <Cyl r={0.7} rTop={0.8} h={1} color="#C2564A" seg={8} />
      </group>
    </group>
  )
}
/** Position de la corbeille par rapport au convoyeur (le collider correspondant est dans layout.ts). */
const BIN = { x: 1.2, z: 1.5 }
const rawMat = mat('#B9C3D9')
const goodMat = mat('#73BF69', { emissive: '#3E8E3A', emissiveIntensity: 0.4 })
const badMat = mat('#E0574A', { emissive: '#B83A2F', emissiveIntensity: 0.5 })
const alarmOn = mat('#FF5A4A', { emissive: '#FF3B2E', emissiveIntensity: 2 })
const alarmOff = mat('#7A2E28')

function Lab() {
  const lang = useLang()
  const p = PLACES.lab
  const dish = useRef<Group>(null)
  useFrame(({ clock }) => {
    dish.current!.rotation.y = Math.sin(clock.elapsedTime * 0.4) * 0.8
  })
  return (
    <group position={[p.x, 0, p.z]}>
      <Box size={[10, 4.2, 7]} color="#CDEFE3" />
      <Box size={[10.3, 0.35, 7.3]} at={[0, 4.2, 0]} color={C.white} />
      <Box size={[8, 2.8, 0.2]} at={[0, 0.3, 3.51]} material={mat(C.glass, { roughness: 0.2, transparent: true, opacity: 0.85 })} />
      {[-4, -2, 0, 2, 4].map((x) => (
        <Box key={x} size={[0.14, 2.8, 0.26]} at={[x, 0.3, 3.55]} color={C.white} shadow={false} />
      ))}
      {/* Panneau sur le toit : règle en langage naturel → requête → contrôle validé */}
      <group position={[0, 4.55, 0.5]}>
        <Box size={[0.2, 1, 0.2]} at={[-2.6, 0, 0]} color={C.slate} />
        <Box size={[0.2, 1, 0.2]} at={[2.6, 0, 0]} color={C.slate} />
        <Box size={[6.6, 2, 0.25]} at={[0, 1, 0]} color="#1C2238" />
        <Text font={FONT_BOLD} fontSize={0.42} color="#F7D25C" position={[-1.95, 2.02, 0.14]} anchorX="center" anchorY="middle">
          {lang === 'fr' ? '« règle »' : '“rule”'}
        </Text>
        <Arrow at={[-0.6, 2.02, 0.14]} size={0.42} color="#58D6C9" />
        <Text font={FONT_BOLD} fontSize={0.42} color="#58D6C9" position={[0.2, 2.02, 0.14]} anchorX="center" anchorY="middle">
          VQL
        </Text>
        <Arrow at={[1.15, 2.02, 0.14]} size={0.42} color="#58D6C9" />
        <group position={[2.3, 2.02, 0.14]} rotation={[0, 0, 0]}>
          <mesh geometry={unitBox} material={goodMat} position={[-0.14, -0.08, 0]} rotation={[0, 0, Math.PI / 4]} scale={[0.32, 0.1, 0.04]} />
          <mesh geometry={unitBox} material={goodMat} position={[0.12, 0.04, 0]} rotation={[0, 0, -Math.PI / 3.2]} scale={[0.6, 0.1, 0.04]} />
        </group>
      </group>
      {/* Antenne d'alerte */}
      <group ref={dish} position={[3.8, 4.55, -2]}>
        <Cyl r={0.12} h={1.2} color={C.slate} seg={6} />
        <mesh position={[0, 1.4, 0.2]} rotation={[-0.9, 0, 0]} material={mat(C.white, { flat: false })} castShadow>
          <sphereGeometry args={[0.8, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2.6]} />
        </mesh>
      </group>
      <Sign title={stations.lab.sign[lang]} subtitle={lang === 'fr' ? 'IA · règles en langage naturel' : 'AI · rules in plain language'} at={[0, 3.4, 3.8]} width={6.2} size={0.48} />
      <group position={[-9, 0, 1.5]}>
        <Conveyor />
      </group>
    </group>
  )
}

// ---------------------------------------------------------------------------
// 7. KPMG France : la plus haute tour, visible de loin dès le début de la balade
// ---------------------------------------------------------------------------

function Tower({ at, w, h, color }: { at: [number, number, number]; w: number; h: number; color: string }) {
  return (
    <group position={at}>
      <Box size={[w, h, w]} material={mat(color, { roughness: 0.35 })} />
      {Array.from({ length: Math.floor(h / 2.2) }, (_, i) => (
        <Box key={i} size={[w + 0.06, 0.12, w + 0.06]} at={[0, 1.6 + i * 2.2, 0]} color="#E8EEF7" shadow={false} />
      ))}
    </group>
  )
}

function Kpmg() {
  const lang = useLang()
  const p = PLACES.kpmg
  const beacon = useRef<Mesh>(null)
  useFrame(({ clock }) => {
    beacon.current!.material = Math.sin(clock.elapsedTime * 3) > 0.6 ? alarmOn : alarmOff
  })
  return (
    <group position={[p.x, 0, p.z]}>
      <Box size={[9, 3.2, 8]} color="#E9EEF6" />
      <Box size={[7.4, 2.6, 0.2]} at={[0, 0, 4.01]} material={mat(C.glass, { roughness: 0.2 })} />
      <Tower at={[0, 3.2, -0.5]} w={6.6} h={21} color="#4D7BD6" />
      <Box size={[4.6, 1.6, 4.6]} at={[0, 24.2, -0.5]} color="#E9EEF6" />
      <Cyl r={0.08} h={3} at={[0, 25.8, -0.5]} color={C.white} seg={6} />
      <mesh ref={beacon} position={[0, 28.9, -0.5]} material={alarmOff}>
        <sphereGeometry args={[0.2, 8, 6]} />
      </mesh>
      <Sign title={stations.kpmg.sign[lang]} subtitle={lang === 'fr' ? 'Consultant SAP · depuis 2026' : 'SAP Consultant · since 2026'} at={[0, 4.05, 2.95]} width={5.8} size={0.5} />
      {/* Quelques tours voisines, façon quartier d'affaires */}
      <Tower at={[-9, 0, -9]} w={4} h={13} color="#8FA6CF" />
      <Tower at={[9, 0, -10]} w={5} h={16} color="#7E95C4" />
      <Tower at={[-18, 0, -11]} w={3.6} h={9} color="#A7B7D6" />
    </group>
  )
}

// ---------------------------------------------------------------------------
// 8. Place des projets : une fontaine et un kiosque par projet
// ---------------------------------------------------------------------------

const awnings = ['#EE7B30', '#4FA59A', '#7B6CC0', '#E9B44C', '#D9534A', '#4D7BD6']

function Kiosk({ color, label }: { color: string; label: string }) {
  return (
    <group>
      <Box size={[2.4, 1.1, 1.3]} color={C.cream} />
      <Box size={[2.5, 0.12, 1.4]} at={[0, 1.1, 0]} color={C.wood} />
      {[-1.1, 1.1].map((x) => (
        <Box key={x} size={[0.12, 1.5, 0.12]} at={[x, 1.1, -0.55]} color={C.woodDark} />
      ))}
      {/* Store rayé */}
      {Array.from({ length: 5 }, (_, i) => (
        <mesh
          key={i}
          geometry={unitBox}
          material={mat(i % 2 ? C.white : color)}
          position={[-1.04 + i * 0.52, 2.55, 0]}
          rotation={[0.35, 0, 0]}
          scale={[0.52, 0.08, 1.6]}
          castShadow
        />
      ))}
      <group position={[0, 1.55, 0.72]}>
        <mesh geometry={unitBox} material={mat(C.cream)} scale={[2.3, 0.5, 0.06]} />
        <Text font={FONT_BOLD} fontSize={0.2} color={C.navy} position={[0, 0, 0.04]} anchorX="center" anchorY="middle" maxWidth={2.2} textAlign="center">
          {label}
        </Text>
      </group>
    </group>
  )
}

function Fountain() {
  const water = useRef<Mesh>(null)
  useFrame(({ clock }) => {
    const s = 1 + Math.sin(clock.elapsedTime * 2.2) * 0.08
    water.current!.scale.set(1, s, 1)
  })
  return (
    <group>
      <Cyl r={1.9} h={0.55} color={C.stone} seg={12} />
      <Cyl r={1.6} h={0.06} at={[0, 0.5, 0]} material={mat('#8CCFE0', { roughness: 0.15, flat: false })} seg={12} />
      <Cyl r={0.25} h={1.5} at={[0, 0.5, 0]} color={C.stone} seg={8} />
      <mesh ref={water} position={[0, 2.05, 0]} material={mat('#A7DDEB', { roughness: 0.1, transparent: true, opacity: 0.8 })}>
        <coneGeometry args={[0.55, 0.9, 8]} />
      </mesh>
    </group>
  )
}

function Projects() {
  const lang = useLang()
  const shortNames = projects.map((pr) => pr.name)
  return (
    <group>
      <mesh position={[PLAZA.x, 0.03, PLAZA.z + 0.5]} rotation={[-Math.PI / 2, 0, 0]} material={mat(C.road)} receiveShadow>
        <circleGeometry args={[PLAZA.r, 24]} />
      </mesh>
      <mesh position={[PLAZA.x, 0.035, PLAZA.z + 0.5]} rotation={[-Math.PI / 2, 0, 0]} material={mat(C.roadEdge)} receiveShadow>
        <ringGeometry args={[PLAZA.r - 0.5, PLAZA.r, 24]} />
      </mesh>
      <group position={[PLAZA.x, 0, PLAZA.z + 0.5]}>
        <Fountain />
      </group>
      {KIOSKS.map((k, i) => (
        <group key={i} position={[k.x, 0, k.z]} rotation={[0, k.yaw, 0]}>
          <Kiosk color={awnings[i]} label={shortNames[i] ?? ''} />
        </group>
      ))}
      <group position={[PLAZA.x - 7.5, 0, PLAZA.z + 7.2]}>
        <Box size={[0.2, 2.3, 0.2]} color={C.woodDark} />
        <Sign title={stations.projects.sign[lang]} subtitle="GitHub · samy-che" at={[0, 2.6, 0.12]} width={4.6} size={0.42} />
      </group>
    </group>
  )
}

// ---------------------------------------------------------------------------
// 9. Le Belvédère : kiosque, longue-vue, banc, boîte aux lettres et trophées
// ---------------------------------------------------------------------------

function Lookout() {
  const lang = useLang()
  const p = PLACES.lookout
  const y = (dx: number, dz: number) => groundHeight(p.x + dx, p.z + dz)
  return (
    <group position={[p.x, 0, p.z]}>
      {/* Kiosque à six colonnes */}
      <group position={[0, y(0, 0), 0]}>
        <Cyl r={3.3} h={0.3} color={C.stone} seg={6} />
        {Array.from({ length: 6 }, (_, i) => {
          const a = (i / 6) * Math.PI * 2 + Math.PI / 6
          return <Cyl key={i} r={0.16} h={3.2} at={[Math.cos(a) * 2.8, 0.3, Math.sin(a) * 2.8]} color={C.white} seg={6} />
        })}
        <mesh position={[0, 4.4, 0]} material={mat(C.orange)} castShadow>
          <coneGeometry args={[3.8, 1.9, 6]} />
        </mesh>
        <mesh position={[0, 5.5, 0]} material={mat(C.gold)}>
          <sphereGeometry args={[0.22, 8, 6]} />
        </mesh>
      </group>
      {/* Longue-vue tournée vers la ville */}
      <group position={[4.2, y(4.2, -1.2), -1.2]} rotation={[0, -2.2, 0]}>
        <Cyl r={0.08} h={1.1} color={C.navy} seg={6} />
        <mesh position={[0, 1.25, 0.2]} rotation={[1.2, 0, 0]} material={mat(C.navy)} castShadow>
          <cylinderGeometry args={[0.16, 0.11, 1.1, 8]} />
        </mesh>
      </group>
      {/* Banc */}
      <group position={[-4.6, y(-4.6, 0.6), 0.6]}>
        <Box size={[2.2, 0.12, 0.6]} at={[0, 0.45, 0]} color={C.wood} />
        <Box size={[2.2, 0.5, 0.1]} at={[0, 0.6, -0.28]} color={C.wood} />
        {[-0.9, 0.9].map((x) => (
          <Box key={x} size={[0.1, 0.45, 0.5]} at={[x, 0, 0]} color={C.woodDark} />
        ))}
      </group>
      {/* Boîte aux lettres : le contact */}
      <group position={[3.6, y(3.6, 3), 3]}>
        <Box size={[0.14, 1.1, 0.14]} color={C.woodDark} />
        <Box size={[0.7, 0.55, 0.9]} at={[0, 1.1, 0]} color={C.orange} />
        <mesh position={[0, 1.65, 0]} rotation={[0, 0, Math.PI / 2]} material={mat(C.orange)} castShadow>
          <cylinderGeometry args={[0.35, 0.35, 0.7, 10, 1, false, 0, Math.PI]} />
        </mesh>
        <Box size={[0.06, 0.5, 0.06]} at={[0.38, 1.2, 0.2]} color={C.red} />
      </group>
      <Sign title={stations.lookout.sign[lang]} subtitle={lang === 'fr' ? 'Et maintenant ? · Contact' : "What's next? · Contact"} at={[-1.5, y(-1.5, 5.2) + 1.6, 5.2]} width={5} size={0.48} />
      <Box size={[0.2, 1.6, 0.2]} at={[-1.5, y(-1.5, 5.2), 5.1]} color={C.woodDark} />
    </group>
  )
}

/** Bornes kilométriques : la route sert aussi de frise chronologique. */
function Milestones() {
  return (
    <group>
      {MILESTONES.map(({ id, x, z }) => (
        <group key={id} position={[x, 0, z]}>
          <Box size={[1.1, 1.3, 0.5]} color={C.white} />
          <Box size={[1.1, 0.35, 0.52]} at={[0, 1.3, 0]} color={C.orange} />
          <Text font={FONT_BOLD} fontSize={0.36} color={C.navy} position={[0, 0.75, 0.27]} anchorX="center" anchorY="middle">
            {stations[id].year}
          </Text>
        </group>
      ))}
    </group>
  )
}

export function Buildings() {
  return (
    <group>
      <Start />
      <Amiens />
      <Evry />
      <Ministere />
      <Dauphine />
      <Fastcube />
      <Lab />
      <Kpmg />
      <Projects />
      <Lookout />
      <Milestones />
    </group>
  )
}
