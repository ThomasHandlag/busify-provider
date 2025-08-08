
import { useEffect, type ReactNode } from "react";
import { useAuthStore } from "../../stores/auth_store";
import { useNavigate } from "react-router";


const AppLayout = ({ children }: { children: ReactNode }) => {
  const { accessToken } = useAuthStore();

  const navigate = useNavigate();

  useEffect(() => {
    if (!accessToken) {
      navigate("login");
    } else {
      navigate("dashboard");
    }
  }, [accessToken, navigate]);

  return (
    <div className="app-layout">
      <main className="w-full h-full">{children}</main>
    </div>
  );
};

export default AppLayout;
