export type Lang = 'fr' | 'en'

/** Un texte disponible dans les deux langues du site. */
export type L = Record<Lang, string>

export type StationId =
  | 'start'
  | 'amiens'
  | 'evry'
  | 'ministere'
  | 'dauphine'
  | 'fastcube'
  | 'lab'
  | 'kpmg'
  | 'projects'
  | 'lookout'

export type StationKind = 'intro' | 'education' | 'experience' | 'case-study' | 'projects' | 'outro'

export interface Section {
  title: L
  items?: L[]
  text?: L
}

export interface Station {
  id: StationId
  kind: StationKind
  /** Nom du lieu, affiché sur le bâtiment et en titre du panneau. */
  name: L
  /** Version courte du nom pour l'enseigne 3D. */
  sign: L
  /** Diplôme, poste ou sous-titre. */
  role: L
  period: L
  /** Année affichée sur la borne au bord de la route (la route est la frise chronologique). */
  year?: string
  intro: L
  sections: Section[]
  takeaway?: L
}

/**
 * Niveau de pratique, affiché sur chaque badge :
 * - mission   : utilisé en mission ou sur un projet réel
 * - formation : pratiqué pendant les études
 * - discovery : en cours de découverte
 */
export type SkillLevel = 'mission' | 'formation' | 'discovery'

export type SkillCategory = 'si' | 'pm' | 'data' | 'sap' | 'dev' | 'tools'

export interface Skill {
  id: string
  label: L
  category: SkillCategory
  level: SkillLevel
  /** L'étape du parcours où le badge se débloque. */
  station: StationId
}

export interface Project {
  id: string
  name: string
  tag: L
  description: L
  points: L[]
  tech: string[]
  repo?: string
  demo?: string
}

export type SecretId = 'boxing' | 'chess' | 'arcade'
