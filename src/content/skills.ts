import type { L, Skill, SkillCategory, SkillLevel } from './types'

export const categoryLabels: Record<SkillCategory, L> = {
  si: { fr: "Systèmes d'information & fonctionnel", en: 'Information systems & functional' },
  pm: { fr: 'Gestion de projet', en: 'Project management' },
  data: { fr: 'Data management', en: 'Data management' },
  sap: { fr: "SAP & architecture d'entreprise", en: 'SAP & enterprise architecture' },
  dev: { fr: 'Développement & bases de données', en: 'Development & databases' },
  tools: { fr: 'Outils', en: 'Tools' },
}

export const categoryOrder: SkillCategory[] = ['si', 'pm', 'data', 'sap', 'dev', 'tools']

export const levelLabels: Record<SkillLevel, L> = {
  mission: { fr: 'Pratiqué en mission ou en projet réel', en: 'Used on the job or in a real project' },
  formation: { fr: 'Pratiqué en formation', en: 'Practised during my studies' },
  discovery: { fr: 'En cours de découverte', en: 'Currently exploring' },
}

/**
 * Toutes les compétences affichées. Règle : uniquement ce qui peut être expliqué concrètement
 * en entretien, avec un niveau honnête. Pour corriger un niveau, modifier `level` ici.
 */
