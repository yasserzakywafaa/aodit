import { Theme, createTheme } from "@mui/material/styles";

export const white = "#f8f8f8";
export const lightGreen = "rgba(239, 245, 241, 1)";
export const black = "#0A0A0A";
export const grey = "#6B6B6B";
export const lightGrey = "#D4D0C8";
export const red = "#C0392B";
export const border = "rgba(180,174,162,0.25)";

export const primaryColor = "#00c278"; // green
export const primaryColorOpaqueTen = "rgba(4, 120, 87, 0.1)";
export const primaryColorOpaqueThirty = "rgba(4, 120, 87, 0.3)";
export const primaryColorOpaqueFifteen = "rgba(4, 120, 87, 0.15)";
export const primaryColorOpaqueEight = "rgba(4, 120, 87, 0.08)";
export const primaryColorDim = "rgba(4, 120, 87, 0.2)";
export const primaryColorFaint = "rgba(4, 120, 87, 0.06)";
export const secondaryColor = black;

export const fontFamilySerif = "'Playfair Display', serif";
export const fontFamilySans = "'Syne', sans-serif";

export const defaultBackDropFilterBlur = "blur(12px)";
const borderRadius = "0px";

export const buttonStyle = {
  textTransform: "capitalize" as const,
  fontFamily: fontFamilySans,
  border: `1px solid ${primaryColor}`,
  borderRadius,
  "&:hover": {
    color: primaryColor,
    backgroundColor: primaryColorOpaqueThirty,
    border: `1px solid ${primaryColor}`,
  },
  "&:active": {
    boxShadow: "none",
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
    backgroundColor: primaryColorFaint,
  },
});

export const theme = createTheme({
  palette: {
    primary: {
      main: primaryColor,
    },
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
        contained: {
          "&.Mui-disabled": {
            opacity: "0.7",
            cursor: "not-allowed",
            backgroundColor: primaryColor,
          },
          ...buttonStyle,
        },
        outlined: {
          ...buttonStyle,
        },
        text: {
          ...buttonStyle,
          border: 0,
          "&:hover": {
            backgroundColor: primaryColorOpaqueThirty,
            border: 0,
          },
        },
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
          border: 0,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius,
          backgroundImage: "unset",
          border: `1px solid ${primaryColor}`,
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        thumb: {
          borderRadius,
          backgroundColor: primaryColor,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius,
          },
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
    secondary: { main: lightGreen },
    background: { default: lightGreen },
    text: { primary: black, secondary: "#000000" },
    divider: primaryColor,
  },
});

export const darkTheme = createTheme({
  ...theme,
  palette: {
    mode: "dark",
    primary: { main: primaryColor },
    secondary: { main: white },
    background: { default: black },
    text: { primary: white, secondary: "#ffffff" },
    divider: primaryColor,
  },
});
