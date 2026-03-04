import { Avatar, Box, Button, TextField, Typography } from "@mui/material";

import { LockOutlined } from "@mui/icons-material";

const LoginForm = () => {
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
        Log in to you account
      </Typography>

      <Box component="div" sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
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
          Log in
        </Button>
        {/* <Grid container>
          <Grid size={{ xs: 12 }}>
            <Link to="#">Forgot password?</Link>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Link to="#">{"Don't have an account? Register"}</Link>
          </Grid>
        </Grid> */}
      </Box>
    </Box>
  );
};

export default LoginForm;
