import {
  ArrowForward as ArrowForwardIcon,
  Article as ArticleIcon,
} from "@mui/icons-material";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";

import { routes } from "src/application/routes";
import { useNavigate } from "react-router-dom";

interface ProjectsCardProps {
  projectsCount: number;
  userId: string;
}

const ProjectsCard = ({ projectsCount, userId }: ProjectsCardProps) => {
  const navigate = useNavigate();

  const handleViewProjects = () => {
    navigate(routes.dashboard.reports.reportsByUserId(userId));
  };

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 4,
        },
      }}
    >
      <CardContent
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        <Box display="flex" alignItems="center" mb={2}>
          <ArticleIcon color="primary" sx={{ mr: 1, fontSize: 32 }} />
          <Typography variant="h6">Projects</Typography>
        </Box>
        <Box
          flexGrow={1}
          display="flex"
          alignItems="center"
          justifyContent="center"
          mb={2}
        >
          <Typography variant="h3" color="primary" fontWeight="bold">
            {projectsCount}
          </Typography>
        </Box>
        <Typography
          variant="body2"
          color="text.secondary"
          mb={2}
          textAlign="center"
        >
          {projectsCount === 1 ? "Project Created" : "Projects Created"}
        </Typography>
        <Button
          variant="contained"
          fullWidth
          endIcon={<ArrowForwardIcon />}
          onClick={handleViewProjects}
          disabled={projectsCount === 0}
        >
          View Projects
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProjectsCard;
