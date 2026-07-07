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

interface RoleSelectorProps {
  user: User | null;
  value: UserRole;
  onChange: (role: UserRole) => void;
}

const RoleSelector = ({ user, value, onChange }: RoleSelectorProps) => {
  if (!user) {
    return null;
  }

  const handleRoleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value as UserRole);
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case UserRole.super_admin:
        return "Super Admin";
      case UserRole.admin:
        return "Admin";
      case UserRole.user:
        return "User";
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
          <Typography variant="h6">User Role</Typography>
        </Box>
        <FormControl fullWidth>
          <InputLabel id="role-select-label">Role</InputLabel>
          <Select
            labelId="role-select-label"
            id="role-select"
            value={value}
            label="Role"
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
          User's role to control their permissions and access level.
        </Typography>
      </CardContent>
    </Card>
  );
};

export default RoleSelector;
