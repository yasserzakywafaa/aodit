import { Box, Divider, Paper, Typography } from "@mui/material";
import {
  DimensionWeightsSection,
  ModelsToEvaluateSection,
  ModelsToTestSection,
  ScenarioTurnsSection,
  ScenariosPerDimensionSection,
} from ".";
import { useTranslation } from "react-i18next";

interface ReportConfigProps {
  modelsCount: number;
  totalScenarios: number;
  datapoints: number;
  evaluationMode?: "benchmark" | "agent";
  evaluatorSelection: string;
  onEvaluatorChange: (value: string) => void;
  agentId?: string;
  agentEvaluatorUrl?: string;
  agentEvaluatorModel?: string;
}

const ReportConfig = ({
  modelsCount,
  totalScenarios,
  datapoints,
  evaluationMode = "benchmark",
  evaluatorSelection,
  onEvaluatorChange,
  agentId,
  agentEvaluatorUrl,
  agentEvaluatorModel,
}: ReportConfigProps) => {
  const { t } = useTranslation("report");

  return (
    <>
      <ScenariosPerDimensionSection />
      <Divider sx={{ mt: 3, mb: 6 }} />
      <DimensionWeightsSection />
      {evaluationMode === "benchmark" && (
        <>
          <Divider sx={{ mt: 3, mb: 6 }} />
          <ModelsToTestSection />
        </>
      )}
      <Divider sx={{ mt: 3, mb: 6 }} />
      <ModelsToEvaluateSection
        value={evaluatorSelection}
        onChange={onEvaluatorChange}
        agentId={evaluationMode === "agent" ? agentId : undefined}
        agentEvaluatorUrl={
          evaluationMode === "agent" ? agentEvaluatorUrl : undefined
        }
        agentEvaluatorModel={
          evaluationMode === "agent" ? agentEvaluatorModel : undefined
        }
        showAgentInheritance={evaluationMode === "agent"}
      />
      <Divider sx={{ mt: 3, mb: 6 }} />
      <ScenarioTurnsSection />
      <Paper
        variant="outlined"
        sx={{
          mt: 2,
          p: 2.5,
          bgcolor: "background.default",
          border: "1px solid",
          borderColor: "primary.main",
          borderRadius: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "stretch",
            flexWrap: "nowrap",
          }}
        >
          {[
            { value: totalScenarios, label: t("configSections.totalScenarios") },
            {
              value: modelsCount,
              label:
                evaluationMode === "agent"
                  ? t("configSections.agents")
                  : t("configSections.models"),
            },
            { value: 8, label: t("configSections.turnsPerScenarioShort") },
            {
              value: datapoints.toLocaleString(),
              label: t("configSections.datapoints"),
            },
          ].map((stat, index, arr) => (
            <Box
              key={stat.label}
              sx={{
                flex: 1,
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                borderRight:
                  index < arr.length - 1 ? "1px solid" : undefined,
                borderColor: "primary.main",
              }}
            >
              <Typography
                variant="h5"
                color="primary"
                sx={{
                  fontWeight: 600,
                }}
              >
                {stat.value}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  display: "block",
                  mt: 0.5,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                {stat.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Paper>
    </>
  );
};

export default ReportConfig;
