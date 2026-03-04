import {
  Box,
  Container,
  Link,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { createWebPageSchema, useSchemaOrg } from "src/shared/utils/schemaOrg";

import Page from "src/components/shared/Page/Page";
import { routes } from "src/application/routes";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

const TermsAndConditions = () => {
  const navigate = useNavigate();

  const handleLinkClick =
    (route: string) =>
    (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      event.preventDefault();
      navigate(route);
    };

  // Generate WebPage schema for SEO
  const webPageSchema = useMemo(() => {
    return createWebPageSchema(
      "Terms and Conditions",
      "Please read these terms and conditions carefully before using Our Service. These Terms and Conditions set out the rights and obligations of all users regarding the use of the Service.",
      routes.termsAndConditions,
      new Date("01/01/2025"),
    );
  }, []);

  // Inject Schema.org structured data
  useSchemaOrg(webPageSchema, "terms-and-conditions-webpage-schema");

  return (
    <Page
      title="Terms and Conditions | Metriz"
      className="terms-and-conditions-page"
      isLoading={false}
    >
      <Container sx={{ mt: 3 }}>
        <Typography variant="h4" gutterBottom>
          Terms and Conditions for Metriz
        </Typography>
        <Typography variant="subtitle1" gutterBottom color="primary">
          Last updated:{" "}
          <span className="bold">
            {new Date("01/01/2025").toLocaleDateString("en-GB", {
              dateStyle: "short",
            })}
          </span>
        </Typography>
        <Typography paragraph>
          Please read these terms and conditions carefully before using Our
          Service.
        </Typography>

        <Box my={2}>
          <Typography variant="h5" color="primary" gutterBottom>
            Interpretation and Definitions
          </Typography>
          <Typography variant="h6" color="primary" gutterBottom>
            Interpretation
          </Typography>
          <Typography paragraph>
            The words of which the initial letter is capitalized have meanings
            defined under the following conditions. The following definitions
            shall have the same meaning regardless of whether they appear in
            singular or in plural.
          </Typography>

          <Typography variant="h6" color="primary" gutterBottom>
            Definitions
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="Country"
                secondary="refers to: Switzerland"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Company"
                secondary="(referred to as either 'the Company', 'We', 'Us' or 'Our' in this Agreement) refers to Metriz."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Device"
                secondary="means any device that can access the Service such as a computer, a cellphone or a digital tablet."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Service"
                secondary="refers to the Website."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Terms and Conditions"
                secondary="(also referred as 'Terms') mean these Terms and Conditions that form the entire agreement between You and the Company regarding the use of the Service."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Third-party Social Media Service"
                secondary="means any services or content (including data, information, products or services) provided by a third-party that may be displayed, included or made available by the Service."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Website"
                secondary="refers to Metriz, accessible from www.metriz.ai"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="You"
                secondary="means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable."
              />
            </ListItem>
          </List>
        </Box>

        <Box my={2}>
          <Typography variant="h5" color="primary" gutterBottom>
            Acknowledgment
          </Typography>
          <Typography paragraph>
            These are the Terms and Conditions governing the use of this Service
            and the agreement that operates between You and the Company. These
            Terms and Conditions set out the rights and obligations of all users
            regarding the use of the Service.
          </Typography>
          <Typography paragraph>
            Your access to and use of the Service is conditioned on Your
            acceptance of and compliance with these Terms and Conditions. These
            Terms and Conditions apply to all visitors, users and others who
            access or use the Service.
          </Typography>
          <Typography paragraph>
            By accessing or using the Service You agree to be bound by these
            Terms and Conditions. If You disagree with any part of these Terms
            and Conditions then You may not access the Service.
          </Typography>
          <Typography paragraph>
            Your access to and use of the Service is also conditioned on Your
            acceptance of and compliance with the{" "}
            <Link
              component="a"
              href={routes.privacyPolicy}
              onClick={handleLinkClick(routes.privacyPolicy)}
            >
              Privacy Policy
            </Link>{" "}
            of the Company. Our Privacy Policy describes Our policies and
            procedures on the collection, use and disclosure of Your personal
            information when You use the Application or the Website and tells
            You about Your privacy rights and how the law protects You. Please
            read Our Privacy Policy carefully before using Our Service.
          </Typography>
        </Box>

        <Box my={2}>
          <Typography variant="h5" color="primary" gutterBottom>
            Sharing personal information
          </Typography>
          <Typography paragraph>
            Metriz uses personal information according to the Terms of Service
            and this{" "}
            <Link
              component="a"
              href={routes.privacyPolicy}
              onClick={handleLinkClick(routes.privacyPolicy)}
            >
              Privacy Policy
            </Link>
            . Metriz may disclose your personal information to third parties,
            including marketing, advertising and analytics providers.
          </Typography>
          <Typography paragraph>
            We may also disclose information or allow third parties to directly
            collect information using third party cookies and related tracking
            technologies (such as pixels and web beacons) via our website, such
            as social media companies, advertising networks, companies that
            provide analytics (including ad tracking and reporting), security
            providers and others that help us to deliver our services.
          </Typography>
          <Typography paragraph>
            We only employ such third party tools based on your consent, opt-out
            preferences, or other appropriate legal requirements mandated by
            applicable laws and regulations.
          </Typography>
        </Box>

        <Box my={2}>
          <Typography variant="h5" color="primary" gutterBottom>
            Links to Other Websites
          </Typography>
          <Typography paragraph>
            Our Service may contain links to third-party web sites or services
            that are not owned or controlled by the Company.
          </Typography>
          <Typography paragraph>
            The Company has no control over, and assumes no responsibility for,
            the content, privacy policies, or practices of any third party web
            sites or services. You further acknowledge and agree that the
            Company shall not be responsible or liable, directly or indirectly,
            for any damage or loss caused or alleged to be caused by or in
            connection with the use of or reliance on any such content, goods or
            services available on or through any such web sites or services.
          </Typography>
          <Typography paragraph>
            We strongly advise You to read the terms and conditions and privacy
            policies of any third-party web sites or services that You visit.
          </Typography>
        </Box>

        <Box my={2}>
          <Typography variant="h5" color="primary" gutterBottom>
            Termination
          </Typography>
          <Typography paragraph>
            We may terminate or suspend Your access immediately, without prior
            notice or liability, for any reason whatsoever, including without
            limitation if You breach these Terms and Conditions.
          </Typography>
          <Typography paragraph>
            Upon termination, Your right to use the Service will cease
            immediately.
          </Typography>
        </Box>

        <Box my={2}>
          <Typography variant="h5" color="primary" gutterBottom>
            Limitation of Liability
          </Typography>
          <Typography paragraph>
            Notwithstanding any damages that You might incur, the entire
            liability of the Company and any of its suppliers under any
            provision of this Terms and Your exclusive remedy for all of the
            foregoing shall be limited to the amount actually paid by You
            through the Service or 100 USD if You haven't purchased anything
            through the Service.
          </Typography>
          <Typography paragraph>
            To the maximum extent permitted by applicable law, in no event shall
            the Company or its suppliers be liable for any special, incidental,
            indirect, or consequential damages whatsoever (including, but not
            limited to, damages for loss of profits, loss of data or other
            information, for business interruption, for personal injury, loss of
            privacy arising out of or in any way related to the use of or
            inability to use the Service, third-party software and/or
            third-party hardware used with the Service, or otherwise in
            connection with any provision of this Terms), even if the Company or
            any supplier has been advised of the possibility of such damages and
            even if the remedy fails of its essential purpose.
          </Typography>
          <Typography paragraph>
            Some states do not allow the exclusion of implied warranties or
            limitation of liability for incidental or consequential damages,
            which means that some of the above limitations may not apply. In
            these states, each party's liability will be limited to the greatest
            extent permitted by law.
          </Typography>
        </Box>

        <Box my={2}>
          <Typography variant="h5" color="primary" gutterBottom>
            "AS IS" and "AS AVAILABLE" Disclaimer
          </Typography>
          <Typography paragraph>
            The Service is provided to You "AS IS" and "AS AVAILABLE" and with
            all faults and defects without warranty of any kind. To the maximum
            extent permitted under applicable law, the Company, on its own
            behalf and on behalf of its Affiliates and its and their respective
            licensors and service providers, expressly disclaims all warranties,
            whether express, implied, statutory or otherwise, with respect to
            the Service, including all implied warranties of merchantability,
            fitness for a particular purpose, title and non-infringement, and
            warranties that may arise out of course of dealing, course of
            performance, usage or trade practice. Without limitation to the
            foregoing, the Company provides no warranty or undertaking, and
            makes no representation of any kind that the Service will meet Your
            requirements, achieve any intended results, be compatible or work
            with any other software, applications, systems or services, operate
            without interruption, meet any performance or reliability standards
            or be error free or that any errors or defects can or will be
            corrected.
          </Typography>
          <Typography paragraph>
            Without limiting the foregoing, neither the Company nor any of the
            company's provider makes any representation or warranty of any kind,
            express or implied: (i) as to the operation or availability of the
            Service, or the information, content, and materials or products
            included thereon; (ii) that the Service will be uninterrupted or
            error-free; (iii) as to the accuracy, reliability, or currency of
            any information or content provided through the Service; or (iv)
            that the Service, its servers, the content, or e-mails sent from or
            on behalf of the Company are free of viruses, scripts, trojan
            horses, worms, malware, timebombs or other harmful components.
          </Typography>
          <Typography paragraph>
            Some jurisdictions do not allow the exclusion of certain types of
            warranties or limitations on applicable statutory rights of a
            consumer, so some or all of the above exclusions and limitations may
            not apply to You. But in such a case the exclusions and limitations
            set forth in this section shall be applied to the greatest extent
            enforceable under applicable law.
          </Typography>
        </Box>

        <Box my={2}>
          <Typography variant="h5" color="primary" gutterBottom>
            Governing Law
          </Typography>
          <Typography paragraph>
            The laws of the Country, excluding its conflicts of law rules, shall
            govern this Terms and Your use of the Service. Your use of the
            Application may also be subject to other local, state, national, or
            international laws.
          </Typography>
        </Box>

        <Box my={2}>
          <Typography variant="h5" color="primary" gutterBottom>
            Disputes Resolution
          </Typography>
          <Typography paragraph>
            If You have any concern or dispute about the Service, You agree to
            first try to resolve the dispute informally by{" "}
            <Link
              component="a"
              href={routes.contact}
              onClick={handleLinkClick(routes.contact)}
            >
              contacting the Company
            </Link>
            .
          </Typography>
        </Box>

        <Box my={2}>
          <Typography variant="h5" color="primary" gutterBottom>
            For European Union (EU) Users
          </Typography>
          <Typography paragraph>
            If You are a European Union consumer, you will benefit from any
            mandatory provisions of the law of the country in which You are
            resident.
          </Typography>
        </Box>

        <Box my={2}>
          <Typography variant="h5" color="primary" gutterBottom>
            United States Legal Compliance
          </Typography>
          <Typography paragraph>
            You represent and warrant that (i) You are not located in a country
            that is subject to the United States government embargo, or that has
            been designated by the United States government as a "terrorist
            supporting" country, and (ii) You are not listed on any United
            States government list of prohibited or restricted parties.
          </Typography>
        </Box>

        <Box my={2}>
          <Typography variant="h5" color="primary" gutterBottom>
            Severability and Waiver
          </Typography>

          <Typography variant="h6" color="primary" gutterBottom>
            Severability
          </Typography>
          <Typography paragraph>
            If any provision of these Terms is held to be unenforceable or
            invalid, such provision will be changed and interpreted to
            accomplish the objectives of such provision to the greatest extent
            possible under applicable law and the remaining provisions will
            continue in full force and effect.
          </Typography>

          <Typography variant="h6" color="primary" gutterBottom>
            Waiver
          </Typography>
          <Typography paragraph>
            Except as provided herein, the failure to exercise a right or to
            require performance of an obligation under these Terms shall not
            affect a party's ability to exercise such right or require such
            performance at any time thereafter nor shall the waiver of a breach
            constitute a waiver of any subsequent breach.
          </Typography>
        </Box>

        <Box my={2}>
          <Typography variant="h5" color="primary" gutterBottom>
            Translation Interpretation
          </Typography>
          <Typography paragraph>
            These Terms and Conditions may have been translated if We have made
            them available to You on our Service. You agree that the original
            English text shall prevail in the case of a dispute.
          </Typography>
        </Box>

        <Box my={2}>
          <Typography variant="h5" color="primary" gutterBottom>
            Changes to These Terms and Conditions
          </Typography>
          <Typography paragraph>
            We reserve the right, at Our sole discretion, to modify or replace
            these Terms at any time. If a revision is material We will make
            reasonable efforts to provide at least 30 days' notice prior to any
            new terms taking effect. What constitutes a material change will be
            determined at Our sole discretion.
          </Typography>
          <Typography paragraph>
            By continuing to access or use Our Service after those revisions
            become effective, You agree to be bound by the revised terms. If You
            do not agree to the new terms, in whole or in part, please stop
            using the website and the Service.
          </Typography>
        </Box>

        <Box my={2}>
          <Typography variant="h5" color="primary" gutterBottom>
            Contact Us
          </Typography>
          <Typography paragraph>
            If you have any questions about these Terms and Conditions, You can
            contact us:
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="By visiting this page on our website: "
                secondary={
                  <Link
                    component="a"
                    href={routes.contact}
                    onClick={handleLinkClick(routes.contact)}
                  >
                    {`${window.location.origin}/contact`}
                  </Link>
                }
              />
            </ListItem>
          </List>
        </Box>
      </Container>
    </Page>
  );
};

export default TermsAndConditions;
