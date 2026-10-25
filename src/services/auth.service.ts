import { api } from "@/api/api";
import { queryClient } from "@/api/queryClient";
import { useAuthStore } from "../store/useAuthStore";
import type {
  ActiveSession,
  AuthResponse,
  ChangePasswordData,
  LoginDTO,
  MessageResponse,
  PublicUser,
  RegisterDTO,
  ResetPasswordData,
  UpdateUserData,
  User,
} from "@/types/auth.type";

export const authService = {
  login: async (credentials: LoginDTO): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>("/auth/login", credentials);
    useAuthStore.getState().login(data.user);
    return data;
  },

  register: async (userData: RegisterDTO): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>("/auth/register", userData);
    useAuthStore.getState().login(data.user);
    return data;
  },

  logout: async (): Promise<void> => {
    try {
      await api.post("/auth/logout");
    } catch {
      // Sign out locally even if the server doesn't respond
    } finally {
      useAuthStore.getState().logout();
    }
  },

  refreshUser: async (): Promise<User> => {
    const { data } = await api.get<User>("/user/me");
    useAuthStore.getState().setUpdatedUser(data);
    return data;
  },

  updateUser: async (updatedData: UpdateUserData): Promise<User> => {
    const { data } = await api.put<User>("/user", updatedData);
    useAuthStore.getState().setUpdatedUser(data);
    void queryClient.invalidateQueries({ queryKey: ["publicUser"] });
    return data;
  },

  deleteAccount: async (password: string): Promise<MessageResponse> => {
    const { data } = await api.delete<MessageResponse>("/user", {
      data: { password },
    });
    useAuthStore.getState().logout();
    return data;
  },

  changePassword: async (
    payload: ChangePasswordData,
  ): Promise<MessageResponse> => {
    const { data } = await api.post<MessageResponse>(
      "/auth/change-password",
      payload,
    );
    return data;
  },

  forgotPassword: async (email: string): Promise<MessageResponse> => {
    const { data } = await api.post<MessageResponse>("/auth/forgot-password", {
      email,
    });
    return data;
  },

  resetPassword: async (
    payload: ResetPasswordData,
  ): Promise<MessageResponse> => {
    const { data } = await api.post<MessageResponse>(
      "/auth/reset-password",
      payload,
    );
    if (useAuthStore.getState().user) {
      useAuthStore.getState().logout();
    }
    return data;
  },

  getSessions: async (): Promise<ActiveSession[]> => {
    const { data } = await api.get<{ sessions: ActiveSession[] }>(
      "/auth/sessions",
    );
    return data.sessions;
  },

  revokeSession: async (id: string): Promise<void> => {
    await api.delete(`/auth/sessions/${id}`);
  },

  revokeOtherSessions: async (): Promise<void> => {
    await api.delete("/auth/sessions");
  },

  getPublicUser: async (id: string): Promise<PublicUser> => {
    const { data } = await api.get<PublicUser>(`/user/${id}`);
    return data;
  },
};
