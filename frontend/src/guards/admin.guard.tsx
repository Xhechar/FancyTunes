import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";

export const AdminGuard = ({ children }: { children: ReactNode }) => {
  const isAdmin = true; // Replace with actual admin role check logic

  return isAdmin ? <>{children}</> : <Navigate to="/not-authorized" replace />;
};