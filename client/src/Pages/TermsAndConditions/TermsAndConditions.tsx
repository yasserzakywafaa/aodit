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

const TermsAndConditions = () => {
  const navigate = useNavigate();

  const handleLinkClick =
    (route: string) =>
    (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      event.preventDefault();
      navigate(route);
    };

  const webPageSchema = useMemo(() => {
    return createWebPageSchema(
      "Terms and Conditions",
      "Terms and Conditions governing the provision of services by Swiss Lab of Intelligence (SwissLI AG) in connection with the aodit platform.",
      routes.termsAndConditions,
      new Date("03/01/2026"),
    );
  }, []);

  useSchemaOrg(webPageSchema, "terms-and-conditions-webpage-schema");

  return (
    <Page
      title="Terms & Conditions | aodit"
      className="terms-and-conditions-page"
      isLoading={false}
      noIndex
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
            Terms &amp; Conditions
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
          {/* 1. Scope */}
          <SectionHeading number="1" title="Scope" />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            These Terms &amp; Conditions (&ldquo;Terms&rdquo;) govern the
            provision of services by Swiss Lab of Intelligence (&ldquo;SwissLI
            AG&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) in connection with
            the{" "}
            <Typography
              component="span"
              fontSize="inherit"
              color="primary.main"
            >
              aodit
            </Typography>{" "}
            platform, related software components, reports, and services.
          </Typography>
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            By engaging SwissLI AG through an order form, master service
            agreement, statement of work, written confirmation, or by accessing
            services made available by SwissLI AG, the client
            (&ldquo;Client&rdquo;) agrees to these Terms.
          </Typography>

          {/* 2. Services */}
          <SectionHeading number="2" title="Services" />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            SwissLI AG provides services that may include:
          </Typography>
          <BulletList
            items={[
              "Independent evaluation of AI agents and AI-enabled systems",
              "Adversarial stress testing and multi-turn scenario analysis",
              "Generation of executive reports, technical reports, and supporting documentation",
              "Deployment of software components within client-controlled environments",
              "Support and advisory services as agreed",
            ]}
          />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            The exact scope of services is defined in the applicable agreement,
            order form, or statement of work.
          </Typography>

          {/* 3. Nature of Services */}
          <SectionHeading number="3" title="Nature of Services" />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            All services provided by SwissLI AG are advisory in nature.{" "}
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
              "Provides independent evaluation and analysis",
              "Supports governance, risk, audit, and compliance processes",
              "Does not constitute legal, regulatory, or audit advice",
              "Does not provide certification or regulatory approval",
              "Does not guarantee compliance with any law, regulation, or supervisory requirement",
            ]}
          />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75, mt: 2 }}>
            The Client remains solely responsible for:
          </Typography>
          <BulletList
            items={[
              "Its systems and infrastructure",
              "Regulatory compliance",
              "Implementation of controls and remediation actions",
              "Decisions taken based on aodit outputs",
            ]}
          />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            The Client acknowledges that AI systems are inherently probabilistic
            and that no evaluation can guarantee the absence of failure or risk.
          </Typography>

          {/* 4. Regulatory Positioning */}
          <SectionHeading number="4" title="Regulatory Positioning" />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            SwissLI AG may refer to frameworks such as:
          </Typography>
          <BulletList
            items={[
              "FINMA Guidance 08/2024",
              "EU AI Act",
              "NIST AI Risk Management Framework",
              "ISO standards",
            ]}
          />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            Such references indicate alignment and support, not certification or
            endorsement. SwissLI AG is not affiliated with, approved by, or
            acting on behalf of any regulatory authority.
          </Typography>

          {/* 5. Use of Services and Reports */}
          <SectionHeading number="5" title="Use of Services and Reports" />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            The Client may use aodit outputs solely for:
          </Typography>
          <BulletList
            items={[
              "Internal risk management",
              "Governance and compliance support",
              "Internal audit and model review processes",
            ]}
          />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75, mt: 2 }}>
            The Client shall not:
          </Typography>
          <BulletList
            items={[
              "Represent aodit outputs as regulatory certification",
              "Publish or distribute full reports externally without written approval",
              "Reverse-engineer or replicate SwissLI AG methodologies",
            ]}
          />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            SwissLI AG may provide executive summaries or limited extracts for
            external use, subject to approval.
          </Typography>

          {/* 6. Intellectual Property */}
          <SectionHeading number="6" title="Intellectual Property" />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            SwissLI AG retains all rights, title, and interest in:
          </Typography>
          <BulletList
            items={[
              "Methodologies",
              "Frameworks",
              "Taxonomies",
              "Scenario libraries",
              "Scoring logic",
              "Report structures",
              "Software, tools, and code",
              "All related know-how",
            ]}
          />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75, mt: 2 }}>
            The Client retains all rights to its systems, its data, and its
            internal outputs. No ownership of SwissLI AG intellectual property
            is transferred to the Client.
          </Typography>

          {/* 6A. Proprietary Methods */}
          <SectionHeading
            number="6A"
            title="Proprietary Methods and Trade Secrets"
          />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            <Typography
              component="span"
              fontSize="inherit"
              color="primary.main"
            >
              aodit
            </Typography>{" "}
            methodology, scenario architecture, category structures, scoring
            logic, and report generation systems are proprietary to SwissLI AG
            and constitute confidential trade secrets.
          </Typography>
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            The Client shall not, and shall not permit any third party to:
          </Typography>
          <BulletList
            items={[
              "Extract, replicate, or reproduce the methodology",
              "Reverse-engineer prompts, scoring logic, or test design",
              "Use outputs to build competing systems",
              "Disclose full technical reports, transcripts, or methodology details",
            ]}
          />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            SwissLI AG intentionally limits disclosure of methodology to protect
            its proprietary framework.
          </Typography>

          {/* 7. Confidentiality */}
          <SectionHeading number="7" title="Confidentiality" />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            Both parties agree to treat all non-public information as
            confidential. This includes:
          </Typography>
          <BulletList
            items={[
              "AI systems and architecture",
              "Test results and reports",
              "Technical and commercial information",
              "Proprietary methodologies",
            ]}
          />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            Confidential information may only be disclosed on a need-to-know
            basis to employees or advisors bound by confidentiality obligations.
          </Typography>

          {/* 8. Data and Deployment Model */}
          <SectionHeading number="8" title="Data and Deployment Model" />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            <Typography
              component="span"
              fontSize="inherit"
              color="primary.main"
            >
              aodit
            </Typography>{" "}
            is designed to operate within client-controlled infrastructure.
            Unless otherwise agreed:
          </Typography>
          <BulletList
            items={[
              "SwissLI AG does not require access to live production systems",
              "SwissLI AG does not process client AI system data by default",
              "SwissLI AG does not store or replicate client AI data",
            ]}
          />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            Client AI inputs, outputs, and logs remain within the client
            environment. Clients may optionally provide data for analysis. Such
            data is used only for the agreed purpose and remains under client
            control.
          </Typography>
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            SwissLI AG may use tools such as Google Workspace for business
            communication and handling documents voluntarily shared by the
            Client.
          </Typography>

          {/* 9. Security and Documentation */}
          <SectionHeading number="9" title="Security and Documentation" />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            SwissLI AG maintains documentation appropriate to its operating
            model, including:
          </Typography>
          <BulletList
            items={[
              "Privacy Policy",
              "Data Processing Agreement",
              "Security Policy",
              "Technical & Organisational Measures (TOM)",
              "Business Continuity Plan",
            ]}
          />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            The Client acknowledges that SwissLI AG&apos;s security model is
            aligned with its architecture and level of system access.
          </Typography>

          {/* 10. Client Responsibilities */}
          <SectionHeading number="10" title="Client Responsibilities" />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            The Client is responsible for:
          </Typography>
          <BulletList
            items={[
              "Ensuring it has rights to any data shared",
              "Maintaining its own governance and controls",
              "Reviewing and acting on aodit findings",
              "Ensuring appropriate internal use of reports",
            ]}
          />

          {/* 11. Fees and Payment */}
          <SectionHeading number="11" title="Fees and Payment" />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            Fees are defined in the applicable agreement, order form, or
            proposal. Unless otherwise agreed:
          </Typography>
          <BulletList
            items={[
              "Fees are denominated in CHF",
              "Invoices are payable within 30 days",
            ]}
          />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            Alternative payment terms (e.g. net 60 or net 90) may be agreed in
            writing. SwissLI AG may suspend services for materially overdue
            payments following reasonable notice, except where amounts are
            disputed in good faith.
          </Typography>

          {/* 12. No Warranty */}
          <SectionHeading number="12" title="No Warranty" />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            Services are provided &ldquo;as is&rdquo;. SwissLI AG does not
            warrant that:
          </Typography>
          <BulletList
            items={[
              "All risks will be identified",
              "Results are complete or error-free",
              "Systems will behave in a specific way",
            ]}
          />

          {/* 13. Limitation of Liability */}
          <SectionHeading number="13" title="Limitation of Liability" />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            To the maximum extent permitted by law, SwissLI AG&apos;s total
            liability shall not exceed the fees paid by the Client under the
            applicable engagement in the 12 months preceding the claim.
          </Typography>
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            SwissLI AG is not liable for:
          </Typography>
          <BulletList
            items={[
              "Indirect or consequential damages",
              "Loss of revenue or business",
              "Regulatory outcomes or supervisory actions",
              "Decisions made by the Client",
              "Third-party systems or infrastructure",
            ]}
          />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            Nothing in these Terms excludes liability where such exclusion is
            not permitted under applicable law.
          </Typography>

          {/* 14. Term and Termination */}
          <SectionHeading number="14" title="Term and Termination" />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            Either party may terminate an engagement:
          </Typography>
          <BulletList
            items={[
              "In accordance with the applicable agreement",
              "For material breach not remedied within a reasonable period",
            ]}
          />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            Termination does not affect accrued rights, payment obligations, or
            confidentiality provisions.
          </Typography>

          {/* 15. Publicity */}
          <SectionHeading number="15" title="Publicity" />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            The Client&apos;s name, logo, or relationship with SwissLI AG may
            not be used publicly without prior written consent.
          </Typography>

          {/* 16. Governing Law and Jurisdiction */}
          <SectionHeading number="16" title="Governing Law and Jurisdiction" />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            These Terms are governed by Swiss law.
          </Typography>
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            Exclusive jurisdiction: Courts of Lucerne, Switzerland.
          </Typography>

          {/* 17. General */}
          <SectionHeading number="17" title="General" />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            These Terms, together with applicable agreements, constitute the
            entire agreement. If any provision is invalid, the remainder remains
            in effect.
          </Typography>

          {/* 18. Force Majeure */}
          <SectionHeading number="18" title="Force Majeure" />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            SwissLI AG shall not be liable for failure or delay in performance
            caused by events beyond its reasonable control, including:
          </Typography>
          <BulletList
            items={[
              "Natural disasters",
              "War or civil unrest",
              "Infrastructure or network outages",
              "Failures of third-party providers",
              "Governmental actions",
            ]}
          />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            Performance shall be suspended for the duration of such events.
          </Typography>

          {/* 19. Independent Parties */}
          <SectionHeading number="19" title="Independent Parties" />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            Nothing in these Terms creates a partnership, joint venture, or
            agency relationship between the parties.
          </Typography>

          {/* 20. Assignment */}
          <SectionHeading number="20" title="Assignment" />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            The Client may not assign these Terms without prior written consent
            of SwissLI AG. SwissLI AG may assign these Terms in connection with
            a corporate restructuring, merger, or sale of business.
          </Typography>

          {/* 21. Amendments */}
          <SectionHeading number="21" title="Amendments" />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            Any amendments to these Terms must be made in writing.
          </Typography>

          {/* 22. Client Due Diligence */}
          <SectionHeading number="22" title="Client Due Diligence" />
          <Typography paragraph sx={{ fontSize: 15, lineHeight: 1.75 }}>
            SwissLI AG may respond to reasonable vendor due diligence requests
            and provide documentation describing its security, operational, and
            governance practices, in line with its operating model.
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
              If you have any questions about these Terms, you can contact us by
              visiting our{" "}
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

export default TermsAndConditions;
