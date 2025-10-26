import { Navigate, useLocation } from "react-router-dom";
import { getAuthToken, isTokenExpired } from "@/utils/auth";

export default function RequireAuth({ children }: { children: JSX.Element }) {
  const token = getAuthToken();
  const location = useLocation();

  if (!token || isTokenExpired(token)) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  return children;
}
