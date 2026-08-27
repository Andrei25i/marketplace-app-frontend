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

export interface User {
  id: string | number;
  first_name: string;
  last_name: string;
  email: string;
  city: string;
  created_at: string;
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
