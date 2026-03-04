import "./Footer.scss";

import Logo, { LogoComponentEnum } from "../Logo";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { Divider } from "@mui/material";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { defaultBackDropFilterBlur } from "src/application/shared/themes";
import { routes } from "src/application/routes";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  const handleFooterLinkItemClick =
    (route: string) =>
    (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      event.preventDefault();
      navigate(route);
    };

  return (
    <Container
      className="footer"
      sx={{
        gap: { xs: 4, sm: 8 },
        p: { xs: 2, sm: 2 },
        textAlign: { sm: "center", md: "left" },
        backdropFilter: defaultBackDropFilterBlur,
      }}
    >
      <Box
        display="flex"
        flexWrap="wrap"
        flexDirection={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
      >
        <Box mb={{ xs: 3, sm: 0 }} paddingRight={{ sm: "1rem" }}>
          <Typography variant="body1">
            At <span className="bold">metriz.ai</span>, we're built for
            companies that need to streamline their tendering process. Our
            AI-powered platform helps businesses manage smart tendering
            processes and generate Bill of Quantities (BOQ) in minutes.
          </Typography>

          <Typography variant="body1">
            Perfect for businesses, procurement teams, and project managers that
            need to generate high volumes of accurate BOQs. Create campaigns
            that automatically generate hundreds of BOQs, manage multiple client
            projects, and integrate seamlessly with your existing workflows.
          </Typography>

          <Typography variant="body1">
            Scale your company's tendering operations with automated BOQ
            generation. Reduce manual work, increase output, and deliver
            consistent quality at scale for all your clients.
          </Typography>

          <Box
            display="flex"
            flexWrap="wrap"
            my={6}
            justifyContent={{ xs: "flex-start", sm: "space-between" }}
            flexDirection={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "center", sm: "flex-start" }}
          >
            <Box my={{ xs: 6, sm: 0 }}>
              <Logo
                component={LogoComponentEnum.IMAGE}
                style={{
                  width: "180px",
                }}
              />
            </Box>

            <Box
              display="flex"
              justifyContent={{ xs: "center", sm: "space-between" }}
              alignItems="flex-start"
              flexWrap="wrap"
              textAlign="left"
              marginY={{ xs: 0 }}
              gap={{ xs: 8, sm: 20 }}
            >
              {/* PRODUCT */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  gap: 1,
                }}
              >
                <Typography component="h5" variant="h5">
                  Product
                </Typography>

                <Typography variant="subtitle2">
                  <Link
                    href={routes.features}
                    onClick={handleFooterLinkItemClick(routes.features)}
                  >
                    Features
                  </Link>
                </Typography>

                <Typography variant="subtitle2">
                  <Link
                    href={routes.howItWorks}
                    onClick={handleFooterLinkItemClick(routes.howItWorks)}
                  >
                    How It Works
                  </Link>
                </Typography>

                <Typography variant="subtitle2">
                  <Link
                    href={routes.pricing}
                    onClick={handleFooterLinkItemClick(routes.pricing)}
                  >
                    Pricing
                  </Link>
                </Typography>
              </Box>

              {/* COMPANY */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                <Typography component="h4" variant="h5">
                  Company
                </Typography>

                <Typography variant="subtitle2">
                  <Link
                    href={routes.contact}
                    onClick={handleFooterLinkItemClick(routes.contact)}
                  >
                    Contact Us
                  </Link>
                </Typography>

                <Typography variant="subtitle2">
                  <Link
                    href={routes.privacyPolicy}
                    onClick={handleFooterLinkItemClick(routes.privacyPolicy)}
                  >
                    Privacy Policy
                  </Link>
                </Typography>

                <Typography variant="subtitle2">
                  <Link
                    href={routes.termsAndConditions}
                    onClick={handleFooterLinkItemClick(
                      routes.termsAndConditions,
                    )}
                  >
                    Terms and Conditions
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ my: 4 }} />

      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box display="flex" justifyContent="center" alignContent="center">
          <Link
            sx={{ pt: "5px" }}
            color="text.secondary"
            href={routes.privacyPolicy}
            onClick={handleFooterLinkItemClick(routes.privacyPolicy)}
          >
            Privacy Policy
          </Link>

          <Divider
            variant="middle"
            orientation="vertical"
            sx={{ width: "3px", height: "20px", mx: 1 }}
          />

          <Link
            sx={{ pt: "5px" }}
            color="text.secondary"
            href={routes.termsAndConditions}
            onClick={handleFooterLinkItemClick(routes.termsAndConditions)}
          >
            Terms and Conditions
          </Link>
        </Box>

        <Box
          mt={1}
          display="flex"
          flexWrap="wrap"
          justifyContent="center"
          alignContent="center"
        >
          <Typography variant="body2" color="text.secondary" mx={1}>
            {"Copyright © "}
            <Link href={routes.features}>Metriz</Link>&nbsp;
            {new Date().getFullYear()}
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Footer;
