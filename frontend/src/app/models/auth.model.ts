export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  type: string;
}

export interface User {
  email: string;
  role: string;
}
