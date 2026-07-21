import { Chip } from "@mui/material";
import { useTranslation } from "react-i18next";

interface BasicBadge {
  fontSize?: number;
}

export const BasicBadge = (props: BasicBadge) => {
  const { t } = useTranslation("common");

  return (
    <Chip
      size="small"
      color="primary"
      variant="filled"
      label={t("badges.basic")}
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
