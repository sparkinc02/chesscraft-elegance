export interface UserData {
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

export interface LoginInput {
  email: string;
  password: string;
}

export interface SignupInput {
  email: string;
  userName: string;
  password: string;
  phone?: string;
}

export interface AuthResponse {
  user: UserData;
  accessToken: string;
}

export interface ApiResponse<T> {
  message: string;
  data: T;
}
