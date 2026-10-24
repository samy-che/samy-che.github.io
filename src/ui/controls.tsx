import { ui } from '../content/ui'
import { useStore } from '../store'
import { useTr } from './common'
import { IconMute, IconSound } from './icons'

export function LangSwitch() {
  const lang = useStore((s) => s.lang)
  const setLang = useStore((s) => s.setLang)
  return (
    <div className="seg" role="group" aria-label="Langue / Language">
      {(['fr', 'en'] as const).map((l) => (
        <button key={l} className={lang === l ? 'is-on' : ''} aria-pressed={lang === l} onClick={() => setLang(l)}>
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  )
}

export function SoundSwitch() {
  const tr = useTr()
  const on = useStore((s) => s.sound)
  const toggle = useStore((s) => s.toggleSound)
  return (
    <button className="icon-btn" onClick={toggle} aria-pressed={on} aria-label={tr(on ? ui.soundOn : ui.soundOff)} title={tr(on ? ui.soundOn : ui.soundOff)}>
      {on ? <IconSound /> : <IconMute />}
    </button>
  )
}
