import { Text } from '@react-three/drei'
import { BoxGeometry, MeshStandardMaterial, type Euler } from 'three'
import fredoka600 from '@fontsource/fredoka/files/fredoka-latin-600-normal.woff?url'
import fredoka500 from '@fontsource/fredoka/files/fredoka-latin-500-normal.woff?url'

export const FONT_BOLD = fredoka600
export const FONT_REGULAR = fredoka500

/** Palette de la ville : tons chauds et pastel, accents orange et bleu nuit. */
export const C = {
  bg: '#F6E7D3',
  grass: '#A8CF8E',
  grassDark: '#93C07A',
  earth: '#D99A66',
  earthDark: '#B87650',
  road: '#EADFCB',
  roadEdge: '#D7C8AE',
  roadLine: '#FFF8EC',
  cream: '#FFF6E8',
  stone: '#F1E4CB',
  navy: '#222B45',
  orange: '#EE7B30',
  orangeSoft: '#F6A86B',
  teal: '#4FA59A',
  glass: '#A9D8E6',
  glassDark: '#6FA9C4',
  wood: '#B97A4F',
  woodDark: '#8C5A3A',
  white: '#FFFFFF',
  slate: '#6C7392',
  gold: '#E9B44C',
  red: '#D9534A',
}

type MatOptions = {
  emissive?: string
  emissiveIntensity?: number
  roughness?: number
  metalness?: number
  transparent?: boolean
  opacity?: number
  flat?: boolean
}

const cache = new Map<string, MeshStandardMaterial>()

/** Matériaux partagés : une seule instance par couleur et réglage. */
export function mat(color: string, o: MatOptions = {}) {
  const key = color + JSON.stringify(o)
  let m = cache.get(key)
  if (!m) {
    m = new MeshStandardMaterial({
      color,
      roughness: o.roughness ?? 0.85,
      metalness: o.metalness ?? 0,
      flatShading: o.flat ?? true,
      emissive: o.emissive ?? '#000000',
      emissiveIntensity: o.emissiveIntensity ?? 1,
      transparent: o.transparent ?? false,
      opacity: o.opacity ?? 1,
    })
    cache.set(key, m)
  }
  return m
}

export const unitBox = new BoxGeometry(1, 1, 1)

type V3 = [number, number, number]

/** Boîte posée : `position` désigne le centre de la base (pratique pour empiler). */
export function Box({
  size,
  at = [0, 0, 0],
  color,
  material,
  rotation,
  shadow = true,
}: {
  size: V3
  at?: V3
  color?: string
  material?: MeshStandardMaterial
  rotation?: V3 | Euler
  shadow?: boolean
}) {
  return (
    <mesh
      geometry={unitBox}
      material={material ?? mat(color ?? C.cream)}
      position={[at[0], at[1] + size[1] / 2, at[2]]}
      rotation={rotation}
      scale={size}
      castShadow={shadow}
      receiveShadow
    />
  )
}

/** Cylindre posé (centre de la base). */
export function Cyl({
  r,
  rTop,
  h,
  at = [0, 0, 0],
  color,
  material,
  seg = 8,
  shadow = true,
}: {
  r: number
  rTop?: number
  h: number
  at?: V3
  color?: string
  material?: MeshStandardMaterial
  seg?: number
  shadow?: boolean
}) {
  return (
    <mesh position={[at[0], at[1] + h / 2, at[2]]} material={material ?? mat(color ?? C.cream)} castShadow={shadow} receiveShadow>
      <cylinderGeometry args={[rTop ?? r, r, h, seg]} />
    </mesh>
  )
}

/** Enseigne en façade : plaque crème et texte bleu nuit, face à la caméra. */
export function Sign({
  title,
  subtitle,
  at,
  width,
  color = C.cream,
  ink = C.navy,
  size = 0.62,
}: {
  title: string
  subtitle?: string
  at: V3
  width: number
  color?: string
  ink?: string
  size?: number
}) {
  const h = subtitle ? size * 2.3 : size * 1.7
  return (
    <group position={at}>
      <mesh geometry={unitBox} material={mat(color)} scale={[width, h, 0.18]} castShadow />
      <Text
        font={FONT_BOLD}
        fontSize={size}
        color={ink}
        anchorX="center"
        anchorY="middle"
        position={[0, subtitle ? size * 0.42 : 0, 0.1]}
        maxWidth={width - 0.4}
      >
        {title}
      </Text>
      {subtitle && (
        <Text
          font={FONT_REGULAR}
          fontSize={size * 0.55}
          color={ink}
          fillOpacity={0.75}
          anchorX="center"
          anchorY="middle"
          position={[0, -size * 0.6, 0.1]}
          maxWidth={width - 0.4}
        >
          {subtitle}
        </Text>
      )}
    </group>
  )
}

/** Rangée de fenêtres sur une façade orientée vers +z. */
export function Windows({
  cols,
  rows,
  w,
  h,
  gapX,
  gapY,
  at,
  color = C.glass,
  frame,
}: {
  cols: number
  rows: number
  w: number
  h: number
  gapX: number
  gapY: number
  at: V3
  color?: string
  frame?: string
}) {
  const items = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = at[0] + (c - (cols - 1) / 2) * gapX
      const y = at[1] + r * gapY
      items.push(
        <group key={`${r}-${c}`} position={[x, y, at[2]]}>
          {frame && <mesh geometry={unitBox} material={mat(frame)} scale={[w + 0.18, h + 0.18, 0.08]} position={[0, h / 2, 0]} />}
          <mesh geometry={unitBox} material={mat(color, { roughness: 0.3 })} scale={[w, h, 0.1]} position={[0, h / 2, 0.02]} />
        </group>,
      )
    }
  }
  return <>{items}</>
}
