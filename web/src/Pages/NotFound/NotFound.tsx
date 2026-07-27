import "./NotFound.scss";

import { Box, Button, Typography } from "@mui/material";

import { EarbudsOutlined } from "@mui/icons-material";
import Page from "src/components/shared/Page/Page";
import { routes } from "src/application/routes";
import { useLocalizedPath } from "@yasserzakywafaa/client-core/web/i18n";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const { t } = useTranslation("page");
  const navigate = useNavigate();
  const localizedPath = useLocalizedPath();
  const handleOnClick = () => navigate(localizedPath(routes.features));

  return (
    <Box component="div" className="not-found-page">
      <Page title={t("notFound.pageTitle")}>
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
            <img src={""} width="100%" alt="" />
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
            <Typography variant="h5" sx={{ textAlign: "center" }}>
              {t("notFound.title")}
            </Typography>

            <Button
              sx={{ marginY: "2rem" }}
              size="large"
              type="button"
              variant="contained"
              endIcon={<EarbudsOutlined />}
              onClick={handleOnClick}
            >
              {t("notFound.goToMain")}
            </Button>
          </Box>
        </Box>
      </Page>
    </Box>
  );
};

export default NotFoundPage;
