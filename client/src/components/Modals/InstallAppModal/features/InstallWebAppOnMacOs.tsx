import { IosShareOutlined } from "@mui/icons-material";
import { Typography } from "@mui/material";

const InstallWebAppOnMacOs: React.FC = () => {
  return (
    <>
      <Typography variant="body1" textAlign="center">
        Install this app on your Mac and enjoy the native application
        functionality.
      </Typography>

      <br />

      <Typography variant="body1" textAlign="center">
        From
        <span className="bold"> Safari </span> browser, <br />
        simply tap the <IosShareOutlined color="primary" /> icon and then
        <br />
        <Typography variant="button" color="primary" textTransform="capitalize">
          "Add to Dock"
        </Typography>
      </Typography>
    </>
  );
};

export default InstallWebAppOnMacOs;
