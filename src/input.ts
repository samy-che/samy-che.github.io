/**
 * État des commandes, lu à chaque frame par le personnage.
 * Les déplacements utilisent `event.code` (position physique de la touche) :
 * ZQSD sur un clavier AZERTY et WASD sur un QWERTY donnent les mêmes codes.
 */
export const input = {
  up: false,
  down: false,
  left: false,
  right: false,
  run: false,
  /** Vecteur du joystick tactile, x vers la droite, y vers le haut, longueur ≤ 1. */
  joy: { x: 0, y: 0 },
}

const bindings: Record<string, 'up' | 'down' | 'left' | 'right' | 'run'> = {
  KeyW: 'up',
  ArrowUp: 'up',
  KeyS: 'down',
  ArrowDown: 'down',
  KeyA: 'left',
  ArrowLeft: 'left',
  KeyD: 'right',
  ArrowRight: 'right',
  ShiftLeft: 'run',
  ShiftRight: 'run',
}

export const isMovementKey = (code: string) => code in bindings && bindings[code] !== 'run'

export function bindKeyboard() {
  const onDown = (e: KeyboardEvent) => {
    const action = bindings[e.code]
    if (!action) return
    input[action] = true
    if (e.code.startsWith('Arrow')) e.preventDefault()
  }
  const onUp = (e: KeyboardEvent) => {
    const action = bindings[e.code]
    if (action) input[action] = false
  }
  const reset = () => {
    input.up = input.down = input.left = input.right = input.run = false
  }
  window.addEventListener('keydown', onDown)
  window.addEventListener('keyup', onUp)
  window.addEventListener('blur', reset)
  return () => {
    window.removeEventListener('keydown', onDown)
    window.removeEventListener('keyup', onUp)
    window.removeEventListener('blur', reset)
  }
}

export const isTouchDevice = () =>
  typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
