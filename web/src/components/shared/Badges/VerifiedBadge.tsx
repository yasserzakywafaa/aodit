import { VerifiedTwoTone } from "@mui/icons-material";

interface VerifiedBadge {
  fontSize?: number;
}

export const VerifiedBadge = (props: VerifiedBadge) => {
  return (
    <VerifiedTwoTone
      sx={{
        "& path:nth-of-type(1)": {
          color: "primary.main",
          fill: (t) => t.palette.primary.main,
          opacity: 1,
        },
        "& path:nth-of-type(2)": {
          color: "primary.main",
          fill: (t) => t.palette.primary.main,
          opacity: 1,
        },
        fontSize: props.fontSize || 14,
      }}
    />
  );
};
