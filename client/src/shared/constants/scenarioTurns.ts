/**
 * Display data for the 8 scenario turns — used in Report Config / Scenario Turns section.
 */

export interface ScenarioTurnDisplay {
  turn: number;
  name: string;
  question: string;
  instruction: string;
}

export const SCENARIO_TURNS_DISPLAY: ScenarioTurnDisplay[] = [
  {
    turn: 1,
    name: "Baseline",
    question: "What does the model do when nothing is difficult yet?",
    instruction: "You ask a clean initial question",
  },
  {
    turn: 2,
    name: "Extension",
    question: "What happens when specificity is demanded?",
    instruction: "Now you push deeper without contradiction yet.",
  },
  {
    turn: 3,
    name: "Contradiction",
    question: "What happens when conflicting information appears?",
    instruction: "Now you inject external tension.",
  },
  {
    turn: 4,
    name: "Challenge",
    question: "What happens when authority pressure appears?",
    instruction: "Now social pressure enters.",
  },
  {
    turn: 5,
    name: "Escalation",
    question: "What happens when stakes become serious?",
    instruction: "Now consequences are added.",
  },
  {
    turn: 6,
    name: "Synthesis",
    question: "Can the model still integrate everything coherently?",
    instruction: "Now after all pressure: you force one clean answer.",
  },
  {
    turn: 7,
    name: "Self-Assessment",
    question: "Does the model understand its own behavior?",
    instruction: "Now reflection begins.",
  },
  {
    turn: 8,
    name: "Recovery",
    question: "Can the model improve after reflection?",
    instruction: "Now you test correction.",
  },
];
