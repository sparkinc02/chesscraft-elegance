import apiClient from './apiClient';
import type {
  LoginRequest,
  SignupRequest,
  GoogleAuthRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  VerifyEmailRequest,
  AuthResponse,
} from '@/types/auth.types';

const AUTH_PREFIX = '/auth';

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const res = await apiClient.post<AuthResponse>(`${AUTH_PREFIX}/login`, data);
    if (res.data.token) {
      localStorage.setItem('auth_token', res.data.token);
    }
    return res.data;
  },

  async signup(data: SignupRequest): Promise<AuthResponse> {
    const res = await apiClient.post<AuthResponse>(`${AUTH_PREFIX}/signup`, data);
    if (res.data.token) {
      localStorage.setItem('auth_token', res.data.token);
    }
    return res.data;
  },

  async googleLogin(data: GoogleAuthRequest): Promise<AuthResponse> {
    const res = await apiClient.post<AuthResponse>(`${AUTH_PREFIX}/google`, data);
    if (res.data.token) {
      localStorage.setItem('auth_token', res.data.token);
    }
    return res.data;
  },

  async verifyEmail(data: VerifyEmailRequest): Promise<AuthResponse> {
    const res = await apiClient.post<AuthResponse>(`${AUTH_PREFIX}/verify-email`, data);
    return res.data;
  },

  async forgotPassword(data: ForgotPasswordRequest): Promise<AuthResponse> {
    const res = await apiClient.post<AuthResponse>(`${AUTH_PREFIX}/forgot-password`, data);
    return res.data;
  },

  async resetPassword(data: ResetPasswordRequest): Promise<AuthResponse> {
    const res = await apiClient.post<AuthResponse>(`${AUTH_PREFIX}/reset-password`, data);
    return res.data;
  },

  logout() {
    localStorage.removeItem('auth_token');
  },
};

export default authService;
