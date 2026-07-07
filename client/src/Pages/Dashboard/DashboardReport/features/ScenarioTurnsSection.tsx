import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";

import { SCENARIO_TURNS_DISPLAY } from "src/shared/constants/scenarioTurns";

const ScenarioTurnsSection = () => {
  return (
    <Accordion
      defaultExpanded={false}
      sx={{
        "&:before": { display: "none" },
        boxShadow: "none",
        bgcolor: "transparent",
      }}
    >
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography variant="subtitle2" color="primary" sx={{
          fontWeight: 600
        }}>
          Scenario Turns
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            ml: 1
          }}>
          8 turns per scenario
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {SCENARIO_TURNS_DISPLAY.map(
            ({ turn, name, question, instruction }) => (
              <Box
                key={turn}
                sx={{
                  p: 2,
                  border: 1,
                  borderColor: "divider",
                  bgcolor: "background.default",
                  borderRadius: 0,
                }}
              >
                <Typography
                  variant="subtitle2"
                  color="primary"
                  sx={{
                    fontWeight: 600
                  }}
                >
                  Turn {turn} — {name}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    mt: 0.5
                  }}>
                  {question}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                    display: "block",
                    mt: 0.25
                  }}>
                  {instruction}
                </Typography>
              </Box>
            ),
          )}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default ScenarioTurnsSection;
