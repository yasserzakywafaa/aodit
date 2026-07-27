import IconButton from "@mui/material/IconButton";
import ModeNightRoundedIcon from "@mui/icons-material/ModeNightRounded";
import { PaletteMode } from "@mui/material";
import WbSunnyRoundedIcon from "@mui/icons-material/WbSunnyRounded";
import { useTranslation } from "react-i18next";

interface ToggleColorModeProps {
  mode?: PaletteMode;
  toggleColorMode?: () => void;
}

const ToggleColorMode = ({ mode, toggleColorMode }: ToggleColorModeProps) => {
  const { t } = useTranslation("common");

  return (
    <IconButton
      onClick={toggleColorMode}
      color="secondary"
      aria-label={t("settings.themeToggle")}
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
