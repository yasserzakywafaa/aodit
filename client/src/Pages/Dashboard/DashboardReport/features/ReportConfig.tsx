import { Box, Divider, Paper, Typography } from "@mui/material";
import {
  DimensionWeightsSection,
  ModelsToEvaluateSection,
  ModelsToTestSection,
  ScenarioTurnsSection,
  ScenariosPerDimensionSection,
} from ".";

interface ReportConfigProps {
  modelsCount: number;
  totalScenarios: number;
  datapoints: number;
  evaluationMode?: "benchmark" | "agent";
  /** First entry maps to server evaluator (friendly label or direct model id). */
  evaluatorSelection: string;
  onEvaluatorChange: (value: string) => void;
}

const ReportConfig = ({
  modelsCount,
  totalScenarios,
  datapoints,
  evaluationMode = "benchmark",
  evaluatorSelection,
  onEvaluatorChange,
}: ReportConfigProps) => {
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
      />

      <Divider sx={{ mt: 3, mb: 6 }} />

      <ScenarioTurnsSection />

      {/* Estimates bar */}
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
          <Box
            sx={{
              flex: 1,
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              borderRight: "1px solid",
              borderColor: "primary.main",
              "&:last-of-type": { borderRight: "none" },
            }}
          >
            <Typography variant="h5" color="primary" fontWeight={600}>
              {totalScenarios}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                display: "block",
                mt: 0.5,
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              Total scenarios
            </Typography>
          </Box>
          <Box
            sx={{
              flex: 1,
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              borderRight: "1px solid",
              borderColor: "primary.main",
              "&:last-of-type": { borderRight: "none" },
            }}
          >
            <Typography variant="h5" color="primary" fontWeight={600}>
              {modelsCount}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                display: "block",
                mt: 0.5,
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              {evaluationMode === "agent" ? "Agents" : "Models"}
            </Typography>
          </Box>
          <Box
            sx={{
              flex: 1,
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              borderRight: "1px solid",
              borderColor: "primary.main",
              "&:last-of-type": { borderRight: "none" },
            }}
          >
            <Typography variant="h5" color="primary" fontWeight={600}>
              8
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                display: "block",
                mt: 0.5,
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              Turns / scenario
            </Typography>
          </Box>
          <Box
            sx={{
              flex: 1,
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography variant="h5" color="primary" fontWeight={600}>
              {datapoints.toLocaleString()}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                display: "block",
                mt: 0.5,
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              Datapoints
            </Typography>
          </Box>
        </Box>
      </Paper>
    </>
  );
};

export default ReportConfig;
