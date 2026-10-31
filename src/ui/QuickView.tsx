import { useEffect, useState } from 'react'
import { certifications, facts, interests, interestsPro, languages, profile, qualities } from '../content/profile'
import { projects } from '../content/projects'
import { categoryLabels, categoryOrder, skills, skillsByStation } from '../content/skills'
import { caseStudy, stations } from '../content/stations'
import type { StationId } from '../content/types'
import { ui } from '../content/ui'
import { useStore } from '../store'
import { ContactButtons, LevelLegend, ProjectCards, Sections, SkillChip, useTr } from './common'
import { LangSwitch } from './controls'
import { IconArrow, IconCheck, IconCube, IconDownload } from './icons'
import './quick.css'

const experience: StationId[] = ['kpmg', 'fastcube', 'ministere']
const education: StationId[] = ['dauphine', 'evry', 'amiens']

const nav = [
  ['profil', ui.nav.profile],
  ['parcours', ui.nav.journey],
  ['etude-de-cas', ui.nav.caseStudy],
  ['projets', ui.nav.projects],
  ['competences', ui.nav.skills],
  ['contact', ui.nav.contact],
] as const

/** Section en cours de lecture (celle qui passe au tiers haut de l'écran), pour souligner le bon lien du menu. */
function useActiveSection() {
  const [active, setActive] = useState<string>(nav[0][0])
  useEffect(() => {
    const update = () => {
      const line = window.innerHeight * 0.35
      let current: string = nav[0][0]
      for (const [id] of nav) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= line) current = id
      }
      // en bas de page, la dernière section est trop courte pour atteindre la ligne
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = nav[nav.length - 1][0]
      setActive(current)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])
  return active
}

/** Une étape du parcours : l'essentiel visible, le détail dépliable. */
function TimelineItem({ id }: { id: StationId }) {
  const tr = useTr()
  const s = stations[id]
  const list = skillsByStation(id)
  const results = s.sections.find((sec) => sec.title.fr.startsWith('Résultat'))
  // les sections de pur texte renvoient à des lieux de la ville 3D : elles n'ont pas leur place ici
  const details = s.sections.filter((sec) => sec !== results && sec.items)
  return (
    <li className="tl__item">
      <p className="tl__date">{tr(s.period)}</p>
      <article className="tl__card">
        <h4 className="tl__name">{tr(s.name)}</h4>
        <p className="tl__role">{tr(s.role)}</p>
        <p className="tl__intro">{tr(s.intro)}</p>
        {results && (
          <ul className="tl__results">
            {results.items!.map((it) => (
              <li key={it.fr}>{tr(it)}</li>
            ))}
          </ul>
        )}
        {s.kind === 'experience' && (
          <ul className="tl__themes">
            {details.map((sec) => (
              <li key={sec.title.fr}>{tr(sec.title)}</li>
            ))}
          </ul>
        )}
        {s.takeaway && <p className="tl__takeaway">{tr(s.takeaway)}</p>}
        {list.length > 0 && (
          <div className="chips chips--compact">
            {list.map((k) => (
              <SkillChip key={k.id} skill={k} />
            ))}
          </div>
        )}
        <div className="tl__foot">
          {details.length > 0 && (
            <details className="tl__details">
              <summary>{tr(ui.showDetails)}</summary>
              <Sections sections={details} heading="h4" />
            </details>
          )}
          {id === 'fastcube' && (
            <a className="tl__link" href="#etude-de-cas">
              {tr(ui.seeCaseStudy)} <IconArrow width={14} height={14} />
            </a>
          )}
        </div>
      </article>
    </li>
  )
}

function SectionHead({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <header className="qhead">
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {text && <p className="qhead__text">{text}</p>}
    </header>
  )
}

