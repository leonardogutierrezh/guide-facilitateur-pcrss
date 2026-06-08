// Navigation tree over the guide, generated at build time from the folder
// structure (Phase -> Activity -> Task) by scripts/build-content.mjs and stored
// in guide-data.json. This file only types it and provides lookup helpers.
import data from "./guide-data.json";
import type { Lang } from "./guide";

export interface NavLeaf {
  slug: string;
  emoji: string;
  fr: string;
  en: string;
  index?: number;
}

export interface NavItem extends NavLeaf {
  children?: NavLeaf[]; // tasks (phases) — empty/absent for basic sections
}

export interface NavSection {
  id: string;
  kind: "phase" | "basic";
  emoji: string;
  color: string; // tailwind gradient classes
  fr: string;
  en: string;
  subFr: string;
  subEn: string;
  items: NavItem[];
}

export const NAV: NavSection[] = (data as unknown as { nav: NavSection[] }).nav;

export function sectionLabel(s: NavSection, lang: Lang) {
  return lang === "fr" ? s.fr : s.en;
}
export function sectionSub(s: NavSection, lang: Lang) {
  return lang === "fr" ? s.subFr : s.subEn;
}
export function leafLabel(i: NavLeaf, lang: Lang) {
  return lang === "fr" ? i.fr : i.en;
}
// kept for backwards-compatibility with existing imports
export const itemLabel = leafLabel;

export interface NavEntry {
  section: NavSection;
  activity: NavItem; // the activity (phase) or the file item (basic section)
  task: NavLeaf | null; // the task, when the slug points to a task file
}

/** Locate any slug (activity README, task, or basic file) in the tree. */
export function findEntry(slug: string): NavEntry | undefined {
  for (const section of NAV) {
    for (const activity of section.items) {
      if (activity.slug === slug) return { section, activity, task: null };
      for (const task of activity.children || []) {
        if (task.slug === slug) return { section, activity, task };
      }
    }
  }
  return undefined;
}

// kept for backwards-compatibility
export function findItem(slug: string): { section: NavSection; item: NavItem } | undefined {
  const e = findEntry(slug);
  return e ? { section: e.section, item: e.activity } : undefined;
}

/** Flatten a section into reading order: activity, its tasks, next activity… */
export function flattenSection(section: NavSection): NavLeaf[] {
  const out: NavLeaf[] = [];
  for (const activity of section.items) {
    out.push(activity);
    for (const task of activity.children || []) out.push(task);
  }
  return out;
}

/** Previous / next navigable leaf within the same section. */
export function prevNext(slug: string): { prev: NavLeaf | null; next: NavLeaf | null } {
  const entry = findEntry(slug);
  if (!entry) return { prev: null, next: null };
  const flat = flattenSection(entry.section);
  const i = flat.findIndex((l) => l.slug === slug);
  return {
    prev: i > 0 ? flat[i - 1] : null,
    next: i >= 0 && i < flat.length - 1 ? flat[i + 1] : null,
  };
}
