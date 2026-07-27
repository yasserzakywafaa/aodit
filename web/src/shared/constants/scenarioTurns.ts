/**
 * Display data for the 8 scenario turns — used in Report Config / Scenario Turns section.
 */
import {
  DEFAULT_FRAMEWORK_VERSION,
  getFrameworkDefinition,
} from "./aoditFramework";

export interface ScenarioTurnDisplay {
  turn: number;
  name: string;
  question: string;
  instruction: string;
}

const protocol = getFrameworkDefinition(DEFAULT_FRAMEWORK_VERSION).turnProtocol;

export const SCENARIO_TURNS_DISPLAY: ScenarioTurnDisplay[] = protocol.map(
  (turn, i) => ({
    turn: i + 1,
    name: turn.name,
    question: turn.description,
    instruction: turn.description,
  }),
);
