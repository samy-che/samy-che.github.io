import { certificationIssuers, certifications, interests, interestsPro, languages, profile, qualities } from '../content/profile'
import { projects } from '../content/projects'
import { levelLabels } from '../content/skills'
import { caseStudy } from '../content/stations'
import type { L, Section, Skill, SkillLevel } from '../content/types'
import { ui } from '../content/ui'
import { useStore } from '../store'
import { IconDownload, IconExternal, IconGithub, IconLinkedin, IconLock, IconMail } from './icons'

export const useLang = () => useStore((s) => s.lang)
export const useTr = () => {
  const lang = useLang()
  return (l: L) => l[lang]
}

export function SkillChip({ skill, locked, hint }: { skill: Skill; locked?: boolean; hint?: string }) {
  const tr = useTr()
  if (locked) {
    return (
      <span className="chip chip--locked" title={hint}>
        <IconLock width={13} height={13} />
        {hint}
      </span>
    )
  }
  return (
    <span className={`chip chip--${skill.level}`} title={tr(levelLabels[skill.level])}>
      <span className="chip__dot" aria-hidden />
      {tr(skill.label)}
    </span>
  )
}

export function LevelLegend() {
  const tr = useTr()
  const levels: SkillLevel[] = ['mission', 'formation', 'discovery']
  return (
    <ul className="legend">
      {levels.map((l) => (
        <li key={l} className={`chip chip--${l}`}>
          <span className="chip__dot" aria-hidden />
          {tr(levelLabels[l])}
        </li>
      ))}
    </ul>
  )
}

export function Sections({ sections, heading = 'h3' }: { sections: Section[]; heading?: 'h3' | 'h4' }) {
  const tr = useTr()
  const H = heading
  return (
    <>
      {sections.map((s) => (
        <section key={s.title.fr} className="block">
          <H className="block__title">{tr(s.title)}</H>
          {s.text && <p>{tr(s.text)}</p>}
          {s.items && (
            <ul className="bullets">
              {s.items.map((it) => (
                <li key={it.fr}>{tr(it)}</li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </>
  )
}

export function CaseStudy({ heading = 'h3' }: { heading?: 'h3' | 'h4' }) {
  const tr = useTr()
  const H = heading
  return (
    <>
      <section className="block">
        <H className="block__title">{tr(ui.workflow)}</H>
        <ol className="steps">
          {caseStudy.steps.map((s, i) => (
            <li key={i}>
              <span className="steps__n">{i + 1}</span>
              <span>{tr(s)}</span>
            </li>
          ))}
        </ol>
      </section>
      <section className="block">
        <H className="block__title">{tr(ui.architecture)}</H>
        <div className="archi">
          {caseStudy.architecture.map((a) => (
            <div key={a.layer.fr} className="archi__layer">
              <span className="archi__name">{tr(a.layer)}</span>
              <span className="archi__tech">{typeof a.tech === 'string' ? a.tech : tr(a.tech)}</span>
              {a.detail && <span className="archi__detail">{tr(a.detail)}</span>}
            </div>
          ))}
        </div>
      </section>
      <section className="block">
        <H className="block__title">{tr(ui.value)}</H>
        <ul className="bullets">
          {caseStudy.value.map((v) => (
            <li key={v.fr}>{tr(v)}</li>
          ))}
        </ul>
      </section>
      <p className="note">{tr(caseStudy.note)}</p>
    </>
  )
}

export function ProjectCards() {
  const tr = useTr()
  return (
    <div className="projects">
      {projects.map((p) => (
        <article key={p.id} className="project">
          <span className="project__tag">{tr(p.tag)}</span>
          <h4 className="project__name">{p.name}</h4>
          <p>{tr(p.description)}</p>
          <ul className="bullets bullets--small">
            {p.points.map((pt) => (
              <li key={pt.fr}>{tr(pt)}</li>
            ))}
          </ul>
          <div className="project__foot">
            <span className="project__tech">{p.tech.join(' · ')}</span>
            <span className="project__links">
              {p.demo && (
                <a href={p.demo} target="_blank" rel="noreferrer">
                  {tr(ui.demo)} <IconExternal width={14} height={14} />
                </a>
              )}
              {p.repo && (
                <a href={p.repo} target="_blank" rel="noreferrer">
                  {tr(ui.code)} <IconExternal width={14} height={14} />
                </a>
              )}
            </span>
          </div>
        </article>
      ))}
      <a className="project project--more" href={profile.github} target="_blank" rel="noreferrer">
        <IconGithub width={22} height={22} />
        {tr(ui.moreOnGithub)}
      </a>
    </div>
  )
}

/** Certifications repliées dans une liste déroulante : un résumé par organisme, le détail au clic. */
export function CertificationList() {
  const tr = useTr()
  return (
    <details className="certs">
      <summary>
        <span className="certs__toggle">{tr(ui.showCertifications).replace('{n}', String(certifications.length))}</span>
        <span className="certs__issuers">{certificationIssuers()}</span>
      </summary>
      <ul>
        {certifications.map((c) => (
          <li key={c.name}>
            <span className="certs__name">{c.name}</span>
            <span className="certs__meta">
              {c.issuer} · {tr(c.date)}
            </span>
          </li>
        ))}
      </ul>
    </details>
  )
}

export function ContactButtons() {
  const tr = useTr()
  return (
    <div className="contact">
      <a className="btn btn--primary" href={`mailto:${profile.email}`}>
        <IconMail /> {profile.email}
      </a>
      <a className="btn" href={profile.linkedin} target="_blank" rel="noreferrer">
        <IconLinkedin /> LinkedIn
      </a>
      <a className="btn" href={profile.github} target="_blank" rel="noreferrer">
        <IconGithub /> GitHub
      </a>
      <a className="btn" href={profile.cv} download>
        <IconDownload /> {tr(ui.downloadCv)}
      </a>
    </div>
  )
}

export function Outro({ heading = 'h3', withContact = true }: { heading?: 'h3' | 'h4'; withContact?: boolean }) {
  const tr = useTr()
  const H = heading
  return (
    <>
      <section className="block">
        <H className="block__title">{tr(ui.interestsPro)}</H>
        <ul className="tags">
          {interestsPro.map((i) => (
            <li key={i.fr}>{tr(i)}</li>
          ))}
        </ul>
      </section>
      <section className="block">
        <H className="block__title">{tr(ui.qualities)}</H>
        <dl className="qualities">
          {qualities.map((q) => (
            <div key={q.quality.fr}>
              <dt>{tr(q.quality)}</dt>
              <dd>{tr(q.proof)}</dd>
            </div>
          ))}
        </dl>
      </section>
      <section className="block">
        <H className="block__title">{tr(ui.languages)}</H>
        <ul className="kv">
          {languages.map((l) => (
            <li key={l.name.fr}>
              <span>{tr(l.name)}</span>
              <span>{tr(l.level)}</span>
            </li>
          ))}
        </ul>
      </section>
      <section className="block">
        <H className="block__title">{tr(ui.certifications)}</H>
        <CertificationList />
      </section>
      <section className="block">
        <H className="block__title">{tr(ui.hobbies)}</H>
        <ul className="tags tags--soft">
          {interests.map((i) => (
            <li key={i.id}>{tr(i.label)}</li>
          ))}
        </ul>
      </section>
      {withContact && (
        <section className="block">
          <H className="block__title">{tr(ui.contact)}</H>
          <ContactButtons />
        </section>
      )}
    </>
  )
}
