export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface GoogleAuthRequest {
  token: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'user';
  address?: {
    address1: string;
    address2: string;
    city: string;
    state: string;
    pin: string;
  };
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: AuthUser;
  token?: string;
}
