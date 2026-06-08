# CLAUDE.md — How this guide works

This folder is an **AI-friendly replica of the PCRSS / Sahel Community-Driven Development (CDD / DCC) Facilitator Guide** (Parts 1, 2, 3). It is built so an AI assistant can answer a facilitator's questions about any phase, activity, task, or form — accurately, in French or English, grounded in the source guides.

It is **not** a rewrite. The substance is faithful to the original. French is the authoritative language of the source; each file keeps the French content and adds an English working layer so questions can be asked and answered in either language.

---

## What this models

The PCRSS community investment cycle has **6 phases** and **14 steps** (plus a preparatory Phase 0).

**This guide is organized by the cycle — Phase → Activity → Task — not by the source guide Parts.** Parts I/II/III are just the documents the content came from; the cycle's phases run *across* them. The content is now split so each phase is a folder, each activity is a sub-folder, and each task is its own file. For provenance, the three source guides map onto the cycle like this:

| Source | Covers | Phases / Steps |
|---|---|---|
| Guide Part 1 (Nov 2024) | Foundations + community planning up to the PDC | Phases 1–3, Steps 1–7 (+ monitoring, apps) |
| Guide Part 2 (Apr 2025) | Sub-project preparation & implementation | Phases 4–5, Steps 8–11 |
| Guide Part 3 (Jan 2026) | Sub-project closure & sustainability | Phase 6, Steps 12–14 |

The single source of truth for the phase/step spine is [`00-foundations/00-cycle-overview.md`](00-foundations/00-cycle-overview.md). Read it first when a question is about *where* something sits in the cycle.

---

## Folder map

```
Sahel-PCRSS-CDD-Guide/
├── CLAUDE.md                         ← you are here
├── README.md                         ← human-readable index
├── 00-foundations/                   ← cross-cutting concepts (apply to every phase)
│   ├── 00-cycle-overview.md          ← the 6-phase / 14-step master table
│   ├── 01-dcc-approach.md            ← what DCC/DCC is, rights & duties, directive vs facilitation
│   ├── 02-facilitation-skills.md     ← facilitation & training techniques, types of questions
│   ├── 03-gender-social-inclusion.md ← gender norms, the 7 gender requirements, inclusion measures
│   ├── 04-climate-change.md          ← how to integrate climate across the cycle
│   ├── 05-grievance-mechanism-mgp.md ← GRM/MGP process, complaint types, EAS/HS
│   ├── 06-actors-and-roles.md        ← every actor (FC, FT, B-CDV, committees, AR, ERAR…) and their role
│   ├── 07-cdv-structure-committees.md← B-CDVFQ + specialized committees: composition & mandate
│   └── glossary-acronyms.md          ← all acronyms FR→EN
│
│   PHASES → ACTIVITIES → TASKS (the cycle, not the guide Parts)
│   Each phase = folder with a README.md (phase index).
│   Each activity = sub-folder with a README.md (overview + quick reference + task list + checklist).
│   Each task = its own file (tache-N-*.md) holding the verbatim French source for that step.
│
├── phase-1-visites-prealables/              ← Steps 1–2
│   ├── README.md
│   ├── activite-1-visite-prealable/         (README.md + tache-1..4)
│   └── activite-2-orientation-ag1/          (README.md + tache-1..7)
├── phase-2-mobilisation-communautaire/      ← Steps 3–4
│   ├── activite-1-mise-en-place-cdv-ag2/
│   └── activite-2-evaluation-sociale-marp-ag3/
├── phase-3-planification-villageoise/       ← Steps 5–7
│   ├── activite-1-identification-priorisation/
│   ├── activite-2-pdc-ag4/
│   └── activite-3-feedback-validation-ag5/
├── phase-4-preparation-sous-projets/        ← Steps 8–9
│   ├── activite-1-preparation-sous-projet/
│   └── activite-2-passation-marches/
├── phase-5-mise-en-oeuvre/                  ← Steps 10–11
│   ├── activite-1-mise-en-oeuvre/
│   ├── activite-2-gestion-environnementale-sociale/
│   ├── activite-3-gestion-financiere/
│   ├── activite-4-suivi-mise-en-oeuvre/
│   └── activite-5-classement-archivage/
├── phase-6-cloture/                         ← Steps 12–14
│   ├── activite-1-cloture-sous-projets/
│   ├── activite-2-genre-cloture/
│   ├── activite-3-audit-social/
│   └── activite-4-entretien-maintenance/
├── transversal/                            ← cross-cutting, span the whole cycle
│   ├── suivi-rapports/                      (monitoring & reporting, the SIG/MIS)
│   └── cadre-redevabilite/                  (accountability framework)
├── forms/
│   └── forms-catalog.md              ← every form/tool code (OP, F, P, T, ES, OC) with purpose & where used
└── tools-apps/
    ├── app-dcc.md                    ← DCC mobile app (install, login, features)
    └── app-emgp.md                   ← eMGP grievance app
```

