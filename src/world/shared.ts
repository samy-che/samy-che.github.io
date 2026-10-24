import { Vector3 } from 'three'
import { CHESS_PIECES } from './layout'

/**
 * État partagé entre le personnage et le décor, mis à jour à chaque frame sans passer par React
 * (pour ne pas déclencher de rendu à 60 images par seconde).
 */
export const player = {
  position: new Vector3(),
  velocity: new Vector3(),
  /** Horodatage (secondes, horloge three) du dernier petit saut de joie. */
  hopAt: -10,
  /** Fin du salut de la main au démarrage. */
  waveUntil: 0,
}

/** Sac de frappe : pendule amorti autour de deux axes. */
export const bag = { ax: 0, az: 0, vx: 0, vz: 0, lastHit: -10 }

/** Inclinaison et vitesse de chaque pièce d'échecs quand on la bouscule. */
export const chessWobble = CHESS_PIECES.map(() => ({ tx: 0, tz: 0, vx: 0, vz: 0, lastHit: -10 }))

/** Borne d'arcade : instant du dernier « coup de jeu », pour l'animation de l'écran. */
export const arcade = { playedAt: -10 }

/** Instant de collecte des badges, par étape. */
export const collectedAt: Partial<Record<string, number>> = {}
