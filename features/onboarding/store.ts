import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { OnboardingSchema } from "@/features/onboarding/schema";

type OnboardingState = Partial<OnboardingSchema> & {
  setData: (data: Partial<OnboardingSchema>) => void;
  reset: () => void;
};

export const useOnboardingState = create<OnboardingState>()(
  persist(
    (set) => ({
      setData: (data) => set((state) => ({ ...state, ...data })),
      reset: () =>
        set((state) => ({
          setData: state.setData,
          reset: state.reset,
        })),
    }),
    {
      name: "onboarding-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => {
        // Exclude functions from being stored
        const { setData, reset, ...rest } = state;
        return rest;
      },
    }
  )
);
