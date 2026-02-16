export const ROOT_INITIAL_ROUTE = "index";

export const ROOT_STACK_OPTIONS = {
  index: { headerShown: false },
  tabs: { headerShown: false },
  modal: { presentation: "modal" as const },
} as const;
