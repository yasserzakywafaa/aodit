import { Breadcrumbs, Link, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { hasAdminRights } from "src/shared/utils/getUserRoles";
import { useApplicationContext } from "src/application/store/Provider";
import { useDashboardReportContext } from "src/Pages/Dashboard/DashboardReport/store/Provider";
import { useDashboardUserContext } from "src/Pages/Dashboard/Admin/DashboardAdminUser/store/Provider";

const SEGMENT_LABEL_KEYS: Record<string, string> = {
  dashboard: "breadcrumbs.dashboard",
  reports: "breadcrumbs.reports",
  agents: "breadcrumbs.agents",
  demos: "breadcrumbs.demos",
  users: "breadcrumbs.users",
  profile: "breadcrumbs.profile",
  create: "breadcrumbs.create",
};

const DashboardBreadcrumbs = () => {
  const { t } = useTranslation("dashboard");
  const navigate = useNavigate();
  const location = useLocation();
  const {
    store: {
      state: {
        auth: { user },
      },
    },
  } = useApplicationContext();

  let userContext;
  const isAdmin = hasAdminRights(user);

  try {
    userContext = useDashboardUserContext();
  } catch {
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

  const isObjectId = (segment: string) => {
    return /^[0-9a-fA-F]{24}$/.test(segment);
  };

  const getBreadcrumbLabel = (
    segment: string,
    index: number,
    segments: string[],
  ): string => {
    if (
      isObjectId(segment) &&
      userContext?.store.state.user &&
      segments[index - 1] === "users"
    ) {
      const breadcrumbUser = userContext.store.state.user;
      return `${breadcrumbUser.name.givenName} ${breadcrumbUser.name.familyName}`;
    }

    if (!isAdmin && segment === "users") {
      return "";
    }

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

    const labelKey = SEGMENT_LABEL_KEYS[segment];
    if (labelKey) {
      return t(labelKey);
    }

    return segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

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
    <Breadcrumbs aria-label={t("aria.breadcrumb")}>
      {breadcrumbs.map((crumb, index) => {
        if (!crumb) return;

        if (crumb.isLast) {
          return (
            <Typography
              key={index}
              variant="body1"
              sx={{
                color: "text.primary",
              }}
            >
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
