import { create } from 'zustand';
import { User } from '../types';
import { mockDB } from '../services/mock/db';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (crm: string, password: string) => Promise<void>;
  logout: () => void;
  checkSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,

  login: async (crm, password) => {
    set({ isLoading: true, error: null });
    try {
      const { user, error } = await mockDB.login(crm, password);
      if (error) {
        set({ error, isLoading: false });
      } else {
        set({ user, isLoading: false });
      }
    } catch (e) {
      set({ error: 'Erro ao conectar com o servidor', isLoading: false });
    }
  },

  logout: async () => {
    await mockDB.logout();
    set({ user: null });
  },

  checkSession: () => {
    const user = mockDB.getCurrentUser();
    set({ user });
  }
}));
