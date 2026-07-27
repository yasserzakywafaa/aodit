import { Theme, createTheme } from "@mui/material/styles";

export const white = "#FFFFFF";
export const lightGreen = "#F7F8FA";
export const black = "#0A0A0A";
export const grey = "#5A6370";
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
export const secondaryColor = "#1B2A4A"; // institutional navy

export const fontFamilyPlayfairDisplay = "'Playfair Display', serif";
export const fontFamilyInter = "'Inter', sans-serif";

export const defaultBackDropFilterBlur = "blur(12px)";
const borderRadius = "0px";

export const buttonStyle = {
  textTransform: "capitalize" as const,
  fontFamily: fontFamilyInter,
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
    secondary: { main: secondaryColor },
    error: { main: red },
  },
  typography: {
    fontFamily: fontFamilyInter,
    h1: {
      fontFamily: fontFamilyPlayfairDisplay,
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    h2: {
      fontFamily: fontFamilyPlayfairDisplay,
      fontWeight: 600,
      letterSpacing: "-0.01em",
    },
    h3: { fontFamily: fontFamilyPlayfairDisplay, fontWeight: 500 },
    h4: { fontFamily: fontFamilyPlayfairDisplay, fontWeight: 500 },
    h5: { fontFamily: fontFamilyPlayfairDisplay },
    h6: { fontFamily: fontFamilyPlayfairDisplay },
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
      // Shrink the label by default
      defaultProps: {
        slotProps: {
          inputLabel: {
            shrink: true,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius,
        },
        outlined: {
          boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
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
    secondary: { main: secondaryColor },
    background: { default: white },
    text: { primary: secondaryColor, secondary: grey },
    divider: "rgba(27, 42, 74, 0.12)",
  },
});

export const darkTheme = createTheme({
  ...theme,
  palette: {
    mode: "dark",
    primary: { main: primaryColor },
    secondary: { main: white },
    background: { default: black },
    text: { primary: white, secondary: white },
    divider: "rgba(255, 255, 255, 0.12)",
  },
});

export function getThemedTheme(
  mode: "light" | "dark",
  direction: "ltr" | "rtl" = "ltr",
) {
  const base = mode === "light" ? lightTheme : darkTheme;
  return createTheme({ ...base, direction });
}