> The web app (`app/`, `scripts/build-content.mjs`) still expects the old `phase-1-planning/` etc. layout and has **not** been migrated to this new tree yet — that's a separate task.

---

## File anatomy (read this so you know where to look inside a file)

There are three levels of file:

**Phase index** — `phase-N-*/README.md`: a one-line phase summary, the steps it covers, and the list of activities (with links and task counts).

**Activity README** — `phase-N-*/activite-K-*/README.md`: the fast-answer layer for an activity.
1. **YAML frontmatter** — machine-readable metadata: `id`, `phase`, `step`, `source`, `duration`, `actors`, `forms`, `quorum`. Use this for routing and quick facts.
2. **Breadcrumb** — `> Phase N · Activité K · Étape … · Source …`.
3. **`## Aperçu (FR)`** — the activity's introductory French text.
4. **`## Quick reference (EN)`** — objective, when, who participates, key rules/thresholds.
5. **`## Tâches de cette activité`** — ordered links to the task files.
6. **`## Tâches du facilitateur (checklist)`** — the action checklist for the whole activity.
7. **`## Cross-cutting`** — how gender, climate, GRM, and accountability apply.

**Task file** — `phase-N-*/activite-K-*/tache-M-*.md`: one step/sub-section of the activity. Frontmatter (`id`, `phase`, `activity`, `task`, `source`) + the **faithful French source content** for that task (steps, tables, facilitation tips). This is the authoritative replica; quote from here when precision matters.

---

## How to answer questions (instructions for the AI)

**Golden rule: answer only from this folder.** This is a faithful replica of an official guide. Do not invent procedures, thresholds, amounts, durations, quorums, or committee compositions. If something isn't covered here, say so plainly and point to the closest section.

When a facilitator asks a question:

1. **Locate it in the cycle.** Identify the phase/step from `00-cycle-overview.md`, open the phase folder's `README.md`, then the matching activity `README.md`, then the specific `tache-*.md`. A question naming an "AG" (assemblée générale), a committee, a form code (e.g. F19, T15, P8, ES1), or a step number is a direct routing signal.
2. **Lead with the activity Quick reference**, then back it with the French detail in the relevant task file. If the user writes in French, answer in French and quote the French source. If in English, answer in English but preserve official French terms (B-CDVFQ, PDC, MGP, screening, etc.) with a short gloss.
3. **Be exact on hard facts.** Quorums (50% of households, 30% women), the grant amount (33,5 millions FCFA per village), tranche splits (20/50/30%), procurement thresholds (e.g. AOL ≥ 20 000 000 FCFA), petty-cash ceiling (50 000 FCFA), retention periods (10 years) — pull these verbatim, don't paraphrase loosely.
4. **Always surface the relevant form.** If the activity produces or requires a form, name its code and point to `forms/forms-catalog.md`.
5. **Apply the cross-cutting lenses** when relevant: does the answer need a gender requirement, a climate consideration, or a GRM step? Mention it.
6. **Don't over-format.** Facilitators want a clear, usable answer — short paragraphs and only the lists that help.

### Example routings

- "Comment se déroule l'élection du bureau CDV ?" → `phase-2-mobilisation-communautaire/activite-1-mise-en-place-cdv-ag2/` (tâche « Processus électoral »)
- "What's the quorum for a general assembly?" → `00-foundations/00-cycle-overview.md` + `phase-1-visites-prealables/activite-2-orientation-ag1/` (50% households, 30% women)
- "Quels sont les seuils de passation de marché ?" → `phase-4-preparation-sous-projets/activite-2-passation-marches/` (tâche « Types de marchés et seuils »)
- "How do I run a social audit?" → `phase-6-cloture/activite-3-audit-social/`
- "What is form F19?" → `forms/forms-catalog.md` (Rapport financier d'achèvement d'un sous-projet)
- "How should I include women in priority-setting?" → `00-foundations/03-gender-social-inclusion.md` + the specific activity

---

## Provenance & maintenance

- Source documents: `Facilitator Guide Part 1/2/3 - Sahel.docx` (in the parent folder). Country context: Mali (PCRSS, Liptako-Gourma).
- Each activity file's frontmatter records its `source` (which Part and section).
- If the source guides are updated, update the matching activity file and `00-cycle-overview.md` together.
- This replica preserves the guide's intent: the facilitator **accompanies** the community to do things themselves — it never decides or acts in their place.
