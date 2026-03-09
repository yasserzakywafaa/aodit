import { Theme, createTheme } from "@mui/material/styles";

export const white = "#F5F3EF";
export const black = "#0A0A0A";
export const cream = "#EDE9E1";
export const grey = "#6B6B6B";
export const lightGrey = "#D4D0C8";
export const red = "#C0392B";
export const border = "rgba(180,174,162,0.25)";

export const primaryColor = "#B8963E"; // gold
export const primaryColorOpaqueTen = "rgba(184, 150, 62, 0.1)";
export const primaryColorOpaqueThirty = "rgba(184, 150, 62, 0.3)";
export const primaryColorOpaqueFifteen = "rgba(184, 150, 62, 0.15)";
export const primaryColorOpaqueEight = "rgba(184, 150, 62, 0.08)";
export const secondaryColor = black;

export const fontFamilySerif = "'Cormorant Garamond', serif";
export const fontFamilyMono = "'DM Mono', monospace";
export const fontFamilySans = "'Instrument Sans', sans-serif";
export const primaryColorForDarkTheme = primaryColor;
export const secondaryColorForDarkTheme = secondaryColor;
export const secondaryColorForLightTheme = primaryColor;

export const defaultBackDropFilterBlur = "blur(12px)";
const borderRadius = "2px";

export const buttonStyle = {
  textTransform: "uppercase" as const,
  letterSpacing: "0.1em",
  fontFamily: "'DM Mono', monospace",
  border: `1px solid ${border}`,
  "&:hover": {
    backgroundColor: primaryColor,
    color: black,
  },
};

export const AvatarSquareStyle = {
  mr: 1,
  width: 20,
  height: 20,
  boxShadow: `-1px -1px 0px ${secondaryColor}, 1px 1px 0px ${primaryColor}`,
};

export const dataGridStyle = (theme: Theme): object => ({
  "& .MuiDataGrid-cell": {
    borderBottom: "none",
  },
  "& .MuiDataGrid-row:hover": {
    backgroundColor: "rgba(184, 150, 62, 0.03)",
  },
});

export const theme = createTheme({
  palette: {
    primary: { main: primaryColor },
    secondary: { main: white },
    error: { main: red },
  },
  typography: {
    fontFamily: fontFamilySans,
    h1: {
      fontFamily: fontFamilySerif,
      fontWeight: 300,
      letterSpacing: "-0.02em",
    },
    h2: {
      fontFamily: fontFamilySerif,
      fontWeight: 300,
      letterSpacing: "-0.01em",
    },
    h3: { fontFamily: fontFamilySerif, fontWeight: 400 },
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
  palette: {
    mode: "light",
    primary: { main: primaryColor },
    secondary: { main: white },
    background: { default: white, paper: cream },
    text: { primary: black, secondary: "#000000" },
    divider: border,
  },
});

export const darkTheme = createTheme({
  ...theme,
  palette: {
    mode: "dark",
    primary: { main: primaryColor },
    secondary: { main: white },
    background: { default: black, paper: "#0d0c09" },
    text: { primary: white, secondary: "#ffffff" },
    divider: border,
  },
});
