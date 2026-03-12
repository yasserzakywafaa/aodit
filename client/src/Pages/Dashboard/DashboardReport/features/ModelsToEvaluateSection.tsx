import { Typography } from "@mui/material";

const ModelsToEvaluateSection = () => {
  return (
    <>
      <Typography variant="h6" color="primary" mb={1.5}>
        Models to Evaluate
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        Model used to judge the results
      </Typography>
      <Typography variant="body1" fontWeight={500} sx={{ mb: 3 }}>
        Claude
      </Typography>
    </>
  );
};

export default ModelsToEvaluateSection;
