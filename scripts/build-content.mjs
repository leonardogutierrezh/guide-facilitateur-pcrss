// Build-time content bundler.
// Reads every guide markdown file and emits lib/guide-data.json — a single
// JSON the app imports for browsing (server components), navigation, and the
// AI chat (the full text becomes the model's cached, grounded context).
//
// The guide is organized by the CYCLE — Phase -> Activity -> Task — not by the
// source guide Parts. The navigation tree below is generated from the folder
// structure so it stays in sync when phases/activities/tasks change.
import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

// ---- top-level section display config (order = display order) ----
const PHASE_FOLDERS = [
  "phase-1-visites-prealables",
  "phase-2-mobilisation-communautaire",
  "phase-3-planification-villageoise",
  "phase-4-preparation-sous-projets",
  "phase-5-mise-en-oeuvre",
  "phase-6-cloture",
  "transversal",
];

const SECTION_DIRS = [...PHASE_FOLDERS, "00-foundations", "forms", "tools-apps"];

const SECTION_META = {
  "phase-1-visites-prealables": {
    kind: "phase", emoji: "🌱", color: "from-green-500 to-green-600",
    fr: "Phase 1 — Visites préalables", en: "Phase 1 — Preliminary visits",
    subFr: "Entrer dans la commune et le village, présenter le projet",
    subEn: "Enter the commune and village, introduce the project",
  },
  "phase-2-mobilisation-communautaire": {
    kind: "phase", emoji: "🤝", color: "from-lime-500 to-green-600",
    fr: "Phase 2 — Mobilisation communautaire", en: "Phase 2 — Community mobilization",
    subFr: "Mettre en place le CDV et faire le diagnostic des besoins",
    subEn: "Set up the CDV and run the needs diagnosis",
  },
  "phase-3-planification-villageoise": {
    kind: "phase", emoji: "📋", color: "from-amber-500 to-orange-600",
    fr: "Phase 3 — Planification villageoise", en: "Phase 3 — Village planning",
    subFr: "Prioriser et écrire le Plan de Développement (PDC)",
    subEn: "Prioritize and write the Development Plan (PDC)",
  },
  "phase-4-preparation-sous-projets": {
    kind: "phase", emoji: "📐", color: "from-orange-500 to-amber-600",
    fr: "Phase 4 — Préparation des sous-projets", en: "Phase 4 — Sub-project preparation",
    subFr: "Études, dossiers et passation des marchés",
    subEn: "Studies, files and procurement",
  },
  "phase-5-mise-en-oeuvre": {
    kind: "phase", emoji: "🏗️", color: "from-rose-500 to-orange-600",
    fr: "Phase 5 — Mise en œuvre", en: "Phase 5 — Implementation",
    subFr: "Construire, gérer l'argent, suivre les travaux",
    subEn: "Build, manage money, monitor the works",
  },
  "phase-6-cloture": {
    kind: "phase", emoji: "🎉", color: "from-sky-500 to-blue-600",
    fr: "Phase 6 — Clôture", en: "Phase 6 — Closure",
    subFr: "Terminer, audit social, entretien et maintenance",
    subEn: "Finish, social audit, operation & maintenance",
  },
  "transversal": {
    kind: "phase", emoji: "♻️", color: "from-teal-500 to-cyan-600",
    fr: "Transversal — Suivi & redevabilité", en: "Cross-cutting — Monitoring & accountability",
    subFr: "Activités qui accompagnent tout le cycle",
    subEn: "Activities that span the whole cycle",
  },
  "00-foundations": {
    kind: "basic", emoji: "📚", color: "from-purple-500 to-fuchsia-600",
    fr: "Les bases", en: "The basics",
    subFr: "Idées qui servent partout : DCC, genre, climat, plaintes, acteurs",
    subEn: "Ideas used everywhere: CDD, gender, climate, grievances, actors",
  },
  "forms": {
    kind: "basic", emoji: "📄", color: "from-rose-500 to-red-600",
    fr: "Formulaires & outils", en: "Forms & tools",
    subFr: "Tous les formulaires (OC, OP, F, P, T, ES) et où les utiliser",
    subEn: "All forms (OC, OP, F, P, T, ES) and where to use them",
  },
  "tools-apps": {
    kind: "basic", emoji: "📱", color: "from-indigo-500 to-violet-600",
    fr: "Applications mobiles", en: "Mobile apps",
    subFr: "L'appli DCC (suivi du cycle) et l'appli eMGP (plaintes)",
    subEn: "The CDD app (cycle tracking) and the eMGP app (grievances)",
  },
};

