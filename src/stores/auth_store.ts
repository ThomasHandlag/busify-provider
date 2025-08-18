import type { NavigateFunction } from "react-router";
import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { login } from "../app/api/auth";
import type { Role } from "../features/auth/data/role";

export interface User {
  role: Role;
  userId: number;
  email: string;
}

export interface AuthState {
  user?: User;
  accessToken: string;
  refreshToken: string;
  loading: boolean;
  error: string | null;
  login: ({
    username,
    password,
    navigate,
  }: {
    username: string;
    password: string;
    navigate: NavigateFunction;
  }) => Promise<void>;
  logOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => {
        return {
          // Set mock data để luôn ở trạng thái đã đăng nhập
          accessToken: "mock_token",
          refreshToken: "mock_refresh_token",
          user: {
            role: "STAFF",
            userId: 1,
            email: "staff@example.com"
          },
          loading: false,
          error: null,
          login: async ({ username, password, navigate }) => {
            try {
              set(
                {
                  user: undefined,
                  accessToken: "",
                  refreshToken: "",
                },
                false,
                { type: "@AUTH/LOGIN/LOADING" }
              );

              const response = await login({
                username,
                password,
              });

              console.log(response);

              set(
                {
                  accessToken: response?.accessToken,
                  refreshToken: response?.refreshToken,
                  user: response?.user as User,
                  loading: false,
                  error: null,
                },
                false,
                { type: "@AUTH/LOGIN/SUCCESS" }
              );
              navigate("/dashboard");
            } catch (error) {
              console.error("Login error:", error);
              set(
                {
                  error:
                    error instanceof Error ? error.message : "Login failed",
                  accessToken: "",
                  refreshToken: "",
                  user: undefined,
                },
                false,
                {
                  type: "@AUTH/LOGIN/ERROR",
                }
              );
            }
          },

          logOut: async () => {
            set({
              accessToken: "",
              refreshToken: "",
              user: undefined,
            });
          },
        };
      },
      {
        name: "auth-storage",
      }
    )
  )
);
