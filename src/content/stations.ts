import type { L, Station, StationId } from './types'

/** L'ordre du parcours : c'est aussi l'ordre chronologique de la route. */
export const stationOrder: StationId[] = [
  'start',
  'amiens',
  'evry',
  'ministere',
  'dauphine',
  'fastcube',
  'lab',
  'kpmg',
  'projects',
  'lookout',
]

export const stations: Record<StationId, Station> = {
  start: {
    id: 'start',
    kind: 'intro',
    name: { fr: 'Point de départ', en: 'Starting point' },
    sign: { fr: 'Samy Cherief', en: 'Samy Cherief' },
    role: { fr: 'Consultant SAP', en: 'SAP Consultant' },
    period: { fr: 'Bienvenue', en: 'Welcome' },
    intro: {
      fr: "Bienvenue ! Je m'appelle Samy Cherief. Je suis consultant SAP chez KPMG France et diplômé du Master MIAGE de l'Université Paris Dauphine-PSL. Mon fil conducteur : faire le lien entre les besoins métier, les données et les équipes techniques.",
      en: "Welcome! I'm Samy Cherief, an SAP consultant at KPMG France and a graduate of the MIAGE Master's programme at Université Paris Dauphine-PSL. My common thread: connecting business needs, data and technical teams.",
    },
    sections: [
      {
        title: { fr: 'Comment jouer', en: 'How to play' },
        items: [
          { fr: 'Déplacez-vous avec ZQSD, WASD ou les flèches. Maj pour courir.', en: 'Move with WASD or the arrow keys. Hold Shift to run.' },
          { fr: 'Approchez-vous d’un bâtiment et appuyez sur E pour découvrir l’étape.', en: 'Walk up to a building and press E to open that chapter.' },
          { fr: 'Chaque étape débloque les compétences que j’y ai développées.', en: 'Each chapter unlocks the skills I built there.' },
          { fr: 'Trois secrets liés à mes centres d’intérêt sont cachés dans la ville.', en: 'Three secrets about my hobbies are hidden around town.' },
          { fr: 'Peu de temps ? La « Version rapide » présente tout le parcours sur une seule page.', en: 'Short on time? The “Quick version” shows everything on a single page.' },
        ],
      },
      {
        title: { fr: 'Mon profil', en: 'My profile' },
        text: {
          fr: 'Un profil hybride : je comprends les aspects techniques des solutions informatiques, et je m’intéresse surtout à leur valeur métier, à leur mise en œuvre et à leur adoption par les utilisateurs.',
          en: 'A hybrid profile: I understand the technical side of IT solutions, and I care most about their business value, how they are rolled out and how users adopt them.',
        },
      },
    ],
  },

  amiens: {
    id: 'amiens',
    kind: 'education',
    name: { fr: 'Université de Picardie Jules Verne', en: 'Université de Picardie Jules Verne' },
    sign: { fr: 'Université de Picardie', en: 'Université de Picardie' },
    role: { fr: 'Licence 1 Mathématiques-Informatique', en: "Bachelor's, year 1: Mathematics & Computer Science" },
    period: { fr: '2021 – 2022 · Amiens', en: '2021 – 2022 · Amiens' },
    year: '2021',
    intro: {
      fr: 'Tout commence à Amiens, avec une première année de licence qui associe mathématiques et informatique : raisonnement, logique, algorithmique et premiers programmes.',
      en: "It all starts in Amiens, with a first year of a Bachelor's combining mathematics and computer science: reasoning, logic, algorithms and my first programs.",
    },
    sections: [
      {
        title: { fr: 'Résultat', en: 'Result' },
        items: [
          { fr: 'Mention Assez Bien', en: 'Graded with honours (mention Assez Bien)' },
          { fr: 'Classé 2e sur 37', en: 'Ranked 2nd out of 37' },
        ],
      },
    ],
  },

  evry: {
    id: 'evry',
    kind: 'education',
    name: { fr: "Université d'Évry Paris-Saclay", en: "Université d'Évry Paris-Saclay" },
    sign: { fr: "Université d'Évry", en: "Université d'Évry" },
    role: { fr: 'Licence 2 Informatique, puis Licence 3 MIAGE', en: "Bachelor's: year 2 in Computer Science, year 3 in MIAGE" },
    period: { fr: '2022 – 2024 · Paris-Saclay', en: '2022 – 2024 · Paris-Saclay' },
    year: '2022',
    intro: {
      fr: 'À Évry, je poursuis en informatique, puis je choisis la MIAGE en troisième année : une formation qui réunit informatique, systèmes d’information et compréhension des besoins métier. C’est là que mon profil hybride prend forme.',
      en: 'In Évry I carry on with computer science, then choose MIAGE in my third year: a programme that brings together computing, information systems and an understanding of business needs. This is where my hybrid profile takes shape.',
    },
    sections: [
      {
        title: { fr: 'Résultats', en: 'Results' },
        items: [
          { fr: 'L2 Informatique (2022 – 2023) : mention Bien, classé 4e sur 84', en: 'Year 2, Computer Science (2022 – 2023): honours (mention Bien), ranked 4th out of 84' },
          { fr: 'L3 MIAGE (2023 – 2024) : mention Assez Bien, classé 2e sur 29', en: 'Year 3, MIAGE (2023 – 2024): honours (mention Assez Bien), ranked 2nd out of 29' },
        ],
      },
      {
        title: { fr: 'Les bases techniques', en: 'Technical foundations' },
        items: [
          { fr: 'Programmation orientée objet en Java, programmation en C et en OCaml', en: 'Object-oriented programming in Java, programming in C and OCaml' },
          { fr: 'Bases de données relationnelles et NoSQL : MySQL, Oracle, MongoDB', en: 'Relational and NoSQL databases: MySQL, Oracle, MongoDB' },
          { fr: 'Modélisation avec StarUML, analyse réseau avec Wireshark', en: 'Modelling with StarUML, network analysis with Wireshark' },
        ],
      },
    ],
  },

  ministere: {
    id: 'ministere',
    kind: 'experience',
    name: { fr: 'Ministère de la Justice', en: 'French Ministry of Justice' },
    sign: { fr: 'Ministère de la Justice', en: 'Ministry of Justice' },
    role: { fr: 'Stage AMOA', en: 'Business analyst intern (AMOA)' },
    period: { fr: 'Avril – août 2024', en: 'April – August 2024' },
    year: '2024',
    intro: {
      fr: 'Mon premier vrai projet de transformation : la dématérialisation des circuits de courrier d’une administration. Mon rôle, côté maîtrise d’ouvrage : comprendre comment les agents travaillent, puis traduire leurs besoins en une solution qui fonctionne pour eux.',
      en: "My first real transformation project: digitising an administration's mail-handling processes. My role, on the business side (AMOA): understand how staff actually work, then turn their needs into a solution that works for them.",
    },
    sections: [
      {
        title: { fr: 'Comprendre le besoin', en: 'Understanding the need' },
        items: [
          { fr: 'Participation à huit ateliers de travail avec les équipes métier', en: 'Took part in eight working sessions with business teams' },
          { fr: 'Recueil et analyse des besoins', en: 'Gathered and analysed requirements' },
          { fr: 'Modélisation UML : cas d’utilisation, séquence, activité et état', en: 'UML modelling: use case, sequence, activity and state diagrams' },
        ],
      },
      {
        title: { fr: 'Construire la solution', en: 'Building the solution' },
        items: [
          { fr: 'Participation au paramétrage de la solution de gestion électronique du courrier', en: 'Helped configure the electronic mail management solution' },
          { fr: 'Rédaction de spécifications et de documentation fonctionnelle et technique', en: 'Wrote specifications and functional and technical documentation' },
          { fr: 'Préparation du cahier de recette et des tests fonctionnels', en: 'Prepared the acceptance test plan and functional tests' },
        ],
      },
      {
        title: { fr: 'Accompagner le changement', en: 'Supporting the change' },
        items: [
          { fr: 'Création de supports et de fiches utilisateurs', en: 'Created user guides and quick-reference sheets' },
          { fr: 'Accompagnement et formation des agents à la nouvelle solution', en: 'Supported and trained staff on the new solution' },
        ],
      },
      {
        title: { fr: 'Mesurer', en: 'Measuring' },
        items: [
          { fr: 'Création et exploitation de questionnaires d’enquête', en: 'Built and ran survey questionnaires' },
          { fr: 'Analyse des résultats et webreporting', en: 'Analysed results and produced web reports' },
          { fr: 'Contribution au suivi des indicateurs de performance (KPI)', en: 'Contributed to KPI tracking' },
        ],
      },
    ],
    takeaway: {
      fr: 'Ce que j’en retiens : le rôle concret de l’AMOA, l’importance du dialogue avec les utilisateurs, et la nécessité de traduire les besoins métier en solutions fonctionnelles.',
      en: 'What I took away: what AMOA really means day to day, how much depends on talking with users, and how to translate business needs into functional solutions.',
    },
  },

  dauphine: {
    id: 'dauphine',
    kind: 'education',
    name: { fr: 'Université Paris Dauphine-PSL', en: 'Université Paris Dauphine-PSL' },
    sign: { fr: 'Paris Dauphine-PSL', en: 'Paris Dauphine-PSL' },
    role: { fr: 'Master MIAGE', en: "MIAGE Master's degree (IT applied to business management)" },
    period: { fr: '2024 – 2026 · Diplômé en septembre 2026', en: '2024 – 2026 · Graduated in September 2026' },
    year: '2024',
    intro: {
      fr: 'Le Master MIAGE de Dauphine approfondit ce qui m’intéresse le plus : les systèmes d’information, la donnée et la gestion de projet, toujours au service des besoins de l’entreprise. Mes deux stages de master se déroulent chez Fastcube puis chez KPMG.',
      en: "Dauphine's MIAGE Master's deepens what interests me most: information systems, data and project management, always in service of business needs. My two Master's internships take place at Fastcube and then at KPMG.",
    },
    sections: [
      {
        title: { fr: 'Quelques projets de ces deux années', en: 'A few projects from these two years' },
        items: [
          { fr: 'Opti’Match : agent IA de recommandation d’équipements informatiques (projet académique)', en: "Opti'Match: an AI agent recommending IT equipment (academic project)" },
          { fr: 'Découverte de dépendances fonctionnelles assistée par LLM', en: 'LLM-assisted discovery of functional dependencies' },
          { fr: 'Aide à la décision multicritère (ELECTRE TRI) appliquée au Nutri-Score', en: 'Multi-criteria decision analysis (ELECTRE TRI) applied to the Nutri-Score' },
          { fr: 'Deep learning : alignement images / légendes, en équipe de trois', en: 'Deep learning: aligning images and captions, in a team of three' },
          { fr: 'Développement full stack avec Spring Boot et Hibernate', en: 'Full-stack development with Spring Boot and Hibernate' },
        ],
      },
      {
        title: { fr: 'À voir plus loin', en: 'Further down the road' },
        text: {
          fr: 'Les projets sont détaillés sur la Place des projets, avec les liens vers le code.',
          en: 'The projects are detailed at Project Square, with links to the code.',
        },
      },
    ],
  },

  fastcube: {
    id: 'fastcube',
    kind: 'experience',
    name: { fr: 'Fastcube', en: 'Fastcube' },
    sign: { fr: 'Fastcube', en: 'Fastcube' },
    role: { fr: 'Consultant Data Management (stage)', en: 'Data Management Consultant (internship)' },
    period: { fr: 'Mai – septembre 2025', en: 'May – September 2025' },
    year: '2025',
    intro: {
      fr: 'Changement de terrain : la donnée. Chez Fastcube, j’ai travaillé sur trois sujets complémentaires : rendre les données plus accessibles, rendre les systèmes plus observables et automatiser des processus métier.',
      en: 'A change of terrain: data. At Fastcube I worked on three complementary topics: making data easier to access, making systems more observable, and automating business processes.',
    },
    sections: [
      {
        title: { fr: 'Virtualisation des données avec Denodo', en: 'Data virtualisation with Denodo' },
        items: [
          { fr: 'Connexion à des sources de données, création de vues et transformations', en: 'Connected data sources, built views and transformations' },
          { fr: 'Requêtes SQL et VQL : jointures, unions, agrégations', en: 'SQL and VQL queries: joins, unions, aggregations' },
          { fr: 'Analyse des performances des requêtes', en: 'Analysed query performance' },
          { fr: 'Découverte des statistiques du CBO et des vues matérialisées', en: 'Explored CBO statistics and materialised views' },
        ],
      },
      {
        title: { fr: 'Observabilité avec Grafana', en: 'Observability with Grafana' },
        items: [
          { fr: 'Déploiement d’un système d’alerting et de monitoring avec Grafana', en: 'Deployed an alerting and monitoring system with Grafana' },
          { fr: 'Exploitation des journaux applicatifs avec Loki et Alloy', en: 'Worked with application logs using Loki and Alloy' },
          { fr: 'Surveillance des applications et détection d’anomalies', en: 'Application monitoring and anomaly detection' },
        ],
      },
      {
        title: { fr: 'Automatisation', en: 'Automation' },
        items: [
          { fr: 'Automatisation de processus métier avec des solutions RPA (Automation Anywhere)', en: 'Automated business processes with RPA tools (Automation Anywhere)' },
        ],
      },
      {
        title: { fr: 'Et un projet complet', en: 'And a full project' },
        text: {
          fr: 'J’ai aussi conçu et développé une application web de Data Quality assistée par l’IA : elle vous attend au Labo, juste à côté.',
          en: "I also designed and built an AI-assisted data quality web application: it's waiting for you at the Lab, right next door.",
        },
      },
    ],
    takeaway: {
      fr: 'L’objectif commun : faciliter l’accès aux données, améliorer leur exploitation et rendre les systèmes plus observables.',
      en: 'The common goal: make data easier to access and use, and make systems more observable.',
    },
  },

  lab: {
    id: 'lab',
    kind: 'case-study',
    name: { fr: 'Labo Data Quality', en: 'Data Quality Lab' },
    sign: { fr: 'Labo Data Quality', en: 'Data Quality Lab' },
    role: { fr: 'Application de Data Quality assistée par l’IA', en: 'AI-assisted data quality application' },
    period: { fr: 'Réalisée chez Fastcube · 2025', en: 'Built at Fastcube · 2025' },
    intro: {
      fr: 'Le problème de départ : les utilisateurs métier connaissent leurs données, mais ne maîtrisent pas forcément SQL ou VQL. L’idée : leur permettre d’écrire des règles de qualité en langage naturel, puis de les transformer automatiquement en contrôles exécutables.',
      en: "The starting problem: business users know their data, but don't necessarily know SQL or VQL. The idea: let them write data quality rules in plain language, then turn them automatically into executable checks.",
    },
    sections: [],
  },

  kpmg: {
    id: 'kpmg',
    kind: 'experience',
    name: { fr: 'KPMG France', en: 'KPMG France' },
    sign: { fr: 'KPMG France', en: 'KPMG France' },
    role: { fr: 'Consultant SAP', en: 'SAP Consultant' },
    period: { fr: 'Depuis avril 2026 · stage, puis CDI', en: 'Since April 2026 · internship, then permanent role' },
    year: '2026',
    intro: {
      fr: 'Aujourd’hui, je suis consultant SAP chez KPMG France, dans le conseil en systèmes d’information et la transformation numérique. Après mon stage, j’ai rejoint l’équipe en CDI. C’est la suite logique de mon parcours MIAGE : enjeux métier, outils SAP et accompagnement de projets de transformation.',
      en: "Today I'm an SAP consultant at KPMG France, working in information systems consulting and digital transformation. After my internship I joined the team on a permanent contract. It's the natural next step after MIAGE: business stakes, SAP tools and supporting transformation projects.",
    },
    sections: [
      {
        title: { fr: 'Pilotage de projet (PMO)', en: 'Project management office (PMO)' },
        items: [
          { fr: 'Contribution au suivi des projets', en: 'Contributed to project tracking' },
          { fr: 'Préparation des reportings', en: 'Prepared reporting' },
          { fr: 'Suivi des livrables', en: 'Tracked deliverables' },
        ],
      },
      {
        title: { fr: 'Architecture d’entreprise et processus', en: 'Enterprise architecture & processes' },
        items: [
          { fr: 'SAP LeanIX : découverte et exploitation de l’outil pour cartographier le paysage applicatif', en: 'SAP LeanIX: learning and using the tool to map the application landscape' },
          { fr: 'SAP Signavio : exploration de la modélisation et de l’analyse des processus métier', en: 'SAP Signavio: exploring business process modelling and analysis' },
          { fr: 'Travaux sur la complémentarité entre LeanIX et Signavio, entre architecture d’entreprise et gestion des processus', en: 'Work on how LeanIX and Signavio complement each other, linking enterprise architecture and process management' },
        ],
      },
      {
        title: { fr: 'IA et SAP', en: 'AI & SAP' },
        items: [
          { fr: 'Exploration de cas d’usage de l’IA pour améliorer les processus et les activités de conseil', en: 'Exploring AI use cases to improve processes and consulting work' },
        ],
      },
    ],
    takeaway: {
      fr: 'Une vision transversale qui associe outils technologiques, processus métier et enjeux organisationnels.',
      en: 'A cross-functional view combining technology, business processes and organisational stakes.',
    },
  },

  projects: {
    id: 'projects',
    kind: 'projects',
    name: { fr: 'Place des projets', en: 'Project Square' },
    sign: { fr: 'Place des projets', en: 'Project Square' },
    role: { fr: 'Projets personnels et académiques', en: 'Personal and academic projects' },
    period: { fr: '2025 – 2026', en: '2025 – 2026' },
    intro: {
      fr: 'Chaque kiosque présente un projet, avec le code sur GitHub. On y retrouve deux fils rouges de mon parcours : les données et les échanges entre systèmes d’information.',
      en: 'Each stall presents a project, with the code on GitHub. Two threads of my path run through them: data, and the exchanges between information systems.',
    },
    sections: [],
  },

  lookout: {
    id: 'lookout',
    kind: 'outro',
    name: { fr: 'Le Belvédère', en: 'The Lookout' },
    sign: { fr: 'Le Belvédère', en: 'The Lookout' },
    role: { fr: 'Et maintenant ?', en: "What's next?" },
    period: { fr: 'Contact', en: 'Contact' },
    intro: {
      fr: 'D’ici, on voit tout le chemin parcouru. Mon objectif : continuer à évoluer à l’intersection des systèmes d’information, des métiers et de la gestion de projet, là où l’on aide les entreprises à améliorer leurs processus, à mieux exploiter leurs données et à piloter leurs transformations.',
      en: 'From up here you can see the whole road so far. My goal: keep growing where information systems, business and project management meet, helping companies improve their processes, make better use of their data and steer their transformations.',
    },
    sections: [],
  },
}