/** La version rapide : tout le parcours sur une page classique, lisible en deux minutes et imprimable. */
export function QuickView({ notice }: { notice?: boolean }) {
  const tr = useTr()
  const setView = useStore((s) => s.setView)
  const active = useActiveSection()

  useEffect(() => {
    window.scrollTo(0, 0)
    // à l'impression, tous les détails sont dépliés
    const open = () => document.querySelectorAll<HTMLDetailsElement>('.quick details').forEach((d) => (d.open = true))
    window.addEventListener('beforeprint', open)
    return () => window.removeEventListener('beforeprint', open)
  }, [])

  const stats = [
    { n: experience.length, label: ui.statExperiences },
    { n: projects.length, label: ui.statProjects },
    { n: certifications.length, label: ui.statCertifications },
    { n: languages.length, label: ui.statLanguages },
  ]
  const languageLine = languages.map((l) => (/\d/.test(l.level.fr) ? `${tr(l.name)} ${l.level.fr}` : tr(l.name))).join(' · ')

  return (
    <div className="quick">
      <header className="qbar">
        <a className="qbar__brand" href="#profil">
          <span className="qbar__name">{profile.name}</span>
          <span className="qbar__title">{tr(profile.title)}</span>
        </a>
        <nav className="qbar__nav" aria-label="Sections">
          {nav.map(([id, label]) => (
            <a key={id} href={`#${id}`} className={active === id ? 'is-active' : ''} aria-current={active === id ? 'true' : undefined}>
              {tr(label)}
            </a>
          ))}
        </nav>
        <div className="qbar__actions">
          <LangSwitch />
          <button className="btn btn--primary btn--small" onClick={() => setView('world')}>
            <IconCube /> <span className="qbar__3d">{tr(ui.explore3d)}</span>
          </button>
        </div>
      </header>

      <main className="qmain">
        {notice && <p className="qnotice">{tr(ui.noWebgl)}</p>}

        {/* ---------- Profil ---------- */}
        <section id="profil" className="qhero">
          <div className="qhero__text">
            <span className="eyebrow">
              {tr(profile.title)} · {profile.company}
            </span>
            <h1>{profile.name}</h1>
            <p className="qhero__tagline">{tr(profile.tagline)}</p>
            <p className="qhero__pitch">{tr(profile.pitch)}</p>
            <ContactButtons />
          </div>
          <aside className="qhero__side">
            <div className="glance">
              <h2 className="glance__title">{tr(ui.atAGlance)}</h2>
              <dl>
                {facts.map((f) => (
                  <div key={f.label.fr}>
                    <dt>{tr(f.label)}</dt>
                    <dd>{tr(f.value)}</dd>
                  </div>
                ))}
                <div>
                  <dt>{tr(ui.factLanguages)}</dt>
                  <dd>{languageLine}</dd>
                </div>
                <div>
                  <dt>{tr(ui.certifications)}</dt>
                  <dd>{certifications.map((c) => c.name).join(' · ')}</dd>
                </div>
              </dl>
            </div>
            <button className="teaser" onClick={() => setView('world')}>
              <IconCube width={22} height={22} />
              <span>
                <strong>{tr(ui.teaserTitle)}</strong>
                <span>{tr(ui.teaserText)}</span>
              </span>
              <IconArrow />
            </button>
          </aside>
          <ul className="stats">
            {stats.map((s) => (
              <li key={s.label.fr}>
                <strong>{s.n}</strong>
                <span>{tr(s.label)}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ---------- Parcours ---------- */}
        <section id="parcours" className="qsection">
          <SectionHead eyebrow={tr(ui.nav.journey)} title={tr(ui.experience)} />
          <ol className="tl">
            {experience.map((id) => (
              <TimelineItem key={id} id={id} />
            ))}
          </ol>
          <h3 className="qsub">{tr(ui.education)}</h3>
          <ol className="tl">
            {education.map((id) => (
              <TimelineItem key={id} id={id} />
            ))}
          </ol>
        </section>

        {/* ---------- Étude de cas ---------- */}
        <section id="etude-de-cas" className="qsection">
          <SectionHead eyebrow={tr(ui.nav.caseStudy)} title={tr(stations.lab.role)} text={tr(stations.lab.period)} />
          <div className="case">
            <div className="case__problem">
              <h3>{tr(ui.problem)}</h3>
              <p>{tr(stations.lab.intro)}</p>
              <h4>{tr(ui.techStack)}</h4>
              <ul className="techs">
                {caseStudy.tech.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
            <div className="case__flow">
              <h3>{tr(ui.workflow)}</h3>
              <ol>
                {caseStudy.steps.map((step, i) => (
                  <li key={i}>
                    <span className="case__n">{i + 1}</span>
                    {tr(step)}
                  </li>
                ))}
              </ol>
            </div>
            <div className="case__archi">
              <h3>{tr(ui.architecture)}</h3>
              <ul>
                {caseStudy.architecture.map((a) => (
                  <li key={a.layer.fr}>
                    <span className="case__layer">{tr(a.layer)}</span>
                    <span className="case__tech">{typeof a.tech === 'string' ? a.tech : tr(a.tech)}</span>
                    {a.detail && <span className="case__detail">{tr(a.detail)}</span>}
                  </li>
                ))}
              </ul>
            </div>
            <div className="case__value">
              <h3>{tr(ui.value)}</h3>
              <ul>
                {caseStudy.value.map((v) => (
                  <li key={v.fr}>
                    <IconCheck width={16} height={16} />
                    {tr(v)}
                  </li>
                ))}
              </ul>
              <p className="case__note">{tr(caseStudy.note)}</p>
            </div>
          </div>
        </section>

        {/* ---------- Projets ---------- */}
        <section id="projets" className="qsection">
          <SectionHead eyebrow={tr(ui.nav.projects)} title={tr(stations.projects.role)} text={tr(stations.projects.intro)} />
          <ProjectCards />
        </section>

        {/* ---------- Compétences ---------- */}
        <section id="competences" className="qsection">
          <SectionHead eyebrow={tr(ui.nav.skills)} title={tr(ui.skillsByArea)} />
          <LevelLegend />
          <div className="skillcards">
            {categoryOrder.map((cat) => {
              const list = skills.filter((k) => k.category === cat)
              return (
                <div key={cat} className="skillcard">
                  <h3>
                    {tr(categoryLabels[cat])} <span>{list.length}</span>
                  </h3>
                  <div className="chips chips--compact">
                    {list.map((k) => (
                      <SkillChip key={k.id} skill={k} />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* ---------- Et maintenant ? ---------- */}
        <section id="contact" className="qsection">
          <SectionHead eyebrow={tr(ui.nav.contact)} title={tr(stations.lookout.role)} text={tr(profile.goal)} />
          <div className="outro">
            <div className="outro__main">
              <h3>{tr(ui.interestsPro)}</h3>
              <ul className="tags">
                {interestsPro.map((i) => (
                  <li key={i.fr}>{tr(i)}</li>
                ))}
              </ul>
              <h3>{tr(ui.qualities)}</h3>
              <dl className="proofs">
                {qualities.map((q) => (
                  <div key={q.quality.fr}>
                    <dt>{tr(q.quality)}</dt>
                    <dd>{tr(q.proof)}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <aside className="outro__side">
              <h3>{tr(ui.languages)}</h3>
              <ul className="kv">
                {languages.map((l) => (
                  <li key={l.name.fr}>
                    <span>{tr(l.name)}</span>
                    <span>{tr(l.level)}</span>
                  </li>
                ))}
              </ul>
              <h3>{tr(ui.certifications)}</h3>
              <ul className="kv">
                {certifications.map((c) => (
                  <li key={c.name}>
                    <span>{c.name}</span>
                  </li>
                ))}
              </ul>
              <h3>{tr(ui.hobbies)}</h3>
              <ul className="tags tags--soft">
                {interests.map((i) => (
                  <li key={i.id}>{tr(i.label)}</li>
                ))}
              </ul>
            </aside>
          </div>

          <div className="cta">
            <div>
              <h3>{tr(ui.contactTitle)}</h3>
              <p>{tr(ui.contactText)}</p>
            </div>
            <div className="cta__actions">
              <ContactButtons />
              <button className="btn cta__print" onClick={() => window.print()}>
                <IconDownload /> {tr(ui.print)}
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="qfoot">
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
