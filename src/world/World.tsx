import { Canvas, useThree } from '@react-three/fiber'
import { Suspense, useEffect } from 'react'
import { Buildings } from './Buildings'
import { Decor } from './Decor'
import { Ground } from './Ground'
import { Badges, Guide } from './Markers'
import { C } from './parts'
import { Player } from './Player'
import { Secrets } from './Secrets'

/** Monté une fois que tout le contenu suspendu (polices des enseignes) est prêt. */
function Ready({ onReady }: { onReady: () => void }) {
  const three = useThree()
  useEffect(() => {
    const id = requestAnimationFrame(onReady)
    if (import.meta.env.DEV) Object.assign(window, { __three: three })
    return () => cancelAnimationFrame(id)
  }, [onReady, three])
  return null
}

export function World({ onReady }: { onReady: () => void }) {
  return (
    <Canvas
      className="world-canvas"
      shadows="percentage"
      flat
      dpr={[1, 1.5]}
      camera={{ fov: 40, near: 0.5, far: 420, position: [0, 72, 80] }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
    >
      <color attach="background" args={[C.bg]} />
      <fog attach="fog" args={[C.bg, 90, 230]} />
      <hemisphereLight args={['#FFF4E4', '#A9C493', 1.9]} />
      <Suspense fallback={null}>
        <Ground />
        <Buildings />
        <Decor />
        <Secrets />
        <Badges />
        <Guide />
        <Ready onReady={onReady} />
      </Suspense>
      <Player />
    </Canvas>
  )
}
