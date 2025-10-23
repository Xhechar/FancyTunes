import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthService } from "../services/auth.service";

export const UserGuard = ({ children }: { children: React.ReactNode }) => {
  const [isUser, setIsUser] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    let mounted = true;
    setIsUser(null);
    AuthService.AuthenticateUser()
      .then((result) => {
        if (!mounted) return;
        setIsUser(Boolean(result?.success && result.role === "user"));
      })
      .catch(() => {
        if (!mounted) return;
        setIsUser(false);
      });

    return () => {
      mounted = false;
    };
  }, [location.pathname]);

  if (isUser === null) {
    return null;
  }

  return isUser ? <>{children}</> : <Navigate to="/login" replace />;
};