import { create } from 'zustand';

interface AuthState {
  user: any | null;
  token: string | null;
  isUnauthorized: boolean;
  setUser: (user: any) => void;
  setToken: (token: string) => void;
  setIsUnauthorized: (val: boolean) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isUnauthorized: false,
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  setIsUnauthorized: (val) => set({ isUnauthorized: val }),
  reset: () => set({ user: null, token: null, isUnauthorized: false }),
}));
