import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Autocomplete,
  Box,
  Button,
  Chip,
  Container,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { ExpandMore, Save } from "@mui/icons-material";
import { useEffect, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

import APP_CONSTANTS from "src/application/shared/app_constants";
import { LoaderSizeEnum } from "src/shared/types/types";
import LoaderSpinner from "src/components/shared/Loader/LoaderSpinner";
import { ReportStatus } from "src/shared/types/report";
import { routes } from "src/application/routes";
import { useDashboardAgentContext } from "./store/Provider";

const DashboardAgent = () => {
  const { agentId } = useParams<{ agentId: string }>();
  const navigate = useNavigate();
  const {
    store: {
      state: {
        agent,
        agentReports,
        evaluatorModels,
        evaluatorModelsStatus,
        evaluatorModelsError,
      },
      setAgent,
      resetEvaluatorModelsState,
    },
    manager: {
      setUp,
      handleUpdateAgent,
      handleTestEvaluatorConnection,
      handleFetchEvaluatorModels,
    },
  } = useDashboardAgentContext();
  const lastEvaluatorDiscoveryKeyRef = useRef<string>("");

  useEffect(() => {
    if (agentId) {
      setUp(agentId);
    }
  }, [agentId]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }
    >,
  ) => {
    const { name, value } = e.target;
    if (!agent) return;
    setAgent({ ...agent, [name as string]: value });
  };

  const isValidUrl = (url: string | undefined): boolean => {
    if (!url || url.trim() === "") return true;
    try {
      const parsed = new URL(url.trim());
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  };

  const isOnPremEvaluatorMissing = useMemo(() => {
    if (!APP_CONSTANTS.IS_ON_PREM) return false;
    const url = agent?.evaluatorUrl?.trim() ?? "";
    const model = agent?.evaluatorModel?.trim() ?? "";
    return !url || !isValidUrl(url) || !model;
  }, [agent?.evaluatorUrl, agent?.evaluatorModel]);

  const evaluatorDiscoveryStatusText = useMemo(() => {
    if (evaluatorModelsStatus === "loading") return "Loading models...";
    if (evaluatorModelsStatus === "loaded") {
      return `Loaded ${evaluatorModels.length} model${evaluatorModels.length === 1 ? "" : "s"} from endpoint.`;
    }
    if (evaluatorModelsStatus === "error") {
      return `${evaluatorModelsError || "Could not fetch models."} Manual entry is still allowed.`;
    }
    return "Manual model entry is allowed. Use Refresh models to discover IDs from /v1/models.";
  }, [evaluatorModelsStatus, evaluatorModels.length, evaluatorModelsError]);

  const isTypedModelOutsideDiscoveredList = useMemo(() => {
    if (!APP_CONSTANTS.IS_ON_PREM) return false;
    const typedModel = agent?.evaluatorModel?.trim();
    return (
      evaluatorModelsStatus === "loaded" &&
      !!typedModel &&
      evaluatorModels.length > 0 &&
      !evaluatorModels.includes(typedModel)
    );
  }, [agent?.evaluatorModel, evaluatorModelsStatus, evaluatorModels]);

  useEffect(() => {
    if (!APP_CONSTANTS.IS_ON_PREM || !agentId) return;

    const evaluatorUrl = agent?.evaluatorUrl?.trim() ?? "";
    const evaluatorApiKey = agent?.evaluatorApiKey?.trim() ?? "";
    if (!evaluatorUrl || !isValidUrl(evaluatorUrl)) {
      lastEvaluatorDiscoveryKeyRef.current = "";
      resetEvaluatorModelsState();
      return;
    }

    const discoveryKey = `${agentId}::${evaluatorUrl}::${evaluatorApiKey}`;
    if (discoveryKey === lastEvaluatorDiscoveryKeyRef.current) return;

    resetEvaluatorModelsState();
    const timer = setTimeout(() => {
      lastEvaluatorDiscoveryKeyRef.current = discoveryKey;
      handleFetchEvaluatorModels(agentId);
    }, 500);

    return () => clearTimeout(timer);
  }, [agentId, agent?.evaluatorUrl, agent?.evaluatorApiKey]);

  const handleRefreshModels = () => {
    if (!agentId || !agent?.evaluatorUrl || !isValidUrl(agent.evaluatorUrl))
      return;
    const evaluatorUrl = agent.evaluatorUrl.trim();
    const evaluatorApiKey = agent.evaluatorApiKey?.trim() ?? "";
    lastEvaluatorDiscoveryKeyRef.current = `${agentId}::${evaluatorUrl}::${evaluatorApiKey}`;
    handleFetchEvaluatorModels(agentId);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agentId || !agent) return;
    if (isOnPremEvaluatorMissing) return;
    handleUpdateAgent(agentId, {
      name: agent.name,
      description: agent.description,
      intent: agent.intent,
      ownerName: agent.ownerName,
      agentUrl: agent.agentUrl,
      evaluatorUrl: agent.evaluatorUrl,
      evaluatorApiKey: agent.evaluatorApiKey,
      evaluatorModel: agent.evaluatorModel,
      status: agent.status,
    });
  };

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 2,
          mb: 2,
        }}
      >
        <Box>
          <Typography variant="h4" component="h1" color="primary" gutterBottom>
            {agent?.name || "Agent"}
          </Typography>
          <Typography variant="body2" sx={{
            color: "text.secondary"
          }}>
            Owner: {agent?.ownerName || "—"}
          </Typography>
        </Box>
        {agentId && (
          <Button
            variant="outlined"
            color="primary"
            startIcon={<Save />}
            onClick={handleSave}
            disabled={!agentId || !agent || isOnPremEvaluatorMissing}
          >
            Save
          </Button>
        )}
      </Box>
      {/* Agent details — auto-expand on-prem when evaluator fields are missing. */}
      <Accordion
        defaultExpanded={isOnPremEvaluatorMissing}
        sx={{ mt: 2, "&:before": { display: "none" } }}
      >
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle1" color="primary" sx={{
            fontWeight: 600
          }}>
            Agent details
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box component="form" onSubmit={handleSave}>
            <TextField
              label="Agent Name"
              name="name"
              value={agent?.name ?? ""}
              onChange={handleChange}
              required
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Description"
              name="description"
              multiline
              rows={3}
              value={agent?.description ?? ""}
              onChange={handleChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Intent"
              name="intent"
              multiline
              rows={2}
              value={agent?.intent ?? ""}
              onChange={handleChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Owner (Human Responsible)"
              name="ownerName"
              value={agent?.ownerName ?? ""}
              onChange={handleChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              required
              label="Agent URL"
              name="agentUrl"
              value={agent?.agentUrl ?? ""}
              onChange={handleChange}
              placeholder="https://your-agent.example.com/chat"
              fullWidth
              type="url"
              error={!isValidUrl(agent?.agentUrl)}
              helperText={
                !isValidUrl(agent?.agentUrl)
                  ? "Enter a valid https:// URL"
                  : "Required for Agent-to-Agent evaluation mode. This will be used to probe the agent during evaluation."
              }
            />

            {APP_CONSTANTS.IS_ON_PREM && (
              <>
                <Typography
                  variant="subtitle1"
                  color="primary"
                  sx={{
                    fontWeight: 600,
                    mt: 4,
                    mb: 1
                  }}>
                  Evaluator (Judge) Endpoint
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    mb: 2
                  }}>
                  Required in on-prem / air-gapped deployments. The judge model
                  must run on an OpenAI-compatible endpoint you control — no
                  requests leave your network. For methodology reasons, the
                  judge should be a different model (and ideally a different
                  endpoint) than the agent under test.
                </Typography>
                <Box
                  sx={{
                    border: 1,
                    borderColor: "divider",
                    borderRadius: 2,
                    p: 2,
                    mb: 1,
                  }}
                >
                  <Grid container spacing={2} sx={{
                    alignItems: "flex-start"
                  }}>
                    <Grid size={{ xs: 12, md: 9 }}>
                      <TextField
                        required
                        label="Evaluator URL"
                        name="evaluatorUrl"
                        value={agent?.evaluatorUrl ?? ""}
                        onChange={handleChange}
                        placeholder="http://10.0.0.5:1234/v1"
                        fullWidth
                        type="url"
                        error={
                          !isValidUrl(agent?.evaluatorUrl) ||
                          !agent?.evaluatorUrl?.trim()
                        }
                        helperText={
                          !agent?.evaluatorUrl?.trim()
                            ? "Required on-prem — set your internal OpenAI-compatible /v1 base URL."
                            : !isValidUrl(agent?.evaluatorUrl)
                              ? "Enter a valid http(s):// URL"
                              : "OpenAI-compatible /v1 base URL (e.g. LM Studio, Ollama, vLLM)."
                        }
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 3 }}>
                      <Button
                        variant="outlined"
                        color="primary"
                        fullWidth
                        disabled={
                          !agentId ||
                          !agent?.evaluatorUrl?.trim() ||
                          !isValidUrl(agent?.evaluatorUrl) ||
                          evaluatorModelsStatus === "loading"
                        }
                        loading={evaluatorModelsStatus === "loading"}
                        loadingIndicator={
                          <LoaderSpinner
                            position="relative"
                            size={LoaderSizeEnum.Small}
                          />
                        }
                        onClick={handleRefreshModels}
                        sx={{ height: 56 }}
                      >
                        Fetch models
                      </Button>
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                      <TextField
                        label="Evaluator API Key (optional)"
                        name="evaluatorApiKey"
                        value={agent?.evaluatorApiKey ?? ""}
                        onChange={handleChange}
                        placeholder="leave blank for keyless local servers"
                        fullWidth
                        type="password"
                      />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                      <Autocomplete
                        freeSolo
                        options={evaluatorModels}
                        inputValue={agent?.evaluatorModel ?? ""}
                        onInputChange={(_, newInputValue) => {
                          if (!agent) return;
                          setAgent({ ...agent, evaluatorModel: newInputValue });
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            required
                            label="Default evaluator model"
                            placeholder="e.g. google/gemma-3-4b"
                            fullWidth
                            error={
                              !agent?.evaluatorModel?.trim() ||
                              isTypedModelOutsideDiscoveredList
                            }
                            helperText={
                              !agent?.evaluatorModel?.trim()
                                ? "Required on-prem — enter the model id loaded on your evaluator endpoint."
                                : isTypedModelOutsideDiscoveredList
                                  ? "Model is not in discovered options. Manual entry is allowed; Test Evaluator Connection will validate it."
                                  : "Used when a report does not specify its own judge model."
                            }
                          />
                        )}
                      />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                      <Alert
                        severity={
                          evaluatorModelsStatus === "error"
                            ? "warning"
                            : evaluatorModelsStatus === "loaded"
                              ? "success"
                              : "info"
                        }
                      >
                        {evaluatorDiscoveryStatusText}
                      </Alert>
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button
                          variant="outlined"
                          color="primary"
                          disabled={
                            !agentId ||
                            !isValidUrl(agent?.evaluatorUrl) ||
                            !agent?.evaluatorUrl ||
                            !agent?.evaluatorModel?.trim()
                          }
                          loading={evaluatorModelsStatus === "loading"}
                          loadingIndicator={
                            <LoaderSpinner
                              position="relative"
                              size={LoaderSizeEnum.Small}
                            />
                          }
                          onClick={() =>
                            agentId && handleTestEvaluatorConnection(agentId)
                          }
                        >
                          Test Evaluator Connection
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </>
            )}
          </Box>
        </AccordionDetails>
      </Accordion>
      {/* Reports section */}
      <Paper variant="outlined" sx={{ p: 3, mt: 3 }}>
        <Typography
          variant="h5"
          color="primary"
          sx={{ mb: 2, borderBottom: 1, borderColor: "divider", pb: 2 }}
        >
          Reports
        </Typography>

        {agentReports.length > 0 ? (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Report Name</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {agentReports.map((report) => {
                const chipColor: Record<
                  string,
                  "default" | "primary" | "success" | "error" | "info"
                > = {
                  [ReportStatus.draft]: "default",
                  [ReportStatus.running]: "primary",
                  [ReportStatus.completed]: "success",
                  [ReportStatus.failed]: "error",
                  [ReportStatus.scheduled]: "info",
                };
                return (
                  <TableRow key={report._id}>
                    <TableCell>{report.name}</TableCell>
                    <TableCell>
                      <Chip
                        label={report.status?.toUpperCase()}
                        color={chipColor[report.status] ?? "default"}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(report.createdAt).toLocaleDateString("en-GB", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        variant="text"
                        onClick={() =>
                          navigate(
                            routes.dashboard.reports.reportById(report._id),
                          )
                        }
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <Typography variant="body2" sx={{
            color: "text.secondary"
          }}>
            No reports have been attached to this agent yet.
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default DashboardAgent;
