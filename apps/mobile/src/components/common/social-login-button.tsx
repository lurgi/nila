import { Pressable, StyleSheet, Text, View } from "react-native";
import type { ReactNode } from "react";
import { colors, radius, spacing, typography } from "@/src/theme/tokens";

type SocialLoginButtonVariant = "apple" | "google";

type SocialLoginButtonProps = {
  label: string;
  icon: ReactNode;
  variant: SocialLoginButtonVariant;
  onPress?: () => void;
};

export function SocialLoginButton({
  label,
  icon,
  variant,
  onPress,
}: SocialLoginButtonProps) {
  const isApple = variant === "apple";

  return (
    <Pressable
      style={[styles.baseButton, isApple ? styles.appleButton : styles.googleButton]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <View style={styles.content}>
        {icon}
        <Text style={isApple ? styles.appleButtonText : styles.googleButtonText}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  baseButton: {
    height: 54,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  appleButton: {
    backgroundColor: colors.appleButton,
  },
  googleButton: {
    backgroundColor: colors.googleButton,
    borderWidth: 1,
    borderColor: colors.border,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },
  appleButtonText: {
    color: colors.appleButtonText,
    fontSize: typography.button,
    fontFamily: typography.family.bold,
  },
  googleButtonText: {
    color: colors.googleButtonText,
    fontSize: typography.button,
    fontFamily: typography.family.semibold,
  },
});
