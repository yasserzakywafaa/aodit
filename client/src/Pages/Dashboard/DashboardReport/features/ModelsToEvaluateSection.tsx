import { Autocomplete, Box, Link, TextField, Typography } from "@mui/material";

import APP_CONSTANTS from "src/application/shared/app_constants";
import { routes } from "src/application/routes";
import { EVALUATOR_FRIENDLY_OPTIONS } from "src/shared/constants/evaluatorModels";
import { Link as RouterLink } from "react-router-dom";

export interface ModelsToEvaluateSectionProps {
  value: string;
  onChange: (value: string) => void;
  agentId?: string;
  agentEvaluatorUrl?: string;
  agentEvaluatorModel?: string;
  showAgentInheritance?: boolean;
}

const ModelsToEvaluateSection = ({
  value,
  onChange,
  agentId,
  agentEvaluatorUrl,
  agentEvaluatorModel,
  showAgentInheritance,
}: ModelsToEvaluateSectionProps) => {
  const isOnPrem = APP_CONSTANTS.IS_ON_PREM;
  const showOnPremSummaryOnly = isOnPrem && !!showAgentInheritance;
  const trimmedAgentUrl = agentEvaluatorUrl?.trim() ?? "";
  const trimmedAgentModel = agentEvaluatorModel?.trim() ?? "";
  const hasRequiredEvaluatorConfig = !!trimmedAgentUrl && !!trimmedAgentModel;

  return (
    <>
      <Typography variant="h6" color="primary" sx={{
        mb: 1.5
      }}>
        Models to Evaluate
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: "text.secondary",
          mb: 1
        }}>
        {showOnPremSummaryOnly
          ? "On-prem evaluator settings are inherited from the selected Agent."
          : isOnPrem
          ? "Model used to judge the results (scenario prompts and scoring). Enter the model id loaded on your evaluator endpoint — leave blank to use the agent's default."
          : "Model used to judge the results (scenario prompts and scoring). Pick a preset or type a direct model id for local / on-prem OpenAI-compatible servers."}
      </Typography>
      {showOnPremSummaryOnly ? (
        <Box
          sx={{
            maxWidth: 560,
            mb: 2,
            p: 1.5,
            border: "1px solid",
            borderColor: hasRequiredEvaluatorConfig ? "success.main" : "error.main",
            borderRadius: 1,
            bgcolor: "background.paper",
          }}
        >
          {hasRequiredEvaluatorConfig ? (
            <>
              <Typography variant="body2" sx={{
                color: "text.secondary"
              }}>
                Evaluator:
                <Typography
                  component="span"
                  variant="body2"
                  sx={{
                    color: "primary.main",
                    fontWeight: 600
                  }}>
                  {" "}
                  {trimmedAgentModel}
                </Typography>{" "}
                at{" "}
                <Typography
                  component="span"
                  variant="body2"
                  sx={{
                    color: "success.main",
                    fontWeight: 600
                  }}>
                  {trimmedAgentUrl}
                </Typography>
              </Typography>
              {agentId && (
                <Link
                  component={RouterLink}
                  to={routes.dashboard.agents.agentById(agentId)}
                  variant="caption"
                  sx={{ mt: 0.75, display: "inline-block" }}
                >
                  Configured on the Agent page · Edit agent
                </Link>
              )}
            </>
          ) : (
            <Typography variant="caption" sx={{
              color: "error.main"
            }}>
              The selected agent is missing evaluator settings. On-prem runs
              require both Evaluator URL and Default evaluator model on the
              Agent page.
            </Typography>
          )}
        </Box>
      ) : isOnPrem ? (
        <TextField
          label="Evaluator (judge model)"
          placeholder={
            trimmedAgentModel
              ? `${trimmedAgentModel} (agent default)`
              : "e.g. google/gemma-3-4b"
          }
          value={value}
          onChange={(e) => onChange(e.target.value)}
          fullWidth
          sx={{ maxWidth: 560, mb: 1 }}
        />
      ) : (
        <Autocomplete
          freeSolo
          options={[...EVALUATOR_FRIENDLY_OPTIONS]}
          value={value}
          onChange={(_, newValue) => {
            if (newValue !== null && newValue !== undefined) {
              onChange(String(newValue));
            }
          }}
          onInputChange={(_, newInputValue) => {
            onChange(newInputValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Evaluator (judge model)"
              placeholder="e.g. Claude or google/gemma-4-e2b"
              fullWidth
            />
          )}
          sx={{ maxWidth: 560, mb: 1 }}
        />
      )}
      {showAgentInheritance && isOnPrem && !showOnPremSummaryOnly && (
        <Box sx={{ maxWidth: 560, mb: 2 }}>
          <Typography variant="caption" sx={{
            color: "text.secondary"
          }}>
            Evaluator endpoint:{" "}
            <Typography
              component="span"
              variant="caption"
              color={trimmedAgentUrl ? "success.main" : "error.main"}
              sx={{
                fontWeight: 600
              }}
            >
              {trimmedAgentUrl || "OpenRouter (platform default)"}
            </Typography>
          </Typography>
        </Box>
      )}
    </>
  );
};

export default ModelsToEvaluateSection;
