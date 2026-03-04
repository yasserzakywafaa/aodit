import { Theme, createTheme } from "@mui/material/styles";

export const white = "#F5F3EF";
export const black = "#0A0A0A";
export const grey = "#6b6b6b";
export const lightGrey = "#D4D0C8";
export const border = "rgba(180,174,162,0.25)";

export const primaryColor = "#B8963E"; // gold
export const primaryColorOpaqueTen = "rgba(184, 150, 62, 0.1)"; // gold 10% Opacity
export const primaryColorOpaqueThirty = "rgba(184, 150, 62, 0.3)"; // gold 30% Opacity
export const secondaryColor = white;
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
  palette: {
    mode: "light",
    background: { default: white },
    text: { primary: black },
  },
});

export const darkTheme = createTheme({
  ...theme,
  palette: {
    mode: "dark",
    background: { default: black },
    text: { primary: white, secondary: grey },
  },
});
