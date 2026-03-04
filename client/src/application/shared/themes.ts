import { Theme, createTheme } from "@mui/material/styles";

import { Languages } from "src/shared/languages";

// SWISSLII Palette
export const white = "#F5F3EF";
export const black = "#0A0A0A";
export const gold = "#B8963E";
export const grey = "#6b6b6b";
export const lightGrey = "#D4D0C8";
export const border = "rgba(180,174,162,0.25)";

export const primaryColor = gold; 
export const secondaryColor = white; 

export const defaultBackDropFilterBlur = "blur(12px)";
const borderRadius = "2px";

export const buttonStyle = {
  textTransform: "uppercase" as const,
  letterSpacing: "0.1em",
  fontFamily: "'DM Mono', monospace",
  border: `1px solid ${border}`,
  "&:hover": {
    backgroundColor: gold,
    color: black,
  },
};

export const AvatarSquareStyle = {
  mr: 1,
  width: 20,
  height: 20,
  border: `1px solid ${border}`,
};

export const dataGridStyle = (theme: Theme): object => ({
  "& .MuiDataGrid-cell": {
    borderBottom: "none",
  },
  "& .MuiDataGrid-row:hover": {
    backgroundColor: "rgba(184, 150, 62, 0.03)",
  },
});

const languagesFonts = Languages.filter((language) => language.fontFamily).map(
  (lang) => lang.fontFamily ?? null,
);

export const theme = createTheme({
  palette: {
    primary: { main: gold },
    secondary: { main: white },
  },
  typography: {
    fontFamily: "'Instrument Sans', sans-serif",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { ...buttonStyle },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: { backdropFilter: defaultBackDropFilterBlur },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius,
          backgroundColor: black,
          border: `1px solid ${border}`,
        },
      },
    },
  },
});

export const lightTheme = createTheme({
  ...theme,
  palette: { mode: "light", background: { default: white }, text: { primary: black } },
});

export const darkTheme = createTheme({
  ...theme,
  palette: { 
    mode: "dark", 
    background: { default: black }, 
    text: { primary: white, secondary: grey },
  },
});
