export const AUTH_LOGIN_ROUTE = "(auth)/login";
export const ONBOARDING_PROFILE_SETUP_ROUTE = "(onboarding)/profile-setup";
export const APP_HOME_ROUTE = "(app)";
export const ROOT_INITIAL_ROUTE = AUTH_LOGIN_ROUTE;

export const ROOT_STACK_OPTIONS = {
  [AUTH_LOGIN_ROUTE]: { headerShown: false },
  [ONBOARDING_PROFILE_SETUP_ROUTE]: { headerShown: false },
  [APP_HOME_ROUTE]: { headerShown: false },
} as const;
