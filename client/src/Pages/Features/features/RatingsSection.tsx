import {
  border,
  fontFamilyMono,
  fontFamilySerif,
  grey,
  lightGrey,
  primaryColor,
  red,
} from "src/application/shared/themes";

import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

const SECTION_LABEL_STYLE = {
  fontFamily: fontFamilyMono,
  fontSize: 10,
  letterSpacing: "0.2em",
  textTransform: "uppercase" as const,
  color: primaryColor,
  mb: 6,
  display: "flex",
  alignItems: "center",
  gap: 2,
  "&::after": {
    content: '""',
    flex: 1,
    maxWidth: 60,
    height: 1,
    bgcolor: primaryColor,
    opacity: 0.4,
  },
};

const ratingData = [
  {
    rank: "01",
    model: "Claude",
    issuer: "Anthropic",
    scores: [5, 5, 5, 5, 4],
    total: 4.8,
    rating: "Aa1",
    outlook: "Stable",
    status: "Approved",
  },
  {
    rank: "02",
    model: "DeepSeek",
    issuer: "DeepSeek AI",
    scores: [5, 5, 5, 5, 4],
    total: 4.8,
    rating: "Aa1",
    outlook: "Stable",
    status: "Approved",
  },
  {
    rank: "03",
    model: "ChatGPT",
    issuer: "OpenAI",
    scores: [5, 4.5, 5, 5, 4],
    total: 4.7,
    rating: "Aa2",
    outlook: "Stable",
    status: "Approved",
  },
  {
    rank: "04",
    model: "Grok",
    issuer: "xAI",
    scores: [5, 4.5, 4.5, 5, 4],
    total: 4.6,
    rating: "Aa3",
    outlook: "Watch",
    status: "Monitored",
  },
  {
    rank: "05",
    model: "Gemini",
    issuer: "Google DeepMind",
    scores: [4.5, 5, 5, 5, 4],
    total: 4.7,
    rating: "A1",
    outlook: "Negative",
    status: "Conditional",
  },
  {
    rank: "06",
    model: "Apertus",
    issuer: "Swiss AI Institute",
    scores: [4, 4, 4, 5, 4.5],
    total: 4.3,
    rating: "A2",
    outlook: "Negative",
    status: "Remediation",
  },
];

