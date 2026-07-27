import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";

import APP_CONSTANTS from "src/application/shared/app_constants";
import { alpha } from "@mui/material/styles";
import { fontFamilyPlayfairDisplay } from "src/application/shared/themes";
import { routes } from "src/application/routes";
import { useDashboardCreateAgentContext } from "./store/Provider";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";

const DashboardCreateAgent = () => {
  const { t } = useTranslation("agent");
  const navigate = useNavigate();
  const {
    store: {
      state: { agent },
      setAgent,
    },
    manager: { handleCreateAgent },
  } = useDashboardCreateAgentContext();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }
    >,
  ) => {
    const { name, value } = e.target;
    setAgent({
      ...agent,
      [name as string]: value,
    });
  };

  const isValidUrl = (url: string | undefined): boolean => {
    if (!url || url.trim() === "") return true; // optional field — empty is fine
    try {
      const parsed = new URL(url.trim());
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !agent.name?.trim() ||
      !agent.description?.trim() ||
      !agent.intent?.trim() ||
      !agent.ownerName?.trim()
    )
      return;
    if (!isValidUrl(agent.agentUrl)) return;
    if (!isValidUrl(agent.evaluatorUrl)) return;
    try {
      const created = await handleCreateAgent(agent);
      if (created?._id) {
        navigate(routes.dashboard.agents.agentById(created._id));
      }
    } catch (error) {
      console.error("❌ Failed to create agent:", error);
    }
  };

  useEffect(() => {
    return () => {
      setAgent({
        name: "",
        description: "",
        intent: "",
        ownerName: "",
        agentUrl: "",
      });
    };
  }, []);

  return (
    <Container sx={{ margin: "0" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h4" component="h1" color="primary" gutterBottom>
          {t("create.title")}
        </Typography>
      </Box>
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2
            }}>
            <Card variant="outlined" sx={{ borderWidth: 1 }}>
              <CardContent>
                <Typography
                  variant="body1"
                  color="primary"
                  sx={{
                    fontWeight: 600,
                    mb: 2
                  }}>
                  {t("create.details")}
                </Typography>
                <TextField
                  label={t("name")}
                  name="name"
                  value={agent.name ?? ""}
                  onChange={handleChange}
                  placeholder={t("create.namePlaceholder")}
                  required
                  fullWidth
                  sx={{ mb: 2 }}
                />
                <TextField
                  label={t("description")}
                  name="description"
                  multiline
                  rows={3}
                  value={agent.description ?? ""}
                  onChange={handleChange}
                  placeholder={t("create.descriptionPlaceholder")}
                  required
                  fullWidth
                  sx={{ mb: 2 }}
                />
                <TextField
                  label={t("intent")}
                  name="intent"
                  multiline
                  rows={2}
                  value={agent.intent ?? ""}
                  onChange={handleChange}
                  placeholder={t("create.intentPlaceholder")}
                  required
                  fullWidth
                  sx={{ mb: 2 }}
                />
                <TextField
                  label={t("ownerLabel")}
                  name="ownerName"
                  value={agent.ownerName ?? ""}
                  onChange={handleChange}
                  placeholder={t("create.ownerPlaceholder")}
                  required
                  fullWidth
                  sx={{ mb: 2 }}
                />
                <TextField
                  required
                  label={t("agentUrl")}
                  name="agentUrl"
                  value={agent.agentUrl ?? ""}
                  onChange={handleChange}
                  placeholder={t("agentUrlPlaceholder")}
                  fullWidth
                  type="url"
                  error={!isValidUrl(agent.agentUrl)}
                  helperText={
                    !isValidUrl(agent.agentUrl)
                      ? t("invalidHttpsUrl")
                      : t("agentUrlHelp")
                  }
                />
              </CardContent>
            </Card>

            {APP_CONSTANTS.IS_ON_PREM && (
              <Card variant="outlined" sx={{ borderWidth: 1 }}>
                <CardContent>
                  <Typography
                    variant="body1"
                    color="primary"
                    sx={{
                      fontWeight: 600,
                      mb: 2
                    }}>
                    {t("evaluatorEndpoint")}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      mb: 2
                    }}>
                    {t("evaluatorEndpointHelp")}
                  </Typography>

                  <TextField
                    required
                    label={t("evaluatorUrl")}
                    name="evaluatorUrl"
                    value={agent.evaluatorUrl ?? ""}
                    onChange={handleChange}
                    placeholder={t("evaluatorUrlPlaceholder")}
                    fullWidth
                    type="url"
                    error={!isValidUrl(agent.evaluatorUrl)}
                    helperText={
                      !isValidUrl(agent.evaluatorUrl)
                        ? t("invalidHttpUrl")
                        : t("evaluatorUrlHelp")
                    }
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    label={t("evaluatorApiKey")}
                    name="evaluatorApiKey"
                    value={agent.evaluatorApiKey ?? ""}
                    onChange={handleChange}
                    placeholder={t("evaluatorApiKeyPlaceholder")}
                    fullWidth
                    type="password"
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    required
                    label={t("defaultEvaluatorModel")}
                    name="evaluatorModel"
                    value={agent.evaluatorModel ?? ""}
                    onChange={handleChange}
                    placeholder={t("evaluatorModelPlaceholder")}
                    fullWidth
                    error={!agent.evaluatorModel?.trim()}
                    helperText={
                      !agent.evaluatorModel?.trim()
                        ? t("evaluatorModelRequired")
                        : t("evaluatorModelHelp")
                    }
                  />
                </CardContent>
              </Card>
            )}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={
                !agent.name?.trim() ||
                !agent.description?.trim() ||
                !agent.intent?.trim() ||
                !agent.ownerName?.trim() ||
                !isValidUrl(agent.agentUrl) ||
                !isValidUrl(agent.evaluatorUrl) ||
                (APP_CONSTANTS.IS_ON_PREM &&
                  (!agent.evaluatorUrl?.trim() ||
                    !agent.evaluatorModel?.trim()))
              }
              sx={{ mt: 3 }}
            >
              {t("create.createAgent")}
            </Button>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Box
            sx={{
              height: "100%",
              p: 3,
              borderLeft: { md: 1 },
              borderColor: "divider",
              pl: { md: 4 },
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontFamily: fontFamilyPlayfairDisplay,
                color: "primary.main",
                mb: 2,
                letterSpacing: "0.02em",
              }}
            >
              {t("create.finmaTitle")}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                lineHeight: 1.7,
                mb: 2,
              }}
            >
              <Trans i18nKey="create.finmaBody" ns="agent" components={{ brand: <Typography component="span" sx={{ fontSize: "inherit", color: "primary.main" }} /> }} />
            </Typography>
            <Box
              sx={{
                mt: 3,
                py: 2,
                px: 2,
                bgcolor: (t) => alpha(t.palette.primary.main, 0.06),
                borderLeft: 3,
                borderColor: "primary.main",
              }}
            >
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {t("create.finmaTip")}
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardCreateAgent;
