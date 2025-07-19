export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
    id: string;
    username: string;
    email: string;
    role: string;
    token:string
}