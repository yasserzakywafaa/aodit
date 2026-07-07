import { Breadcrumbs, Link, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

import { hasAdminRights } from "src/shared/utils/getUserRoles";
import { useApplicationContext } from "src/application/store/Provider";
import { useDashboardReportContext } from "src/Pages/Dashboard/DashboardReport/store/Provider";
import { useDashboardUserContext } from "src/Pages/Dashboard/Admin/DashboardAdminUser/store/Provider";

const DashboardBreadcrumbs = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    store: {
      state: {
        auth: { user },
      },
    },
  } = useApplicationContext();

  // Try to get user context (will be undefined if not in user page)
  let userContext;
  const isAdmin = hasAdminRights(user);

  try {
    userContext = useDashboardUserContext();
  } catch {
    // Not in user context, that's fine
    userContext = null;
  }

  const reportContext = useDashboardReportContext();

  const pathSegments = location.pathname
    .split("/")
    .filter((segment) => segment !== "");

  const handleClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    path: string,
  ) => {
    event.preventDefault();
    navigate(path);
  };

  // Check if a segment looks like a MongoDB ObjectId (24 hex characters)
  const isObjectId = (segment: string) => {
    return /^[0-9a-fA-F]{24}$/.test(segment);
  };

  // Get the label for a breadcrumb segment
  const getBreadcrumbLabel = (
    segment: string,
    index: number,
    segments: string[],
  ): string => {
    // Check if this segment is a user ID and we have user context
    if (
      isObjectId(segment) &&
      userContext?.store.state.user &&
      segments[index - 1] === "users"
    ) {
      // Replace user ID with user name
      const user = userContext.store.state.user;
      return `${user.name.givenName} ${user.name.familyName}`;
    }

    if (!isAdmin && segment === "users") {
      return "";
    }

    // Check if this segment is a report ID and we have report context
    if (
      isObjectId(segment) &&
      reportContext?.store.state.report?.name &&
      segments[index - 1] === "reports"
    ) {
      return reportContext.store.state.report.name;
    }

    if (segment === "admin") {
      return "";
    }

    // Format label: capitalize first letter and replace hyphens with spaces
    return segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Build breadcrumbs progressively from URL segments
  const buildBreadcrumbs = () => {
    let currentPath = "";

    return pathSegments.map((segment, index) => {
      if (segment === "admin" || (!isAdmin && segment === "users")) {
        return undefined;
      }

      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;

      return {
        label: getBreadcrumbLabel(segment, index, pathSegments),
        path: currentPath,
        isLast,
      };
    });
  };

  const breadcrumbs = buildBreadcrumbs().filter((crumb) => crumb !== undefined);

  if (breadcrumbs.length === 0) {
    return null;
  }

  return (
    <Breadcrumbs aria-label="breadcrumb">
      {breadcrumbs.map((crumb, index) => {
        if (!crumb) return;

        if (crumb.isLast) {
          return (
            <Typography key={index} variant="body1" sx={{
              color: "text.primary"
            }}>
              {crumb.label}
            </Typography>
          );
        }

        return (
          <Link
            key={index}
            component="a"
            variant="body1"
            underline="hover"
            color="inherit"
            onClick={(e) => handleClick(e, crumb.path)}
              sx={{
              cursor: "pointer",
              "&:hover": {
                color: "primary.main",
              },
            }}
          >
            {crumb.label}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
};

export default DashboardBreadcrumbs;
