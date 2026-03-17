import {
  DimensionWeightsSection,
  ModelsToEvaluateSection,
  ModelsToTestSection,
  ScenarioTurnsSection,
  ScenariosPerDimensionSection,
} from ".";

import { Divider } from "@mui/material";

const ReportConfig = () => {
  return (
    <>
      <ScenariosPerDimensionSection />

      <Divider sx={{ mt: 3, mb: 6 }} />

      <DimensionWeightsSection />

      <Divider sx={{ mt: 3, mb: 6 }} />

      <ModelsToTestSection />

      <Divider sx={{ mt: 3, mb: 6 }} />

      <ModelsToEvaluateSection />

      <Divider sx={{ mt: 3, mb: 6 }} />

      <ScenarioTurnsSection />
    </>
  );
};

export default ReportConfig;
