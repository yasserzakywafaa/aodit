import { Button } from "@mui/material";
import END_POINTS from "src/application/shared/endpoints";
import { Google as GoogleIcon } from "@mui/icons-material";
import React from "react";
import { useLoginModalContext } from "src/components/Modals/LoginModal/store/Provider";
import { useRegisterModalContext } from "src/components/Modals/RegisterModal/store/Provider";

interface OAuth2GoogleAuthProps {
  authType?: "login" | "register";
  disabled?: boolean;
}

const GoogleAuth: React.FC<OAuth2GoogleAuthProps> = ({
  authType = "login",
  disabled = false,
}) => {
  const isRegister = authType === "register";
  const { store: loginStore } = useLoginModalContext();
  const { store: registerStore } = useRegisterModalContext();

  const handleGoogleLogin = async () => {
    if (isRegister) {
      registerStore.handleIsFetching(true);
    } else {
      loginStore.handleIsFetching(true);
    }
    window.location.assign(END_POINTS.AUTH.GOOGLE);
  };

  return (
    <Button
      fullWidth
      variant="contained"
      onClick={handleGoogleLogin}
      disabled={disabled}
      sx={{
        display: "flex",
        justifyContent: "flex-start",
        textTransform: "none",
        gap: 2,
      }}
    >
      <GoogleIcon />
      {isRegister ? "Register with Google" : "Login with Google"}
    </Button>
  );
};

export default GoogleAuth;