/** Étude de cas du Labo Data Quality. */
export const caseStudy = {
  steps: [
    { fr: 'L’utilisateur formule une règle de qualité en langage naturel.', en: 'The user writes a data quality rule in plain language.' },
    { fr: 'Le Denodo AI SDK génère la requête VQL correspondante.', en: 'The Denodo AI SDK generates the matching VQL query.' },
    { fr: 'La règle et sa requête sont enregistrées en base.', en: 'The rule and its query are stored in the database.' },
    { fr: 'Un planificateur déclenche l’exécution périodique de la règle.', en: 'A scheduler runs the rule periodically.' },
    { fr: 'Les résultats alimentent un historique d’exécution.', en: 'Results feed an execution history.' },
    { fr: 'Le système analyse les résultats pour détecter les violations.', en: 'The system analyses results to detect rule violations.' },
    { fr: 'Une alerte est déclenchée en cas d’anomalie.', en: 'An alert is raised when an anomaly is found.' },
  ] as L[],
  architecture: [
    { layer: { fr: 'Interface', en: 'Frontend' }, tech: 'React' },
    { layer: { fr: 'API', en: 'Backend' }, tech: 'Node.js · TypeScript', detail: { fr: 'contrôleurs, modèles, routes, services', en: 'controllers, models, routes, services' } },
    { layer: { fr: 'Stockage', en: 'Storage' }, tech: 'PostgreSQL', detail: { fr: 'règles et historique d’exécution', en: 'rules and execution history' } },
    { layer: { fr: 'Données & IA', en: 'Data & AI' }, tech: 'Denodo · Denodo AI SDK · VQL', detail: { fr: 'virtualisation et génération des requêtes', en: 'virtualisation and query generation' } },
    { layer: { fr: 'Automatisation', en: 'Automation' }, tech: { fr: 'Planificateur', en: 'Scheduler' }, detail: { fr: 'exécution périodique des règles', en: 'periodic rule execution' } },
    { layer: { fr: 'Supervision', en: 'Monitoring' }, tech: 'Grafana · Loki', detail: { fr: 'alertes en cas d’anomalie', en: 'alerts on anomalies' } },
  ] as { layer: L; tech: string | L; detail?: L }[],
  value: [
    { fr: 'Création de règles de qualité simplifiée', en: 'Simpler creation of data quality rules' },
    { fr: 'Moins de dépendance à l’écriture manuelle de requêtes', en: 'Less reliance on hand-written queries' },
    { fr: 'Contrôles automatisés et exécutions tracées', en: 'Automated checks with traceable runs' },
    { fr: 'Détection plus systématique des anomalies', en: 'More systematic anomaly detection' },
    { fr: 'Des outils de Data Quality accessibles aux utilisateurs métier', en: 'Data quality tooling that business users can actually use' },
  ] as L[],
  note: {
    fr: 'Projet interne à Fastcube : le code n’est pas public. Toutes les fonctionnalités décrites ici ont été implémentées.',
    en: "An internal Fastcube project, so the code isn't public. Every feature described here was implemented.",
  } as L,
}
