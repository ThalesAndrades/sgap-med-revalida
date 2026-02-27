import { create } from 'zustand';
import { User } from '../types';
import { authLogin, authLogout, authMe, AuthUser } from '../services/auth/authApi';

const PREFS_KEY = 'revalidaai_user_prefs_v1';

const loadPrefs = (): Record<string, any> => {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const savePrefs = (value: Record<string, any>) => {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(value));
  } catch {
    return;
  }
};

const mergeUser = (u: AuthUser | null): User | null => {
  if (!u) return null;
  const all = loadPrefs();
  const prefs = all[u.id];
  return {
    id: u.id,
    email: u.email,
    created_at: u.created_at,
    preferences: prefs
  };
};

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
  updatePreferences: (prefs: User['preferences']) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const u = await authLogin(email, password);
      set({ user: mergeUser(u), isLoading: false });
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Erro ao conectar com o servidor';
      set({ error: msg, isLoading: false });
    }
  },

  logout: async () => {
    await authLogout().catch(() => null);
    set({ user: null });
  },

  checkSession: async () => {
    const u = await authMe().catch(() => null);
    set({ user: mergeUser(u) });
  },

  updatePreferences: (prefs) => {
    set((state) => {
      if (!state.user) return state;
      const all = loadPrefs();
      all[state.user.id] = prefs;
      savePrefs(all);
      return { ...state, user: { ...state.user, preferences: prefs } };
    });
  }
}));
