import {
  Box,
  Card,
  CardContent,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { SubscriptionPlanEnum, User } from "src/shared/types/user";

import { CreditCard as CreditCardIcon } from "@mui/icons-material";

interface SubscriptionDetailsCardProps {
  user: User | null;
  subscriptionType: string;
  maxProjectsAllowed: number;
  paymentStatus: string;
  apiAccessAllowed: boolean;
  onSubscriptionTypeChange: (type: string) => void;
  onMaxProjectsAllowedChange: (maxProjectsAllowed: number) => void;
  onPaymentStatusChange: (paymentStatus: string) => void;
  onApiAccessAllowedChange: (apiAccessAllowed: boolean) => void;
}

const SubscriptionDetailsCard = ({
  user,
  subscriptionType,
  maxProjectsAllowed,
  paymentStatus,
  apiAccessAllowed,
  onSubscriptionTypeChange,
  onMaxProjectsAllowedChange,
  onPaymentStatusChange,
  onApiAccessAllowedChange,
}: SubscriptionDetailsCardProps) => {
  if (!user || !user.subscription) {
    return null;
  }

  const subscription = user.subscription;

  const handleTypeChange = (event: SelectChangeEvent) => {
    onSubscriptionTypeChange(event.target.value);
  };

  const handleMaxProjectsChange = (value: number) => {
    onMaxProjectsAllowedChange(Math.max(0, value));
  };

  const handlePaymentStatusChange = (event: SelectChangeEvent) => {
    onPaymentStatusChange(event.target.value);
  };

  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <CreditCardIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">Subscription Details</Typography>
        </Box>

        <Grid container spacing={2}>
          {/* Subscription ID */}
          <Grid container size={{ xs: 12 }} gap={2}>
            <Grid size={{ xs: 6, sm: 2 }}>
              <Typography variant="body2">Subscription ID:</Typography>
            </Grid>
            <Grid size="auto">
              <Typography variant="body2" fontWeight="bold">
                {subscription.id || "N/A"}
              </Typography>
            </Grid>
          </Grid>

          {/* Start Date */}
          <Grid container size={{ xs: 12 }} gap={2}>
            <Grid size={{ xs: 6, sm: 2 }}>
              <Typography variant="body2">Start Date:</Typography>
            </Grid>
            <Grid size="auto">
              <Typography variant="body2" fontWeight="bold">
                {new Date(subscription.startDate).toLocaleString()}
              </Typography>
            </Grid>
          </Grid>

          {/* End Date */}
          <Grid container size={{ xs: 12 }} gap={2}>
            <Grid size={{ xs: 6, sm: 2 }}>
              <Typography variant="body2">End Date:</Typography>
            </Grid>
            <Grid size="auto">
              <Typography variant="body2" fontWeight="bold">
                {new Date(subscription.endDate).toLocaleString()}
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2, width: "50%" }} />

          {/* Subscription Type */}
          <Grid container size={{ xs: 12 }} gap={2} alignItems="center">
            <Grid size={{ xs: 12, sm: 4 }}>
              <FormControl fullWidth>
                <InputLabel id="subscription-type-label">Type</InputLabel>
                <Select
                  labelId="subscription-type-label"
                  id="subscription-type-select"
                  value={subscriptionType}
                  label="Type"
                  onChange={handleTypeChange}
                >
                  {Object.values(SubscriptionPlanEnum).map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Max Projects Allowed */}
          <Grid container size={{ xs: 12 }} gap={2} alignItems="center">
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                type="number"
                label="Max Projects Allowed"
                value={maxProjectsAllowed}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0;
                  handleMaxProjectsChange(value);
                }}
                inputProps={{ min: 0 }}
                fullWidth
              />
            </Grid>
          </Grid>

          {/* Payment Status */}
          <Grid container size={{ xs: 12 }} gap={2} alignItems="center">
            <Grid size={{ xs: 12, sm: 4 }}>
              <FormControl fullWidth>
                <InputLabel id="payment-status-label">
                  Payment Status
                </InputLabel>
                <Select
                  labelId="payment-status-label"
                  id="payment-status-select"
                  value={paymentStatus}
                  label="Payment Status"
                  onChange={handlePaymentStatusChange}
                >
                  <MenuItem value="paid">Paid</MenuItem>
                  <MenuItem value="unpaid">Unpaid</MenuItem>
                  <MenuItem value="no_payment_required">
                    No Payment Required
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2, width: "50%" }} />

          {/* Price */}
          <Grid container size={{ xs: 12 }} gap={2}>
            <Grid size={{ xs: 6, sm: 2 }}>
              <Typography variant="body2">Price:</Typography>
            </Grid>
            <Grid size="auto">
              <Typography variant="body2" fontWeight="bold">
                {subscription.price
                  ? `${
                      (subscription.price as any)?.unit_amount
                        ? (subscription.price as any).unit_amount / 100
                        : "N/A"
                    } ${(subscription.price as any)?.currency || ""}`
                  : "N/A"}
              </Typography>
            </Grid>
          </Grid>

          {/* API Access */}
          {subscription.api && (
            <>
              <Grid container size={{ xs: 12 }} alignItems="center">
                <Grid size={{ xs: 6, sm: 2 }}>
                  <Typography variant="body2">API Access:</Typography>
                </Grid>
                <Grid size="auto">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={apiAccessAllowed}
                        onChange={(e) =>
                          onApiAccessAllowedChange(e.target.checked)
                        }
                      />
                    }
                    label="Allowed"
                  />
                </Grid>
              </Grid>

              {subscription.api.apiKey && (
                <Grid container size={{ xs: 12 }} overflow="auto">
                  <Grid size={{ xs: 6, sm: 2 }}>
                    <Typography variant="body2">API Key:</Typography>
                  </Grid>
                  <Grid size="auto">
                    <Typography component="code">
                      {subscription.api.apiKey}
                    </Typography>
                  </Grid>
                </Grid>
              )}
            </>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default SubscriptionDetailsCard;
