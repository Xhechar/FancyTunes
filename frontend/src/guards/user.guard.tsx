import { Navigate } from "react-router-dom";

export const UserGuard = ({ children }: { children: React.ReactNode }) => {
  const isUser = true; // Replace with actual user role check logic

  return isUser ? <>{children}</> : <Navigate to="/not-authorized" replace />;
};