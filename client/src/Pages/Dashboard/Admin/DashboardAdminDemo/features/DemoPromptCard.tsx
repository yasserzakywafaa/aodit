import { Box, Card, CardContent, Typography } from "@mui/material";

import { Description as DescriptionIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

const DemoPromptCard = ({ systemPrompt }: { systemPrompt: string }) => {
  const { t } = useTranslation("dashboard");
  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 2
          }}>
          <DescriptionIcon color="primary" sx={{ mr: 1 }} />
<Typography variant="h6">{t("admin.demos.systemPrompt")}</Typography>
        </Box>
        <Box
          sx={(theme) => ({
            p: 2,
            borderRadius: 1,
            backgroundColor: theme.palette.action.hover,
            fontFamily: "monospace",
            fontSize: "0.85rem",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          })}
        >
          {systemPrompt || "—"}
        </Box>
      </CardContent>
    </Card>
  );
};

export default DemoPromptCard;
