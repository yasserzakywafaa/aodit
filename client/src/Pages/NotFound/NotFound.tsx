import "./NotFound.scss";

import { Box, Button, Typography } from "@mui/material";

// import 404Image from "../../assets/images/bot_404.webp";
import { EarbudsOutlined } from "@mui/icons-material";
import Page from "src/components/shared/Page/Page";
import { routes } from "src/application/routes";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();
  const handleOnClick = () => navigate(routes.features);

  return (
    <>
      <Box component="div" className="not-found-page">
        <Page title="Not Found | Aodit">
          <Box
            component="div"
            className="not-found-card-wrapper "
            sx={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              justifyContent: "center",
              p: 3
            }}>
            <Box component="div">
              <img src={""} width="100%" />
            </Box>

            <Box
              component="div"
              className="unauthorized-card-wrapper"
              sx={{
                marginY: 4,
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                justifyContent: "center"
              }}>
              <Typography variant="h5" sx={{
                textAlign: "center"
              }}>
                Page Not Found
              </Typography>

              <Button
                sx={{ marginY: "2rem" }}
                size="large"
                type="button"
                variant="contained"
                endIcon={<EarbudsOutlined />}
                onClick={handleOnClick}
              >
                Go to main page
              </Button>
            </Box>
          </Box>
        </Page>
      </Box>
    </>
  );
};

export default NotFoundPage;
