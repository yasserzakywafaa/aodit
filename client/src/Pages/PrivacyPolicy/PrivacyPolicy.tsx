import "./PrivacyPolicy.scss";

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

const PrivacyPolicyPage = () => {
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
      "Privacy Policy",
      "This Privacy Policy describes Our policies and procedures on the collection, use, and disclosure of your information when you use the Service and tells you about your privacy rights and how the law protects you.",
      routes.privacyPolicy,
      new Date("01/07/2024"),
    );
  }, []);

  // Inject Schema.org structured data
  useSchemaOrg(webPageSchema, "privacy-policy-webpage-schema");

  return (
    <Page
      title="Privacy Policy | Metriz"
      className="privacy-policy-page"
      isLoading={false}
    >
      <Container sx={{ mt: 3 }}>
        <Typography variant="h4" gutterBottom>
          Privacy Policy
        </Typography>
        <Typography variant="subtitle1" color="primary" gutterBottom>
          Last updated:{" "}
          <span className="bold">
            {new Date("01/07/2024").toLocaleDateString("en-GB", {
              dateStyle: "short",
            })}
          </span>
        </Typography>
        <Typography paragraph>
          This Privacy Policy describes Our policies and procedures on the
          collection, use, and disclosure of your information when you use the
          Service and tells you about your privacy rights and how the law
          protects you.
        </Typography>
        <Typography paragraph>
          We use your Personal data to provide and improve the Service. By using
          the Service, you agree to the collection and use of information in
          accordance with this Privacy Policy.
        </Typography>

        <Box my={4}>
          <Typography variant="h5" color="primary" gutterBottom>
            Interpretation and Definitions
          </Typography>

          <Typography variant="h6" color="primary">
            Interpretation
          </Typography>
          <Typography paragraph>
            The words of which the initial letter is capitalized have meanings
            defined under the following conditions. The following definitions
            shall have the same meaning regardless of whether they appear in
            singular or in plural.
          </Typography>

          <Typography variant="h6" color="primary">
            Definitions
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="Account"
                secondary="A unique account created for you to access Our Service or parts of Our Service."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Affiliate"
                secondary="An entity that controls, is controlled by or is under common control with a party."
              />
            </ListItem>
            <ListItem>
              <ListItemText primary="Company" secondary="Refers to Metriz." />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Cookies"
                secondary="Small files placed on your computer or device by a website, containing the details of your browsing history on that website."
              />
            </ListItem>
            <ListItem>
              <ListItemText primary="Country" secondary="Switzerland" />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Device"
                secondary="Any device that can access the Service such as a computer, a cellphone or a digital tablet."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Personal Data"
                secondary="Any information that relates to an identified or identifiable individual."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Service"
                secondary="Refers to the web application."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Service Provider"
                secondary="Any natural or legal person who processes the data on behalf of the Company."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Usage Data"
                secondary="Data collected automatically, either generated by the use of the Service or from the Service infrastructure itself."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Website"
                secondary={
                  <Link
                    href={routes.features}
                    onClick={handleLinkClick(routes.features)}
                  >
                    {window.location.origin}
                  </Link>
                }
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="You"
                secondary="The individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service."
              />
            </ListItem>
          </List>
        </Box>

        <Box my={4}>
          <Typography variant="h5" color="primary" gutterBottom>
            Collecting and Using your Personal Data
          </Typography>

          <Typography variant="h6" color="primary">
            Types of Data Collected
          </Typography>
          <Typography variant="subtitle1">Personal Data</Typography>
          <Typography paragraph>
            While using Our Service, We may ask you to provide Us with certain
            personally identifiable information that can be used to contact or
            identify you. Personally identifiable information may include, but
            is not limited to:
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="First name and last name" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Usage Data" />
            </ListItem>
          </List>

          <Typography variant="subtitle1">Usage Data</Typography>
          <Typography paragraph>
            Usage Data is collected automatically when using the Service.
          </Typography>
          <Typography paragraph>
            Usage Data may include information such as your Device's Internet
            Protocol address (e.g. IP address), browser type, browser version,
            the pages of Our Service that you visit, the time and date of your
            visit, the time spent on those pages, unique device identifiers and
            other diagnostic data.
          </Typography>
          <Typography paragraph>
            When you access the Service by or through a mobile device, We may
            collect certain information automatically, including, but not
            limited to, the type of mobile device you use, your mobile device
            unique ID, the IP address of your mobile device, your mobile
            operating system, the type of mobile Internet browser you use,
            unique device identifiers and other diagnostic data.
          </Typography>
          <Typography paragraph>
            We may also collect information that your browser sends whenever you
            visit Our Service or when you access the Service by or through a
            mobile device.
          </Typography>

          <Typography variant="subtitle1">
            Tracking Technologies and Cookies
          </Typography>
          <Typography paragraph>
            We use Cookies and similar tracking technologies to track the
            activity on Our Service and store certain information. Tracking
            technologies used are beacons, tags, and scripts to collect and
            track information and to improve and analyze Our Service. The
            technologies We use may include:
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="Cookies or Browser Cookies"
                secondary="A cookie is a small file placed on your Device. you can instruct your browser to refuse all Cookies or to indicate when a Cookie is being sent."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Web Beacons"
                secondary="Certain sections of Our Service and Our emails may contain small electronic files known as web beacons."
              />
            </ListItem>
          </List>
          <Typography paragraph>
            Cookies can be "Persistent" or "Session" Cookies. Persistent Cookies
            remain on your personal computer or mobile device when you go
            offline, while Session Cookies are deleted as soon as you close your
            web browser.
          </Typography>
        </Box>
      </Container>
    </Page>
  );
};

export default PrivacyPolicyPage;