export const skills: Skill[] = [
  // Ministère de la Justice
  { id: 'needs', station: 'ministere', category: 'si', level: 'mission', label: { fr: 'Recueil et analyse des besoins métier', en: 'Business requirements gathering & analysis' } },
  { id: 'amoa', station: 'ministere', category: 'si', level: 'mission', label: { fr: 'AMOA (assistance à maîtrise d’ouvrage)', en: 'AMOA (business-side project support)' } },
  { id: 'uml', station: 'ministere', category: 'si', level: 'mission', label: { fr: 'Modélisation UML', en: 'UML modelling' } },
  { id: 'specs', station: 'ministere', category: 'si', level: 'mission', label: { fr: 'Spécifications et documentation fonctionnelles', en: 'Functional specifications & documentation' } },
  { id: 'testing', station: 'ministere', category: 'si', level: 'mission', label: { fr: 'Cahier de recette et tests fonctionnels', en: 'Acceptance test plans & functional testing' } },
  { id: 'change', station: 'ministere', category: 'si', level: 'mission', label: { fr: 'Conduite du changement et formation des utilisateurs', en: 'Change management & user training' } },
  { id: 'paperless', station: 'ministere', category: 'si', level: 'mission', label: { fr: 'Dématérialisation et gestion électronique du courrier', en: 'Paperless workflows & electronic mail management' } },
  { id: 'workshops', station: 'ministere', category: 'pm', level: 'mission', label: { fr: 'Ateliers métier', en: 'Business workshops' } },
  { id: 'stakeholders', station: 'ministere', category: 'pm', level: 'mission', label: { fr: 'Coordination avec les parties prenantes', en: 'Stakeholder coordination' } },
  { id: 'kpi', station: 'ministere', category: 'pm', level: 'mission', label: { fr: 'Suivi des KPI et webreporting', en: 'KPI tracking & web reporting' } },

  // Université de Picardie Jules Verne
  { id: 'algo', station: 'amiens', category: 'dev', level: 'formation', label: { fr: 'Algorithmique', en: 'Algorithms' } },
  { id: 'maths', station: 'amiens', category: 'dev', level: 'formation', label: { fr: 'Mathématiques pour l’informatique', en: 'Mathematics for computer science' } },

  // Université d'Évry Paris-Saclay
  { id: 'java', station: 'evry', category: 'dev', level: 'formation', label: { fr: 'Java (programmation orientée objet)', en: 'Java (object-oriented programming)' } },
  { id: 'c-ocaml', station: 'evry', category: 'dev', level: 'formation', label: { fr: 'C et OCaml', en: 'C and OCaml' } },
  { id: 'databases', station: 'evry', category: 'dev', level: 'formation', label: { fr: 'MySQL, Oracle, MongoDB', en: 'MySQL, Oracle, MongoDB' } },
  { id: 'staruml', station: 'evry', category: 'tools', level: 'formation', label: { fr: 'StarUML', en: 'StarUML' } },
  { id: 'wireshark', station: 'evry', category: 'tools', level: 'formation', label: { fr: 'Wireshark', en: 'Wireshark' } },

  // Université Paris Dauphine-PSL
  { id: 'python', station: 'dauphine', category: 'dev', level: 'formation', label: { fr: 'Python pour la data', en: 'Python for data' } },
  { id: 'ml', station: 'dauphine', category: 'data', level: 'formation', label: { fr: 'Machine learning et deep learning', en: 'Machine learning & deep learning' } },
  { id: 'mcda', station: 'dauphine', category: 'data', level: 'formation', label: { fr: 'Aide à la décision multicritère', en: 'Multi-criteria decision analysis' } },
  { id: 'llm', station: 'dauphine', category: 'dev', level: 'formation', label: { fr: 'Intégration de LLM', en: 'LLM integration' } },
  { id: 'spring', station: 'dauphine', category: 'dev', level: 'formation', label: { fr: 'Spring Boot et Hibernate', en: 'Spring Boot & Hibernate' } },
  { id: 'nextjs', station: 'dauphine', category: 'dev', level: 'formation', label: { fr: 'Next.js', en: 'Next.js' } },
  { id: 'figma', station: 'dauphine', category: 'tools', level: 'formation', label: { fr: 'Figma', en: 'Figma' } },

  // Fastcube
  { id: 'denodo', station: 'fastcube', category: 'data', level: 'mission', label: { fr: 'Denodo : virtualisation des données', en: 'Denodo: data virtualisation' } },
  { id: 'sql-vql', station: 'fastcube', category: 'data', level: 'mission', label: { fr: 'SQL et VQL', en: 'SQL & VQL' } },
  { id: 'query-perf', station: 'fastcube', category: 'data', level: 'mission', label: { fr: 'Analyse des performances des requêtes', en: 'Query performance analysis' } },
  { id: 'cbo', station: 'fastcube', category: 'data', level: 'discovery', label: { fr: 'Statistiques CBO et vues matérialisées', en: 'CBO statistics & materialised views' } },
  { id: 'grafana', station: 'fastcube', category: 'data', level: 'mission', label: { fr: 'Grafana : monitoring et alerting', en: 'Grafana: monitoring & alerting' } },
  { id: 'loki', station: 'fastcube', category: 'data', level: 'mission', label: { fr: 'Loki et Alloy : collecte de logs', en: 'Loki & Alloy: log collection' } },
  { id: 'rpa', station: 'fastcube', category: 'data', level: 'mission', label: { fr: 'RPA avec Automation Anywhere', en: 'RPA with Automation Anywhere' } },

  // Labo Data Quality
  { id: 'data-quality', station: 'lab', category: 'data', level: 'mission', label: { fr: 'Qualité des données', en: 'Data quality' } },
  { id: 'ai-sdk', station: 'lab', category: 'data', level: 'mission', label: { fr: 'Denodo AI SDK', en: 'Denodo AI SDK' } },
  { id: 'scheduling', station: 'lab', category: 'data', level: 'mission', label: { fr: 'Automatisation et planification des contrôles', en: 'Automated, scheduled checks' } },
  { id: 'react', station: 'lab', category: 'dev', level: 'mission', label: { fr: 'React', en: 'React' } },
  { id: 'node-ts', station: 'lab', category: 'dev', level: 'mission', label: { fr: 'Node.js et TypeScript', en: 'Node.js & TypeScript' } },
  { id: 'postgres', station: 'lab', category: 'dev', level: 'mission', label: { fr: 'PostgreSQL', en: 'PostgreSQL' } },

  // KPMG
  { id: 'pmo', station: 'kpmg', category: 'pm', level: 'mission', label: { fr: 'PMO : suivi des projets et des livrables', en: 'PMO: project & deliverable tracking' } },
  { id: 'reporting', station: 'kpmg', category: 'pm', level: 'mission', label: { fr: 'Préparation des reportings', en: 'Reporting preparation' } },
  { id: 'leanix', station: 'kpmg', category: 'sap', level: 'mission', label: { fr: 'SAP LeanIX', en: 'SAP LeanIX' } },
  { id: 'signavio', station: 'kpmg', category: 'sap', level: 'mission', label: { fr: 'SAP Signavio', en: 'SAP Signavio' } },
  { id: 'ea-bpm', station: 'kpmg', category: 'sap', level: 'mission', label: { fr: "Architecture d'entreprise et gestion des processus", en: 'Enterprise architecture & process management' } },
  { id: 'ai-sap', station: 'kpmg', category: 'sap', level: 'discovery', label: { fr: 'IA appliquée aux processus SAP', en: 'AI for SAP processes' } },

  // Place des projets
  { id: 'xml-xsd', station: 'projects', category: 'dev', level: 'mission', label: { fr: 'XML, XSD et WSDL', en: 'XML, XSD & WSDL' } },
  { id: 'einvoicing', station: 'projects', category: 'si', level: 'discovery', label: { fr: 'Formats de facturation électronique (CII, UBL, Factur-X)', en: 'E-invoicing formats (CII, UBL, Factur-X)' } },
  { id: 'web', station: 'projects', category: 'dev', level: 'mission', label: { fr: 'HTML, CSS, JavaScript', en: 'HTML, CSS, JavaScript' } },
  { id: 'git', station: 'projects', category: 'tools', level: 'mission', label: { fr: 'Git et GitHub', en: 'Git & GitHub' } },
]

export const skillsByStation = (station: string) => skills.filter((s) => s.station === station)
