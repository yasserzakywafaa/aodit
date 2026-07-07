import { Box, Grid, Typography } from "@mui/material";

import finmaLogo from "src/assets/images/finma_logo.png";

interface ComplianceLogoItem {
  id: string;
  label: string;
  src: string;
}

const COMPLIANCE_LOGOS: ComplianceLogoItem[] = [
  {
    id: "finma",
    src: finmaLogo,
    label: "FINMA",
  },
  // {
  //   id: "eu",
  //   label: "European Union",
  //   src: euFlag,
  // },
];

const ComplianceLogosSection = () => {
  return (
    <Box
      component="section"
      sx={{
        bgcolor: "background.paper",
        mt: { xs: 6, md: 12.5 },
        p: 4,
      }}
    >
      <Box
        sx={{
          display: "grid",
          gap: 3,
          gridTemplateColumns: { xs: "1fr", md: "1.2fr 1fr" },
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="h4">
            Regulatory standards and compliance references we align with
          </Typography>
          <Typography
            sx={{
              mt: 1.5,
              color: "text.secondary",
            }}
          >
            Starting with FINMA standards, with more institutions and standards
            added over time.
          </Typography>
        </Box>

        <Grid container spacing={1}>
          {COMPLIANCE_LOGOS.map((item) => (
            <Box
              component="img"
              key={item.id}
              src={item.src}
              alt={item.label}
              sx={{
                width: 100,
                height: 100,
                width: "100%",
                maxWidth: "40%",
                height: "100%",

                // border: "1px solid",
                // borderColor: "primary.main",
                objectFit: "cover"
              }} />
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default ComplianceLogosSection;
