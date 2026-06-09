import type { Lang } from "./guide";

export const UI = {
  appName: { fr: "Guide du Facilitateur", en: "Facilitator Guide" },
  appSub: {
    fr: "PCRSS · Développement Conduit par les Communautés (DCC)",
    en: "PCRSS · Community-Driven Development (CDD)",
  },
  tagline: {
    fr: "Votre aide simple pour accompagner le village, étape par étape.",
    en: "Your simple helper to support the village, step by step.",
  },
  browseTitle: { fr: "📖 Lire le guide", en: "📖 Read the guide" },
  browseSub: {
    fr: "Choisissez une phase et une étape",
    en: "Choose a phase and a step",
  },
  askTitle: { fr: "💬 Poser une question", en: "💬 Ask a question" },
  askSub: {
    fr: "Demandez ce que vous voulez, l'assistant répond avec le guide",
    en: "Ask anything, the assistant answers using the guide",
  },
  home: { fr: "Accueil", en: "Home" },
  back: { fr: "Retour", en: "Back" },
  ask: { fr: "Demander", en: "Ask" },
  askPlaceholder: {
    fr: "Écrivez votre question ici…",
    en: "Type your question here…",
  },
  thinking: { fr: "L'assistant réfléchit…", en: "The assistant is thinking…" },
  chatHello: {
    fr: "Bonjour 👋 Je suis votre assistant. Posez-moi une question sur le cycle du projet, une assemblée générale, un formulaire, l'argent, le genre, les plaintes… Je réponds à partir du guide.",
    en: "Hello 👋 I am your assistant. Ask me about the project cycle, a general assembly, a form, money, gender, grievances… I answer from the guide.",
  },
  suggestions: {
    fr: [
      "Quel est le quorum d'une assemblée générale ?",
      "Comment élire le bureau du CDV ?",
      "Combien d'argent reçoit chaque village ?",
      "Comment faire un audit social ?",
      "C'est quoi le formulaire F19 ?",
      "Comment inclure les femmes dans les priorités ?",
    ],
    en: [
      "What is the quorum for a general assembly?",
      "How do we elect the CDV bureau?",
      "How much money does each village receive?",
      "How do I run a social audit?",
      "What is form F19?",
      "How do I include women in priority-setting?",
    ],
  },
  source: { fr: "Source dans le guide", en: "Source in the guide" },
  openInGuide: { fr: "Ouvrir dans le guide", en: "Open in the guide" },
  chatError: {
    fr: "Désolé, une erreur est survenue. Réessayez.",
    en: "Sorry, something went wrong. Please try again.",
  },
  steps: { fr: "étapes", en: "steps" },
  step: { fr: "étape", en: "step" },
  newChat: { fr: "Nouvelle question", en: "New question" },
  langName: { fr: "Français", en: "English" },
  notConfiguredTitle: {
    fr: "Assistant pas encore connecté",
    en: "Assistant not connected yet",
  },
  notConfiguredBody: {
    fr: "Le chat IA n'est pas configuré sur ce site. Un administrateur doit ajouter une clé API (AI_PROVIDER + clé) puis redéployer. En attendant, vous pouvez lire tout le guide.",
    en: "The AI chat is not set up on this site. An administrator needs to add an API key (AI_PROVIDER + key) and redeploy. In the meantime, you can read the whole guide.",
  },
  notConfiguredCta: { fr: "📖 Lire le guide", en: "📖 Read the guide" },
  composerDisabled: {
    fr: "Chat indisponible — configuration manquante",
    en: "Chat unavailable — setup needed",
  },

  // ---- Immersive journey (scrollytelling) ----
  discoverJourney: {
    fr: "✨ Découvrir le parcours interactif",
    en: "✨ Discover the interactive journey",
  },
  discoverJourneySub: {
    fr: "Une façon immersive de traverser tout le cycle",
    en: "An immersive way to travel the whole cycle",
  },
  journeyKicker: { fr: "Le parcours", en: "The journey" },
  journeyTitle: {
    fr: "Le voyage du facilitateur",
    en: "The facilitator's journey",
  },
  journeyLead: {
    fr: "Faites défiler pour traverser les 6 phases du cycle communautaire — une étape à la fois.",
    en: "Scroll to travel through the 6 phases of the community cycle — one step at a time.",
  },
  journeyScroll: { fr: "Faites défiler", en: "Scroll to begin" },
  phaseOf: { fr: "Phase", en: "Phase" },
  openPhase: { fr: "Ouvrir cette phase", en: "Open this phase" },
  journeyOutroTitle: {
    fr: "Vous avez parcouru tout le cycle 🎉",
    en: "You've traveled the whole cycle 🎉",
  },
  journeyOutroLead: {
    fr: "Plongez plus loin, ou posez directement votre question.",
    en: "Dive deeper, or just ask your question.",
  },
  resourcesWord: { fr: "Ressources & outils", en: "Resources & tools" },
  classicView: { fr: "Vue classique", en: "Classic view" },
  startJourney: { fr: "Commencer le parcours", en: "Start the journey" },

  // ---- Guided activity flow ----
  overview: { fr: "Aperçu", en: "Overview" },
  stepWord: { fr: "Étape", en: "Step" },
  ofWord: { fr: "sur", en: "of" },
  previous: { fr: "Précédent", en: "Previous" },
  next: { fr: "Suivant", en: "Next" },
  nextActivity: { fr: "Activité suivante", en: "Next activity" },
  finishActivity: { fr: "Terminer", en: "Finish" },
  sourceWord: { fr: "Source", en: "Source" },
  actorsWord: { fr: "Acteurs", en: "Actors" },
  formsWord: { fr: "Formulaires", en: "Forms" },
  readingView: { fr: "Tout lire", en: "Read all" },
  guidedView: { fr: "Pas à pas", en: "Step by step" },
};

export type UIKey = keyof typeof UI;

export function t(key: UIKey, lang: Lang): string {
  const v = UI[key] as Record<Lang, string | string[]>;
  return v[lang] as string;
}
