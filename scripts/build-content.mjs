// Build-time content bundler.
// Reads every guide markdown file and emits lib/guide-data.json — a single
// JSON the app imports both for browsing (server components) and for the AI
// chat (the full text becomes Claude's cached, grounded context).
import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

// Content lives in these top-level folders (the original guide structure).
const SECTION_DIRS = [
  "00-foundations",
  "phase-1-planning",
  "phase-2-preparation-implementation",
  "phase-3-closure-sustainability",
  "forms",
  "tools-apps",
];

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (entry.endsWith(".md")) out.push(full);
  }
  return out;
}

const files = [];
for (const section of SECTION_DIRS) {
  const dir = join(ROOT, section);
  let mdFiles;
  try {
    mdFiles = walk(dir);
  } catch {
    continue; // section folder may not exist
  }
  for (const full of mdFiles) {
    const raw = readFileSync(full, "utf8");
    const { data, content } = matter(raw);
    const slug = relative(ROOT, full).replace(/\.md$/, "");
    files.push({
      slug, // e.g. "phase-1-planning/02-ag1-orientation"
      section,
      title: data.title || slug,
      frontmatter: data,
      body: content.trim(),
    });
  }
}

files.sort((a, b) => a.slug.localeCompare(b.slug, "fr"));

// One big text blob for the AI: every file, labelled, so answers stay grounded.
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
  combined,
};

const libDir = join(ROOT, "lib");
mkdirSync(libDir, { recursive: true });
writeFileSync(join(libDir, "guide-data.json"), JSON.stringify(out));
console.log(
  `[build-content] bundled ${files.length} files, ${(combined.length / 1024).toFixed(0)} KB of guide text -> lib/guide-data.json`
);
