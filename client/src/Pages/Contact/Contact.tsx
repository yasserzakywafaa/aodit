import "./Contact.scss";

import { Container, Grid, Typography } from "@mui/material";
import {
  createBreadcrumbSchema,
  createContactPageSchema,
  createOrganizationSchemaForSite,
  useSchemaOrg,
} from "src/shared/utils/schemaOrg";

import ContactForm from "./features/ContactForm";
import ContactMap from "./features/ContactMap";
import Page from "src/components/shared/Page/Page";
import { routes } from "src/application/routes";
import { useContactContext } from "./store/Provider";
import { useMemo } from "react";

const ContactPage = () => {
  const {
    store: {
      state: { isFetching },
    },
  } = useContactContext();

  // Generate ContactPage schema for SEO
  const contactPageSchema = useMemo(() => createContactPageSchema(), []);

  // Generate Organization schema with contact information
  const organizationSchema = useMemo(
    () => createOrganizationSchemaForSite(),
    [],
  );

  // Generate Breadcrumb schema
  const breadcrumbSchema = useMemo(() => {
    const breadcrumbs = [
      { name: "Home", url: routes.features },
      { name: "Contact", url: routes.contact },
    ];
    return createBreadcrumbSchema(breadcrumbs);
  }, []);

  // Inject Schema.org structured data
  useSchemaOrg(contactPageSchema, "contact-page-schema");
  useSchemaOrg(organizationSchema, "contact-organization-schema");
  useSchemaOrg(breadcrumbSchema, "contact-breadcrumb-schema");

  return (
    <Page
      title="Contact Us | Aodit"
      className="contact-page"
      isLoading={isFetching}
    >
      <Container
        className="contact-container"
        sx={{
          pt: 4,
          pb: 4,
        }}
      >
        <Typography variant="h4" component="h1" color="primary" gutterBottom>
          Contact Us
        </Typography>

        <Grid container spacing={5}>
          <Grid size={{ xs: 12, md: 6 }}>
            <ContactForm />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <ContactMap />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default ContactPage;
