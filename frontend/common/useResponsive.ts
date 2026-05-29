import { useMediaQuery } from "react-responsive";

const breakpoints = {
  mobile: "(max-width: 767px)",
  tablet: "(min-width: 768px) and (max-width: 1024px)",
  desktop: "(min-width: 1025px) and (max-width: 1199px)",
  largeScreen: "(min-width: 1200px)",
};

const useResponsive = () => {
  const isMobile = useMediaQuery({ query: breakpoints.mobile });
  const isTablet = useMediaQuery({ query: breakpoints.tablet });
  const isDesktop = useMediaQuery({ query: breakpoints.desktop });
  const isLargeScreen = useMediaQuery({ query: breakpoints.largeScreen });

  return { isMobile, isTablet, isDesktop, isLargeScreen };
};

export default useResponsive;
