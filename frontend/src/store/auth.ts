import type { Role } from "@/types/enum/app-enum";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserAuth {
  id: string;
  username: string;
  name: string;
  email?: string;
  phone?: string;
  role: Role;
}

type AuthStoreType = {
  user?: UserAuth;
  setUser: (user: UserAuth) => void;
  logout: () => void;
};

const useAuthStore = create<AuthStoreType>()(
  persist(
    (set) => ({
      user: undefined,
      setUser: (user) => set({ user }),
      logout: () => set({ user: undefined }),
    }),
    {
      name: "seee-partnership-management-auth-store",
      partialize: (state) => ({ user: state.user }),
    }
  )
);

export default useAuthStore;