// activity emoji by keyword found in the activity folder name
const ACT_EMOJI = [
  ["visite-prealable", "🚶"], ["orientation", "📣"], ["mise-en-place-cdv", "🗳️"],
  ["evaluation-sociale", "🔎"], ["identification-priorisation", "✅"], ["pdc", "📋"],
  ["feedback", "🔔"], ["preparation-sous-projet", "📐"], ["passation-marches", "🤝"],
  ["mise-en-oeuvre", "🧱"], ["gestion-environnementale", "🌍"], ["gestion-financiere", "💰"],
  ["suivi-mise-en-oeuvre", "👀"], ["classement-archivage", "🗄️"], ["cloture", "🏁"],
  ["genre", "♀️"], ["audit-social", "🔍"], ["entretien-maintenance", "🔧"],
  ["redevabilite", "⚖️"], ["suivi-rapports", "📝"],
];
function actEmoji(folder) {
  for (const [k, e] of ACT_EMOJI) if (folder.includes(k)) return e;
  return "📄";
}

// foundations / forms / apps: curated emoji+labels by slug (keeps the icons crisp)
const BASIC_ITEMS = {
  "00-foundations/00-cycle-overview": { emoji: "🗺️", fr: "Vue d'ensemble du cycle", en: "Cycle overview" },
  "00-foundations/01-dcc-approach": { emoji: "🌍", fr: "L'approche DCC", en: "The CDD approach" },
  "00-foundations/02-facilitation-skills": { emoji: "🎤", fr: "Techniques de facilitation", en: "Facilitation skills" },
  "00-foundations/03-gender-social-inclusion": { emoji: "👥", fr: "Genre & inclusion", en: "Gender & inclusion" },
  "00-foundations/04-climate-change": { emoji: "☀️", fr: "Changement climatique", en: "Climate change" },
  "00-foundations/05-grievance-mechanism-mgp": { emoji: "📨", fr: "Mécanisme de plaintes (MGP)", en: "Grievance mechanism (MGP)" },
  "00-foundations/06-actors-and-roles": { emoji: "🧑‍🤝‍🧑", fr: "Acteurs & rôles", en: "Actors & roles" },
  "00-foundations/07-cdv-structure-committees": { emoji: "🏛️", fr: "Structure du CDV & comités", en: "CDV structure & committees" },
  "00-foundations/glossary-acronyms": { emoji: "🔤", fr: "Glossaire & sigles", en: "Glossary & acronyms" },
  "forms/forms-catalog": { emoji: "🗂️", fr: "Catalogue des formulaires", en: "Forms catalog" },
  "tools-apps/app-dcc": { emoji: "📲", fr: "Application DCC", en: "CDD app" },
  "tools-apps/app-emgp": { emoji: "📥", fr: "Application eMGP", en: "eMGP app" },
};

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (entry.endsWith(".md")) out.push(full);
  }
  return out;
}

function firstH1(body) {
  const m = body.match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : null;
}

// "# Activité 6 — Quatrième AG : le PDC / 4th AG: Community Development Plan"
// -> { fr: "Quatrième AG : le PDC", en: "4th AG: Community Development Plan" }
function splitTitle(h1, fallback) {
  let s = h1 || fallback || "";
  const dash = s.indexOf(" — ");
  if (dash !== -1) s = s.slice(dash + 3).trim();
  s = s.replace(/^\d+(\.\d+)*\s+/, ""); // strip leading "5.6 " style numbering
  const parts = s.split(" / ");
  if (parts.length >= 2) return { fr: parts[0].trim(), en: parts.slice(1).join(" / ").trim() };
  return { fr: s.trim(), en: s.trim() };
}

