import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { CampaignOutlined } from "@mui/icons-material";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useLoginModalContext } from "src/components/Modals/LoginModal/store/Provider";

const Hero = () => {
  const {
    store: { handleToggleLoginModal },
  } = useLoginModalContext();

  const handleTryForFreeClick = () => {
    handleToggleLoginModal();
  };

  return (
    <Box id="hero" sx={{ mt: { xs: 1, sm: 4 }, mb: { xs: 2, sm: 8 } }}>
      <Container
        className="hero-container"
        sx={{
          pt: { xs: 2, sm: 4 },
          position: "relative",
        }}
      >
        <Box
          sx={{
            display: { xs: "flex", sm: "flex" },
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Box width="100%">
            <Typography
              variant="h1"
              className="hero-primary-text"
              sx={{
                display: "flex",
                flexDirection: "row",
                alignSelf: "center",
                textAlign: "center",
                fontSize: { xs: "2rem", sm: "3rem" },
              }}
            >
              Smart Tendering & BOQ for&nbsp;
              <Typography
                component="span"
                variant="h1"
                color="primary"
                className="hero-primary-sub-text"
                sx={{
                  fontSize: { xs: "2rem", sm: "3rem" },
                }}
              >
                Construction Companies
              </Typography>
            </Typography>

            <Typography
              variant="h2"
              textAlign="center"
              color="text.secondary"
              sx={{
                my: 2,
                alignSelf: "center",
                fontSize: { xs: "1.25rem", sm: "2rem" },
              }}
            >
              Generate accurate Bill of Quantities (BOQ) in minutes with
              AI-powered logic and streamline your tendering process.
            </Typography>
          </Box>

          {/* Hero Content with Visual and CTAs */}
          <Box my={6} width="30%">
            <Button
              variant="contained"
              size="medium"
              fullWidth
              endIcon={<CampaignOutlined />}
              onClick={handleTryForFreeClick}
              sx={{
                py: 2,
                fontSize: "1.1rem",
                fontWeight: "bold",
              }}
            >
              Try For free
            </Button>
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
              sx={{ mt: 1 }}
            >
              No credit card required.
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Hero;
