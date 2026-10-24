import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/fredoka/500.css'
import '@fontsource/fredoka/600.css'
import '@fontsource/nunito/400.css'
import '@fontsource/nunito/600.css'
import '@fontsource/nunito/700.css'
import '@fontsource/nunito/800.css'
import './styles.css'
import App from './App'

// Outils de test, uniquement en développement (absents du site publié)
if (import.meta.env.DEV) {
  void Promise.all([import('./store'), import('./world/shared')]).then(([{ useStore }, { player }]) => {
    Object.assign(window, { __pf: { useStore, player } })
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
