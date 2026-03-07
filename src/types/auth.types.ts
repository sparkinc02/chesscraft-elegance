export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  userName: string;
  password: string;
  phone?: string;
}

export interface SendEmailOtpRequest {
  email: string;
}

export interface SendEmailOtpResponse {
  message: string;
  data: {
    otpToken: string;
  };
}

export interface VerifyEmailOtpRequest {
  otp: string;
  token: string;
}

export interface VerifyEmailOtpResponse {
  message: string;
  data: {
    email: string;
  };
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  newPassword: string;
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
  message: string;
  data: {
    user: AuthUser;
    accessToken: string;
  };
}

export interface GenericResponse {
  message: string;
}
