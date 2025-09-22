import type { User } from "../../stores/auth_store";
import apiClient from "./index";

export const login = async (credentials: {
  username: string;
  password: string;
}): Promise<
  { accessToken: string; refreshToken: string; user: User } | undefined
> => {
  const response = await apiClient.post("/api/auth/login", credentials);
  if (response.data.code === 200) {
    const result = response.data.result;

    return {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      user: {
        email: result.email,
        role: result.role,
        userId: 1,
      },
    };
  }

  const message = response.data.message || "Unknown error";

  console.error("Login failed:", response);
  throw new Error(message);
};

export const signup = async (userData: {
  username: string;
  password: string;
  email: string;
}) => {
  const response = await apiClient.post("api/auth/signup", userData);
  return response.data;
};
