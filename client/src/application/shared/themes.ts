import { Theme, createTheme } from "@mui/material/styles";

export const white = "#f8f8f8";
export const black = "#0A0A0A";
export const cream = "#EDE9E1";
export const grey = "#6B6B6B";
export const lightGrey = "#D4D0C8";
export const red = "#C0392B";
export const border = "rgba(180,174,162,0.25)";

export const primaryColor = "#C8960C"; // gold (default)
export const primaryColorOpaqueTen = "rgba(200, 150, 12, 0.1)";
export const primaryColorOpaqueThirty = "rgba(200, 150, 12, 0.3)";
export const primaryColorOpaqueFifteen = "rgba(200, 150, 12, 0.15)";
export const primaryColorOpaqueEight = "rgba(200, 150, 12, 0.08)";
export const primaryColorDim = "rgba(200, 150, 12, 0.2)";
export const primaryColorFaint = "rgba(200, 150, 12, 0.06)";
export const secondaryColor = black;

export const fontFamilySerif = "'Playfair Display', serif";
export const fontFamilySans = "'Syne', sans-serif";
export const primaryColorForDarkTheme = primaryColor;
export const secondaryColorForDarkTheme = secondaryColor;
export const secondaryColorForLightTheme = primaryColor;

export const defaultBackDropFilterBlur = "blur(12px)";
const borderRadius = "0px";

/**
 * Curated accent colors suited to Aodit's AI risk-index identity.
 * Each entry has a hex value, a display label, and a short rationale.
 */
export const AODIT_THEME_COLORS = [
  { value: "#C8960C", label: "Gold", description: "Financial authority (default)" },
  { value: "#1B4F8C", label: "Navy", description: "Institutional trust & stability" },
  { value: "#047857", label: "Emerald", description: "AI safety & positive performance" },
  { value: "#7C3AED", label: "Violet", description: "AI/ML innovation & intelligence" },
  { value: "#0891B2", label: "Teal", description: "Data analytics & fintech" },
  { value: "#DC2626", label: "Crimson", description: "Risk alerts & critical findings" },
  { value: "#D97706", label: "Amber", description: "Caution & risk awareness" },
  { value: "#475569", label: "Slate", description: "Neutral enterprise authority" },
] as const;

/** Hex value type derived from the curated palette (plus free-form strings). */
export type ThemeColorValue = (typeof AODIT_THEME_COLORS)[number]["value"] | string;

const makeButtonStyle = (color: string) => ({
  textTransform: "capitalize" as const,
  fontFamily: fontFamilySans,
  border: `1px solid ${color}`,
  borderRadius,
  "&:hover": {
    color,
    backgroundColor: hexToRgba(color, 0.3),
    border: `1px solid ${color}`,
  },
  "&:active": {
    boxShadow: "none",
  },
});

/** Convert a hex color to rgba with the given alpha. */
export function hexToRgba(hex: string, alpha: number): string {
  const sanitized = hex.replace("#", "");
  const r = parseInt(sanitized.substring(0, 2), 16);
  const g = parseInt(sanitized.substring(2, 4), 16);
  const b = parseInt(sanitized.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export const buttonStyle = makeButtonStyle(primaryColor);

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
    backgroundColor: hexToRgba(primaryColor, 0.03),
  },
});

/**
 * Build MUI light + dark themes for any primary accent color.
 * This is the primary way to create themes going forward.
 */
export const buildDynamicThemes = (accent: string = primaryColor) => {
  const btn = makeButtonStyle(accent);

  const base = createTheme({
    palette: {
      primary: { main: accent },
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
          root: { ...btn },
          contained: {
            "&.Mui-disabled": {
              opacity: "0.7",
              cursor: "not-allowed",
              backgroundColor: accent,
            },
            ...btn,
          },
          outlined: { ...btn },
          text: {
            ...btn,
            border: 0,
            "&:hover": {
              backgroundColor: hexToRgba(accent, 0.3),
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
          root: { borderRadius, border: 0 },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius,
            backgroundImage: "unset",
            border: `1px solid ${accent}`,
          },
        },
      },
      MuiSlider: {
        styleOverrides: {
          thumb: { borderRadius, backgroundColor: accent },
        },
      },
    },
  });

  const light = createTheme({
    ...base,
    palette: {
      mode: "light",
      primary: { main: accent },
      secondary: { main: white },
      background: { default: white, paper: cream },
      text: { primary: black, secondary: "#000000" },
      divider: border,
    },
  });

  const dark = createTheme({
    ...base,
    palette: {
      mode: "dark",
      primary: { main: accent },
      secondary: { main: white },
      background: { default: black, paper: "#171616" },
      text: { primary: white, secondary: "#ffffff" },
      divider: border,
    },
  });

  return { light, dark };
};

// Static default themes (kept for backwards compatibility)
const { light: lightTheme, dark: darkTheme } = buildDynamicThemes(primaryColor);

export const theme = lightTheme;
export { lightTheme, darkTheme };
