import { ArrowBackIosNew } from "@mui/icons-material";
import { IconButton } from "@mui/material";

interface BackButtonProps {
  onClick: () => void;
}

const BackButton = (props: BackButtonProps) => {
  return (
    <IconButton
      aria-label="back-button"
      className="back-button"
      sx={{ color: (theme) => theme.palette.primary.main }}
      onClick={props.onClick}
    >
      <ArrowBackIosNew fontSize="medium" />
    </IconButton>
  );
};

export default BackButton;
