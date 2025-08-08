import type { LoggedInUser } from "../../stores/auth_store";
import apiClient from "./index";

export const login = async (credentials: {
  username: string;
  password: string;
}): Promise<
  | { accessToken: string; refreshToken: string; loggedInUser: LoggedInUser }
  | undefined
> => {
  const response = await apiClient.post("api/auth/login", credentials);
  if (!response.data || !response.data.result) {
    throw new Error("Login failed");
  }

  const result = response.data.result;
  return {
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
    loggedInUser: {
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
