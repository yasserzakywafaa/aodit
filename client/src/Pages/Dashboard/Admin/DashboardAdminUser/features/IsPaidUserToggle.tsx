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

interface IsPaidUserToggleProps {
  user: User | null;
  value: boolean;
  onChange: (isPaidUser: boolean) => void;
}

const IsPaidUserToggle = ({ user, value, onChange }: IsPaidUserToggleProps) => {
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
          <Typography variant="h6">Paid User Status</Typography>
        </Box>
        <FormControlLabel
          control={
            <Switch checked={value} onChange={handleToggle} color="primary" />
          }
          label={value ? "Paid User" : "Free User"}
        />
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            mt: 1
          }}>
          Whether this user is a paid user or not <br />
          (should be used with Subscription Type)
        </Typography>
      </CardContent>
    </Card>
  );
};

export default IsPaidUserToggle;
