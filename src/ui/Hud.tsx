import { useEffect, useRef, useState } from 'react'
import { interact } from '../actions'
import { sound } from '../audio'
import { profile } from '../content/profile'
import { categoryLabels, categoryOrder, skills } from '../content/skills'
import { stationOrder, stations } from '../content/stations'
import { ui } from '../content/ui'
import { input, isTouchDevice } from '../input'
import { useStore } from '../store'
import { LevelLegend, SkillChip, useTr } from './common'
import { LangSwitch, SoundSwitch } from './controls'
import { IconArrow, IconBag, IconBolt, IconCheck, IconClose, IconMap } from './icons'

const chapterCount = stationOrder.length - 1

function TopBar() {
  const tr = useTr()
  const visited = useStore((s) => s.visited)
  const overlay = useStore((s) => s.overlay)
  const setOverlay = useStore((s) => s.setOverlay)
  const setView = useStore((s) => s.setView)
  const unlocked = skills.filter((k) => visited.includes(k.station)).length
  const visitedChapters = visited.filter((v) => v !== 'start').length
  return (
    <header className="topbar">
      <div className="brand">
        <span className="brand__name">{profile.name}</span>
        <span className="brand__title">{tr(profile.title)}</span>
      </div>
      <nav className="topbar__actions">
        <button className={`pill ${overlay === 'route' ? 'is-on' : ''}`} onClick={() => setOverlay(overlay === 'route' ? null : 'route')} aria-expanded={overlay === 'route'}>
          <IconMap />
          <span className="pill__label">{tr(ui.route)}</span>
          <span className="pill__count">
            {visitedChapters}/{chapterCount}
          </span>
        </button>
        <button className={`pill ${overlay === 'skills' ? 'is-on' : ''}`} onClick={() => setOverlay(overlay === 'skills' ? null : 'skills')} aria-expanded={overlay === 'skills'}>
          <IconBag />
          <span className="pill__label">{tr(ui.skills)}</span>
          <span className="pill__count">
            {unlocked}/{skills.length}
          </span>
        </button>
        <button className="pill pill--accent" onClick={() => setView('quick')}>
          <IconBolt />
          <span className="pill__label">{tr(ui.quickCta)}</span>
        </button>
        <LangSwitch />
        <SoundSwitch />
      </nav>
    </header>
  )
}

function Toasts() {
  const toasts = useStore((s) => s.toasts)
  const dismiss = useStore((s) => s.dismissToast)
  return (
    <div className="toasts" aria-live="polite">
      {toasts.map((t) => (
        <button key={t.id} className={`toast toast--${t.tone}`} onClick={() => dismiss(t.id)}>
          <strong>{t.title}</strong>
          {t.text && <span>{t.text}</span>}
        </button>
      ))}
    </div>
  )
}

/** Bas de l'écran : invite à découvrir l'étape proche, sinon la prochaine étape à rejoindre. */
function BottomBar({ touch }: { touch: boolean }) {
  const tr = useTr()
  const near = useStore((s) => s.near)
  const nearArcade = useStore((s) => s.nearArcade)
  const open = useStore((s) => s.open)
  const visited = useStore((s) => s.visited)
  const autopilot = useStore((s) => s.autopilot)
  const goTo = useStore((s) => s.goTo)

  if (open) return null
  if (autopilot) {
    return (
      <div className="bottom">
        <div className="prompt prompt--soft">
          <span className="spinner" aria-hidden />
          {tr(ui.autopilot)} · {tr(stations[autopilot].name)}
        </div>
      </div>
    )
  }
  if (near || nearArcade) {
    const label = near ? `${tr(ui.discover)} · ${tr(stations[near].name)}` : tr(ui.play)
    return (
      <div className="bottom">
        <button className="prompt" onClick={interact}>
          {!touch && <kbd>E</kbd>}
          {label}
        </button>
      </div>
    )
  }
  const next = stationOrder.find((id) => !visited.includes(id))
  return (
    <div className="bottom">
      {next ? (
        <button className="prompt prompt--soft" onClick={() => goTo(next)}>
          <span className="prompt__muted">{tr(ui.next)} :</span> {tr(stations[next].name)}
          <span className="prompt__go">
            {tr(ui.goThere)} <IconArrow width={15} height={15} />
          </span>
        </button>
      ) : (
        <button className="prompt prompt--soft" onClick={() => goTo('lookout')}>
          {tr(ui.done)}
          <span className="prompt__go">
            {tr(ui.contactMe)} <IconArrow width={15} height={15} />
          </span>
        </button>
      )}
    </div>
  )
}

function ControlsHint() {
  const tr = useTr()
  const lang = useStore((s) => s.lang)
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    const hide = () => setVisible(false)
    const timer = setTimeout(hide, 14000)
    window.addEventListener('keydown', hide, { once: true })
    return () => {
      clearTimeout(timer)
      window.removeEventListener('keydown', hide)
    }
  }, [])
  return (
    <div className={`hint ${visible ? '' : 'is-hidden'}`} aria-hidden={!visible}>
      <span>
        {(lang === 'fr' ? ['Z', 'Q', 'S', 'D'] : ['W', 'A', 'S', 'D']).map((k) => (
          <kbd key={k}>{k}</kbd>
        ))}{' '}
        / <kbd>↑</kbd>
        <kbd>←</kbd>
        <kbd>↓</kbd>
        <kbd>→</kbd> {tr(ui.controlsMove)}
      </span>
      <span>
        <kbd>{lang === 'fr' ? 'Maj' : 'Shift'}</kbd> / <kbd>{lang === 'fr' ? 'Espace' : 'Space'}</kbd> {tr(ui.controlsRun)}
      </span>
      <span>
        <kbd>E</kbd> {tr(ui.controlsInteract)}
      </span>
    </div>
  )
}

