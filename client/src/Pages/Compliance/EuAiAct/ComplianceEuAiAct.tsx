import { Box, Container, List, ListItem, ListItemText, Typography } from "@mui/material";
import { createWebPageSchema, useSchemaOrg } from "src/shared/utils/schemaOrg";

import Page from "src/components/shared/Page/Page";
import { routes } from "src/application/routes";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

const ComplianceEuAiActPage = () => {
  const { t } = useTranslation("compliance");
  const items = t("euAiAct.items", { returnObjects: true }) as {
    primary: string;
    secondary: string;
  }[];

  const webPageSchema = useMemo(() => {
    return createWebPageSchema(
      t("euAiAct.schemaTitle"),
      t("euAiAct.schemaDescription"),
      routes.compliance.euAiAct,
    );
  }, [t]);

  useSchemaOrg(webPageSchema, "compliance-eu-ai-act-webpage-schema");

  return (
    <Page
      title={t("euAiAct.pageTitle")}
      className="compliance-eu-ai-act-page"
      isLoading={false}
    >
      <Container sx={{ mt: 3, pb: 6 }}>
        <Typography variant="h4" gutterBottom>
          {t("euAiAct.title")}
        </Typography>
        <Typography variant="subtitle1" color="primary" gutterBottom>
          {t("euAiAct.subtitle")}
        </Typography>

        <Typography paragraph>{t("euAiAct.intro")}</Typography>

        <Box sx={{ my: 2 }}>
          <Typography variant="h6" color="primary" gutterBottom>
            {t("euAiAct.focusAreas")}
          </Typography>
          <List>
            {items.map((item) => (
              <ListItem key={item.primary}>
                <ListItemText
                  primary={item.primary}
                  secondary={item.secondary}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Container>
    </Page>
  );
};

export default ComplianceEuAiActPage;
