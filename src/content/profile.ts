import type { L, SecretId } from './types'

export const profile = {
  name: 'Samy Cherief',
  title: { fr: 'Consultant SAP', en: 'SAP Consultant' } as L,
  company: 'KPMG France',
  tagline: {
    fr: 'Le lien entre les besoins métier, les données et les équipes techniques.',
    en: 'Bridging business needs, data and technical teams.',
  } as L,
  pitch: {
    fr: "Consultant SAP chez KPMG France et diplômé du Master MIAGE de l'Université Paris Dauphine-PSL. Mon profil est hybride : je comprends les aspects techniques des solutions, et je m'intéresse surtout à leur valeur métier, à leur mise en œuvre et à leur adoption par les utilisateurs.",
    en: "SAP consultant at KPMG France and graduate of the MIAGE Master's programme at Université Paris Dauphine-PSL. I have a hybrid profile: I understand the technical side of IT solutions, and what interests me most is their business value, how they are rolled out and how users adopt them.",
  } as L,
  goal: {
    fr: 'Mon objectif : continuer à évoluer à l’intersection des systèmes d’information, des métiers et de la gestion de projet, là où l’on aide les entreprises à améliorer leurs processus, à mieux exploiter leurs données et à piloter leurs transformations.',
    en: 'My goal: keep growing where information systems, business and project management meet, helping companies improve their processes, make better use of their data and steer their transformations.',
  } as L,
  email: 'samycherief21@outlook.fr',
  linkedin: 'https://www.linkedin.com/in/yacine-cherief/',
  github: 'https://github.com/samy-che',
  cv: 'cv-samy-cherief.pdf',
}

export const languages: { name: L; level: L }[] = [
  { name: { fr: 'Français', en: 'French' }, level: { fr: 'Bilingue', en: 'Bilingual' } },
  { name: { fr: 'Arabe', en: 'Arabic' }, level: { fr: 'Langue maternelle', en: 'Native' } },
  { name: { fr: 'Anglais', en: 'English' }, level: { fr: 'B2', en: 'B2' } },
  { name: { fr: 'Espagnol', en: 'Spanish' }, level: { fr: 'A2', en: 'A2' } },
]

export const certifications: { name: string; issuer: string }[] = [
  { name: 'Denodo 9 Developer', issuer: 'Denodo' },
  { name: 'Denodo AI SDK Developer', issuer: 'Denodo' },
  { name: 'RPA (Automation Anywhere)', issuer: 'Automation Anywhere' },
  { name: 'Bloomberg Market Concepts (BMC)', issuer: 'Bloomberg' },
]

export const interests: { id: SecretId; label: L; secret: L }[] = [
  {
    id: 'boxing',
    label: { fr: 'Boxe anglaise', en: 'Boxing' },
    secret: {
      fr: "La boxe anglaise, l'un de mes centres d'intérêt. Garde haute !",
      en: 'Boxing, one of my hobbies. Keep your guard up!',
    },
  },
  {
    id: 'chess',
    label: { fr: 'Échecs', en: 'Chess' },
    secret: {
      fr: 'Les échecs : anticiper plusieurs coups à l’avance, ça sert aussi en gestion de projet.',
      en: 'Chess: thinking several moves ahead helps in project management too.',
    },
  },
  {
    id: 'arcade',
    label: { fr: 'Jeux vidéo', en: 'Video games' },
    secret: {
      fr: "Les jeux vidéo, d'où l'idée de ce portfolio !",
      en: 'Video games, hence the idea for this portfolio!',
    },
  },
]

/** Les domaines vers lesquels je souhaite évoluer (pas de statut de disponibilité affiché). */
export const interestsPro: L[] = [
  { fr: 'Conseil en systèmes d’information', en: 'Information systems consulting' },
  { fr: 'Gestion de projet IT, PMO et pilotage', en: 'IT project management, PMO and steering' },
  { fr: 'Business Analysis et AMOA', en: 'Business analysis and business-side project support (AMOA)' },
  { fr: 'Transformation numérique', en: 'Digital transformation' },
  { fr: 'Conseil fonctionnel SAP', en: 'SAP functional consulting' },
  { fr: 'Data Management et gouvernance des données', en: 'Data management and data governance' },
  { fr: 'Audit des systèmes d’information', en: 'IT audit' },
]

/** Les qualités, toujours illustrées par une expérience concrète. */
export const qualities: { quality: L; proof: L }[] = [
  {
    quality: { fr: 'Rigueur', en: 'Rigour' },
    proof: {
      fr: 'Spécifications, cahier de recette et modélisation UML au Ministère de la Justice.',
      en: 'Specifications, acceptance test plans and UML modelling at the French Ministry of Justice.',
    },
  },
  {
    quality: { fr: "Capacité d'apprentissage", en: 'Fast learning' },
    proof: {
      fr: 'Denodo, Grafana et la RPA pris en main pendant un stage de cinq mois, et quatre certifications.',
      en: 'Got to grips with Denodo, Grafana and RPA during a five-month internship, plus four certifications.',
    },
  },
  {
    quality: { fr: "Esprit d'analyse", en: 'Analytical mindset' },
    proof: {
      fr: 'Analyse des performances de requêtes chez Fastcube, analyse de résultats d’enquêtes au Ministère.',
      en: 'Query performance analysis at Fastcube, survey results analysis at the Ministry.',
    },
  },
  {
    quality: { fr: 'Perspective métier', en: 'Business perspective' },
    proof: {
      fr: 'Une application de Data Quality pensée pour des utilisateurs qui n’écrivent pas de SQL.',
      en: "A data quality application designed for users who don't write SQL.",
    },
  },
  {
    quality: { fr: 'Curiosité', en: 'Curiosity' },
    proof: {
      fr: 'Exploration de SAP LeanIX, de Signavio et de l’IA appliquée à SAP ; des outils personnels autour de la facturation électronique.',
      en: 'Exploring SAP LeanIX, Signavio and AI for SAP; personal tools around e-invoicing.',
    },
  },
]
