import { create } from 'zustand'
import type { Lang, SecretId, StationId } from './content/types'

const read = (key: string) => {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}
const write = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value)
  } catch {
    /* stockage indisponible : la préférence ne sera simplement pas mémorisée */
  }
}

const initialLang = (): Lang => {
  const saved = read('pf-lang')
  if (saved === 'fr' || saved === 'en') return saved
  return navigator.language?.toLowerCase().startsWith('fr') ? 'fr' : 'en'
}

export type Overlay = null | 'route' | 'skills'
export type View = 'world' | 'quick'

export interface Toast {
  id: number
  title: string
  text?: string
  tone: 'skill' | 'secret' | 'info'
}

interface State {
  lang: Lang
  view: View
  started: boolean
  sound: boolean
  near: StationId | null
  nearArcade: boolean
  open: StationId | null
  overlay: Overlay
  visited: StationId[]
  secrets: SecretId[]
  autopilot: StationId | null
  toasts: Toast[]
  revealAll: boolean
  setLang: (lang: Lang) => void
  setView: (view: View) => void
  start: () => void
  toggleSound: () => void
  setNear: (id: StationId | null) => void
  setNearArcade: (near: boolean) => void
  openStation: (id: StationId) => void
  closeStation: () => void
  setOverlay: (overlay: Overlay) => void
  visit: (id: StationId) => boolean
  findSecret: (id: SecretId) => boolean
  goTo: (id: StationId) => void
  stopAutopilot: () => void
  toast: (toast: Omit<Toast, 'id'>) => void
  dismissToast: (id: number) => void
  setRevealAll: (on: boolean) => void
}

let toastId = 0

export const useStore = create<State>((set, get) => ({
  lang: initialLang(),
  view: location.hash === '#quick' ? 'quick' : 'world',
  started: false,
  sound: read('pf-sound') !== 'off',
  near: null,
  nearArcade: false,
  open: null,
  overlay: null,
  visited: [],
  secrets: [],
  autopilot: null,
  toasts: [],
  revealAll: false,

  setLang: (lang) => {
    write('pf-lang', lang)
    document.documentElement.lang = lang
    set({ lang })
  },
  setView: (view) => {
    if (view === 'quick') history.replaceState(null, '', '#quick')
    else history.replaceState(null, '', location.pathname + location.search)
    set({ view, open: null, overlay: null, autopilot: null })
  },
  start: () => set({ started: true }),
  toggleSound: () => {
    const sound = !get().sound
    write('pf-sound', sound ? 'on' : 'off')
    set({ sound })
  },
  setNear: (near) => set({ near }),
  setNearArcade: (nearArcade) => set({ nearArcade }),
  openStation: (open) => set({ open, overlay: null }),
  closeStation: () => set({ open: null }),
  setOverlay: (overlay) => set({ overlay }),
  visit: (id) => {
    if (get().visited.includes(id)) return false
    set({ visited: [...get().visited, id] })
    return true
  },
  findSecret: (id) => {
    if (get().secrets.includes(id)) return false
    set({ secrets: [...get().secrets, id] })
    return true
  },
  goTo: (autopilot) => set({ autopilot, open: null, overlay: null }),
  stopAutopilot: () => set({ autopilot: null }),
  toast: (toast) => {
    const id = ++toastId
    set({ toasts: [...get().toasts.slice(-2), { ...toast, id }] })
    setTimeout(() => get().dismissToast(id), 4200)
  },
  dismissToast: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),
  setRevealAll: (revealAll) => set({ revealAll }),
}))
