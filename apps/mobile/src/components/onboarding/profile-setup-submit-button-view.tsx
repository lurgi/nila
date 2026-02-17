import { Pressable, StyleSheet, Text } from "react-native";
import { colors, radius, typography } from "@/src/theme/tokens";

type ProfileSetupSubmitButtonViewProps = {
  label: string;
  disabled?: boolean;
  onPress?: () => void;
};

export function ProfileSetupSubmitButtonView({
  label,
  disabled,
  onPress,
}: ProfileSetupSubmitButtonViewProps) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={[styles.button, disabled ? styles.buttonDisabled : styles.buttonEnabled]}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Text
        style={[
          styles.label,
          disabled ? styles.labelDisabled : styles.labelEnabled,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 54,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonEnabled: {
    backgroundColor: colors.appleButton,
  },
  buttonDisabled: {
    backgroundColor: colors.buttonDisabled,
  },
  label: {
    fontSize: typography.button,
    fontFamily: typography.family.semibold,
  },
  labelEnabled: {
    color: colors.appleButtonText,
  },
  labelDisabled: {
    color: colors.surface,
  },
});
