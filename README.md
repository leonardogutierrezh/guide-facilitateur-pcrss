# Guide du Facilitateur CDD/DCC — version IA / AI-friendly replica

Réplique structurée du **Guide du Facilitateur PCRSS** (Parties 1, 2, 3) pour l'approche **Développement Conduit par les Communautés (DCC / CDD)**. Conçue pour être lue par une IA et interrogée par activité, tâche ou formulaire — en français ou en anglais.

> Structured replica of the PCRSS Community-Driven Development Facilitator Guide. Ask questions per phase, activity, task, or form. French is the source language; English is provided as a working layer. See [`CLAUDE.md`](CLAUDE.md) for how the AI reads and answers.

---

## 📱 Application interactive / Interactive web app

Ce dépôt contient aussi une **application web bilingue (FR/EN)** pensée pour les facilitateurs sur le terrain : simple, visuelle, utilisable sur un petit téléphone, avec un **assistant IA** qui répond à partir du guide.

> This repo also ships a **bilingual (FR/EN) web app** for field facilitators: simple, visual, phone-friendly, with an **AI assistant** that answers strictly from the guide content.

- **Lire le guide / Read the guide** — phases et étapes en grandes cartes illustrées.
- **Poser une question / Ask a question** — chat IA ancré dans les fichiers du guide. L'assistant ne répond que depuis le guide ; il ne devine pas.

> Note : l'application web (`app/`, `scripts/build-content.mjs`) n'a pas encore été mise à jour pour la nouvelle arborescence Phases/Activités/Tâches — à faire séparément.

### Lancer en local / Run locally

```bash
npm install
cp .env.example .env.local      # add your OPENAI_API_KEY
npm run dev                     # http://localhost:3000
```

### Déployer / Deploy (Vercel)

The app is a Next.js project. Choose your AI provider with **`AI_PROVIDER`** (`anthropic` or `openai`) and set the matching API key on Vercel, then deploy. See [`DEPLOY.md`](DEPLOY.md).

**Tech:** Next.js (App Router) · React · Tailwind CSS · pluggable AI provider (`@anthropic-ai/sdk` → `claude-sonnet-4-6`, or `openai` → `gpt-4o-mini`; both default-overridable). The full guide (~230 KB) is sent to the model as the system context and **prompt-cached** by the provider, so answers stay grounded and cheap. Content is bundled at build time by [`scripts/build-content.mjs`](scripts/build-content.mjs).

---

## Le cycle en bref / The cycle at a glance

6 phases, 14 étapes. Détail complet : [`00-foundations/00-cycle-overview.md`](00-foundations/00-cycle-overview.md).

Le guide est organisé en **Phases → Activités → Tâches** (et non plus par Partie I/II/III du guide source). Chaque phase est un dossier ; chaque activité est un sous-dossier avec un `README.md` (aperçu, quick reference EN, liste des tâches, checklist) ; chaque tâche est un fichier individuel.

| Phase | Étapes | Dossier |
|---|---|---|
| 1 — Visites préalables | 1–2 | [phase-1-visites-prealables](phase-1-visites-prealables/) |
| 2 — Mobilisation communautaire | 3–4 | [phase-2-mobilisation-communautaire](phase-2-mobilisation-communautaire/) |
| 3 — Planification villageoise (PDC) | 5–7 | [phase-3-planification-villageoise](phase-3-planification-villageoise/) |
| 4 — Préparation des sous-projets | 8–9 | [phase-4-preparation-sous-projets](phase-4-preparation-sous-projets/) |
| 5 — Mise en œuvre des sous-projets | 10–11 | [phase-5-mise-en-oeuvre](phase-5-mise-en-oeuvre/) |
| 6 — Clôture & durabilité | 12–14 | [phase-6-cloture](phase-6-cloture/) |
| Transversal — Suivi & redevabilité | — | [transversal](transversal/) |

## Concepts transversaux / Cross-cutting (apply everywhere)

- [Approche DCC](00-foundations/01-dcc-approach.md) · [Facilitation](00-foundations/02-facilitation-skills.md) · [Genre & inclusion](00-foundations/03-gender-social-inclusion.md) · [Changement climatique](00-foundations/04-climate-change.md) · [Mécanisme de gestion des plaintes (MGP)](00-foundations/05-grievance-mechanism-mgp.md)
- [Acteurs & rôles](00-foundations/06-actors-and-roles.md) · [Structure CDV & comités](00-foundations/07-cdv-structure-committees.md) · [Glossaire / acronymes](00-foundations/glossary-acronyms.md)

## Formulaires & outils / Forms & tools

- [Catalogue des formulaires](forms/forms-catalog.md) (codes OP, F, P, T, ES, OC)
- [Application DCC](tools-apps/app-dcc.md) · [Application eMGP](tools-apps/app-emgp.md)

## Repères chiffrés / Key numbers

- Allocation par village/quartier/fraction : **33 500 000 FCFA**
- Quorum AG : **50 % des ménages** représentés, **≥ 30 % de femmes**
- Tranches de subvention : **20 % / 50 % / 30 %**
- Frais de fonctionnement CDV : **≤ 3 %** de la subvention
- Plafond petite caisse : **50 000 FCFA**
- Conservation des documents : **10 ans**
- Couverture Mali : 35 communes, 721 villages/quartiers/fractions (Bandiagara, Gao, Douentza, Gourma-Rharous)
