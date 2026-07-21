import {
  Box,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { User, UserRole } from "src/shared/types/user";

import { AdminPanelSettings as AdminPanelSettingsIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

interface RoleSelectorProps {
  user: User | null;
  value: UserRole;
  onChange: (role: UserRole) => void;
}

const RoleSelector = ({ user, value, onChange }: RoleSelectorProps) => {
  const { t } = useTranslation("dashboard");
  if (!user) {
    return null;
  }

  const handleRoleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value as UserRole);
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case UserRole.super_admin:
        return t("admin.users.roleSuperAdmin");
      case UserRole.admin:
        return t("admin.users.roleAdmin");
      case UserRole.user:
        return t("admin.user.roleUser");
      default:
        return role;
    }
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
          <AdminPanelSettingsIcon color="primary" sx={{ mr: 1 }} />
<Typography variant="h6">{t("admin.user.userRole")}</Typography>
        </Box>
        <FormControl fullWidth>
<InputLabel id="role-select-label">{t("admin.user.role")}</InputLabel>
          <Select
            labelId="role-select-label"
            id="role-select"
            value={value}
            label={t("admin.user.role")}
            onChange={handleRoleChange}
          >
            {Object.values(UserRole).map((role) => (
              <MenuItem key={role} value={role}>
                {getRoleLabel(role)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            mt: 1
          }}>
{t("admin.user.roleHelp")}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default RoleSelector;
