import "./InstallAppModal.scss";

import { Box, Dialog, DialogContent } from "@mui/material";

import InstallWebAppOnAndroid from "./features/InstallWebAppOnAndroid";
import InstallWebAppOnIos from "./features/InstallWebAppOnIos";
import InstallWebAppOnMacOs from "./features/InstallWebAppOnMacOs";
import { useDetectBrowserType } from "src/shared/hooks/useDetectBrowserType";
import InstallWebAppOnWindows from "./features/InstallWebAppOnWindows";

interface InstallAppModalProps {
  isInstallAppDialogOpen: boolean;
  setIsInstallAppDialogOpen: (isDialogOpen: boolean) => void;
}

export const InstallAppModal = (props: InstallAppModalProps) => {
  const { isInstallAppDialogOpen, setIsInstallAppDialogOpen } = props;
  const { isAndroid, isIos, isMacOs, isWindows } = useDetectBrowserType();

  const handleOnDialogClose = () => setIsInstallAppDialogOpen(false);

  return (
    <Box className="install-app-popup">
      <Dialog open={isInstallAppDialogOpen} onClose={handleOnDialogClose}>
        {/* <DialogTitle>Install App</DialogTitle> */}

        <DialogContent>
          {isAndroid && <InstallWebAppOnAndroid />}

          {isIos && <InstallWebAppOnIos />}

          {isMacOs && <InstallWebAppOnMacOs />}

          {isWindows && <InstallWebAppOnWindows />}
        </DialogContent>
      </Dialog>
    </Box>
  );
};
