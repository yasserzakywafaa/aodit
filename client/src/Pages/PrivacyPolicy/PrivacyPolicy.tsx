import "./PrivacyPolicy.scss";

import {
  Box,
  Container,
  Link,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import { createWebPageSchema, useSchemaOrg } from "src/shared/utils/schemaOrg";
import { fontFamilySerif, primaryColor } from "src/application/shared/themes";

import Page from "src/components/shared/Page/Page";
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
      fontFamily: fontFamilySerif,
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

const PrivacyPolicyPage = () => {
  const navigate = useNavigate();

  const handleLinkClick =
    (route: string) =>
    (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      event.preventDefault();
      navigate(route);
    };

  const webPageSchema = useMemo(() => {
    return createWebPageSchema(
      "Privacy Policy",
      "Privacy Policy of Swiss Lab of Intelligence AG (SwissLI AG) describing how personal data is processed in connection with the AODIT platform.",
      routes.privacyPolicy,
      new Date("03/01/2026"),
    );
  }, []);

  useSchemaOrg(webPageSchema, "privacy-policy-webpage-schema");

  return (
    <Page
      title="Privacy Policy | AODIT"
      className="privacy-policy-page"
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
              fontFamily: fontFamilySerif,
              fontSize: { xs: "2rem", sm: "2.4rem", md: "2.6rem" },
              lineHeight: 1.15,
              mb: 2,
              color: "text.primary",
            }}
          >
            Privacy Policy
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
          {/* 1. Controller */}
          <SectionHeading number="1" title="Controller" />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            Swiss Lab of Intelligence AG (&ldquo;SwissLI AG&rdquo;,
            &ldquo;we&rdquo;, &ldquo;us&rdquo;) is the controller of personal
            data processed in connection with its website and business
            activities.
          </Typography>
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            For data protection inquiries, including data subject requests:{" "}
            <Link href="mailto:privacy@swissli.ai">privacy@swissli.ai</Link>
          </Typography>

          {/* 2. Scope of this Policy */}
          <SectionHeading number="2" title="Scope of this Policy" />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            This Privacy Policy describes how SwissLI AG processes personal data
            in relation to:
          </Typography>
          <BulletList
            items={[
              "The website www.aodit.ai",
              "Client onboarding, contracting, and communication",
              "Optional support or analysis services",
            ]}
          />
          <Typography
            paragraph
            sx={{ fontSize: 15, lineHeight: 1.75, fontWeight: 600 }}
          >
            The AODIT platform itself is designed to operate without requiring
            SwissLI AG to access client AI system data.
          </Typography>

          {/* 3. Core Principle */}
          <SectionHeading
            number="3"
            title="Core Principle — Data Sovereignty"
          />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            AODIT is designed as an on-premise evaluation system. This means:
          </Typography>
          <BulletList
            items={[
              "AI agent inputs, outputs, and logs remain within the Client's infrastructure",
              "SwissLI AG does not receive, store, or process client AI system data by default",
              "No client AI data is transferred to SwissLI AG systems unless explicitly provided by the Client",
            ]}
          />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            SwissLI AG acts as an independent evaluation provider, not as a
            processor of client AI workloads.
          </Typography>

          {/* 3A. No Data Processor Role */}
          <SectionHeading number="3A" title="No Data Processor Role" />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            SwissLI AG does not act as a data processor for client AI system
            data in the ordinary course of its services. Unless explicitly
            agreed:
          </Typography>
          <BulletList
            items={[
              "SwissLI AG does not process personal data on behalf of the Client",
              "SwissLI AG does not host or operate Client systems",
              "SwissLI AG does not access production environments",
            ]}
          />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            Where limited processing may occur (e.g. optional analysis), this is
            governed by a separate agreement (e.g. Data Processing Agreement).
          </Typography>

          {/* 4. Access to Client Data */}
          <SectionHeading number="4" title="Access to Client Data" />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            AODIT is designed to operate without requiring direct access to live
            production systems. SwissLI AG:
          </Typography>
          <BulletList
            items={[
              "Does not access AI agent outputs or transcripts by default",
              "Does not store or replicate client AI data",
              "Does not use client data for training or development",
            ]}
          />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            If access is required:
          </Typography>
          <BulletList
            items={[
              "It is explicitly approved by the Client",
              "Limited in scope and duration",
              "Technically controlled",
              "Logged where applicable",
            ]}
          />

          {/* 5. Development vs Client Environments */}
          <SectionHeading
            number="5"
            title="Development vs Client Environments"
          />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            SwissLI AG develops evaluation methodologies using controlled
            environments, which may include cloud-based language models.
            However:
          </Typography>
          <BulletList
            items={[
              "No client data is used in development or testing",
              "Client-specific evaluations are executed within client-controlled infrastructure",
              "External systems and models have no visibility into client environments",
            ]}
          />

          {/* 6. Categories of Personal Data Processed */}
          <SectionHeading
            number="6"
            title="Categories of Personal Data Processed"
          />
          <Typography
            variant="h6"
            sx={{
              fontFamily: fontFamilySerif,
              fontSize: "1.05rem",
              color: "text.primary",
              mb: 1.5,
              mt: 3,
            }}
          >
            6.1 Website and Communication
          </Typography>
          <BulletList
            items={[
              "Name",
              "Email address",
              "Company information",
              "Technical data (e.g. IP address, browser type)",
            ]}
          />

          <Typography
            variant="h6"
            sx={{
              fontFamily: fontFamilySerif,
              fontSize: "1.05rem",
              color: "text.primary",
              mb: 1.5,
              mt: 3,
            }}
          >
            6.2 Client Relationship Management
          </Typography>
          <BulletList
            items={[
              "Contact details of client representatives",
              "Contracts, billing information, and communication records",
            ]}
          />

          <Typography
            variant="h6"
            sx={{
              fontFamily: fontFamilySerif,
              fontSize: "1.05rem",
              color: "text.primary",
              mb: 1.5,
              mt: 3,
            }}
          >
            6.3 Documents Provided by Clients (Optional)
          </Typography>
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            Clients may voluntarily provide documents (e.g. reports or outputs)
            for analysis. Such documents:
          </Typography>
          <BulletList
            items={[
              "Are not required for AODIT operation",
              "Are handled within SwissLI AG's secured environment",
              "Remain under client control",
            ]}
          />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            SwissLI AG does not process end-user data generated within client AI
            systems.
          </Typography>

          {/* 7. Legal Basis for Processing */}
          <SectionHeading number="7" title="Legal Basis for Processing" />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            SwissLI AG processes personal data based on:
          </Typography>
          <BulletList
            items={[
              "Contract performance",
              "Legitimate interest (business communication and operations)",
              "Consent (where applicable)",
              "Legal obligations",
            ]}
          />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            In accordance with:
          </Typography>
          <BulletList
            items={[
              "Swiss Federal Act on Data Protection (nDSG)",
              "EU General Data Protection Regulation (GDPR), where applicable",
            ]}
          />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            SwissLI AG applies principles of data minimisation and processes
            only personal data necessary for the stated purposes.
          </Typography>

          {/* 8. Use of Google Workspace */}
          <SectionHeading number="8" title="Use of Google Workspace" />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            SwissLI AG uses Google Workspace (including Gmail, Google Drive, and
            Google Sheets) for business communication and document management.
            This includes:
          </Typography>
          <BulletList
            items={[
              "Email communication",
              "Storage of business documents",
              "Analysis of documents voluntarily shared by clients",
            ]}
          />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            Data processed within Google Workspace is subject to Google&apos;s
            security and data protection measures. SwissLI AG does not transfer
            client AI system data to Google systems.
          </Typography>

          {/* 8A. No Use for Training */}
          <SectionHeading
            number="8A"
            title="No Use for Training or Cross-Client Reuse"
          />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            SwissLI AG does not use client-provided data for:
          </Typography>
          <BulletList
            items={[
              "Training machine learning models",
              "Fine-tuning models",
              "Improving third-party models",
              "Benchmarking one client against another using identifiable client data",
            ]}
          />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            SwissLI AG may use generalized, anonymized, and
            non-client-identifiable learnings to refine its methodologies,
            taxonomies, and scenario design, provided that no client
            confidential information, personal data, or client-identifiable
            materials are disclosed or reused across clients.
          </Typography>

          {/* 9. Data Sharing */}
          <SectionHeading number="9" title="Data Sharing" />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            SwissLI AG does not sell personal data. Limited sharing may occur
            with:
          </Typography>
          <BulletList
            items={[
              "Infrastructure providers (e.g. Google Workspace)",
              "Professional advisors (legal, financial)",
              "Regulatory authorities where required by law",
            ]}
          />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            SwissLI AG maintains a limited set of infrastructure providers
            necessary for business operations. A list of key subprocessors may
            be provided upon request. Client AI system data is not shared
            externally.
          </Typography>

          {/* 10. International Data Transfers */}
          <SectionHeading number="10" title="International Data Transfers" />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            SwissLI AG operates primarily in Switzerland. Where third-party
            providers are used, data may be processed outside Switzerland. Such
            transfers are safeguarded through:
          </Typography>
          <BulletList
            items={["Adequacy decisions", "Standard contractual clauses"]}
          />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            Client AI system data remains within client-controlled
            infrastructure.
          </Typography>

          {/* 11. Cookies and Analytics */}
          <SectionHeading number="11" title="Cookies and Analytics" />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            The website uses cookies to ensure functionality and improve user
            experience.
          </Typography>

          <Typography
            variant="h6"
            sx={{
              fontFamily: fontFamilySerif,
              fontSize: "1.05rem",
              color: "text.primary",
              mb: 1.5,
              mt: 3,
            }}
          >
            11.1 Essential Cookies
          </Typography>
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            Used for:
          </Typography>
          <BulletList items={["Website operation", "Security"]} />

          <Typography
            variant="h6"
            sx={{
              fontFamily: fontFamilySerif,
              fontSize: "1.05rem",
              color: "text.primary",
              mb: 1.5,
              mt: 3,
            }}
          >
            11.2 Analytics Cookies (Google Analytics)
          </Typography>
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            SwissLI AG uses Google Analytics to understand website usage. Google
            Analytics may collect:
          </Typography>
          <BulletList
            items={[
              "Anonymized IP address",
              "Device and browser information",
              "Pages visited and interaction data",
            ]}
          />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            This data does not directly identify individuals.
          </Typography>

          <Typography
            variant="h6"
            sx={{
              fontFamily: fontFamilySerif,
              fontSize: "1.05rem",
              color: "text.primary",
              mb: 1.5,
              mt: 3,
            }}
          >
            11.3 Cookie Consent
          </Typography>
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            Analytics cookies are activated only after user consent via a cookie
            banner. Users can:
          </Typography>
          <BulletList
            items={["Accept or reject cookies", "Withdraw consent at any time"]}
          />

          <Typography
            variant="h6"
            sx={{
              fontFamily: fontFamilySerif,
              fontSize: "1.05rem",
              color: "text.primary",
              mb: 1.5,
              mt: 3,
            }}
          >
            11.4 Additional Information
          </Typography>
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            Further information on Google&apos;s data processing:{" "}
            <Link
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://policies.google.com/privacy
            </Link>
          </Typography>

          {/* 12. Data Retention */}
          <SectionHeading number="12" title="Data Retention" />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            SwissLI AG retains personal data as follows:
          </Typography>
          <BulletList
            items={[
              "Client relationship data (contracts, communication, billing): up to 10 years",
              "Contact data provided voluntarily: retained as long as necessary",
              "Website analytics data: up to 12 months",
            ]}
          />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            SwissLI AG does not retain AI system data.
          </Typography>

          {/* 13. Security Measures */}
          <SectionHeading number="13" title="Security Measures" />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            SwissLI AG implements appropriate technical and organisational
            measures, including:
          </Typography>
          <BulletList
            items={[
              "Encryption of communications (e.g. TLS)",
              "Restricted access controls based on least-privilege principles",
              "Strong authentication controls, including multi-factor authentication (MFA)",
              "Controlled access to internal systems and documents",
              "Use of secure infrastructure providers (e.g. Google Workspace)",
              "Logging of administrative access where applicable",
            ]}
          />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            SwissLI AG maintains internal documentation covering its security,
            development, and operational practices. Such documentation may be
            made available to clients upon reasonable request as part of vendor
            due diligence processes.
          </Typography>

          {/* 13A. Incident Handling */}
          <SectionHeading number="13A" title="Incident Handling" />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            SwissLI AG maintains procedures for handling security incidents
            affecting systems or data under its control. Where legally required,
            SwissLI AG will notify affected parties or authorities of relevant
            incidents and cooperate in appropriate remediation steps.
          </Typography>

          {/* 14. Your Rights */}
          <SectionHeading number="14" title="Your Rights" />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            Under applicable law, you have the right to:
          </Typography>
          <BulletList
            items={[
              "Access your personal data",
              "Request correction or deletion",
              "Object to processing",
              "Withdraw consent",
            ]}
          />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            You may lodge a complaint with:
            <br />
            Swiss Federal Data Protection and Information Commissioner (FDPIC)
            <br />
            <Link
              href="https://www.edoeb.admin.ch"
              target="_blank"
              rel="noopener noreferrer"
            >
              www.edoeb.admin.ch
            </Link>
          </Typography>

          {/* 15. Changes to this Policy */}
          <SectionHeading number="15" title="Changes to this Policy" />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            This Privacy Policy may be updated from time to time. The latest
            version is available at:{" "}
            <Link
              href={routes.privacyPolicy}
              onClick={handleLinkClick(routes.privacyPolicy)}
            >
              www.aodit.ai/privacy
            </Link>
          </Typography>

          {/* 16. Contact */}
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
                fontFamily: fontFamilySerif,
                mb: 2,
                color: "text.primary",
              }}
            >
              Contact
            </Typography>
            <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
              Swiss Lab of Intelligence AG
              <br />
              Murbacherstrasse 19
              <br />
              6003 Luzern
              <br />
              Switzerland
            </Typography>
            <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
              Email:{" "}
              <Link href="mailto:privacy@swissli.ai">privacy@swissli.ai</Link>
            </Typography>
          </Box>
        </Container>
      </Box>
    </Page>
  );
};

export default PrivacyPolicyPage;
