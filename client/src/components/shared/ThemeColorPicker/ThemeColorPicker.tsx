import { Box, Tooltip, Typography } from "@mui/material";
import { AODIT_THEME_COLORS } from "src/application/shared/themes";
import { useApplicationContext } from "src/application/store/Provider";
import CheckIcon from "@mui/icons-material/Check";

interface ThemeColorPickerProps {
  /** Called after a color swatch is clicked — useful for closing a parent menu. */
  onColorChange?: () => void;
}

const ThemeColorPicker = ({ onColorChange }: ThemeColorPickerProps) => {
  const {
    store: {
      state: { themePrimaryColor },
    },
    manager: { handleSetPrimaryColor },
  } = useApplicationContext();

  const handleClick = (color: string) => {
    handleSetPrimaryColor(color);
    onColorChange?.();
  };

  return (
    <Box sx={{ px: 2, pt: 0.5, pb: 1.5 }}>
      <Typography
        variant="caption"
        sx={{
          display: "block",
          mb: 1,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          opacity: 0.5,
          fontSize: "0.65rem",
        }}
      >
        Accent Color
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "6px",
        }}
      >
        {AODIT_THEME_COLORS.map(({ value, label, description }) => {
          const isActive = themePrimaryColor === value;

          return (
            <Tooltip
              key={value}
              title={
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                    {label}
                  </Typography>
                  <br />
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    {description}
                  </Typography>
                </Box>
              }
              placement="top"
              arrow
            >
              <Box
                role="button"
                aria-label={`Set accent color to ${label}`}
                onClick={() => handleClick(value)}
                sx={{
                  width: 28,
                  height: 28,
                  backgroundColor: value,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: isActive
                    ? "2px solid #ffffff"
                    : "2px solid transparent",
                  boxShadow: isActive
                    ? `0 0 0 1px ${value}`
                    : "0 1px 3px rgba(0,0,0,0.4)",
                  transition: "transform 0.15s ease, box-shadow 0.15s ease",
                  "&:hover": {
                    transform: "scale(1.15)",
                    boxShadow: `0 0 0 2px ${value}`,
                  },
                }}
              >
                {isActive && (
                  <CheckIcon
                    sx={{
                      fontSize: 14,
                      color: "#ffffff",
                      filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.6))",
                    }}
                  />
                )}
              </Box>
            </Tooltip>
          );
        })}
      </Box>
    </Box>
  );
};

export default ThemeColorPicker;
