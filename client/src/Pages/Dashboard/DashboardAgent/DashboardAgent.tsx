import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  Container,
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
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { ReportStatus } from "src/shared/types/report";
import { routes } from "src/application/routes";
import { useDashboardAgentContext } from "./store/Provider";

const DashboardAgent = () => {
  const { agentId } = useParams<{ agentId: string }>();
  const navigate = useNavigate();
  const {
    store: {
      state: { agent, agentReports },
      setAgent,
    },
    manager: { setUp, handleUpdateAgent },
  } = useDashboardAgentContext();

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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agentId || !agent) return;
    handleUpdateAgent(agentId, {
      name: agent.name,
      description: agent.description,
      intent: agent.intent,
      ownerName: agent.ownerName,
      agentUrl: agent.agentUrl,
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
          <Typography variant="body2" color="text.secondary">
            Owner: {agent?.ownerName || "—"}
          </Typography>
        </Box>
        {agentId && (
          <Button
            variant="outlined"
            color="primary"
            startIcon={<Save />}
            onClick={handleSave}
            disabled={!agentId || !agent}
          >
            Save
          </Button>
        )}
      </Box>

      {/* Agent details — accordion, collapsed by default */}
      <Accordion
        defaultExpanded={false}
        sx={{ mt: 2, "&:before": { display: "none" } }}
      >
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle1" color="primary" fontWeight={600}>
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
              label="Agent URL (optional)"
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
                  : "Required only for Agent-to-Agent evaluation mode"
              }
            />
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
          <Typography variant="body2" color="text.secondary">
            No reports have been attached to this agent yet.
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default DashboardAgent;
