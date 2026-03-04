import { AuthType } from "src/shared/types/types";
import { Box } from "@mui/material";
import GoogleAuth from "src/components/shared/SocialLogins/GoogleAuth";
// import LinkedInAuth from "src/components/shared/SocialLogins/LinkedInAuth";

interface SocialRegisterProps {
  authType?: AuthType;
}

const SocialRegister = (props: SocialRegisterProps): JSX.Element => {
  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <GoogleAuth authType={props.authType || "register"} />
      {/* <LinkedInAuth authType={props.authType || "register"} /> */}
    </Box>
  );
};

export default SocialRegister;