const RatingsSection = () => (
  <Box
    id="ratings"
    component="section"
    sx={{
      py: { xs: 6, md: 12.5 },
      px: { xs: 3, md: 6 },
      borderTop: `1px solid ${border}`,
      bgcolor: "#0d0c09",
    }}
  >
    <Typography sx={SECTION_LABEL_STYLE}>Current Ratings</Typography>

    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { md: "1fr 1fr" },
        gap: { md: 6 },
        mb: 6,
      }}
    >
      <Typography
        component="h2"
        sx={{
          fontFamily: fontFamilySerif,
          fontSize: {
            xs: "clamp(1.75rem, 4vw, 2.5rem)",
            md: "clamp(36px, 4vw, 56px)",
          },
          fontWeight: 300,
          lineHeight: 1.1,
          letterSpacing: "-0.01em",
          color: "text.primary",
        }}
      >
        2026 AI Agent
        <br />
        Risk{" "}
        <Box component="em" sx={{ fontStyle: "italic", color: primaryColor }}>
          Ratings
        </Box>
      </Typography>
      <Typography
        sx={{
          color: "rgba(245,243,239,0.55)",
          fontSize: 15,
          lineHeight: 1.75,
          pt: 1,
        }}
      >
        Financial Services Behavioral Security Benchmark. Six leading large
        language models evaluated across a standardised 7-turn adversarial
        banking simulation. Ratings reflect behavioral compliance quality and
        deployment suitability for live financial environments.
      </Typography>
    </Box>

    <Table
      sx={{
        width: "100%",
        "& th, & td": { borderBottom: `1px solid ${border}` },
      }}
    >
      <TableHead>
        <TableRow>
          <TableCell
            sx={{
              fontFamily: fontFamilyMono,
              fontSize: 10,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: grey,
              py: 1.5,
              px: 2,
            }}
          >
            #
          </TableCell>
          <TableCell
            sx={{
              fontFamily: fontFamilyMono,
              fontSize: 10,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: grey,
              py: 1.5,
              px: 2,
            }}
          >
            Model
          </TableCell>
          <TableCell
            sx={{
              fontFamily: fontFamilyMono,
              fontSize: 10,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: grey,
              py: 1.5,
              px: 2,
            }}
          >
            Score
          </TableCell>
          <TableCell
            sx={{
              fontFamily: fontFamilyMono,
              fontSize: 10,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: grey,
              py: 1.5,
              px: 2,
            }}
          >
            Rating
          </TableCell>
          <TableCell
            sx={{
              fontFamily: fontFamilyMono,
              fontSize: 10,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: grey,
              py: 1.5,
              px: 2,
            }}
          >
            Outlook
          </TableCell>
          <TableCell
            sx={{
              fontFamily: fontFamilyMono,
              fontSize: 10,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: grey,
              py: 1.5,
              px: 2,
            }}
          >
            Status
          </TableCell>
          <TableCell
            sx={{
              fontFamily: fontFamilyMono,
              fontSize: 10,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: grey,
              py: 1.5,
              px: 2,
            }}
          >
            Report
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {ratingData.map((row) => (
          <TableRow
            key={row.rank}
            sx={{
              "& td": {
                py: 2.25,
                px: 2,
                borderBottom: "1px solid rgba(180,174,162,0.08)",
                verticalAlign: "middle",
              },
              "&:hover td": { bgcolor: "rgba(184,150,62,0.03)" },
            }}
          >
            <TableCell
              sx={{ fontFamily: fontFamilyMono, fontSize: 11, color: grey }}
            >
              {row.rank}
            </TableCell>
            <TableCell>
              <Box
                sx={{
                  fontFamily: "inherit",
                  fontSize: 15,
                  fontWeight: 500,
                  color: "text.primary",
                }}
              >
                {row.model}
              </Box>
              <Box
                sx={{
                  fontFamily: fontFamilyMono,
                  fontSize: 10,
                  color: grey,
                  mt: 0.25,
                }}
              >
                {row.issuer}
              </Box>
            </TableCell>
            <TableCell
              sx={{
                fontFamily: fontFamilyMono,
                fontSize: 12,
                color: lightGrey,
              }}
            >
              {row.total}
            </TableCell>
            <TableCell>
              <Box
                component="span"
                sx={{
                  fontFamily: fontFamilyMono,
                  fontSize: 13,
                  fontWeight: 500,
                  letterSpacing: "0.05em",
                  px: 1.25,
                  py: 0.5,
                  borderRadius: "2px",
                  bgcolor: "rgba(184,150,62,0.15)",
                  color: primaryColor,
                }}
              >
                {row.rating}
              </Box>
            </TableCell>
            <TableCell
              sx={{
                fontFamily: fontFamilyMono,
                fontSize: 10,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color:
                  row.outlook === "Stable"
                    ? "#6aaa6a"
                    : row.outlook === "Negative"
                      ? red
                      : "#e0a030",
              }}
            >
              {row.outlook}
            </TableCell>
            <TableCell>
              <Box
                component="span"
                sx={{
                  fontFamily: fontFamilyMono,
                  fontSize: 10,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  px: 1,
                  py: 0.375,
                  borderRadius: "2px",
                  bgcolor:
                    row.status === "Approved"
                      ? "rgba(106,170,106,0.12)"
                      : row.status === "Conditional"
                        ? "rgba(192,57,43,0.1)"
                        : row.status === "Monitored"
                          ? "rgba(224,160,48,0.1)"
                          : "rgba(192,57,43,0.15)",
                  color:
                    row.status === "Approved"
                      ? "#6aaa6a"
                      : row.status === "Conditional"
                        ? "#e07060"
                        : row.status === "Monitored"
                          ? "#e0a030"
                          : red,
                }}
              >
                {row.status}
              </Box>
            </TableCell>
            <TableCell>
              <Box
                component="a"
                href="#"
                sx={{
                  fontFamily: fontFamilyMono,
                  fontSize: 11,
                  color: primaryColor,
                  textDecoration: "none",
                  letterSpacing: "0.05em",
                  opacity: 0.7,
                  "&:hover": { opacity: 1 },
                }}
              >
                PDF ↗
              </Box>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>

    <Box
      sx={{
        mt: 6,
        p: 3.5,
        borderLeft: `2px solid ${red}`,
        bgcolor: "rgba(192,57,43,0.05)",
      }}
    >
      <Typography
        sx={{
          fontFamily: fontFamilyMono,
          fontSize: 10,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: red,
          mb: 1.25,
        }}
      >
        ⚠ Critical Finding — Report AIR-2026-FSB-001
      </Typography>
      <Typography
        sx={{ fontSize: 14, color: "rgba(245,243,239,0.7)", lineHeight: 1.7 }}
      >
        <Box component="strong" sx={{ color: "text.primary" }}>
          Gemini (Google DeepMind)
        </Box>{" "}
        executed a card freeze without completed authentication — the only model
        in this evaluation to take a concrete account action on an unverified
        request. This represents an exploitable attack surface. Mandatory
        remediation required before live banking deployment. 90-day remediation
        window issued. Rating Outlook:{" "}
        <Box component="strong" sx={{ color: "text.primary" }}>
          NEGATIVE
        </Box>
        .
      </Typography>
    </Box>
  </Box>
);

export default RatingsSection;
