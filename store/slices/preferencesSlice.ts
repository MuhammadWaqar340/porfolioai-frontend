import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store";

export interface PreferencesState {
  targetRole: string;
  onboardingComplete: boolean;
  bannerDismissed: boolean;
}

const initialState: PreferencesState = {
  targetRole: "",
  onboardingComplete: false,
  bannerDismissed: false,
};

const preferencesSlice = createSlice({
  name: "preferences",
  initialState,
  reducers: {
    setTargetRole: (state, action: PayloadAction<string>) => {
      state.targetRole = action.payload.trim();
    },
    dismissOnboardingBanner: (state) => {
      state.bannerDismissed = true;
    },
    markOnboardingComplete: (state) => {
      state.onboardingComplete = true;
      state.bannerDismissed = true;
    },
    resetOnboardingBanner: (state) => {
      state.bannerDismissed = false;
    },
    resetOnboardingProgress: (state) => {
      state.onboardingComplete = false;
      state.bannerDismissed = false;
    },
    resetPreferences: () => initialState,
    hydratePreferences: (
      state,
      action: PayloadAction<{
        target_role: string;
        onboarding_complete: boolean;
        onboarding_banner_dismissed: boolean;
      }>
    ) => {
      state.targetRole = action.payload.target_role;
      state.onboardingComplete = action.payload.onboarding_complete;
      state.bannerDismissed = action.payload.onboarding_banner_dismissed;
    },
  },
});

export const {
  setTargetRole,
  dismissOnboardingBanner,
  markOnboardingComplete,
  resetOnboardingBanner,
  resetOnboardingProgress,
  resetPreferences,
  hydratePreferences,
} = preferencesSlice.actions;

export const selectTargetRole = (state: RootState) => state.preferences.targetRole;

export const selectShouldShowOnboardingBanner = (state: RootState) =>
  !state.preferences.onboardingComplete && !state.preferences.bannerDismissed;

export default preferencesSlice.reducer;
