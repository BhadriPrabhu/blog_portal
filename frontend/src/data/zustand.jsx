import { create } from 'zustand'
import { persist } from "zustand/middleware"

export const useStore = create(
    persist((set) => ({
        profileData: {},
        setProfileData: (data) => set({ profileData: data }),
        isAuth: false,
        setIsAuth: (value) => set({ isAuth: value }),
        refreshTrigger: 0,
        setTriggerRefresh: () => set((state) => ({refreshTrigger: state.refreshTrigger + 1})),
    })),
    {
        name: "Profile_storage",
    }
);