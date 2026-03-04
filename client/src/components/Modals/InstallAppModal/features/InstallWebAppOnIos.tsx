import { IosShareOutlined } from "@mui/icons-material";
import { Typography } from "@mui/material";

const InstallWebAppOnIos: React.FC = () => {
  return (
    <>
      <Typography variant="body1" textAlign="center">
        Install this app on your iPhone or iPad and enjoy the mobile application
        functionality.
      </Typography>

      <br />

      <Typography variant="body1" textAlign="center">
        From
        <span className="bold"> Safari </span> browser, <br />
        simply tap the <IosShareOutlined color="primary" /> icon and then
        <Typography variant="body1" color="primary">
          "Add to Home Screen"
        </Typography>
      </Typography>
    </>
  );
};

export default InstallWebAppOnIos;
