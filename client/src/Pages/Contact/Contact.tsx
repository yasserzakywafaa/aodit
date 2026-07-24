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
import { useLocalizedPath } from "@yasserzakywafaa/client-core/web/i18n";
import { useContactContext } from "./store/Provider";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

const ContactPage = () => {
  const { t } = useTranslation("page");
  const localizedPath = useLocalizedPath();
  const {
    store: {
      state: { isFetching },
    },
  } = useContactContext();

  const contactPageSchema = useMemo(() => createContactPageSchema(), []);

  const organizationSchema = useMemo(
    () => createOrganizationSchemaForSite(),
    [],
  );

  const breadcrumbSchema = useMemo(() => {
    const breadcrumbs = [
      { name: t("breadcrumb.home"), url: localizedPath(routes.features) },
      { name: t("breadcrumb.contact"), url: localizedPath(routes.contact) },
    ];
    return createBreadcrumbSchema(breadcrumbs);
  }, [t, localizedPath]);

  useSchemaOrg(contactPageSchema, "contact-page-schema");
  useSchemaOrg(organizationSchema, "contact-organization-schema");
  useSchemaOrg(breadcrumbSchema, "contact-breadcrumb-schema");

  return (
    <Page
      title={t("contact.pageTitle")}
      className="contact-page"
      isLoading={isFetching}
      seo={{
        description: t("contact.intro"),
        segment: routes.contact,
      }}
    >
      <Container className="contact-container" sx={{ pt: 6, pb: 6 }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontSize: { xs: "1.75rem", md: "2.25rem" },
            mb: 1,
          }}
        >
          {t("contact.title")}
        </Typography>
        <Typography sx={{ color: "text.secondary", mb: 1, lineHeight: 1.7 }}>
          {t("contact.intro")}{" "}
          <Typography
            component="span"
            sx={{ fontSize: "inherit", color: "primary.main" }}
          >
            aodit
          </Typography>
          .
        </Typography>
        <Typography sx={{ color: "text.secondary", mb: 4, fontSize: 14 }}>
          {t("contact.responseTime")}
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
