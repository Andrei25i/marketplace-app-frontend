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
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;

  login: (userData: User, userToken: string) => void;
  logout: () => void;
  setUpdatedUser: (updatedData: User) => void;
}

export type UpdateUserData = Partial<User>;

export interface ResetPasswordData {
  token: string;
  newPassword: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface RegisterResponse {
  message: string;
  user: Pick<User, "id" | "first_name" | "last_name" | "email" | "created_at">;
}

export interface MessageResponse {
  message: string;
}
