import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";

import { routes } from "src/application/routes";
import { useDashboardCreateProjectContext } from "./store/Provider";
import { useNavigate } from "react-router-dom";

const DashboardCreateProject = () => {
  const navigate = useNavigate();
  const {
    store: {
      state: { project },
      setProject,
    },
    manager: { handleCreateProject },
  } = useDashboardCreateProjectContext();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }
    >,
  ) => {
    const { name, value } = e.target;

    setProject({
      ...project,
      [name as string]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Data Submitted:", project);
    try {
      await handleCreateProject(project);

      navigate(routes.dashboard.projects.base);
    } catch (error) {
      console.error("❌ Failed to create project:", error);
    }
  };

  return (
    <Container sx={{ margin: "0" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h4" component="h1" color="primary" gutterBottom>
          Create New Project
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Project Name"
              name="name"
              value={project.name}
              onChange={handleChange}
              required
              fullWidth
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField
              label="Start Date"
              name="startDate"
              type="date"
              value={
                project.startDate || new Date().toISOString().substring(0, 10)
              }
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField
              label="End Date"
              name="endDate"
              type="date"
              value={
                project.endDate || new Date().toISOString().substring(0, 10)
              }
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Description"
              name="description"
              multiline
              rows={4}
              value={project.description || ""}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
        </Grid>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 4 }}
        >
          Create Project
        </Button>
      </Box>
    </Container>
  );
};

export default DashboardCreateProject;
