import {
  DashboardAgentState,
  getDashboardAgentInitialState,
} from "./state";

import { Agent } from "src/shared/types/agent";
import { Report } from "src/shared/types/report";
import { useState } from "react";

export interface DashboardAgentStore {
  state: DashboardAgentState;
  setIsFetching: (isFetching: boolean) => void;
  setAgent: (agent: Agent | undefined) => void;
  setAgentReports: (reports: Report[]) => void;
  setEvaluatorModelsStatus: (
    status: DashboardAgentState["evaluatorModelsStatus"],
  ) => void;
  setEvaluatorModels: (models: string[]) => void;
  setEvaluatorModelsError: (error?: string) => void;
  resetEvaluatorModelsState: () => void;
}

const useDashboardAgentStore = (): DashboardAgentStore => {
  const initialState = getDashboardAgentInitialState();
  const [state, setState] = useState<DashboardAgentState>(initialState);

  const setIsFetching = (isFetching: boolean) => {
    setState((prev) => ({
      ...prev,
      isFetching,
    }));
  };

  const setAgent = (agent: Agent | undefined) => {
    setState((prev) => ({
      ...prev,
      agent,
    }));
  };

  const setAgentReports = (agentReports: Report[]) => {
    setState((prev) => ({
      ...prev,
      agentReports,
    }));
  };

  const setEvaluatorModelsStatus = (
    evaluatorModelsStatus: DashboardAgentState["evaluatorModelsStatus"],
  ) => {
    setState((prev) => ({
      ...prev,
      evaluatorModelsStatus,
    }));
  };

  const setEvaluatorModels = (evaluatorModels: string[]) => {
    setState((prev) => ({
      ...prev,
      evaluatorModels,
    }));
  };

  const setEvaluatorModelsError = (evaluatorModelsError?: string) => {
    setState((prev) => ({
      ...prev,
      evaluatorModelsError,
    }));
  };

  const resetEvaluatorModelsState = () => {
    setState((prev) => ({
      ...prev,
      evaluatorModels: [],
      evaluatorModelsStatus: "idle",
      evaluatorModelsError: undefined,
    }));
  };

  return {
    state,
    setIsFetching,
    setAgent,
    setAgentReports,
    setEvaluatorModelsStatus,
    setEvaluatorModels,
    setEvaluatorModelsError,
    resetEvaluatorModelsState,
  };
};

export default useDashboardAgentStore;
