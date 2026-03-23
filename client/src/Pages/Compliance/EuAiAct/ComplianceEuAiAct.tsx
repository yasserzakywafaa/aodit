import { Box, Container, List, ListItem, ListItemText, Typography } from "@mui/material";
import { createWebPageSchema, useSchemaOrg } from "src/shared/utils/schemaOrg";

import Page from "src/components/shared/Page/Page";
import { routes } from "src/application/routes";
import { useMemo } from "react";

const ComplianceEuAiActPage = () => {
  const webPageSchema = useMemo(() => {
    return createWebPageSchema(
      "EU AI Act",
      "Overview of EU AI Act compliance themes including risk classification, technical documentation, transparency obligations, and post-market monitoring.",
      routes.compliance.euAiAct,
    );
  }, []);

  useSchemaOrg(webPageSchema, "compliance-eu-ai-act-webpage-schema");

  return (
    <Page title="EU AI Act | Aodit" className="compliance-eu-ai-act-page" isLoading={false}>
      <Container sx={{ mt: 3, pb: 6 }}>
        <Typography variant="h4" gutterBottom>
          EU AI Act
        </Typography>
        <Typography variant="subtitle1" color="primary" gutterBottom>
          European AI regulation framework
        </Typography>

        <Typography paragraph>
          This page outlines key elements of the EU AI Act to help teams frame control design,
          evidence collection, and compliance-readiness workstreams.
        </Typography>

        <Box my={2}>
          <Typography variant="h6" color="primary" gutterBottom>
            Focus Areas
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="Risk-based classification" secondary="Identify prohibited, high-risk, and limited-risk use cases and apply the correct obligations." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Technical documentation" secondary="Prepare robust documentation, logs, and traceability artifacts for regulatory scrutiny." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Transparency requirements" secondary="Provide clear user-facing disclosures when interacting with AI systems." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Post-market monitoring" secondary="Track incidents, maintain reporting readiness, and continuously evaluate model behavior." />
            </ListItem>
          </List>
        </Box>
      </Container>
    </Page>
  );
};

export default ComplianceEuAiActPage;
