import { useMediaQuery, useTheme } from "@mui/material";

const useDeviceSize = () => {
  const theme = useTheme();
  const queryOptions = { noSsr: true };

  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"), queryOptions);
  const isTablet = useMediaQuery(
    theme.breakpoints.between("sm", "lg"),
    queryOptions,
  );
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"), queryOptions);
  const isSmallMobile = useMediaQuery(
    theme.breakpoints.down("xs"),
    queryOptions,
  );

  return {
    isDesktop,
    isTablet,
    isMobile,
    isSmallMobile,
  };
};

export default useDeviceSize;
