import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import {
  Notify,
  ToastTypes,
} from "src/components/shared/Notification/Notification";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import END_POINTS from "src/application/shared/endpoints";
import { MuiTelInput } from "mui-tel-input";
import { User } from "src/shared/types/user";
import axios from "axios";
import { getAxiosError } from "src/shared/utils/getAxiosError";
import { parsePhoneNumber } from "libphonenumber-js";
import { routes } from "src/application/routes";
import { trackEvent } from "src/shared/utils/ga4";
import { useApplicationContext } from "src/application/store/Provider";
import { useNavigate } from "react-router-dom";

type PhoneAuthType = "register" | "login";

interface PhoneAuthSuccessResponse {
  message: string;
  user: User;
}

interface PhoneOtpAuthFormProps {
  authType: PhoneAuthType;
  onAuthSuccess?: () => void;
  onWaitingForOtp?: (waiting: boolean) => void;
}

const OTP_CODE_REGEX = /^\d{4,8}$/;

const validatePhoneNumber = (value: string): string | null => {
  const trimmed = value.trim();
  if (!trimmed) return null;
  try {
    const parsed = parsePhoneNumber(trimmed);
    if (!parsed?.isValid()) return null;
    return parsed.format("E.164");
  } catch {
    return null;
  }
};

const PhoneOtpAuthForm = ({
  authType,
  onAuthSuccess,
  onWaitingForOtp,
}: PhoneOtpAuthFormProps): JSX.Element => {
  const { t } = useTranslation("auth");
  const isRegister = authType === "register";
  const navigate = useNavigate();
  const {
    manager: { handleSetAuthInfo },
  } = useApplicationContext();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [language, setLanguage] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [submittedPhoneNumber, setSubmittedPhoneNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sendOtpEndpoint = useMemo(
    () =>
      isRegister
        ? END_POINTS.AUTH.PHONE_REGISTER_SEND_OTP
        : END_POINTS.AUTH.PHONE_LOGIN_SEND_OTP,
    [isRegister],
  );

  const verifyOtpEndpoint = useMemo(
    () =>
      isRegister
        ? END_POINTS.AUTH.PHONE_REGISTER_VERIFY_OTP
        : END_POINTS.AUTH.PHONE_LOGIN_VERIFY_OTP,
    [isRegister],
  );

  const handleSendOtp = async () => {
    const normalizedPhoneNumber = validatePhoneNumber(phoneNumber);
    if (!normalizedPhoneNumber) {
      Notify({
        content: t("validationPhoneRequired"),
        type: ToastTypes.Error,
      });
      return;
    }

    if (isRegister && !firstName.trim()) {
      Notify({
        content: t("validationFirstNameRequired"),
        type: ToastTypes.Error,
      });
      return;
    }

    if (isRegister && !gender.trim()) {
      Notify({
        content: t("validationGenderRequired"),
        type: ToastTypes.Error,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post<{ message: string }>(
        sendOtpEndpoint,
        {
          phoneNumber: normalizedPhoneNumber,
        },
        {
          withCredentials: true,
        },
      );

      setPhoneNumber(normalizedPhoneNumber);
      setSubmittedPhoneNumber(normalizedPhoneNumber);
      setIsOtpSent(true);
      setOtpCode("");
      onWaitingForOtp?.(true);

      Notify({
        content: response.data.message || t("otpSentSuccess"),
        type: ToastTypes.Success,
      });
    } catch (error) {
      getAxiosError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!isOtpSent) {
      return;
    }

    if (!OTP_CODE_REGEX.test(otpCode.trim())) {
      Notify({
        content: t("validationOtpRequired"),
        type: ToastTypes.Error,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = isRegister
        ? {
            phoneNumber: submittedPhoneNumber,
            otpCode: otpCode.trim(),
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            gender: gender.trim(),
            language: language.trim() || undefined,
          }
        : {
            phoneNumber: submittedPhoneNumber,
            otpCode: otpCode.trim(),
          };

      const response = await axios.post<PhoneAuthSuccessResponse>(
        verifyOtpEndpoint,
        payload,
        {
          withCredentials: true,
        },
      );

      handleSetAuthInfo({
        isAuthenticated: true,
        user: response.data.user,
      });

      Notify({
        content:
          response.data.message ||
          (isRegister ? t("phoneVerifiedCreated") : t("loggedInSuccess")),
        type: ToastTypes.Success,
      });

      trackEvent(isRegister ? "sign_up" : "login", {
        method: "phone_otp",
      });

      onWaitingForOtp?.(false);
      onAuthSuccess?.();
      navigate(routes.dashboard.base, { replace: true });
    } catch (error) {
      getAxiosError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangePhoneNumber = () => {
    setIsOtpSent(false);
    setOtpCode("");
    setSubmittedPhoneNumber("");
    onWaitingForOtp?.(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isOtpSent) {
      handleSendOtp();
    } else {
      handleVerifyOtp();
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {isRegister && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <TextField
            required
            fullWidth
            label={t("firstName")}
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            disabled={isOtpSent}
            autoComplete="given-name"
          />
          <TextField
            fullWidth
            label={t("lastName")}
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            disabled={isOtpSent}
            autoComplete="family-name"
          />
          <FormControl fullWidth required disabled={isOtpSent}>
            <InputLabel id="phone-auth-gender-label">{t("gender")}</InputLabel>
            <Select
              labelId="phone-auth-gender-label"
              id="phone-auth-gender"
              value={gender}
              label={t("gender")}
              onChange={(e) => setGender(e.target.value)}
            >
              <MenuItem value="male">{t("genderMale")}</MenuItem>
              <MenuItem value="female">{t("genderFemale")}</MenuItem>
              <MenuItem value="other">{t("genderOther")}</MenuItem>
              <MenuItem value="prefer_not_to_say">{t("genderPreferNot")}</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth disabled={isOtpSent}>
            <InputLabel id="phone-auth-language-label">{t("language")}</InputLabel>
            <Select
              labelId="phone-auth-language-label"
              id="phone-auth-language"
              value={language}
              label={t("language")}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <MenuItem value="en">{t("languageEnglish")}</MenuItem>
              <MenuItem value="fr">{t("languageFrench")}</MenuItem>
              <MenuItem value="ar">{t("languageArabic")}</MenuItem>
            </Select>
          </FormControl>
        </Box>
      )}
      <MuiTelInput
        value={phoneNumber}
        onChange={(value) => setPhoneNumber(value)}
        label={t("phoneNumber")}
        required
        disabled={isOtpSent}
        defaultCountry="PT"
        preferredCountries={["DE", "FR", "EG", "PT"]}
        FlagIconButtonProps={{
          sx: {
            width: 20,
            height: 20,
          },
        }}
      />
      {isOtpSent && (
        <>
          <TextField
            required
            fullWidth
            label={t("otpCode")}
            placeholder={t("otpPlaceholder")}
            value={otpCode}
            onChange={(event) => setOtpCode(event.target.value)}
            autoComplete="one-time-code"
          />
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
            }}
          >
            {t("otpSentTo", { number: submittedPhoneNumber })}
          </Typography>
        </>
      )}
      {!isOtpSent ? (
        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={isSubmitting}
        >
          {isSubmitting ? t("sendingOtp") : t("sendOtp")}
        </Button>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1.5,
          }}
        >
          <Button
            type="button"
            fullWidth
            variant="outlined"
            onClick={handleChangePhoneNumber}
            disabled={isSubmitting}
          >
            {t("changeNumber")}
          </Button>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? t("verifying")
              : isRegister
                ? t("verifyAndRegister")
                : t("verifyAndLogin")}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default PhoneOtpAuthForm;
