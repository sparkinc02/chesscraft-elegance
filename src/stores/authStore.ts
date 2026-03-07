import { create } from 'zustand';
import authService from '@/services/authService';
import type { AuthUser } from '@/types/auth.types';

export type User = AuthUser;

export interface Order {
  id: string;
  date: string;
  status: 'Processing' | 'In Transit' | 'Delivered' | 'Cancelled';
  items: { id: number; name: string; emoji: string; category: string; price: number; qty: number }[];
  subtotal: number;
  shipping: number;
  gst: number;
  grandTotal: number;
  paymentMethod: string;
  deliveryAddress: {
    name: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    pin: string;
    phone: string;
  };
  trackingSteps: { label: string; date: string; done: boolean }[];
}

const mockUsers: (User & { password: string })[] = [
  { id: '1', name: 'Arjun Mehta', email: 'arjun@chess.com', phone: '9876543210', password: 'admin123', role: 'admin' },
  { id: '2', name: 'Priya Nair', email: 'priya@chess.com', phone: '9876543211', password: 'user123', role: 'user' },
];

const mockOrders: Order[] = [
  {
    id: 'CC-A1B2C3',
    date: '2026-02-20',
    status: 'Delivered',
    items: [
      { id: 1, name: 'Grandmaster Rosewood Set', emoji: '♟', category: 'Chess Sets', price: 8499, qty: 1 },
      { id: 4, name: 'DGT 3000 Chess Clock', emoji: '⏱', category: 'Accessories', price: 2899, qty: 1 },
    ],
    subtotal: 11398, shipping: 0, gst: 2052, grandTotal: 13450, paymentMethod: 'UPI',
    deliveryAddress: { name: 'Arjun Mehta', address1: '42 Chess Lane', address2: 'T. Nagar', city: 'Chennai', state: 'Tamil Nadu', pin: '600017', phone: '+91 98765 43210' },
    trackingSteps: [
      { label: 'Order Placed', date: 'Feb 20, 2026', done: true },
      { label: 'Confirmed', date: 'Feb 20, 2026', done: true },
      { label: 'Shipped', date: 'Feb 22, 2026', done: true },
      { label: 'Delivered', date: 'Feb 25, 2026', done: true },
    ],
  },
  {
    id: 'CC-D4E5F6',
    date: '2026-02-28',
    status: 'In Transit',
    items: [
      { id: 7, name: 'My System — Nimzowitsch', emoji: '📖', category: 'Books', price: 549, qty: 2 },
    ],
    subtotal: 1098, shipping: 0, gst: 198, grandTotal: 1296, paymentMethod: 'Credit/Debit Card',
    deliveryAddress: { name: 'Arjun Mehta', address1: '42 Chess Lane', address2: 'T. Nagar', city: 'Chennai', state: 'Tamil Nadu', pin: '600017', phone: '+91 98765 43210' },
    trackingSteps: [
      { label: 'Order Placed', date: 'Feb 28, 2026', done: true },
      { label: 'Confirmed', date: 'Feb 28, 2026', done: true },
      { label: 'Shipped', date: 'Mar 1, 2026', done: true },
      { label: 'Out for Delivery', date: 'Expected Mar 3', done: false },
    ],
  },
  {
    id: 'CC-G7H8I9',
    date: '2026-03-01',
    status: 'Processing',
    items: [
      { id: 2, name: 'Walnut & Maple Board', emoji: '♜', category: 'Boards', price: 4299, qty: 1 },
      { id: 9, name: 'Chess Bag Deluxe', emoji: '🎒', category: 'Accessories', price: 1199, qty: 1 },
    ],
    subtotal: 5498, shipping: 0, gst: 990, grandTotal: 6488, paymentMethod: 'Cash on Delivery',
    deliveryAddress: { name: 'Arjun Mehta', address1: '42 Chess Lane', address2: 'T. Nagar', city: 'Chennai', state: 'Tamil Nadu', pin: '600017', phone: '+91 98765 43210' },
    trackingSteps: [
      { label: 'Order Placed', date: 'Mar 1, 2026', done: true },
      { label: 'Confirmed', date: 'Pending', done: false },
      { label: 'Shipped', date: 'Pending', done: false },
      { label: 'Delivered', date: 'Pending', done: false },
    ],
  },
];

