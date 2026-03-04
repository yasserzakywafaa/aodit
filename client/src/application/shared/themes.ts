import { Theme, createTheme } from "@mui/material/styles";

import { Languages } from "src/shared/languages";

export const white = "#FFFFFF";
export const black = "#000000";
export const lightGrey = "#666666"; // Light Grey
export const charcoal = "#333333"; // Dark Charcoal
export const darkCharcoal = "#121212"; // Black Charcoal

export const primaryColor = "#76d6b6"; // green
export const primaryColorOpaqueTen = "rgba(0, 0, 0, 0.1)"; // Black 10% Opacity
export const primaryColorOpaqueThirty = "rgba(0, 0, 0, 0.3)"; // Black 30% Opacity
export const secondaryColor = white; // white
export const primaryColorForDarkTheme = primaryColor;
export const secondaryColorForDarkTheme = secondaryColor;
export const secondaryColorForLightTheme = primaryColor;

export const defaultBackDropFilterBlur = "blur(4px)";
const borderRadius = "8px";
export const buttonStyle = {
  // borderRadius: "8px",
  border: `1px solid ${black}`,
  boxShadow: `0px 1px 0 ${charcoal}`,
  "&:hover": {
    color: white,
    backgroundColor: primaryColorOpaqueThirty,
    border: `1px solid ${lightGrey}`,
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
  "& .MuiDataGrid-row:nth-of-type(odd)": {
    backgroundColor: primaryColorOpaqueTen,
  },
  "& .MuiDataGrid-row:hover": {
    backgroundColor: primaryColorOpaqueThirty,
  },
  "& .MuiDataGrid-toolbar": {
    color: theme.palette.mode === "dark" ? secondaryColor : primaryColor,
    "& .MuiIconButton-root": {
      color: theme.palette.mode === "dark" ? secondaryColor : primaryColor,
    },
  },
});
const languagesFonts = Languages.filter((language) => language.fontFamily).map(
  (lang) => lang.fontFamily ?? null,
);

export const theme = createTheme({
  palette: {
    primary: {
      main: primaryColor,
      light: primaryColorForDarkTheme,
    },
    secondary: {
      // main: secondaryColor,
      main: primaryColor,
    },
  },
  typography: {
    fontFamily: languagesFonts.join(", "),
  },
  components: {
    MuiList: {
      styleOverrides: {
        root: {
          "&.MuiMenu-list": {
            ".MuiMenuItem-root": {
              ".MuiTypography-root": {
                textWrap: "balance",
              },
            },
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: "40px",
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          ...(ownerState.orientation === "horizontal" && {
            margin: "auto",
            borderColor: "transparent",
            borderBottomWidth: "thin",
            boxShadow: `-9px -2px 1px ${primaryColor}, 13px 2px 1px ${primaryColor}`,
          }),
          ...(ownerState.orientation === "vertical" && {
            margin: "auto",
            borderColor: "transparent",
            borderBottomWidth: "thin",
            boxShadow: `-2px -5px 1px ${primaryColor}, 2px 2px 1px ${primaryColor}`,
          }),
        }),
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          backdropFilter: defaultBackDropFilterBlur,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          backgroundColor: "transparent",
          backdropFilter: defaultBackDropFilterBlur,
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          backgroundColor: "transparent",
          "&.MuiPaper-root": {
            borderRadius,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "capitalize",
          "&.Mui-disabled": {
            opacity: "0.7",
            cursor: "not-allowed",
            backgroundColor: primaryColor,
          },
        },
        contained: {
          ...buttonStyle,
        },
        outlined: {
          ...buttonStyle,
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          backdropFilter: defaultBackDropFilterBlur,
        },
        outlined: {
          borderRadius: 0,
          backdropFilter: defaultBackDropFilterBlur,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 0,
            backdropFilter: defaultBackDropFilterBlur,
          },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          marginLeft: 0,
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          borderTop: `1px solid ${lightGrey}`,
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          "&:hover": {
            "& .MuiSwitch-switchBase": {
              borderRadius: 0,
            },
          },
          "& .MuiSwitch-thumb": {
            borderRadius: 0,
            border: `4px solid ${primaryColor}`,
          },
          "& .MuiSwitch-thumb:hover": {
            borderRadius: 0,
          },

          "& .MuiSwitch-track": {
            borderRadius: 0,
          },
        },
      },
    },
    MuiSnackbar: {
      styleOverrides: {
        root: {
          ".MuiPaper-root": {
            border: `1px solid ${primaryColor}`,
          },
        },
      },
    },
    MuiTablePagination: {
      styleOverrides: {
        root: {
          "& .MuiTablePagination-select": {
            "& .MuiTablePagination-selectIcon": {
              color: primaryColor,
            },
          },
          "& .MuiTablePagination-actions": {
            "& .MuiButtonBase-root.MuiIconButton-root:not(.Mui-disabled)": {
              color: primaryColor,
            },
            "& .MuiButtonBase-root.MuiIconButton-root.Mui-disabled": {
              color: primaryColorOpaqueThirty,
            },
          },
        },
      },
    },
  },
});

export const lightTheme = createTheme({
  ...theme,
  palette: {
    ...theme.palette,
    secondary: {
      main: secondaryColorForLightTheme,
    },
    mode: "light",
    background: {
      default: white,
    },
    text: {
      primary: charcoal, // Charcoal
      secondary: lightGrey, // Gray
    },
    divider: "#CCCCCC",
  },
  components: {
    ...theme.components,
    MuiLink: {
      styleOverrides: {
        root: {
          color: charcoal,
          fontFamily: "LexendDeca-Bold",
          "&:visited": {
            color: charcoal,
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: "4px",
          backgroundColor: white,
          backgroundImage: "unset",
          border: `1px solid ${primaryColor}`,
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          border: `1px solid ${primaryColor}`,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        standardInfo: {
          border: `1px solid ${secondaryColorForLightTheme}`,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        outlined: {
          ...buttonStyle,
        },
        filled: {
          ...buttonStyle,
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  ...theme,
  palette: {
    ...theme.palette,
    mode: "dark",
    primary: {
      main: primaryColorForDarkTheme,
    },
    secondary: {
      main: secondaryColorForDarkTheme,
    },
    background: {
      default: black,
    },
    text: {
      primary: "#FFFFFF", // White
      secondary: "#FFFFFF", // White
    },
    divider: lightGrey, // Charcoal
  },
  components: {
    ...theme.components,
    MuiLink: {
      styleOverrides: {
        root: {
          color: white,
          fontFamily: "LexendDeca-Bold",
          "&:visited": {
            color: white,
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: "4px",
          backgroundImage: "unset",
          backgroundColor: darkCharcoal,
          border: `1px solid ${primaryColor}`,
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          border: `1px solid ${primaryColor}`,
        },
        list: {
          color: white,
          backgroundColor: darkCharcoal,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        standardInfo: {
          border: `1px solid ${secondaryColorForDarkTheme}`,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        outlined: {
          ...buttonStyle,
          color: white,
        },
        filled: {
          ...buttonStyle,
        },
      },
    },
  },
});
