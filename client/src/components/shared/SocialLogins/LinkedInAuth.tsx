import { Button } from "@mui/material";
import END_POINTS from "src/application/shared/endpoints";
import { LinkedIn as LinkedInIcon } from "@mui/icons-material";
import React from "react";
import { useLoginModalContext } from "src/components/Modals/LoginModal/store/Provider";
import { useRegisterModalContext } from "src/components/Modals/RegisterModal/store/Provider";

interface LinkedInAuthProps {
  authType?: "login" | "register";
  disabled?: boolean;
}

const LinkedInAuth: React.FC<LinkedInAuthProps> = ({
  authType = "login",
  disabled = false,
}) => {
  const isRegister = authType === "register";
  const { store: loginStore } = useLoginModalContext();
  const { store: registerStore } = useRegisterModalContext();

  const handleLinkedInLogin = () => {
    if (isRegister) {
      registerStore.handleIsFetching(true);
    } else {
      loginStore.handleIsFetching(true);
    }
    window.location.assign(END_POINTS.AUTH.LINKEDIN);
  };

  return (
    <Button
      fullWidth
      variant="contained"
      onClick={handleLinkedInLogin}
      disabled={disabled}
      sx={{
        display: "flex",
        justifyContent: "flex-start",
        textTransform: "none",
        gap: 2,
      }}
    >
      <LinkedInIcon />
      {isRegister ? "Register with LinkedIn" : "Login with LinkedIn"}
    </Button>
  );
};

export default LinkedInAuth;
