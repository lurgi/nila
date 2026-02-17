export const colors = {
  background: "#f4f6fb",
  surface: "#ffffff",
  textPrimary: "#0f172a",
  textSecondary: "#64748b",
  border: "#d9e0ea",
  inputBorderFocus: "#2563eb",
  inputBorderError: "#ef4444",
  inputPlaceholder: "#94a3b8",
  buttonDisabled: "#cbd5e1",
  errorText: "#dc2626",
  appleButton: "#111111",
  appleButtonText: "#ffffff",
  googleButton: "#ffffff",
  googleButtonText: "#0f172a",
} as const;

export const spacing = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
} as const;

export const radius = {
  md: 12,
  lg: 18,
  xl: 24,
  full: 999,
} as const;

export const typography = {
  family: {
    regular: "NotoSerifKR-Regular",
    semibold: "NotoSerifKR-SemiBold",
    bold: "NotoSerifKR-Bold",
  },
  title: 30,
  body: 15,
  button: 17,
  label: 14,
  helper: 13,
} as const;
