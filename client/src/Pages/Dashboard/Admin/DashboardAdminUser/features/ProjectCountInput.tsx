import { Box, Card, CardContent, TextField, Typography } from "@mui/material";

import { Article as ArticleIcon } from "@mui/icons-material";
import { User } from "src/shared/types/user";

interface ProjectCountInputProps {
  user: User | null;
  value: number;
  onChange: (projectsCount: number) => void;
}

const ProjectCountInput = ({
  user,
  value,
  onChange,
}: ProjectCountInputProps) => {
  if (!user) {
    return null;
  }

  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <ArticleIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">Project Count</Typography>
        </Box>
        <TextField
          type="number"
          label="Project Count"
          value={value}
          onChange={(e) => {
            const newValue = parseInt(e.target.value) || 0;
            onChange(Math.max(0, newValue));
          }}
          inputProps={{ min: 0 }}
          fullWidth
        />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          How many projects created in the current subscription period.
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ProjectCountInput;
