import { create } from "zustand";
import { persist } from "zustand/middleware";
import { apiClient } from "../api/client";

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      login: async (body) => {
        const res = await apiClient.post("/auth/login", body);
        const data = res.data.data;
        set({ token: data.accessToken, user: data.user ?? null });
        return data;
      },
      logout: () => set({ token: null, user: null }),
    }),
    { name: "peach-auth" },
  ),
);