// ---- collect files ----
const files = [];
const bySlug = new Map();
for (const section of SECTION_DIRS) {
  const dir = join(ROOT, section);
  let mdFiles;
  try { mdFiles = walk(dir); } catch { continue; }
  for (const full of mdFiles) {
    const raw = readFileSync(full, "utf8");
    const { data, content } = matter(raw);
    const slug = relative(ROOT, full).replace(/\.md$/, "").split("\\").join("/");
    const f = {
      slug,
      section,
      title: data.title || firstH1(content) || slug,
      frontmatter: data,
      body: content.trim(),
    };
    files.push(f);
    bySlug.set(slug, f);
  }
}
files.sort((a, b) => a.slug.localeCompare(b.slug, "fr"));

// ---- build nav tree ----
function listDirs(p) {
  return readdirSync(p)
    .filter((e) => statSync(join(p, e)).isDirectory())
    .sort((a, b) => a.localeCompare(b, "fr"));
}

const nav = [];
for (const section of SECTION_DIRS) {
  const meta = SECTION_META[section];
  if (!meta) continue;
  const dir = join(ROOT, section);
  if (!existsSync(dir)) continue;

  const node = { id: section, ...meta, items: [] };

  if (meta.kind === "phase") {
    for (const act of listDirs(dir)) {
      const actDir = join(dir, act);
      const readmeSlug = `${section}/${act}/README`;
      const readme = bySlug.get(readmeSlug);
      const lbl = splitTitle(readme ? firstH1(readme.body) : null, readme?.title || act);
      const item = { slug: readmeSlug, emoji: actEmoji(act), fr: lbl.fr, en: lbl.en, children: [] };
      const taskFiles = readdirSync(actDir)
        .filter((e) => e.startsWith("tache-") && e.endsWith(".md"))
        .sort((a, b) => {
          const na = parseInt(a.match(/^tache-(\d+)/)?.[1] || "0", 10);
          const nb = parseInt(b.match(/^tache-(\d+)/)?.[1] || "0", 10);
          return na - nb;
        });
      taskFiles.forEach((tf, i) => {
        const tslug = `${section}/${act}/${tf.replace(/\.md$/, "")}`;
        const t = bySlug.get(tslug);
        const tl = splitTitle(t ? firstH1(t.body) : null, t?.title || tf);
        item.children.push({ slug: tslug, emoji: "▫️", index: i + 1, fr: tl.fr, en: tl.en });
      });
      node.items.push(item);
    }
  } else {
    const sectionFiles = files.filter((f) => f.section === section);
    const curated = Object.keys(BASIC_ITEMS).filter((s) => s.startsWith(section + "/"));
    const ordered = [
      ...curated.filter((s) => bySlug.has(s)),
      ...sectionFiles.map((f) => f.slug).filter((s) => !curated.includes(s)),
    ];
    for (const slug of ordered) {
      const b = BASIC_ITEMS[slug];
      const f = bySlug.get(slug);
      const lbl = b || splitTitle(f ? firstH1(f.body) : null, f?.title || slug);
      node.items.push({ slug, emoji: (b && b.emoji) || "📄", fr: lbl.fr, en: lbl.en, children: [] });
    }
  }
  nav.push(node);
}

// ---- AI context blob ----
const combined = files
  .map(
    (f) =>
      `\n\n===== FILE: ${f.slug}.md =====\nTITLE: ${f.title}\n${
        f.frontmatter && Object.keys(f.frontmatter).length
          ? "FRONTMATTER: " + JSON.stringify(f.frontmatter) + "\n"
          : ""
      }\n${f.body}`
  )
  .join("\n");

const out = {
  generatedAt: new Date().toISOString(),
  fileCount: files.length,
  files,
  nav,
  combined,
};

const libDir = join(ROOT, "lib");
mkdirSync(libDir, { recursive: true });
writeFileSync(join(libDir, "guide-data.json"), JSON.stringify(out));
const activities = nav.reduce((n, s) => n + s.items.length, 0);
const tasks = nav.reduce((n, s) => n + s.items.reduce((m, a) => m + (a.children?.length || 0), 0), 0);
console.log(
  `[build-content] ${files.length} files · ${nav.length} sections · ${activities} activities · ${tasks} tasks · ${(combined.length / 1024).toFixed(0)} KB -> lib/guide-data.json`
);
