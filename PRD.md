# PRD — Frise chronologique de séries historiques / Historical Series Timeline

---

## Table of contents / Sommaire

1. [Vision & Objectif / Vision & Goal](#vision)
2. [Personas](#personas)
3. [Fonctionnalités / Features](#features)
4. [User Stories](#user-stories)
5. [Architecture de l'information / Information Architecture](#ia)
6. [Design & UX](#design)
7. [Data Model](#data-model)
8. [Technical Stack](#tech-stack)
9. [Out of Scope](#out-of-scope)
10. [Métriques de succès / Success Metrics](#metrics)
11. [Roadmap](#roadmap)

---

## 1. Vision & Objectif / Vision & Goal <a name="vision"></a>

### FR
Créer une fresque historique interactive en mode parallaxe permettant de découvrir, à travers les séries télévisées, les grandes époques de l'histoire humaine. L'utilisateur parcourt une frise temporelle allant de l'Antiquité à nos jours et voit apparaître les séries dont l'histoire se déroule à chaque période. L'objectif est de susciter la curiosité historique et d'orienter le spectateur vers des œuvres de fiction qui incarnent chaque époque.

### EN
Build an interactive parallax historical fresco that lets users discover major eras of human history through TV series. Users scroll a timeline spanning from Antiquity to the present day and see shows anchored to the period in which their story unfolds. The goal is to spark historical curiosity and guide viewers toward fiction that brings each era to life.

---

## 2. Personas <a name="personas"></a>

| # | Name | FR Description | EN Description |
|---|------|---------------|---------------|
| P1 | **Le curieux culturel** / The Cultural Explorer | Passionné de séries, peu versé dans l'histoire. Cherche à explorer le passé via la fiction. | Series enthusiast, not a history buff. Wants to explore the past through fiction. |
| P2 | **L'historien amateur** / The Amateur Historian | Connaît l'histoire mais veut découvrir des séries méconnues liées à ses périodes favorites. | Knows history well, wants to uncover lesser-known shows tied to favourite eras. |
| P3 | **L'enseignant** / The Teacher | Cherche des supports culturels pour rendre l'histoire vivante en classe. | Looking for cultural resources to make history engaging in the classroom. |
| P4 | **Le binge-watcher** / The Binge-Watcher | Veut juste une recommandation claire de quoi regarder ce soir, filtrée par époque. | Just wants a clear "what to watch tonight" answer, filtered by era. |

---

## 3. Fonctionnalités / Features <a name="features"></a>

### 3.1 Frise chronologique / Timeline

| # | FR | EN |
|---|----|----|
| F-01 | Frise horizontale scrollable couvrant de ~3000 av. J.-C. à nos jours | Horizontal scrollable timeline from ~3000 BC to present |
| F-02 | Échelle temporelle non-linéaire : densité plus forte aux périodes riches en séries | Non-linear time scale: denser around era-rich periods |
| F-03 | Grandes époques colorées en arrière-plan (Antiquité, Moyen Âge, Renaissance, etc.) | Major eras colour-coded in background (Antiquity, Middle Ages, Renaissance, etc.) |
| F-04 | Indicateurs d'événements historiques majeurs (chute de Rome, Révolution Française…) | Major historical event markers (Fall of Rome, French Revolution…) |
| F-05 | Navigation clavier (←/→) et molette souris / trackpad | Keyboard (←/→) and mouse-wheel / trackpad navigation |

### 3.2 Cartes de séries / Show Cards

| # | FR | EN |
|---|----|----|
| F-06 | Carte affichée à l'année de début de l'histoire (pas de la diffusion) | Card placed at the story's start year (not broadcast year) |
| F-07 | Indicateur de durée narrative (ex. : une série couvrant 50 ans s'étale sur la frise) | Narrative span indicator (e.g., a show covering 50 years stretches across the timeline) |
| F-08 | Gestion des flashbacks : placement principal + badge "flashback" vers une autre période | Flashback support: primary placement + "flashback" badge linking to another era |
| F-09 | Affichage de la pochette (poster), titre, années narratives, plateforme(s) de streaming | Show poster, title, narrative years, streaming platform(s) |
| F-10 | Score historique (fiabilité historique évaluée de 1 à 5 — ex. : docu-drama vs fantaisie) | Historical accuracy score (1–5 rating — e.g., docudrama vs. fantasy) |
| F-11 | Langues disponibles (VO, VF…) | Available languages (original, dubbed…) |

### 3.3 Détail d'une série / Show Detail Panel

| # | FR | EN |
|---|----|----|
| F-12 | Panneau latéral ou modal avec synopsis historique (pas le synopsis de la série) | Side panel / modal with a historical synopsis (not the show's plot synopsis) |
| F-13 | Lien vers la fiche Wikipedia de la période historique | Link to Wikipedia page of the historical period |
| F-14 | "Séries similaires" : autres œuvres de la même époque | "Similar shows": other works from the same era |
| F-15 | Liens directs vers les plateformes de streaming | Direct links to streaming platforms |
| F-16 | Bouton "Ajouter à ma watchlist" (compte requis) | "Add to watchlist" button (account required) |

### 3.4 Filtres & Recherche / Filters & Search

| # | FR | EN |
|---|----|----|
| F-17 | Filtre par région géographique (Europe, Asie, Amériques…) | Filter by geographic region (Europe, Asia, Americas…) |
| F-18 | Filtre par plateforme de streaming | Filter by streaming platform |
| F-19 | Filtre par genre (Péplum, Médiéval, Guerre, Biopic…) | Filter by genre (Peplum, Medieval, War, Biopic…) |
| F-20 | Filtre par score de fiabilité historique | Filter by historical accuracy score |
| F-21 | Recherche textuelle par titre ou personnage historique | Text search by title or historical figure |
| F-22 | Filtre "disponible dans mon pays" | "Available in my country" filter |

### 3.5 Compte utilisateur / User Account

| # | FR | EN |
|---|----|----|
| F-23 | Inscription / connexion (email ou OAuth Google/Apple) | Sign-up / login (email or Google/Apple OAuth) |
| F-24 | Watchlist personnalisée | Personal watchlist |
| F-25 | Marquage "Vu" / "En cours" / "A voir" | "Watched" / "Watching" / "To watch" marking |
| F-26 | Recommandations basées sur les séries vues | Recommendations based on watched shows |

### 3.6 Contribution communautaire / Community Contribution

| # | FR | EN |
|---|----|----|
| F-27 | Proposition d'ajout d'une série (formulaire soumis à modération) | Suggest a new show (form submitted for moderation) |
| F-28 | Correction de la date narratives (vote communautaire) | Correct narrative dates (community vote) |
| F-29 | Commentaires sur le contexte historique d'une série | Comments on a show's historical context |

---

## 4. User Stories <a name="user-stories"></a>

```
US-01  En tant que curieux culturel,
       je veux faire défiler une frise animée,
       afin de découvrir quelles séries se déroulent au Moyen Âge.

US-02  En tant qu'amateur d'histoire romaine,
       je veux filtrer par "Antiquité / Europe",
       afin d'obtenir uniquement les séries situées dans l'Empire romain.

US-03  En tant qu'enseignant,
       je veux partager un lien vers "la frise au XVIe siècle",
       afin que mes élèves voient Les Tudors, Les Borgia et Versailles en contexte.

US-04  En tant que binge-watcher,
       je veux cliquer sur une carte de série,
       afin d'accéder directement à Netflix/Amazon/Disney+ pour la regarder.

US-05  En tant qu'utilisateur inscrit,
       je veux marquer Vikings comme "Vu",
       afin que le système me recommande d'autres séries vikings ou médiévales.

US-06  En tant que contributeur,
       je veux signaler que "The Last Kingdom" devrait être ancré en 878 et non 900,
       afin d'améliorer la précision de la frise pour tous.
```

---

## 5. Architecture de l'information / Information Architecture <a name="ia"></a>

```
Home
├── Frise principale (Timeline)
│   ├── Époque > Série > Détail série
│   └── Événements historiques (tooltips)
├── Recherche / Filtres
├── Explorer par région
├── Explorer par genre
├── Mon compte
│   ├── Watchlist
│   ├── Historique
│   └── Recommandations
└── À propos / Contribuer
```

---

## 6. Design & UX <a name="design"></a>

### Paradigme visuel / Visual Paradigm

**FR** : La frise est une fresque immersive à défilement horizontal. L'effet parallaxe crée une profondeur : les arrière-plans d'époque (illustrations, textures parchemin, couleurs) défilent plus lentement que les cartes de séries au premier plan. L'ambiance oscille entre musée interactif et magazine visuel haut de gamme.

**EN**: The timeline is an immersive horizontal-scroll fresco. A parallax effect creates depth: era backgrounds (illustrations, parchment textures, colour palettes) scroll slower than the foreground show cards. The mood sits between an interactive museum and a premium visual magazine.

### Principes UX / UX Principles

| # | FR | EN |
|---|----|----|
| UX-01 | "Show, don't tell" — la frise parle d'elle-même sans tutoriel | "Show, don't tell" — the timeline speaks for itself without a tutorial |
| UX-02 | Zero friction sur mobile : swipe horizontal natif | Zero friction on mobile: native horizontal swipe |
| UX-03 | Accessibilité WCAG AA : contraste, navigation clavier, ARIA | WCAG AA accessibility: contrast, keyboard navigation, ARIA |
| UX-04 | Chargement progressif : squelette de frise affiché < 1 s | Progressive loading: timeline skeleton displayed < 1 s |
| UX-05 | Mode sombre / clair | Dark / light mode |

### Zones visuelles de la frise / Timeline Visual Zones

```
┌─────────────────────────────────────────────────────────────────────┐
│  [BARRE DE NAVIGATION + FILTRES]                                    │
├─────────────────────────────────────────────────────────────────────┤
│  ░░░ COUCHE 1 – Fond d'époque (parallaxe lente) ░░░░░░░░░░░░░░░░░  │
│  ─── COUCHE 2 – Axe temporel + Événements historiques ─────────── │
│  ▓▓▓ COUCHE 3 – Cartes séries (parallaxe rapide) ▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │
├─────────────────────────────────────────────────────────────────────┤
│  [PANNEAU DÉTAIL — slide-in depuis la droite]                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 7. Data Model <a name="data-model"></a>

### Show (Série)

```typescript
interface Show {
  id: string;
  title: {
    fr: string;
    en: string;
    original: string;
  };
  posterUrl: string;
  narrativeYearStart: number;       // story start year (negative = BC)
  narrativeYearEnd: number | null;  // null if ongoing within the story
  broadcastYearStart: number;       // real broadcast year
  broadcastYearEnd: number | null;
  historicalAccuracyScore: 1 | 2 | 3 | 4 | 5;
  genres: Genre[];
  regions: Region[];
  platforms: Platform[];
  flashbacks: Flashback[];
  historicalContext: {
    fr: string;
    en: string;
  };
  historicalFigures: string[];      // named real historical figures
  wikipediaUrl: string;
  trailerUrl?: string;
  languages: string[];              // ISO 639-1
  countryAvailability: string[];    // ISO 3166-1 alpha-2
}

interface Flashback {
  narrativeYearStart: number;
  narrativeYearEnd: number;
  description: { fr: string; en: string };
}

type Genre =
  | "peplum" | "medieval" | "renaissance" | "revolution"
  | "war" | "biopic" | "western" | "colonial" | "ancient_east"
  | "cold_war" | "20th_century" | "contemporary";

type Region =
  | "europe_west" | "europe_east" | "mediterranean" | "middle_east"
  | "asia_east" | "asia_south" | "africa" | "americas_north"
  | "americas_south" | "oceania";

type Platform =
  | "netflix" | "prime_video" | "disney_plus" | "apple_tv"
  | "max" | "canal_plus" | "arte" | "other";
```

### HistoricalEra (Époque)

```typescript
interface HistoricalEra {
  id: string;
  name: { fr: string; en: string };
  yearStart: number;
  yearEnd: number;
  colorPalette: string[];           // hex codes for background gradient
  backgroundAssetUrl: string;       // parallax background illustration
  description: { fr: string; en: string };
  keyEvents: HistoricalEvent[];
}

interface HistoricalEvent {
  year: number;
  name: { fr: string; en: string };
  iconUrl?: string;
}
```

---

## 8. Technical Stack <a name="tech-stack"></a>

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Frontend | **Next.js 14** (App Router) | SSR for SEO on show pages; RSC for performance |
| Parallax / Animation | **Framer Motion** + CSS `scroll-timeline` | Smooth parallax without heavy libs |
| Styling | **Tailwind CSS** | Rapid iteration, dark-mode utility |
| State | **Zustand** | Lightweight, sufficient for filter/timeline state |
| Database | **PostgreSQL** (Supabase) | Relational — clear FK between shows, eras, platforms |
| Search | **Algolia** (or Supabase FTS) | Instant search across titles & historical figures |
| Auth | **Supabase Auth** | Matches DB choice; supports OAuth |
| CMS / Back-office | **Payload CMS** or **Directus** | Editorial team to add/moderate shows without code |
| Image CDN | **Cloudinary** | Poster transformations & WebP delivery |
| Hosting | **Vercel** | Next.js-native, edge functions for geolocation filter |
| i18n | **next-intl** | FR / EN routing (`/fr`, `/en`) |

---

## 9. Out of Scope <a name="out-of-scope"></a>

- Films (movies) — séries uniquement pour v1 / series only for v1
- Podcasts, livres, jeux vidéo historiques
- Système de notation utilisateur (étoiles) — le score de fiabilité est éditorial
- Application mobile native (PWA suffisant pour v1)
- Monétisation / pub display pour v1
- Intégration API streaming temps réel (données de disponibilité = mises à jour manuelles ou hebdomadaires)

---

## 10. Métriques de succès / Success Metrics <a name="metrics"></a>

| Metric | Target (6 months) |
|--------|-------------------|
| Séries indexées / Shows indexed | ≥ 150 |
| Utilisateurs actifs mensuels / MAU | ≥ 5 000 |
| Durée moyenne de session / Avg. session duration | ≥ 4 min |
| Taux de clic vers streaming / Click-through to streaming | ≥ 15 % |
| Propositions communautaires / Community suggestions | ≥ 50/mois |
| Score NPS | ≥ 40 |

---

## 11. Roadmap <a name="roadmap"></a>

### Phase 1 — MVP (3 mois / 3 months)

- [ ] Frise statique avec ~50 séries clés (données JSON)
- [ ] Effet parallaxe de base (3 couches)
- [ ] Filtres par époque et région
- [ ] Panneau détail d'une série
- [ ] Bilingue FR/EN
- [ ] Responsive mobile

### Phase 2 — Engagement (mois 4–6 / months 4–6)

- [ ] Compte utilisateur + watchlist
- [ ] Système de recherche (Algolia)
- [ ] Score de fiabilité historique
- [ ] Liens streaming par pays (geolocation)
- [ ] Back-office CMS pour ajout de séries

### Phase 3 — Communauté (mois 7–9 / months 7–9)

- [ ] Formulaire de contribution / modération
- [ ] Commentaires contextuels
- [ ] Recommandations personnalisées
- [ ] Carte interactive géographique (exploration par région)
- [ ] Mode "Salle de classe" (lien partageable figé sur une époque)

---

## Exemples de séries / Example Shows

| Titre | Époque narrative / Narrative Era | Année début / Start Year | Région / Region |
|-------|----------------------------------|--------------------------|-----------------|
| Vikings | Époque viking / Viking Age | ~793 | Europe Nord |
| The Last Kingdom | Haut Moyen Âge / Early Middle Ages | 866 | Europe Ouest |
| Knightfall | Moyen Âge / Middle Ages | 1306 | Europe Ouest |
| Les Borgia / The Borgias | Renaissance | 1492 | Méditerranée |
| Reign | Renaissance | 1557 | Europe Ouest |
| Les Tudors / The Tudors | Renaissance | 1509 | Europe Ouest |
| Versailles | Baroque / Classical Age | 1667 | Europe Ouest |
| Black Sails | Golden Age of Piracy | 1715 | Amériques |
| Turn: Washington's Spies | American Revolution | 1776 | Amériques |
| Les Misérables | XIXe siècle / 19th century | 1815 | Europe Ouest |
| Peaky Blinders | Early 20th century | 1919 | Europe Ouest |
| Band of Brothers | WWII | 1944 | Europe |
| Marco Polo | Moyen Âge / Middle Ages | 1271 | Asie / Europe |
| Shogun | Époque Sengoku / Sengoku Period | 1600 | Asie |
| Spartacus | Antiquité / Antiquity | ~73 BC | Méditerranée |
| Rome | Antiquité / Antiquity | ~52 BC | Méditerranée |

---

*Document version 1.0 — 2026-05-17*
*Author: Michael Faurel*
