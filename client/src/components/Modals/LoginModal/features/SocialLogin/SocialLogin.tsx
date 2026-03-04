import { AuthType } from "src/shared/types/types";
import { Box } from "@mui/material";
import GoogleAuth from "src/components/shared/SocialLogins/GoogleAuth";
// import LinkedInAuth from "src/components/shared/SocialLogins/LinkedInAuth";

interface SocialLoginProps {
  authType?: AuthType;
}

const SocialLogin = (props: SocialLoginProps): JSX.Element => {
  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <GoogleAuth authType={props.authType || "login"} />
      {/* <LinkedInAuth authType={props.authType || "login"} /> */}
    </Box>
  );
};

export default SocialLogin;
