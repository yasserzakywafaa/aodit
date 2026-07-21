import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import React, { useState } from "react";

import END_POINTS from "src/application/shared/endpoints";
import { UserRole } from "src/shared/types/user";
import axios from "axios";
import { useTranslation } from "react-i18next";

interface CreateUserDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateUserDialog: React.FC<CreateUserDialogProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const { t } = useTranslation(["dashboard", "common", "auth"]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>(UserRole.user);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setRole(UserRole.user);
    setShowPassword(false);
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await axios.post(
        END_POINTS.DASHBOARD.ADMIN.USERS.CREATE_USER,
        { firstName, lastName, email, password, role },
        { withCredentials: true },
      );
      resetForm();
      onSuccess();
      onClose();
    } catch (err: any) {
      const message = err.response?.data?.message || t("dashboard:admin.users.createFailed");
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
<DialogTitle>{t("dashboard:admin.users.createUserTitle")}</DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}
        >
          <TextField
            required
            fullWidth
            label={t("auth:firstName")}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            autoComplete="off"
            size="small"
          />
          <TextField
            fullWidth
            label={t("auth:lastName")}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            autoComplete="off"
            size="small"
          />
          <TextField
            required
            fullWidth
            type="email"
            label={t("auth:email")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="off"
            size="small"
          />
          <TextField
            required
            fullWidth
            type={showPassword ? "text" : "password"}
            label={t("auth:password")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            slotProps={{ htmlInput: { minLength: 8 } }}
            size="small"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={t("dashboard:admin.users.togglePasswordVisibility")}
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                    size="small"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <FormControl fullWidth size="small">
<InputLabel id="role-label">{t("dashboard:admin.users.role")}</InputLabel>
            <Select
              labelId="role-label"
              value={role}
              label={t("dashboard:admin.users.role")}
              onChange={(e) => setRole(e.target.value as UserRole)}
            >
<MenuItem value={UserRole.user}>{t("dashboard:admin.users.roleUser")}</MenuItem>
<MenuItem value={UserRole.admin}>{t("dashboard:admin.users.roleAdmin")}</MenuItem>
<MenuItem value={UserRole.super_admin}>{t("dashboard:admin.users.roleSuperAdmin")}</MenuItem>
            </Select>
          </FormControl>

          {error && (
            <Alert severity="error" sx={{ py: 0 }}>
              {error}
            </Alert>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} disabled={isSubmitting}>
            {t("common:cancel")}
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
          >
{isSubmitting ? t("dashboard:admin.users.creating") : t("dashboard:admin.users.createUser")}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default CreateUserDialog;
