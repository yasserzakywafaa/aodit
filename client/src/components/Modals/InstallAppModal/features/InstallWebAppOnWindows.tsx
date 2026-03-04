import { InstallDesktopOutlined } from "@mui/icons-material";
import { Typography } from "@mui/material";

const InstallWebAppOnMacOs: React.FC = () => {
  return (
    <>
      <Typography variant="body1" textAlign="center">
        Install this app on your Windows computer and enjoy the desktop
        application functionality.
      </Typography>

      <br />

      <Typography variant="body1" textAlign="center">
        From
        <span className="bold"> Chrome </span> browser, at the top next to the
        URL, <br />
        simply click the <InstallDesktopOutlined color="primary" /> icon and
        then{" "}
        <Typography variant="button" color="primary" textTransform="capitalize">
          "Install"
        </Typography>
      </Typography>
    </>
  );
};

export default InstallWebAppOnMacOs;
