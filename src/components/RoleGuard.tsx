import type { ReactNode } from "react";
import { useAuthStore } from "../stores/auth_store";
import { Navigate } from "react-router";
import type { Role } from "../features/auth/data/role";

const RoleGuard = ({ children, roles }: { children: ReactNode, roles: Role[] }) => {
  const { user } = useAuthStore();

  if (!user?.role || !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return <>{children}</>;
};

export default RoleGuard;