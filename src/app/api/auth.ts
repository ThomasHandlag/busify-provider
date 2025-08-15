import type { User } from "../../stores/auth_store";
import apiClient from "./index";

export const login = async (credentials: {
  username: string;
  password: string;
}): Promise<
  | { accessToken: string; refreshToken: string; user: User }
  | undefined
> => {
  const response = await apiClient.post("api/auth/login", credentials);
  if (response.status !== 200) {
    console.error("Login failed:", response);
    throw new Error("Login failed");
  }

  const result = response.data.result;
  return {
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
    user: {
      email: result.email,
      role: result.role,
      userId: 1
    },
  };
};

export const signup = async (userData: {
  username: string;
  password: string;
  email: string;
}) => {
  const response = await apiClient.post("api/auth/signup", userData);
  return response.data;
};
