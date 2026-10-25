export interface RegisterDTO {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  password: string;
  city: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface PublicUser {
  id: string | number;
  first_name: string;
  last_name: string;
  created_at: string;
}

export interface User extends PublicUser {
  email: string;
  phone_number: string;
  city: string;
  updated_at: string;
}

export interface BroadcastOptions {
  broadcast?: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;

  login: (user: User, options?: BroadcastOptions) => void;
  logout: (options?: BroadcastOptions) => void;
  setUpdatedUser: (user: User, options?: BroadcastOptions) => void;
}

export type UpdateUserData = Partial<User>;

export interface ResetPasswordData {
  token: string;
  newPassword: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface AuthResponse {
  user: User;
}

export interface ActiveSession {
  id: string;
  browser: string;
  os: string;
  ip: string | null;
  created_at: string;
  last_used_at: string;
  is_current: boolean;
}

export interface MessageResponse {
  message: string;
}
