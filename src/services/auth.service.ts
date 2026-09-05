import { api } from "@/api/api";
import { useAuthStore } from "../store/useAuthStore";
import type {
  AuthResponse,
  LoginDTO,
  MessageResponse,
  PublicUser,
  RegisterDTO,
  RegisterResponse,
  ResetPasswordData,
  UpdateUserData,
  User,
} from "@/types/auth.type";

export const authService = {
  login: async (credentials: LoginDTO): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/login", credentials);
    const { user, token } = response.data;
    useAuthStore.getState().login(user, token);

    return response.data;
  },

  register: async (userData: RegisterDTO): Promise<AuthResponse> => {
    await api.post<RegisterResponse>("/auth/register", userData);

    return await authService.login({
      email: userData.email,
      password: userData.password,
    });
  },

  refreshUser: async (): Promise<User> => {
    const response = await api.get<User>("/user/me");
    const user = response.data;

    useAuthStore.getState().setUpdatedUser(user);

    return user;
  },

  updateUser: async (updatedData: UpdateUserData): Promise<User> => {
    const response = await api.put<User>("/user", updatedData);
    const user = response.data;

    useAuthStore.getState().setUpdatedUser(user);

    return user;
  },

  deleteAccount: async (password: string): Promise<MessageResponse> => {
    const response = await api.delete<MessageResponse>("/user", {
      data: { password },
    });

    useAuthStore.getState().logout();

    return response.data;
  },

  forgotPassword: async (email: string): Promise<MessageResponse> => {
    const response = await api.post<MessageResponse>("/auth/forgot-password", {
      email,
    });
    return response.data;
  },

  resetPassword: async (data: ResetPasswordData): Promise<MessageResponse> => {
    const response = await api.post<MessageResponse>(
      "/auth/reset-password",
      data,
    );
    return response.data;
  },

  getPublicUser: async (id: string): Promise<PublicUser> => {
    const response = await api.get<PublicUser>(`/user/${id}`);
    return response.data;
  },
};
