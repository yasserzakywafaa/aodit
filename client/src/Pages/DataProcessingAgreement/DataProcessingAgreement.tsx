import {
  Box,
  Container,
  Link,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import { createWebPageSchema, useSchemaOrg } from "src/shared/utils/schemaOrg";

import Page from "src/components/shared/Page/Page";
import { primaryColor } from "src/application/shared/themes";
import { routes } from "src/application/routes";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

const BulletList = ({ items }: { items: string[] }) => (
  <List sx={{ pl: 2, py: 0.5 }}>
    {items.map((item) => (
      <ListItem
        key={item}
        sx={{ display: "list-item", listStyleType: "'•  '", py: 0.25, px: 0 }}
      >
        <Typography
          sx={{ fontSize: 15, lineHeight: 1.7, color: "text.primary" }}
        >
          {item}
        </Typography>
      </ListItem>
    ))}
  </List>
);

const SectionHeading = ({
  number,
  title,
}: {
  number: string;
  title: string;
}) => (
  <Typography
    variant="h5"
    sx={{
      fontSize: { xs: "1.2rem", md: "1.35rem" },
      color: "text.primary",
      mb: 2,
      mt: 5,
    }}
  >
    <Box component="span" sx={{ color: primaryColor, mr: 1 }}>
      {number}.
    </Box>
    {title}
  </Typography>
);

const DataProcessingAgreementPage = () => {
  const navigate = useNavigate();

  const handleLinkClick =
    (route: string) =>
    (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      event.preventDefault();
      navigate(route);
    };

  const webPageSchema = useMemo(() => {
    return createWebPageSchema(
      "Data Processing Agreement (DPA)",
      "Data Processing Agreement governing the processing of personal data by Swiss Lab of Intelligence (SwissLI AG) on behalf of AODIT clients.",
      routes.dataProcessingAgreement,
      new Date("03/01/2026"),
    );
  }, []);

  useSchemaOrg(webPageSchema, "dpa-webpage-schema");

  return (
    <Page
      title="Data Processing Agreement | aodit"
      className="dpa-page"
      isLoading={false}
    >
      {/* Hero */}
      <Box
        sx={{
          pt: { xs: 10, md: 13 },
          pb: { xs: 4, md: 6 },
          px: { xs: 3, md: 0 },
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="subtitle2"
            sx={{
              color: primaryColor,
              fontWeight: 700,
              fontSize: 13,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              mb: 2,
            }}
          >
            Legal
          </Typography>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "2rem", sm: "2.4rem", md: "2.6rem" },
              lineHeight: 1.15,
              mb: 2,
              color: "text.primary",
            }}
          >
            Data Processing Agreement (DPA)
          </Typography>
          <Typography sx={{ fontSize: 15, color: "text.secondary", mb: 1 }}>
            Last updated: March 2026
          </Typography>
          <Typography sx={{ fontSize: 15, color: "text.secondary" }}>
            Swiss Lab of Intelligence (SwissLI AG)
            <br />
            Murbacherstrasse 19, 6003 Luzern, Switzerland
          </Typography>
        </Container>
      </Box>

      {/* Content */}
      <Box sx={{ py: { xs: 4, md: 6 }, px: { xs: 3, md: 0 } }}>
        <Container maxWidth="md">
          {/* 1. Purpose and Applicability */}
          <SectionHeading number="1" title="Purpose and Applicability" />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            This Data Processing Agreement (&ldquo;DPA&rdquo;) governs the
            processing of personal data by Swiss Lab of Intelligence
            (&ldquo;SwissLI AG&rdquo;, &ldquo;Processor&rdquo;) on behalf of the
            Client (&ldquo;Controller&rdquo;).
          </Typography>
          <Typography
            paragraph
            sx={{ fontSize: 15, lineHeight: 1.75, fontWeight: 600 }}
          >
            <Typography
              component="span"
              fontSize="inherit"
              color="primary.main"
            >
              aodit
            </Typography>{" "}
            is designed to operate without processing personal data.
          </Typography>
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            Accordingly:
          </Typography>
          <BulletList
            items={[
              "SwissLI AG does not process personal data as part of standard service delivery",
              "This DPA applies only in limited cases where SwissLI AG processes personal data on behalf of the Client",
            ]}
          />

          {/* 2. Roles of the Parties */}
          <SectionHeading number="2" title="Roles of the Parties" />
          <BulletList
            items={[
              "The Client acts as Controller",
              "SwissLI AG acts as Processor, only where applicable",
            ]}
          />
          <Typography sx={{ fontSize: 15, lineHeight: 1.75 }}>
            In standard{" "}
            <Typography
              component="span"
              fontSize="inherit"
              color="primary.main"
            >
              aodit
            </Typography>{" "}
            deployments, SwissLI AG does not act as a processor of personal
            data.
          </Typography>

          {/* 3. Nature of Processing */}
          <SectionHeading number="3" title="Nature of Processing" />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            SwissLI AG&apos;s services are based on:
          </Typography>
          <BulletList
            items={[
              "Adversarial testing using synthetic data",
              "Evaluation of AI system behaviour",
              "Generation of reports based on controlled inputs",
            ]}
          />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            Accordingly:
          </Typography>
          <BulletList
            items={[
              "SwissLI AG does not process personal data within AODIT evaluations",
              "Evaluation outputs (e.g. transcripts) are generated using synthetic, non-personal data",
            ]}
          />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            Only in exceptional cases, the Client may request analysis of
            materials. Such processing occurs only upon explicit written
            instruction from the Client.
          </Typography>

          {/* 4. Categories of Data and Data Subjects */}
          <SectionHeading
            number="4"
            title="Categories of Data and Data Subjects"
          />
          <Typography
            variant="h6"
            sx={{
              fontSize: "1.05rem",
              color: "text.primary",
              mb: 1.5,
              mt: 3,
            }}
          >
            4.1 Standard Operation
          </Typography>
          <BulletList
            items={[
              "No personal data is processed",
              "No data subjects are involved",
            ]}
          />

          <Typography
            variant="h6"
            sx={{
              fontSize: "1.05rem",
              color: "text.primary",
              mb: 1.5,
              mt: 3,
            }}
          >
            4.2 Exceptional Cases (If Applicable)
          </Typography>
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            If the Client voluntarily provides materials containing personal
            data:
          </Typography>
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            Categories of Data may include:
          </Typography>
          <BulletList
            items={[
              "Business contact data",
              "Documents or outputs provided by the Client",
            ]}
          />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            Data Subjects may include:
          </Typography>
          <BulletList items={["Client employees or representatives"]} />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            SwissLI AG does not intentionally process special categories of
            personal data.
          </Typography>

          {/* 5. Processing Instructions */}
          <SectionHeading number="5" title="Processing Instructions" />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            Where this DPA applies, SwissLI AG shall:
          </Typography>
          <BulletList
            items={[
              "Process personal data only on documented written instructions from the Client",
              "Process data only for the explicitly agreed purpose",
              "Not use personal data for training, development, or internal reuse",
            ]}
          />

          {/* 6. Confidentiality */}
          <SectionHeading number="6" title="Confidentiality" />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            SwissLI AG ensures that:
          </Typography>
          <BulletList
            items={[
              "All personnel are bound by confidentiality obligations",
              "Access to any data is restricted on a need-to-know basis",
            ]}
          />

          {/* 7. Security Measures */}
          <SectionHeading number="7" title="Security Measures" />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            SwissLI AG implements appropriate technical and organisational
            measures proportionate to its processing model. Given the
            architecture:
          </Typography>
          <BulletList
            items={[
              "SwissLI AG does not host or process client AI system data",
              "Personal data exposure is limited to business communication and, where applicable, explicitly shared materials",
            ]}
          />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            Security measures include:
          </Typography>
          <BulletList
            items={[
              "Secure communication via Google Workspace",
              "Multi-factor authentication (MFA) for account access",
              "Restricted access controls",
              "Encryption in transit (TLS)",
            ]}
          />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            Further details are defined in the Security Policy and Technical
            &amp; Organisational Measures (TOM).
          </Typography>

          {/* 8. Sub-Processors */}
          <SectionHeading number="8" title="Sub-Processors" />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            SwissLI AG uses limited third-party providers for business
            operations, including:
          </Typography>
          <BulletList
            items={["Google Workspace (email and document handling)"]}
          />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            SwissLI AG does not use sub-processors to process client AI system
            data. Where the Client explicitly requests external analysis,
            specific tools or providers may be used only with prior written
            approval from the Client.
          </Typography>

          {/* 9. International Data Transfers */}
          <SectionHeading number="9" title="International Data Transfers" />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            SwissLI AG operates primarily in Switzerland. As a principle, no
            client AI system data is transferred outside client-controlled
            infrastructure.
          </Typography>
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            In exceptional cases where the Client provides materials for
            analysis:
          </Typography>
          <BulletList
            items={[
              "Data may be processed using tools located outside Switzerland",
              "Such processing occurs only with Client knowledge and instruction",
              "Appropriate safeguards are applied where required",
            ]}
          />

          {/* 10. Assistance to the Controller */}
          <SectionHeading number="10" title="Assistance to the Controller" />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            Where applicable, SwissLI AG shall reasonably assist the Client
            with:
          </Typography>
          <BulletList
            items={[
              "Data subject requests",
              "Regulatory inquiries",
              "Security-related matters",
            ]}
          />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            Such assistance is limited to the scope of actual processing
            performed.
          </Typography>

          {/* 11. Data Breach Notification */}
          <SectionHeading number="11" title="Data Breach Notification" />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            SwissLI AG shall notify the Client without undue delay, and in any
            event within 48 hours after becoming aware of a personal data breach
            affecting data processed under this DPA.
          </Typography>

          {/* 12. Data Retention and Deletion */}
          <SectionHeading number="12" title="Data Retention and Deletion" />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            SwissLI AG does not retain client AI system data as part of standard{" "}
            <Typography
              component="span"
              fontSize="inherit"
              color="primary.main"
            >
              aodit
            </Typography>{" "}
            operation. Where personal data is processed under this DPA:
          </Typography>
          <BulletList
            items={[
              "Such data is retained only for the duration necessary to fulfil the agreed purpose",
              "And is deleted or returned upon completion of the engagement, unless otherwise agreed",
            ]}
          />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            Outputs generated by{" "}
            <Typography
              component="span"
              fontSize="inherit"
              color="primary.main"
            >
              aodit
            </Typography>{" "}
            :
          </Typography>
          <BulletList
            items={[
              "Are based on synthetic or non-personal data",
              "Do not constitute personal data",
              "May be retained by SwissLI AG for internal benchmarking, quality improvement, and development purposes, provided no Client-specific confidential information is disclosed",
            ]}
          />

          {/* 13. Audit and Verification */}
          <SectionHeading number="13" title="Audit and Verification" />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            The Client may request reasonable information to verify compliance
            with this DPA. Any audit:
          </Typography>
          <BulletList
            items={[
              "Must be proportionate to the limited processing activities",
              "Must not interfere with SwissLI AG's operations or confidentiality obligations",
            ]}
          />

          {/* 14. Liability */}
          <SectionHeading number="14" title="Liability" />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            Liability is governed by the applicable agreement (e.g.{" "}
            <Link
              href={routes.termsAndConditions}
              onClick={handleLinkClick(routes.termsAndConditions)}
            >
              Terms &amp; Conditions
            </Link>{" "}
            or Master Service Agreement).
          </Typography>

          {/* 15. Governing Law */}
          <SectionHeading number="15" title="Governing Law" />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            This DPA is governed by Swiss law.
          </Typography>
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            Jurisdiction: Courts of Lucerne, Switzerland.
          </Typography>

          {/* 16. Relationship with Other Agreements */}
          <SectionHeading
            number="16"
            title="Relationship with Other Agreements"
          />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            This DPA forms part of the contractual relationship between the
            parties. In case of conflict, this DPA prevails for data protection
            matters.
          </Typography>

          {/* Contact */}
          <Box
            sx={{
              mt: 6,
              pt: 4,
              borderTop: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                color: "text.primary",
              }}
            >
              Contact
            </Typography>
            <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
              If you have any questions about this Data Processing Agreement,
              you can contact us by visiting our{" "}
              <Link
                component="a"
                href={routes.contact}
                onClick={handleLinkClick(routes.contact)}
              >
                contact page
              </Link>
              .
            </Typography>
          </Box>
        </Container>
      </Box>
    </Page>
  );
};

export default DataProcessingAgreementPage;
