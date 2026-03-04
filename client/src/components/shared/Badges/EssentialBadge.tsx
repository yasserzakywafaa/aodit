import { Chip } from "@mui/material";

interface EssentialBadge {
  fontSize?: number;
}

export const EssentialBadge = (props: EssentialBadge) => {
  return (
    <Chip
      size="small"
      color="primary"
      variant="filled"
      label="Essential"
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
