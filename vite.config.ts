import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' : le site fonctionne aussi bien à la racine d'un domaine que dans un sous-dossier (GitHub Pages).
export default defineConfig({
  plugins: [react()],
  base: './',
})
