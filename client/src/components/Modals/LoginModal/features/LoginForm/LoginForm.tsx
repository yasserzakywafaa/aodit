import { Avatar, Box, Button, TextField, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import { LockOutlined } from "@mui/icons-material";

const LoginForm = () => {
  const { t } = useTranslation("auth");

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
        <LockOutlined />
      </Avatar>

      <Typography component="h1" variant="h5">
        {t("loginFormHeading")}
      </Typography>

      <Box component="div" sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label={t("email")}
          name="email"
          autoComplete="email"
          autoFocus
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label={t("password")}
          type="password"
          id="password"
          autoComplete="current-password"
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          {t("login")}
        </Button>
      </Box>
    </Box>
  );
};

export default LoginForm;
