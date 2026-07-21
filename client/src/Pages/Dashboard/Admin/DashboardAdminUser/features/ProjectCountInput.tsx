import { Box, Card, CardContent, TextField, Typography } from "@mui/material";

import { Article as ArticleIcon } from "@mui/icons-material";
import { User } from "src/shared/types/user";

interface ProjectCountInputProps {
  user: User | null;
  value: number;
  onChange: (projectsCount: number) => void;
}

import { useTranslation } from "react-i18next";

const ProjectCountInput = ({
  user,
  value,
  onChange,
}: ProjectCountInputProps) => {
  const { t } = useTranslation("dashboard");
  if (!user) {
    return null;
  }

  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 2
          }}>
          <ArticleIcon color="primary" sx={{ mr: 1 }} />
<Typography variant="h6">{t("admin.user.projectCount")}</Typography>
        </Box>
        <TextField
          type="number"
          label={t("admin.user.projectCount")}
          value={value}
          onChange={(e) => {
            const newValue = parseInt(e.target.value) || 0;
            onChange(Math.max(0, newValue));
          }}
          slotProps={{ htmlInput: { min: 0 } }}
          fullWidth
        />
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            mt: 1
          }}>
{t("admin.user.projectCountHelp")}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ProjectCountInput;
