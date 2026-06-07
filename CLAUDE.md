# CLAUDE.md — How this guide works

This folder is an **AI-friendly replica of the PCRSS / Sahel Community-Driven Development (CDD / DCC) Facilitator Guide** (Parts 1, 2, 3). It is built so an AI assistant can answer a facilitator's questions about any phase, activity, task, or form — accurately, in French or English, grounded in the source guides.

It is **not** a rewrite. The substance is faithful to the original. French is the authoritative language of the source; each file keeps the French content and adds an English working layer so questions can be asked and answered in either language.

---

## What this models

The PCRSS community investment cycle has **6 phases** and **14 steps** (plus a preparatory Phase 0). The three source guides map onto it like this:

| Source | Covers | Phases / Steps |
|---|---|---|
| Guide Part 1 (Nov 2024) | Foundations + community planning up to the PDC | Phases 1–3, Steps 1–7 (+ monitoring, apps) |
| Guide Part 2 (Apr 2025) | Sub-project preparation & implementation | Phases 4–5, Steps 8–11 |
| Guide Part 3 (Jan 2026) | Sub-project closure & sustainability | Phase 6, Steps 12–14 |

The single source of truth for the phase/step spine is [`00-foundations/00-cycle-overview.md`](00-foundations/00-cycle-overview.md). Read it first when a question is about *where* something sits in the cycle.

---

## Folder map

```
CDD-Cycle-Guide/
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
├── phase-1-planning/                 ← Part 1 activities (community mobilization → PDC)
│   ├── 01-visite-prealable.md
│   ├── 02-ag1-orientation.md
│   ├── 03-ag2-mise-en-place-cdv.md
│   ├── 04-ag3-evaluation-sociale-marp.md
│   ├── 05-identification-priorisation.md
│   ├── 06-ag4-pdc.md
│   ├── 07-ag5-feedback.md
│   └── 08-suivi-rapports.md
├── phase-2-preparation-implementation/  ← Part 2 activities
│   ├── 01-preparation-sous-projet.md
│   ├── 02-passation-marches.md
│   ├── 03-mise-en-oeuvre.md
│   ├── 04-gestion-environnementale-sociale.md
│   ├── 05-gestion-financiere.md
│   ├── 06-suivi-mise-en-oeuvre.md
│   └── 07-classement-archivage.md
├── phase-3-closure-sustainability/      ← Part 3 activities
│   ├── 01-cloture-sous-projets.md
│   ├── 02-genre-cloture.md
│   ├── 03-cadre-redevabilite.md
│   ├── 04-audit-social.md
│   └── 05-entretien-maintenance.md
├── forms/
│   └── forms-catalog.md              ← every form/tool code (OP, F, P, T, ES, OC) with purpose & where used
└── tools-apps/
    ├── app-dcc.md                    ← DCC mobile app (install, login, features)
    └── app-emgp.md                   ← eMGP grievance app
```

---

## File anatomy (read this so you know where to look inside a file)

Every activity file follows the same structure:

1. **YAML frontmatter** — machine-readable metadata: `id`, `phase`, `step`, `source`, `duration`, `actors`, `forms`, `quorum`. Use this for routing and quick facts.
2. **`## Quick reference (EN)`** — objective, when, who participates, the task checklist, forms used, key rules/thresholds. This is the fast-answer layer.
3. **`## Contenu détaillé (FR — source)`** — the faithful French content from the guide: steps, tables, facilitation tips. This is the authoritative replica; quote from here when precision matters.
4. **`## Cross-cutting`** — pointers to how gender, climate, GRM, and accountability apply to this activity.

---

## How to answer questions (instructions for the AI)

**Golden rule: answer only from this folder.** This is a faithful replica of an official guide. Do not invent procedures, thresholds, amounts, durations, quorums, or committee compositions. If something isn't covered here, say so plainly and point to the closest section.

When a facilitator asks a question:

1. **Locate it in the cycle.** Identify the phase/step from `00-cycle-overview.md`, then open the matching activity file. A question naming an "AG" (assemblée générale), a committee, a form code (e.g. F19, T15, P8, ES1), or a step number is a direct routing signal.
2. **Lead with the Quick reference**, then back it with the French detail. If the user writes in French, answer in French and quote the French source. If in English, answer in English but preserve official French terms (B-CDVFQ, PDC, MGP, screening, etc.) with a short gloss.
3. **Be exact on hard facts.** Quorums (50% of households, 30% women), the grant amount (33,5 millions FCFA per village), tranche splits (20/50/30%), procurement thresholds (e.g. AOL ≥ 20 000 000 FCFA), petty-cash ceiling (50 000 FCFA), retention periods (10 years) — pull these verbatim, don't paraphrase loosely.
4. **Always surface the relevant form.** If the activity produces or requires a form, name its code and point to `forms/forms-catalog.md`.
5. **Apply the cross-cutting lenses** when relevant: does the answer need a gender requirement, a climate consideration, or a GRM step? Mention it.
6. **Don't over-format.** Facilitators want a clear, usable answer — short paragraphs and only the lists that help.

### Example routings

- "Comment se déroule l'élection du bureau CDV ?" → `phase-1-planning/03-ag2-mise-en-place-cdv.md`
- "What's the quorum for a general assembly?" → `00-foundations/00-cycle-overview.md` + `phase-1-planning/02-ag1-orientation.md` (50% households, 30% women)
- "Quels sont les seuils de passation de marché ?" → `phase-2-preparation-implementation/02-passation-marches.md`
- "How do I run a social audit?" → `phase-3-closure-sustainability/04-audit-social.md`
- "What is form F19?" → `forms/forms-catalog.md` (Rapport financier d'achèvement d'un sous-projet)
- "How should I include women in priority-setting?" → `00-foundations/03-gender-social-inclusion.md` + the specific activity

---

## Provenance & maintenance

- Source documents: `Facilitator Guide Part 1/2/3 - Sahel.docx` (in the parent folder). Country context: Mali (PCRSS, Liptako-Gourma).
- Each activity file's frontmatter records its `source` (which Part and section).
- If the source guides are updated, update the matching activity file and `00-cycle-overview.md` together.
- This replica preserves the guide's intent: the facilitator **accompanies** the community to do things themselves — it never decides or acts in their place.
