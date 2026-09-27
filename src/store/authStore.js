import { create } from "zustand";
import { loginUser, registerUser, fetchCurrentUser } from "../services/api/authApi";

export const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem("satquery_token") || null,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const data = await loginUser(email, password);
      localStorage.setItem("satquery_token", data.access_token);
      set({ token: data.access_token });
      await get().fetchUser();
    } catch (err) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  register: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      await registerUser(name, email, password);
      // Auto login after register
      await get().login(email, password);
    } catch (err) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  fetchUser: async () => {
    const token = get().token;
    if (!token) {
        set({ isLoading: false });
        return;
    }
    
    set({ isLoading: true, error: null });
    try {
      const user = await fetchCurrentUser(token);
      set({ user, isLoading: false });
    } catch (err) {
      localStorage.removeItem("satquery_token");
      set({ user: null, token: null, error: err.message, isLoading: false });
    }
  },

  logout: () => {
    localStorage.removeItem("satquery_token");
    set({ user: null, token: null });
  },
}));
