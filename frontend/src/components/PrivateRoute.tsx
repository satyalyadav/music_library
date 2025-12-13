import React, { ReactNode } from "react";
import { useAuth } from "../contexts/AuthContext";

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { loading } = useAuth();

  // For local-first app, no authentication required
  // Just show loading state if needed
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return <>{children}</>;
};

export default PrivateRoute;
