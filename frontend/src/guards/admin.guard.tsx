import React, { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { AuthService } from "../services/auth.service";

export const AdminGuard = ({ children }: { children: ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    console.log("AdminGuard mounted");
    let mounted = true;
    AuthService.AuthenticateAdmin()
      .then((result) => {
        if (!mounted) return;
        setIsAdmin(!!(result?.success && result?.role === "admin"));
      })
      .catch(() => {
        if (mounted) setIsAdmin(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (isAdmin === null) return null;

  return isAdmin ? <>{children}</> : <Navigate to="/login" replace />;
};