// Curated, bilingual navigation tree over the guide files.
// Big emojis + short FR/EN labels keep it usable for facilitators with
// limited literacy. Each leaf points to a generated file slug.
import type { Lang } from "./guide";

export interface NavItem {
  slug: string;
  emoji: string;
  fr: string;
  en: string;
}

export interface NavSection {
  id: string;
  emoji: string;
  color: string; // tailwind gradient classes
  fr: string;
  en: string;
  subFr: string;
  subEn: string;
  items: NavItem[];
}

export const NAV: NavSection[] = [
  {
    id: "phase-1",
    emoji: "🌱",
    color: "from-green-500 to-green-600",
    fr: "Phase 1 — Planification",
    en: "Phase 1 — Planning",
    subFr: "Entrer dans le village, créer le CDV, faire le plan (PDC)",
    subEn: "Enter the village, set up the CDV, make the plan (PDC)",
    items: [
      { slug: "phase-1-planning/01-visite-prealable", emoji: "🚶", fr: "Visite préalable", en: "Preliminary visit" },
      { slug: "phase-1-planning/02-ag1-orientation", emoji: "📣", fr: "AG1 — Orientation", en: "AG1 — Orientation" },
      { slug: "phase-1-planning/03-ag2-mise-en-place-cdv", emoji: "🗳️", fr: "AG2 — Mise en place du CDV", en: "AG2 — Set up the CDV" },
      { slug: "phase-1-planning/04-ag3-evaluation-sociale-marp", emoji: "🔎", fr: "AG3 — Évaluation sociale (MARP)", en: "AG3 — Social assessment (MARP)" },
      { slug: "phase-1-planning/05-identification-priorisation", emoji: "✅", fr: "Identifier & prioriser", en: "Identify & prioritize" },
      { slug: "phase-1-planning/06-ag4-pdc", emoji: "📋", fr: "AG4 — Plan (PDC)", en: "AG4 — Plan (PDC)" },
      { slug: "phase-1-planning/07-ag5-feedback", emoji: "🔔", fr: "AG5 — Retour de validation", en: "AG5 — Approval feedback" },
      { slug: "phase-1-planning/08-suivi-rapports", emoji: "📝", fr: "Suivi & rapports", en: "Monitoring & reports" },
    ],
  },
  {
    id: "phase-2",
    emoji: "🏗️",
    color: "from-amber-500 to-orange-600",
    fr: "Phase 2 — Préparation & mise en œuvre",
    en: "Phase 2 — Preparation & implementation",
    subFr: "Préparer le sous-projet, passer les marchés, construire",
    subEn: "Prepare the sub-project, do procurement, build",
    items: [
      { slug: "phase-2-preparation-implementation/01-preparation-sous-projet", emoji: "📐", fr: "Préparer le sous-projet", en: "Prepare the sub-project" },
      { slug: "phase-2-preparation-implementation/02-passation-marches", emoji: "🤝", fr: "Passation des marchés", en: "Procurement" },
      { slug: "phase-2-preparation-implementation/03-mise-en-oeuvre", emoji: "🧱", fr: "Mise en œuvre", en: "Implementation" },
      { slug: "phase-2-preparation-implementation/04-gestion-environnementale-sociale", emoji: "🌍", fr: "Gestion environnementale & sociale", en: "Environmental & social management" },
      { slug: "phase-2-preparation-implementation/05-gestion-financiere", emoji: "💰", fr: "Gestion financière", en: "Financial management" },
      { slug: "phase-2-preparation-implementation/06-suivi-mise-en-oeuvre", emoji: "👀", fr: "Suivi des travaux", en: "Implementation monitoring" },
      { slug: "phase-2-preparation-implementation/07-classement-archivage", emoji: "🗄️", fr: "Classement & archivage", en: "Filing & archiving" },
    ],
  },
  {
    id: "phase-3",
    emoji: "🎉",
    color: "from-sky-500 to-blue-600",
    fr: "Phase 3 — Clôture & durabilité",
    en: "Phase 3 — Closure & sustainability",
    subFr: "Terminer, vérifier (audit social), entretenir l'ouvrage",
    subEn: "Finish, check (social audit), maintain the works",
    items: [
      { slug: "phase-3-closure-sustainability/01-cloture-sous-projets", emoji: "🏁", fr: "Clôture des sous-projets", en: "Closing sub-projects" },
      { slug: "phase-3-closure-sustainability/02-genre-cloture", emoji: "♀️", fr: "Genre à la clôture", en: "Gender at closure" },
      { slug: "phase-3-closure-sustainability/03-cadre-redevabilite", emoji: "⚖️", fr: "Cadre de redevabilité", en: "Accountability framework" },
      { slug: "phase-3-closure-sustainability/04-audit-social", emoji: "🔍", fr: "Audit social", en: "Social audit" },
      { slug: "phase-3-closure-sustainability/05-entretien-maintenance", emoji: "🔧", fr: "Entretien & maintenance", en: "Operation & maintenance" },
    ],
  },
  {
    id: "foundations",
    emoji: "📚",
    color: "from-purple-500 to-fuchsia-600",
    fr: "Les bases",
    en: "The basics",
    subFr: "Idées qui servent partout : DCC, genre, climat, plaintes, acteurs",
    subEn: "Ideas used everywhere: CDD, gender, climate, grievances, actors",
    items: [
      { slug: "00-foundations/00-cycle-overview", emoji: "🗺️", fr: "Vue d'ensemble du cycle", en: "Cycle overview" },
      { slug: "00-foundations/01-dcc-approach", emoji: "🌍", fr: "L'approche DCC", en: "The CDD approach" },
      { slug: "00-foundations/02-facilitation-skills", emoji: "🎤", fr: "Techniques de facilitation", en: "Facilitation skills" },
      { slug: "00-foundations/03-gender-social-inclusion", emoji: "👥", fr: "Genre & inclusion", en: "Gender & inclusion" },
      { slug: "00-foundations/04-climate-change", emoji: "☀️", fr: "Changement climatique", en: "Climate change" },
      { slug: "00-foundations/05-grievance-mechanism-mgp", emoji: "📨", fr: "Mécanisme de plaintes (MGP)", en: "Grievance mechanism (MGP)" },
      { slug: "00-foundations/06-actors-and-roles", emoji: "🧑‍🤝‍🧑", fr: "Acteurs & rôles", en: "Actors & roles" },
      { slug: "00-foundations/07-cdv-structure-committees", emoji: "🏛️", fr: "Structure du CDV & comités", en: "CDV structure & committees" },
      { slug: "00-foundations/glossary-acronyms", emoji: "🔤", fr: "Glossaire & sigles", en: "Glossary & acronyms" },
    ],
  },
  {
    id: "forms",
    emoji: "📄",
    color: "from-rose-500 to-red-600",
    fr: "Formulaires & outils",
    en: "Forms & tools",
    subFr: "Tous les formulaires (OC, OP, F, P, T, ES) et où les utiliser",
    subEn: "All forms (OC, OP, F, P, T, ES) and where to use them",
    items: [
      { slug: "forms/forms-catalog", emoji: "🗂️", fr: "Catalogue des formulaires", en: "Forms catalog" },
    ],
  },
  {
    id: "apps",
    emoji: "📱",
    color: "from-teal-500 to-cyan-600",
    fr: "Applications mobiles",
    en: "Mobile apps",
    subFr: "L'appli DCC (suivi du cycle) et l'appli eMGP (plaintes)",
    subEn: "The CDD app (cycle tracking) and the eMGP app (grievances)",
    items: [
      { slug: "tools-apps/app-dcc", emoji: "📲", fr: "Application DCC", en: "CDD app" },
      { slug: "tools-apps/app-emgp", emoji: "📥", fr: "Application eMGP", en: "eMGP app" },
    ],
  },
];

export function sectionLabel(s: NavSection, lang: Lang) {
  return lang === "fr" ? s.fr : s.en;
}
export function sectionSub(s: NavSection, lang: Lang) {
  return lang === "fr" ? s.subFr : s.subEn;
}
export function itemLabel(i: NavItem, lang: Lang) {
  return lang === "fr" ? i.fr : i.en;
}

export function findItem(slug: string): { section: NavSection; item: NavItem } | undefined {
  for (const section of NAV) {
    const item = section.items.find((i) => i.slug === slug);
    if (item) return { section, item };
  }
  return undefined;
}
