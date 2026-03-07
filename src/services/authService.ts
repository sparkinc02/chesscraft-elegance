import apiClient from './apiClient';
import type {
  LoginRequest,
  SignupRequest,
  SendEmailOtpRequest,
  SendEmailOtpResponse,
  VerifyEmailOtpRequest,
  VerifyEmailOtpResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  AuthResponse,
  GenericResponse,
} from '@/types/auth.types';

const AUTH_PREFIX = '/auth';

export const authService = {
  async sendEmailOtp(data: SendEmailOtpRequest): Promise<SendEmailOtpResponse> {
    const res = await apiClient.post<SendEmailOtpResponse>(`${AUTH_PREFIX}/send-email-verification-otp`, data);
    return res.data;
  },

  async verifyEmailOtp(data: VerifyEmailOtpRequest): Promise<VerifyEmailOtpResponse> {
    const res = await apiClient.post<VerifyEmailOtpResponse>(`${AUTH_PREFIX}/verify-email`, data);
    return res.data;
  },

  async signup(data: SignupRequest): Promise<AuthResponse> {
    const res = await apiClient.post<AuthResponse>(`${AUTH_PREFIX}/signup`, data);
    if (res.data.data?.accessToken) {
      localStorage.setItem('auth_token', res.data.data.accessToken);
    }
    return res.data;
  },

  async login(data: LoginRequest): Promise<AuthResponse> {
    const res = await apiClient.post<AuthResponse>(`${AUTH_PREFIX}/login`, data);
    if (res.data.data?.accessToken) {
      localStorage.setItem('auth_token', res.data.data.accessToken);
    }
    return res.data;
  },

  async forgotPassword(data: ForgotPasswordRequest): Promise<GenericResponse> {
    const res = await apiClient.post<GenericResponse>(`${AUTH_PREFIX}/forgot-password`, data);
    return res.data;
  },

  async resetPassword(token: string, data: ResetPasswordRequest): Promise<GenericResponse> {
    const res = await apiClient.post<GenericResponse>(`${AUTH_PREFIX}/reset-password/${token}`, data);
    return res.data;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post(`${AUTH_PREFIX}/logout`);
    } catch {
      // silent — clear local state regardless
    }
    localStorage.removeItem('auth_token');
  },
};

export default authService;
