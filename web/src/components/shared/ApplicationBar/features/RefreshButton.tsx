import { IconButton } from "@mui/material";
import { Refresh } from "@mui/icons-material";

export interface RefreshButtonProps {
  onClick: () => void;
}

const RefreshButton = ({ onClick }: RefreshButtonProps) => {
  return (
    <IconButton className="refresh-button" onClick={onClick}>
      <Refresh />
    </IconButton>
  );
};

export default RefreshButton;
