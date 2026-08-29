import { api } from "@/api/api";
import { useAuthStore } from "../store/useAuthStore";
import type {
  LoginDTO,
  RegisterDTO,
  ResetPasswordData,
  UpdateUserData,
} from "@/types/auth.type";

export const authService = {
  login: async (credentials: LoginDTO) => {
    const response = await api.post("/auth/login", credentials);
    const { user, token } = response.data;
    useAuthStore.getState().login(user, token);

    return response.data;
  },

  register: async (userData: RegisterDTO) => {
    const response = await api.post("/auth/register", userData);
    const { user, token } = response.data;
    useAuthStore.getState().login(user, token);

    return response.data;
  },

  refreshUser: async () => {
    const response = await api.get("/user/me");
    const user = response.data;

    useAuthStore.getState().setUpdatedUser(user);

    return user;
  },

  updateUser: async (updatedData: UpdateUserData) => {
    const response = await api.put("/user", updatedData);
    const user = response.data;

    useAuthStore.getState().setUpdatedUser(user);

    return user;
  },

  forgotPassword: async (email: string) => {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  },

  resetPassword: async (data: ResetPasswordData) => {
    const response = await api.post("/auth/reset-password", data);
    return response.data;
  },
};
