import { useEffect, useRef } from 'react'
import { sound } from '../audio'
import { skillsByStation } from '../content/skills'
import { stationOrder, stations } from '../content/stations'
import { ui } from '../content/ui'
import { useStore } from '../store'
import { CaseStudy, ContactButtons, LevelLegend, Outro, ProjectCards, Sections, SkillChip, useTr } from './common'
import { IconArrow, IconClose } from './icons'

/** Panneau de l'étape : à droite sur ordinateur, en feuille glissante sur mobile. */
export function StationPanel() {
  const tr = useTr()
  const open = useStore((s) => s.open)
  const close = useStore((s) => s.closeStation)
  const goTo = useStore((s) => s.goTo)
  const closeBtn = useRef<HTMLButtonElement>(null)
  const body = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) {
      body.current?.scrollTo({ top: 0 })
      closeBtn.current?.focus({ preventScroll: true })
    }
  }, [open])

  if (!open) return null
  const s = stations[open]
  const index = stationOrder.indexOf(open)
  const next = stationOrder[index + 1]
  const list = skillsByStation(open)

  return (
    <aside className="panel" role="dialog" aria-labelledby="panel-title">
      <header className="panel__head">
        <div>
          <span className="panel__chapter">{index === 0 ? tr(s.period) : `${tr(ui.chapter)} ${index} / ${stationOrder.length - 1}`}</span>
          <h2 id="panel-title">{tr(s.name)}</h2>
          <p className="panel__role">{tr(s.role)}</p>
          {index > 0 && <p className="panel__period">{tr(s.period)}</p>}
        </div>
        <button
          ref={closeBtn}
          className="icon-btn"
          onClick={() => {
            sound.close()
            close()
          }}
          aria-label={tr(ui.close)}
        >
          <IconClose />
        </button>
      </header>
      <div className="panel__body" ref={body}>
        {s.kind === 'case-study' && <h3 className="block__title">{tr(ui.problem)}</h3>}
        <p className="lead">{tr(s.intro)}</p>
        <Sections sections={s.sections} />
        {s.kind === 'case-study' && <CaseStudy />}
        {s.kind === 'projects' && <ProjectCards />}
        {s.kind === 'outro' && <Outro />}
        {s.takeaway && <blockquote className="takeaway">{tr(s.takeaway)}</blockquote>}
        {list.length > 0 && (
          <section className="block">
            <h3 className="block__title">{tr(ui.skillsHere)}</h3>
            <div className="chips">
              {list.map((k) => (
                <SkillChip key={k.id} skill={k} />
              ))}
            </div>
            <LevelLegend />
          </section>
        )}
        {s.kind === 'intro' && <ContactButtons />}
      </div>
      {next && (
        <footer className="panel__foot">
          <button className="btn btn--primary btn--block" onClick={() => goTo(next)}>
            {tr(ui.next)} : {tr(stations[next].name)} <IconArrow />
          </button>
        </footer>
      )}
    </aside>
  )
}
