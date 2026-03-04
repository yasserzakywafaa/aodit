import { Chip } from "@mui/material";

interface PremiumBadge {
  fontSize?: number;
}

export const PremiumBadge = (props: PremiumBadge) => {
  return (
    <Chip
      size="small"
      color="primary"
      variant="filled"
      label="Premium"
      sx={{
        paddingX: 0,
        paddingY: 0,
        marginRight: "0.5rem",
        height: "fit-content",
        fontSize: props.fontSize || "0.65rem",
        "& .MuiChip-label": {
          paddingX: "2px",
        },
      }}
    />
  );
};
