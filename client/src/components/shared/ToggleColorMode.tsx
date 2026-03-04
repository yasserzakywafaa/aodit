import IconButton from "@mui/material/IconButton";
import ModeNightRoundedIcon from "@mui/icons-material/ModeNightRounded";
import { PaletteMode } from "@mui/material";
import WbSunnyRoundedIcon from "@mui/icons-material/WbSunnyRounded";

interface ToggleColorModeProps {
  mode?: PaletteMode;
  toggleColorMode?: () => void;
}

const ToggleColorMode = ({ mode, toggleColorMode }: ToggleColorModeProps) => {
  return (
    <IconButton
      onClick={toggleColorMode}
      color="secondary"
      aria-label="Theme toggle button"
    >
      {mode === "dark" ? (
        <WbSunnyRoundedIcon fontSize="small" />
      ) : (
        <ModeNightRoundedIcon fontSize="small" />
      )}
    </IconButton>
  );
};

export default ToggleColorMode;
