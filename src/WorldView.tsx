import { useEffect } from 'react'
import { interact } from './actions'
import { sound } from './audio'
import { bindKeyboard } from './input'
import { useStore } from './store'
import { Hud } from './ui/Hud'
import { StationPanel } from './ui/StationPanel'
import { World } from './world/World'

/**
 * Tout ce qui dépend de three.js : la scène, l'interface de jeu et les raccourcis clavier.
 * Ce module est chargé à part, pour que la version rapide s'affiche sans l'attendre.
 */
export default function WorldView({ onReady }: { onReady: () => void }) {
  const started = useStore((s) => s.started)

  useEffect(() => {
    const unbind = bindKeyboard()
    const onKey = (e: KeyboardEvent) => {
      const s = useStore.getState()
      if (e.key === 'Escape') {
        if (s.overlay) s.setOverlay(null)
        else if (s.open) {
          sound.close()
          s.closeStation()
        }
        return
      }
      const target = e.target instanceof Element ? e.target : null
      if (target?.closest('input, textarea, select')) return
      // Entrée garde son rôle normal sur un bouton ou un lien ; E fonctionne partout
      const enter = e.key === 'Enter' && !target?.closest('button, a')
      if (e.key === 'e' || e.key === 'E' || enter) {
        e.preventDefault()
        interact()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      unbind()
      window.removeEventListener('keydown', onKey)
    }
  }, [])

  return (
    <>
      <World onReady={onReady} />
      {started && (
        <>
          <Hud />
          <StationPanel />
        </>
      )}
    </>
  )
}
