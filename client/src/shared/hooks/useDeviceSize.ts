import { useMediaQuery, useTheme } from "@mui/material";

const useDeviceSize = () => {
  const theme = useTheme();

  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "lg"));
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("xs"));

  return {
    isDesktop,
    isTablet,
    isMobile,
    isSmallMobile,
  };
};

export default useDeviceSize;
