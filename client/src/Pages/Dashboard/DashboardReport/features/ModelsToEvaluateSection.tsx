import { Autocomplete, TextField, Typography } from "@mui/material";

import { EVALUATOR_FRIENDLY_OPTIONS } from "src/shared/constants/evaluatorModels";

export interface ModelsToEvaluateSectionProps {
  value: string;
  onChange: (value: string) => void;
}

const ModelsToEvaluateSection = ({
  value,
  onChange,
}: ModelsToEvaluateSectionProps) => {
  return (
    <>
      <Typography variant="h6" color="primary" mb={1.5}>
        Models to Evaluate
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        Model used to judge the results (scenario prompts and scoring). Pick a
        preset or type a direct model id for local / on-prem OpenAI-compatible
        servers.
      </Typography>
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
        sx={{ maxWidth: 560, mb: 2 }}
      />
    </>
  );
};

export default ModelsToEvaluateSection;
