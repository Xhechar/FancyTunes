import React, {ReactNode} from "react";
import { Navigate } from "react-router-dom";

export const AuthGuard = ({ children }: { children: ReactNode}) => {
  const isAuthenticated = true; // Replace with actual authentication logic

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}