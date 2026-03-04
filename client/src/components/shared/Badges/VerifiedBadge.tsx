import { VerifiedTwoTone } from "@mui/icons-material";
import { primaryColor } from "src/application/shared/themes";

interface VerifiedBadge {
  fontSize?: number;
}

export const VerifiedBadge = (props: VerifiedBadge) => {
  return (
    <VerifiedTwoTone
      sx={{
        "& path:nth-of-type(1)": {
          color: primaryColor,
          fill: primaryColor,
          opacity: 1,
        },
        "& path:nth-of-type(2)": {
          color: primaryColor,
          fill: primaryColor,
          opacity: 1,
        },
        fontSize: props.fontSize || 14,
      }}
    />
  );
};
