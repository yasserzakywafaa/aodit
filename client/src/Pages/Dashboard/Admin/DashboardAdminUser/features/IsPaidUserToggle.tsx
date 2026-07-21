import {
  Box,
  Card,
  CardContent,
  FormControlLabel,
  Switch,
  Typography,
} from "@mui/material";

import { Payment as PaymentIcon } from "@mui/icons-material";
import { User } from "src/shared/types/user";
import { useTranslation } from "react-i18next";

interface IsPaidUserToggleProps {
  user: User | null;
  value: boolean;
  onChange: (isPaidUser: boolean) => void;
}

const IsPaidUserToggle = ({ user, value, onChange }: IsPaidUserToggleProps) => {
  const { t } = useTranslation("dashboard");
  if (!user) {
    return null;
  }

  const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.checked);
  };

  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 2
          }}>
          <PaymentIcon color="primary" sx={{ mr: 1 }} />
<Typography variant="h6">{t("admin.user.paidUserStatus")}</Typography>
        </Box>
        <FormControlLabel
          control={
            <Switch checked={value} onChange={handleToggle} color="primary" />
          }
          label={value ? t("admin.user.paidUser") : t("admin.user.freeUser")}
        />
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            mt: 1
          }}>
<span dangerouslySetInnerHTML={{ __html: t("admin.user.paidUserHelp") }} />
        </Typography>
      </CardContent>
    </Card>
  );
};

export default IsPaidUserToggle;