const USE_API = !!import.meta.env.VITE_API_BASE_URL;

interface AuthStore {
  user: User | null;
  orders: Order[];
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, phone: string, password: string) => Promise<{ success: boolean; error?: string }>;
  googleLogin: (token: string) => Promise<{ success: boolean; error?: string }>;
  verifyEmail: (token: string) => Promise<{ success: boolean; error?: string }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (token: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateAddress: (address: User['address']) => void;
  getOrder: (id: string) => Order | undefined;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  orders: mockOrders,
  loading: false,

  login: async (email, password) => {
    if (USE_API) {
      try {
        set({ loading: true });
        const res = await authService.login({ email, password });
        if (res.success && res.user) {
          set({ user: res.user, loading: false });
          return { success: true };
        }
        set({ loading: false });
        return { success: false, error: res.message || 'Login failed' };
      } catch (e: any) {
        set({ loading: false });
        return { success: false, error: e.message || 'Login failed' };
      }
    }
    // Mock fallback
    const found = mockUsers.find((u) => u.email === email && u.password === password);
    if (found) {
      const { password: _, ...user } = found;
      set({ user });
      return { success: true };
    }
    return { success: false, error: 'Invalid email or password' };
  },

  signup: async (name, email, phone, password) => {
    if (USE_API) {
      try {
        set({ loading: true });
        const res = await authService.signup({ name, email, phone, password });
        if (res.success && res.user) {
          set({ user: res.user, loading: false });
          return { success: true };
        }
        set({ loading: false });
        return { success: false, error: res.message || 'Signup failed' };
      } catch (e: any) {
        set({ loading: false });
        return { success: false, error: e.message || 'Signup failed' };
      }
    }
    // Mock fallback
    if (mockUsers.find((u) => u.email === email)) {
      return { success: false, error: 'Email already registered' };
    }
    const newUser: User = { id: String(Date.now()), name, email, phone, role: 'user' };
    mockUsers.push({ ...newUser, password });
    set({ user: newUser });
    return { success: true };
  },

  googleLogin: async (token) => {
    if (USE_API) {
      try {
        set({ loading: true });
        const res = await authService.googleLogin({ token });
        if (res.success && res.user) {
          set({ user: res.user, loading: false });
          return { success: true };
        }
        set({ loading: false });
        return { success: false, error: res.message || 'Google login failed' };
      } catch (e: any) {
        set({ loading: false });
        return { success: false, error: e.message || 'Google login failed' };
      }
    }
    return { success: false, error: 'Google login not available in mock mode' };
  },

  verifyEmail: async (token) => {
    if (USE_API) {
      try {
        const res = await authService.verifyEmail({ token });
        return { success: res.success, error: res.message };
      } catch (e: any) {
        return { success: false, error: e.message || 'Verification failed' };
      }
    }
    // Mock: accept '123456'
    return token === '123456' ? { success: true } : { success: false, error: 'Incorrect OTP. Try again.' };
  },

  forgotPassword: async (email) => {
    if (USE_API) {
      try {
        const res = await authService.forgotPassword({ email });
        return { success: res.success, error: res.message };
      } catch (e: any) {
        return { success: false, error: e.message || 'Failed to send reset code' };
      }
    }
    return { success: true };
  },

  resetPassword: async (token, newPassword) => {
    if (USE_API) {
      try {
        const res = await authService.resetPassword({ token, newPassword });
        return { success: res.success, error: res.message };
      } catch (e: any) {
        return { success: false, error: e.message || 'Reset failed' };
      }
    }
    // Mock: accept '123456'
    return token === '123456' ? { success: true } : { success: false, error: 'Incorrect OTP. Try again.' };
  },

  logout: () => {
    authService.logout();
    set({ user: null });
  },

  updateAddress: (address) => set((s) => s.user ? { user: { ...s.user, address } } : {}),
  getOrder: (id) => get().orders.find((o) => o.id === id),
}));
