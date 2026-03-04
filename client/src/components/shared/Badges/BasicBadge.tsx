import { Chip } from "@mui/material";

interface BasicBadge {
  fontSize?: number;
}

export const BasicBadge = (props: BasicBadge) => {
  return (
    <Chip
      size="small"
      color="primary"
      variant="filled"
      label="Basic"
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
