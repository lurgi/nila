export const ROOT_INITIAL_ROUTE = "index";
export const ONBOARDING_PROFILE_SETUP_ROUTE = "onboarding/profile-setup";

export const ROOT_STACK_OPTIONS = {
  index: { headerShown: false },
  [ONBOARDING_PROFILE_SETUP_ROUTE]: { headerShown: false },
} as const;
