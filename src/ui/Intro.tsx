import { profile } from '../content/profile'
import { ui } from '../content/ui'
import { isTouchDevice } from '../input'
import { useStore } from '../store'
import { useTr } from './common'
import { LangSwitch, SoundSwitch } from './controls'
import { IconBolt, IconCube } from './icons'

export function Intro({ ready, onStart }: { ready: boolean; onStart: () => void }) {
  const tr = useTr()
  const lang = useStore((s) => s.lang)
  const setView = useStore((s) => s.setView)
  const touch = isTouchDevice()
  return (
    <div className="intro">
      <div className="intro__card">
        <div className="intro__top">
          <span className="eyebrow">{tr(ui.eyebrow)}</span>
          <div className="intro__toggles">
            <LangSwitch />
            <SoundSwitch />
          </div>
        </div>
        <h1>{profile.name}</h1>
        <p className="intro__title">
          {tr(profile.title)} · {profile.company}
        </p>
        <p className="intro__tagline">{tr(profile.tagline)}</p>
        <p className="intro__text">{tr(ui.introText)}</p>
        <div className="intro__actions">
          <button className="btn btn--primary btn--big" onClick={onStart} disabled={!ready}>
            <IconCube />
            {ready ? tr(ui.startCta) : tr(ui.loading)}
          </button>
          <button className="btn btn--big" onClick={() => setView('quick')}>
            <IconBolt />
            <span>
              {tr(ui.quickCta)}
              <small>{tr(ui.quickHint)}</small>
            </span>
          </button>
        </div>
        <p className="intro__controls">
          {touch ? (
            tr(ui.controlsTouch)
          ) : (
            <>
              <kbd>{lang === 'fr' ? 'ZQSD' : 'WASD'}</kbd> / <kbd>↑←↓→</kbd> {tr(ui.controlsMove)} · <kbd>{lang === 'fr' ? 'Maj' : 'Shift'}</kbd> / <kbd>{lang === 'fr' ? 'Espace' : 'Space'}</kbd>{' '}
              {tr(ui.controlsRun)} · <kbd>E</kbd> {tr(ui.controlsInteract)}
            </>
          )}
        </p>
      </div>
    </div>
  )
}
