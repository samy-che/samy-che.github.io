import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Politique de sécurité du contenu (CSP) : le site ne charge que ses propres fichiers.
 * GitHub Pages ne permet pas d'en-têtes HTTP personnalisés, d'où la balise <meta>.
 * blob: et 'unsafe-eval' sont nécessaires à la bibliothèque des textes 3D (troika),
 * qui exécute son code dans un worker créé à la volée.
 */
const CSP = [
  "default-src 'self'",
  "script-src 'self' blob: 'unsafe-eval'",
  "worker-src 'self' blob:",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self' data: blob:",
  "media-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'none'",
  'upgrade-insecure-requests',
].join('; ')

function contentSecurityPolicy(): Plugin {
  return {
    name: 'content-security-policy',
    // en développement, Vite injecte des scripts en ligne que cette politique bloquerait
    apply: 'build',
    transformIndexHtml: () => [
      { tag: 'meta', attrs: { 'http-equiv': 'Content-Security-Policy', content: CSP }, injectTo: 'head-prepend' },
    ],
  }
}

// base './' : le site fonctionne aussi bien à la racine d'un domaine que dans un sous-dossier (GitHub Pages).
export default defineConfig({
  plugins: [react(), contentSecurityPolicy()],
  base: './',
})
