import { Autocomplete, Box, Link, TextField, Typography } from "@mui/material";

import APP_CONSTANTS from "src/application/shared/app_constants";
import { routes } from "src/application/routes";
import { EVALUATOR_FRIENDLY_OPTIONS } from "src/shared/constants/evaluatorModels";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation("report");
  const isOnPrem = APP_CONSTANTS.IS_ON_PREM;
  const showOnPremSummaryOnly = isOnPrem && !!showAgentInheritance;
  const trimmedAgentUrl = agentEvaluatorUrl?.trim() ?? "";
  const trimmedAgentModel = agentEvaluatorModel?.trim() ?? "";
  const hasRequiredEvaluatorConfig = !!trimmedAgentUrl && !!trimmedAgentModel;

  return (
    <>
      <Typography
        variant="h6"
        color="primary"
        sx={{
          mb: 1.5,
        }}
      >
        {t("configSections.modelsToEvaluate")}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: "text.secondary",
          mb: 1,
        }}
      >
        {showOnPremSummaryOnly
          ? t("configSections.onPremInherited")
          : isOnPrem
            ? t("configSections.onPremJudgeHelp")
            : t("configSections.cloudJudgeHelp")}
      </Typography>
      {showOnPremSummaryOnly ? (
        <Box
          sx={{
            maxWidth: 560,
            mb: 2,
            p: 1.5,
            border: "1px solid",
            borderColor: hasRequiredEvaluatorConfig
              ? "success.main"
              : "error.main",
            borderRadius: 1,
            bgcolor: "background.paper",
          }}
        >
          {hasRequiredEvaluatorConfig ? (
            <>
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                }}
              >
                {t("configSections.evaluatorLabel")}
                <Typography
                  component="span"
                  variant="body2"
                  sx={{
                    color: "primary.main",
                    fontWeight: 600,
                  }}
                >
                  {" "}
                  {trimmedAgentModel}
                </Typography>{" "}
                {t("configSections.evaluatorAt")}{" "}
                <Typography
                  component="span"
                  variant="body2"
                  sx={{
                    color: "success.main",
                    fontWeight: 600,
                  }}
                >
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
                  {t("configSections.configuredOnAgent")}
                </Link>
              )}
            </>
          ) : (
            <Typography
              variant="caption"
              sx={{
                color: "error.main",
              }}
            >
              {t("configSections.missingEvaluatorSettings")}
            </Typography>
          )}
        </Box>
      ) : isOnPrem ? (
        <TextField
          label={t("configSections.evaluatorJudgeModel")}
          placeholder={
            trimmedAgentModel
              ? t("configSections.evaluatorPlaceholderWithDefault", {
                  model: trimmedAgentModel,
                })
              : t("configSections.evaluatorPlaceholder")
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
              label={t("configSections.evaluatorJudgeModel")}
              placeholder={t("configSections.evaluatorCloudPlaceholder")}
              fullWidth
            />
          )}
          sx={{ maxWidth: 560, mb: 1 }}
        />
      )}
      {showAgentInheritance && isOnPrem && !showOnPremSummaryOnly && (
        <Box sx={{ maxWidth: 560, mb: 2 }}>
          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
            }}
          >
            {t("configSections.evaluatorEndpoint")}{" "}
            <Typography
              component="span"
              variant="caption"
              color={trimmedAgentUrl ? "success.main" : "error.main"}
              sx={{
                fontWeight: 600,
              }}
            >
              {trimmedAgentUrl || t("configSections.openRouterDefault")}
            </Typography>
          </Typography>
        </Box>
      )}
    </>
  );
};

export default ModelsToEvaluateSection;