/** Joystick tactile : le vecteur est lu par le personnage via `input.joy`. */
function Joystick() {
  const zone = useRef<HTMLDivElement>(null)
  const [knob, setKnob] = useState({ x: 0, y: 0 })
  const pointer = useRef<number | null>(null)
  const R = 46

  const update = (e: React.PointerEvent) => {
    const rect = zone.current!.getBoundingClientRect()
    let x = e.clientX - (rect.left + rect.width / 2)
    let y = e.clientY - (rect.top + rect.height / 2)
    const d = Math.hypot(x, y)
    if (d > R) {
      x = (x / d) * R
      y = (y / d) * R
    }
    setKnob({ x, y })
    input.joy.x = x / R
    input.joy.y = -y / R
  }
  const end = () => {
    pointer.current = null
    setKnob({ x: 0, y: 0 })
    input.joy.x = 0
    input.joy.y = 0
  }
  return (
    <div
      ref={zone}
      className="joystick"
      onPointerDown={(e) => {
        pointer.current = e.pointerId
        zone.current!.setPointerCapture(e.pointerId)
        update(e)
      }}
      onPointerMove={(e) => pointer.current === e.pointerId && update(e)}
      onPointerUp={end}
      onPointerCancel={end}
      aria-hidden
    >
      <div className="joystick__knob" style={{ transform: `translate(${knob.x}px, ${knob.y}px)` }} />
    </div>
  )
}

function RouteMenu() {
  const tr = useTr()
  const visited = useStore((s) => s.visited)
  const goTo = useStore((s) => s.goTo)
  const setOverlay = useStore((s) => s.setOverlay)
  return (
    <div className="popover" role="dialog" aria-label={tr(ui.routeTitle)}>
      <div className="popover__head">
        <h2>{tr(ui.routeTitle)}</h2>
        <button className="icon-btn" onClick={() => setOverlay(null)} aria-label={tr(ui.close)}>
          <IconClose />
        </button>
      </div>
      <p className="muted">{tr(ui.routeHint)}</p>
      <ol className="route">
        {stationOrder.map((id, i) => {
          const s = stations[id]
          const done = visited.includes(id)
          return (
            <li key={id}>
              <button
                className={`route__item ${done ? 'is-done' : ''}`}
                onClick={() => {
                  sound.click()
                  goTo(id)
                }}
              >
                <span className="route__n">{done ? <IconCheck width={14} height={14} /> : i}</span>
                <span className="route__text">
                  <strong>{tr(s.name)}</strong>
                  <span>
                    {tr(s.role)}
                    {s.year ? ` · ${s.year}` : ''}
                  </span>
                </span>
              </button>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

function SkillsModal() {
  const tr = useTr()
  const visited = useStore((s) => s.visited)
  const secrets = useStore((s) => s.secrets)
  const revealAll = useStore((s) => s.revealAll)
  const setRevealAll = useStore((s) => s.setRevealAll)
  const setOverlay = useStore((s) => s.setOverlay)
  const unlocked = skills.filter((k) => visited.includes(k.station)).length
  return (
    <div className="modal-backdrop" onClick={() => setOverlay(null)}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={tr(ui.skillsTitle)} onClick={(e) => e.stopPropagation()}>
        <div className="modal__head">
          <div>
            <h2>{tr(ui.skillsTitle)}</h2>
            <p className="muted">
              {unlocked}/{skills.length} · {tr(ui.skillsHint)}
            </p>
          </div>
          <button className="icon-btn" onClick={() => setOverlay(null)} aria-label={tr(ui.close)}>
            <IconClose />
          </button>
        </div>
        <div className="modal__tools">
          <LevelLegend />
          <label className="toggle">
            <input type="checkbox" checked={revealAll} onChange={(e) => setRevealAll(e.target.checked)} />
            {tr(ui.revealAll)}
          </label>
        </div>
        <div className="modal__body">
          {categoryOrder.map((cat) => (
            <section key={cat} className="block">
              <h3 className="block__title">{tr(categoryLabels[cat])}</h3>
              <div className="chips">
                {skills
                  .filter((k) => k.category === cat)
                  .map((k) => {
                    const locked = !revealAll && !visited.includes(k.station)
                    return <SkillChip key={k.id} skill={k} locked={locked} hint={locked ? `${tr(ui.unlockedAt)} ${tr(stations[k.station].name)}` : undefined} />
                  })}
              </div>
            </section>
          ))}
          <section className="block">
            <h3 className="block__title">
              {tr(ui.secrets)} · {secrets.length}/3
            </h3>
            <div className="secrets">
              {(['boxing', 'chess', 'arcade'] as const).map((id) => (
                <span key={id} className={`secret ${secrets.includes(id) ? 'is-found' : ''}`}>
                  {secrets.includes(id) ? { boxing: '🥊', chess: '♞', arcade: '🎮' }[id] : '?'}
                </span>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export function Hud() {
  const overlay = useStore((s) => s.overlay)
  const [touch] = useState(isTouchDevice)
  return (
    <>
      <TopBar />
      <Toasts />
      <BottomBar touch={touch} />
      {touch ? <Joystick /> : <ControlsHint />}
      {overlay === 'route' && <RouteMenu />}
      {overlay === 'skills' && <SkillsModal />}
    </>
  )
}
