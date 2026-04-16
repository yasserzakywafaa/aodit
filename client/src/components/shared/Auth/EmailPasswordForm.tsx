import { Alert, Box, Button, TextField } from "@mui/material";
import React, { useState } from "react";

import APP_CONSTANTS from "src/application/shared/app_constants";
import END_POINTS from "src/application/shared/endpoints";
import axios from "axios";
import { routes } from "src/application/routes";
import { useApplicationContext } from "src/application/store/Provider";
import { useNavigate } from "react-router-dom";

interface EmailPasswordFormProps {
  mode: "login" | "register";
}

interface AuthResponse {
  message: string;
  user: any;
}

const EmailPasswordForm: React.FC<EmailPasswordFormProps> = ({ mode }) => {
  const isRegister = mode === "register";
  const navigate = useNavigate();
  const {
    manager: { handleSetAuthInfo },
  } = useApplicationContext();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const endpoint = isRegister
        ? END_POINTS.AUTH.EMAIL_REGISTER
        : END_POINTS.AUTH.EMAIL_LOGIN;

      const payload = isRegister
        ? { email, password, firstName, lastName }
        : { email, password };

      const response = await axios.post<AuthResponse>(endpoint, payload, {
        withCredentials: true,
      });

      const user = response.data.user;

      handleSetAuthInfo({
        isAuthenticated: true,
        user,
      });

      // Persist to localStorage (matches existing auth pattern)
      localStorage.setItem(APP_CONSTANTS.LOCAL_STORAGE.AUTHENTICATED, "true");
      localStorage.setItem(
        APP_CONSTANTS.LOCAL_STORAGE.USER,
        JSON.stringify(user),
      );

      navigate(routes.dashboard.user.profile, { replace: true });
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        (isRegister ? "Registration failed." : "Login failed.");
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      component="form"
      display="flex"
      flexDirection="column"
      gap={2}
      onSubmit={handleSubmit}
      sx={{ width: "100%", maxWidth: 360 }}
    >
      {isRegister && (
        <>
          <TextField
            required
            fullWidth
            label="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            autoComplete="given-name"
            size="small"
          />
          <TextField
            fullWidth
            label="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            autoComplete="family-name"
            size="small"
          />
        </>
      )}

      <TextField
        required
        fullWidth
        type="email"
        label="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
        size="small"
      />

      <TextField
        required
        fullWidth
        type="password"
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete={isRegister ? "new-password" : "current-password"}
        inputProps={{ minLength: 8 }}
        size="small"
      />

      {error && (
        <Alert severity="error" sx={{ py: 0 }}>
          {error}
        </Alert>
      )}

      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={isSubmitting}
      >
        {isSubmitting
          ? isRegister
            ? "Creating account…"
            : "Signing in…"
          : isRegister
            ? "Create Account"
            : "Login"}
      </Button>
    </Box>
  );
};

export default EmailPasswordForm;
