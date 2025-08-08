import type { ReactNode } from "react";
import { useAuthStore } from "../stores/auth_store";
import { Navigate } from "react-router";

const RoleGuard = ({ children }: { children: ReactNode }) => {
  const { loggedInUser: user } = useAuthStore();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default RoleGuard;
