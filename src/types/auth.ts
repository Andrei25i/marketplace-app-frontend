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
