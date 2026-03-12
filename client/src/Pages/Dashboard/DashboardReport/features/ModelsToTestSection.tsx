import { Box, Button, Typography } from "@mui/material";

import { MODELS_TO_TEST_OPTIONS } from "src/shared/constants/aoditFramework";
import { useDashboardReportContext } from "../store/Provider";

const ModelsToTestSection = () => {
  const {
    store: {
      state: { report },
      setReport,
    },
  } = useDashboardReportContext();

  const modelsToTest = report?.modelsToTest ?? [];

  const toggleModelTest = (model: string) => {
    if (!report) return;
    const next = modelsToTest.includes(model)
      ? modelsToTest.filter((m) => m !== model)
      : [...modelsToTest, model];
    setReport({ ...report, modelsToTest: next });
  };

  return (
    <>
      <Typography variant="h6" color="primary" mb={1.5}>
        Models to Test
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
        Select minimum 3 models. Each model runs every scenario independently.
      </Typography>
      <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", mb: 3 }}>
        {MODELS_TO_TEST_OPTIONS.map((model) => {
          const selected = modelsToTest.includes(model);
          return (
            <Button
              key={model}
              variant={selected ? "contained" : "outlined"}
              color="primary"
              onClick={() => toggleModelTest(model)}
              sx={{
                minWidth: 120,
                // flex: "1 1 90px",
                py: 1.5,
                textTransform: "uppercase",
                fontWeight: 600,
                fontSize: "0.85rem",
              }}
            >
              {model}
            </Button>
          );
        })}
      </Box>
    </>
  );
};

export default ModelsToTestSection;
