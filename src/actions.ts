import { sound } from './audio'
import { interests } from './content/profile'
import { skillsByStation } from './content/skills'
import { ui } from './content/ui'
import type { SecretId, StationId } from './content/types'
import { useStore } from './store'
import { arcade, collectedAt, player } from './world/shared'

/** Première visite d'une étape : on débloque ses badges et on le fête. */
export function onFirstVisit(id: StationId, clockTime: number) {
  const s = useStore.getState()
  const list = skillsByStation(id)
  if (!list.length) return
  collectedAt[id] = clockTime
  player.hopAt = clockTime
  sound.pickup()
  const names = list.slice(0, 3).map((k) => k.label[s.lang])
  s.toast({
    tone: 'skill',
    title: `+${list.length} ${ui.skillsUnlocked[s.lang]}`,
    text: names.join(' · ') + (list.length > 3 ? ' …' : ''),
  })
}

export function discoverSecret(id: SecretId) {
  const s = useStore.getState()
  if (!s.findSecret(id)) return
  sound.secret()
  const secret = interests.find((i) => i.id === id)!
  s.toast({
    tone: 'secret',
    title: `${ui.secretFound[s.lang]} · ${useStore.getState().secrets.length}/3`,
    text: secret.secret[s.lang],
  })
}

export function playArcade() {
  arcade.playedAt = performance.now() / 1000
  sound.arcade()
  setTimeout(() => discoverSecret('arcade'), 500)
}

/** Touche E, Entrée ou bouton tactile : ouvrir l'étape proche ou jouer à la borne. */
export function interact() {
  const s = useStore.getState()
  if (!s.started || s.view !== 'world') return
  if (s.near && s.open !== s.near) {
    s.openStation(s.near)
    sound.open()
  } else if (s.nearArcade) {
    playArcade()
  }
}
