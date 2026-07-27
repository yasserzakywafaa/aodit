import { ReactNode, useEffect } from "react";

import { routes } from "src/application/routes";
import { useApplicationContext } from "src/application/store/Provider";
import { useNavigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const {
    store: {
      state: { auth },
    },
  } = useApplicationContext();

  useEffect(() => {
    if (!auth.isAuthenticated || !auth.user) {
      navigate(routes.auth.login, { replace: true });
    }
  }, [auth.isAuthenticated, auth.user, navigate]);

  if (!auth.isAuthenticated || !auth.user) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
