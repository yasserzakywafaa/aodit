import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
} from "@mui/material";
import React, { useState } from "react";

import { Phone } from "@mui/icons-material";
import PhoneOtpAuthForm from "src/components/shared/Auth/PhoneOtpAuthForm";
import { primaryColor } from "src/application/shared/themes";

interface PhoneAuthProps {
  authType?: "login" | "register";
  onAuthSuccess?: () => void;
  disabled?: boolean;
}

const PhoneAuth: React.FC<PhoneAuthProps> = ({
  authType = "login",
  onAuthSuccess,
  disabled = false,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [isWaitingForOtp, setIsWaitingForOtp] = useState(false);
  const isRegister = authType === "register";
  const label = isRegister
    ? "Register by Phone Number"
    : "Login by Phone Number";

  const handleAccordionChange = (
    _: React.SyntheticEvent,
    isExpanded: boolean,
  ) => {
    if (expanded && isWaitingForOtp && !isExpanded) return;
    setExpanded(isExpanded);
  };

  const handlePhoneAuthClick = () => {
    setExpanded(!expanded);
  };

  return (
    <>
      <Button
        fullWidth
        variant="contained"
        onClick={handlePhoneAuthClick}
        disabled={disabled}
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          textTransform: "none",
          gap: 2,
        }}
      >
        <Phone />
        {label}
      </Button>

      <Accordion
        expanded={expanded}
        onChange={handleAccordionChange}
        disabled={disabled}
        disableGutters
        elevation={0}
        sx={{
          "&.MuiPaper-root": {
            marginTop: "-1.1rem",
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
          },
          border: expanded ? "1px solid" : "none",
          borderColor: expanded ? "divider" : "transparent",
          "&:before": { display: "none" },
          "&.Mui-expanded": {
            borderColor: expanded ? primaryColor : "transparent",
          },
        }}
      >
        <AccordionSummary sx={{ display: "none", border: "none" }} />
        <AccordionDetails sx={{ p: 2 }}>
          <PhoneOtpAuthForm
            authType={authType}
            onAuthSuccess={onAuthSuccess}
            onWaitingForOtp={setIsWaitingForOtp}
          />
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default PhoneAuth;
