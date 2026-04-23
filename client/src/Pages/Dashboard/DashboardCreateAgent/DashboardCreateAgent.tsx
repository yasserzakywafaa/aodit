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

const DashboardCreateAgent = () => {
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
          Create New Agent
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box
            component="form"
            onSubmit={handleSubmit}
            display="flex"
            flexDirection="column"
            gap={2}
          >
            <Card variant="outlined" sx={{ borderWidth: 1 }}>
              <CardContent>
                <Typography
                  variant="body1"
                  color="primary"
                  fontWeight={600}
                  sx={{ mb: 2 }}
                >
                  Agent details
                </Typography>
                <TextField
                  label="Agent Name"
                  name="name"
                  value={agent.name ?? ""}
                  onChange={handleChange}
                  placeholder="e.g. Banking Loan Advisor"
                  required
                  fullWidth
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Description"
                  name="description"
                  multiline
                  rows={3}
                  value={agent.description ?? ""}
                  onChange={handleChange}
                  placeholder="Describe what this AI agent does"
                  required
                  fullWidth
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Intent"
                  name="intent"
                  multiline
                  rows={2}
                  value={agent.intent ?? ""}
                  onChange={handleChange}
                  placeholder="What will this agent be used for? (e.g. Customer-facing loan advisory)"
                  required
                  fullWidth
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Owner (Human Responsible)"
                  name="ownerName"
                  value={agent.ownerName ?? ""}
                  onChange={handleChange}
                  placeholder="e.g. Jane Smith"
                  required
                  fullWidth
                  sx={{ mb: 2 }}
                />
                <TextField
                  required
                  label="Agent URL"
                  name="agentUrl"
                  value={agent.agentUrl ?? ""}
                  onChange={handleChange}
                  placeholder="https://your-agent.example.com/chat"
                  fullWidth
                  type="url"
                  error={!isValidUrl(agent.agentUrl)}
                  helperText={
                    !isValidUrl(agent.agentUrl)
                      ? "Enter a valid https:// URL"
                      : "Required for Agent-to-Agent evaluation mode. This will be used to probe the agent during evaluation."
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
                    fontWeight={600}
                    sx={{ mb: 2 }}
                  >
                    Evaluator (Judge) Endpoint
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    Required in on-prem / air-gapped deployments. The judge
                    model must run on an OpenAI-compatible endpoint you
                    control — no requests leave your network. For methodology
                    reasons, the judge should be a different model (and
                    ideally a different endpoint) than the agent under test.
                  </Typography>

                  <TextField
                    required
                    label="Evaluator URL"
                    name="evaluatorUrl"
                    value={agent.evaluatorUrl ?? ""}
                    onChange={handleChange}
                    placeholder="http://10.0.0.5:1234/v1"
                    fullWidth
                    type="url"
                    error={!isValidUrl(agent.evaluatorUrl)}
                    helperText={
                      !isValidUrl(agent.evaluatorUrl)
                        ? "Enter a valid http(s):// URL"
                        : "OpenAI-compatible /v1 base URL (e.g. LM Studio, Ollama, vLLM)."
                    }
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    label="Evaluator API Key (optional)"
                    name="evaluatorApiKey"
                    value={agent.evaluatorApiKey ?? ""}
                    onChange={handleChange}
                    placeholder="leave blank for keyless local servers"
                    fullWidth
                    type="password"
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    required
                    label="Default evaluator model"
                    name="evaluatorModel"
                    value={agent.evaluatorModel ?? ""}
                    onChange={handleChange}
                    placeholder="e.g. google/gemma-3-4b"
                    fullWidth
                    error={!agent.evaluatorModel?.trim()}
                    helperText={
                      !agent.evaluatorModel?.trim()
                        ? "Required on-prem — enter the model id loaded on your evaluator endpoint."
                        : "Used when a report does not specify its own judge model."
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
              Create Agent
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
              FINMA Compliance
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                lineHeight: 1.7,
                mb: 2,
              }}
            >
              Under Swiss FINMA regulations, every AI agent deployed in
              regulated environments must have a designated human responsible
              for its oversight. Creating an agent here registers it in the{" "}
              <Typography
                component="span"
                fontSize="inherit"
                color="primary.main"
              >
                aodit
              </Typography>{" "}
              platform and allows you to attach it to reports for evaluation.
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
                Each report must have an agent assigned before it can be run.
                The agent's owner, intent, and description are recorded for
                audit traceability.
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardCreateAgent;
