# Portfolio de Samy Cherief

Un portfolio à parcourir comme un jeu : un mini-Samy se promène dans une petite ville en 3D, et chaque bâtiment raconte une étape du parcours (formation, expériences, étude de cas, projets, compétences). Une **version rapide** présente tout sur une seule page classique (`#quick`), pour les recruteurs pressés ou les navigateurs sans 3D.

## Lancer le site en local

```bash
npm install
npm run dev
```

Puis ouvrir l'adresse affichée (par défaut http://localhost:5173).

## Modifier le contenu

Tous les textes sont dans `src/content/`, en français et en anglais :

| Fichier | Contenu |
|---|---|
| `profile.ts` | nom, accroche, contact, langues, certifications, centres d'intérêt, domaines visés, qualités |
| `stations.ts` | les 10 étapes du parcours et l'étude de cas Data Quality |
| `skills.ts` | les compétences, leur catégorie, leur niveau (`mission`, `formation`, `discovery`) et l'étape qui les débloque |
| `projects.ts` | les projets de la Place des projets |
| `ui.ts` | les textes de l'interface |

Le CV téléchargeable est `public/cv-samy-cherief.pdf`.

## Publier

```bash
npm run build
```

Le dossier `dist/` est un site statique : il se dépose tel quel sur GitHub Pages, Vercel ou Netlify. Les chemins sont relatifs, donc le site fonctionne aussi dans un sous-dossier.

## Organisation du code

- `src/world/` : la scène 3D (React Three Fiber). `layout.ts` contient le plan de la ville, les collisions et la route ; `Buildings.tsx` les bâtiments ; `Avatar.tsx` le personnage ; `Player.tsx` les déplacements, la caméra et le trajet automatique.
- `src/ui/` : l'interface (barre du haut, panneaux d'étape, sac à compétences, version rapide).
- `src/audio.ts` : musique et bruitages synthétisés en direct (Web Audio), sans fichier audio.
