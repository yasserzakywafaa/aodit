import { Box, Container, List, ListItem, ListItemText, Typography } from "@mui/material";
import { createWebPageSchema, useSchemaOrg } from "src/shared/utils/schemaOrg";

import Page from "src/components/shared/Page/Page";
import { routes } from "src/application/routes";
import { useMemo } from "react";

const ComplianceFinmaPage = () => {
  const webPageSchema = useMemo(() => {
    return createWebPageSchema(
      "FINMA AI Guidelines",
      "Overview of FINMA-aligned considerations for AI governance, risk controls, transparency, and model oversight in Swiss financial services.",
      routes.compliance.finma,
    );
  }, []);

  useSchemaOrg(webPageSchema, "compliance-finma-webpage-schema");

  return (
    <Page title="FINMA AI Guidelines | Aodit" className="compliance-finma-page" isLoading={false}>
      <Container sx={{ mt: 3, pb: 6 }}>
        <Typography variant="h4" gutterBottom>
          FINMA AI Guidelines
        </Typography>
        <Typography variant="subtitle1" color="primary" gutterBottom>
          Swiss financial market supervision
        </Typography>

        <Typography paragraph>
          This page provides a practical overview of AI compliance themes relevant to Swiss-regulated
          institutions. It is intended to support internal governance planning and documentation.
        </Typography>

        <Box my={2}>
          <Typography variant="h6" color="primary" gutterBottom>
            Focus Areas
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="Governance and accountability" secondary="Define responsible owners, controls, and escalation paths for AI systems." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Risk management" secondary="Assess model, data, operational, legal, and reputational risks through the AI lifecycle." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Transparency and documentation" secondary="Maintain auditable records for model assumptions, data lineage, and decision rationale." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Monitoring and oversight" secondary="Track performance drift, incidents, and control effectiveness with periodic reviews." />
            </ListItem>
          </List>
        </Box>
      </Container>
    </Page>
  );
};

export default ComplianceFinmaPage;
