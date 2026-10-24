import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import { sound } from './audio'
import { useStore } from './store'
import { Intro } from './ui/Intro'
import { QuickView } from './ui/QuickView'

// La 3D (three.js) est chargée à part : la version rapide s'affiche sans l'attendre.
const WorldView = lazy(() => import('./WorldView'))

const hasWebGL = (() => {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
})()

export default function App() {
  const view = useStore((s) => s.view)
  const started = useStore((s) => s.started)
  const soundOn = useStore((s) => s.sound)
  const lang = useStore((s) => s.lang)
  const [ready, setReady] = useState(false)
  const onReady = useCallback(() => setReady(true), [])

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  useEffect(() => {
    sound.setEnabled(soundOn)
  }, [soundOn])

  useEffect(() => {
    const onHash = () => useStore.getState().setView(location.hash === '#quick' ? 'quick' : 'world')
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const start = () => {
    if (soundOn) sound.unlock()
    useStore.getState().start()
  }

  if (view === 'quick' || !hasWebGL) return <QuickView notice={!hasWebGL} />

  return (
    <div className="app">
      <Suspense fallback={null}>
        <WorldView onReady={onReady} />
      </Suspense>
      {!started && <Intro ready={ready} onStart={start} />}
    </div>
  )
}
