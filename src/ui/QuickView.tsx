import { useEffect } from 'react'
import { profile } from '../content/profile'
import { categoryLabels, categoryOrder, skills } from '../content/skills'
import { stations } from '../content/stations'
import type { StationId } from '../content/types'
import { ui } from '../content/ui'
import { useStore } from '../store'
import { CaseStudy, ContactButtons, LevelLegend, Outro, ProjectCards, Sections, SkillChip, useTr } from './common'
import { LangSwitch } from './controls'
import { IconCube } from './icons'

const education: StationId[] = ['dauphine', 'evry', 'amiens']
const experience: StationId[] = ['kpmg', 'fastcube', 'ministere']

function Entry({ id }: { id: StationId }) {
  const tr = useTr()
  const s = stations[id]
  return (
    <article className="entry">
      <div className="entry__side">
        <span className="entry__period">{tr(s.period)}</span>
      </div>
      <div className="entry__main">
        <h4>{tr(s.name)}</h4>
        <p className="entry__role">{tr(s.role)}</p>
        <p>{tr(s.intro)}</p>
        {/* le renvoi vers la « Place des projets » n'a pas de sens ici : les projets ont leur propre section */}
        <Sections sections={s.sections.filter((sec) => !(id === 'dauphine' && sec.text))} heading="h4" />
        {s.takeaway && <blockquote className="takeaway">{tr(s.takeaway)}</blockquote>}
      </div>
    </article>
  )
}

/** La version rapide : tout le parcours sur une page classique, lisible en deux minutes et imprimable. */
export function QuickView({ notice }: { notice?: boolean }) {
  const tr = useTr()
  const setView = useStore((s) => s.setView)
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const nav = [
    ['profil', ui.nav.profile],
    ['parcours', ui.nav.journey],
    ['etude-de-cas', ui.nav.caseStudy],
    ['projets', ui.nav.projects],
    ['competences', ui.nav.skills],
    ['contact', ui.nav.contact],
  ] as const

  return (
    <div className="quick">
      <header className="quick__bar">
        <a className="brand" href="#profil">
          <span className="brand__name">{profile.name}</span>
          <span className="brand__title">{tr(profile.title)}</span>
        </a>
        <nav className="quick__nav" aria-label="Sections">
          {nav.map(([id, label]) => (
            <a key={id} href={`#${id}`}>
              {tr(label)}
            </a>
          ))}
        </nav>
        <div className="quick__actions">
          <LangSwitch />
          <button className="btn btn--primary btn--small" onClick={() => setView('world')}>
            <IconCube /> {tr(ui.explore3d)}
          </button>
        </div>
      </header>

      <main className="quick__main">
        {notice && <p className="notice">{tr(ui.noWebgl)}</p>}

        <section id="profil" className="hero">
          <span className="eyebrow">{tr(profile.title)} · {profile.company}</span>
          <h1>{profile.name}</h1>
          <p className="hero__tagline">{tr(profile.tagline)}</p>
          <p className="hero__pitch">{tr(profile.pitch)}</p>
          <ContactButtons />
        </section>

        <section id="parcours" className="qsection">
          <h2>{tr(ui.experience)}</h2>
          {experience.map((id) => (
            <Entry key={id} id={id} />
          ))}
          <h2>{tr(ui.education)}</h2>
          {education.map((id) => (
            <Entry key={id} id={id} />
          ))}
        </section>

        <section id="etude-de-cas" className="qsection">
          <h2>{tr(ui.nav.caseStudy)}</h2>
          <article className="entry entry--wide">
            <div className="entry__main">
              <h3>{tr(stations.lab.role)}</h3>
              <p className="entry__role">{tr(stations.lab.period)}</p>
              <h4 className="block__title">{tr(ui.problem)}</h4>
              <p>{tr(stations.lab.intro)}</p>
              <CaseStudy heading="h4" />
            </div>
          </article>
        </section>

        <section id="projets" className="qsection">
          <h2>{tr(ui.nav.projects)}</h2>
          <p className="muted">{tr(stations.projects.intro)}</p>
          <ProjectCards />
        </section>

        <section id="competences" className="qsection">
          <h2>{tr(ui.nav.skills)}</h2>
          <LevelLegend />
          <div className="skill-grid">
            {categoryOrder.map((cat) => (
              <div key={cat} className="block">
                <h3 className="block__title">{tr(categoryLabels[cat])}</h3>
                <div className="chips">
                  {skills
                    .filter((k) => k.category === cat)
                    .map((k) => (
                      <SkillChip key={k.id} skill={k} />
                    ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="contact" className="qsection">
          <h2>{tr(stations.lookout.role)}</h2>
          <p className="lead">{tr(profile.goal)}</p>
          <Outro />
        </section>
      </main>

      <footer className="quick__foot">
        <span>
          © {new Date().getFullYear()} {profile.name}
        </span>
        <button className="link" onClick={() => setView('world')}>
          {tr(ui.explore3d)}
        </button>
      </footer>
    </div>
  )
}
