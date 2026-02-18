import { StyleSheet, Text, TextInput, View } from "react-native";
import { colors, radius, spacing, typography } from "@/src/theme/tokens";

type ProfileSetupInputState = "default" | "focused" | "error";

type ProfileSetupNameInputViewProps = {
  value?: string;
  placeholder?: string;
  countText?: string;
  maxLength?: number;
  state?: ProfileSetupInputState;
  errorMessage?: string;
  onChangeText?: (text: string) => void;
};

const getBorderColor = (state: ProfileSetupInputState) => {
  if (state === "error") {
    return colors.inputBorderError;
  }
  if (state === "focused") {
    return colors.inputBorderFocus;
  }
  return colors.border;
};

export function ProfileSetupNameInputView({
  value,
  placeholder,
  countText,
  maxLength = 30,
  state = "default",
  errorMessage,
  onChangeText,
}: ProfileSetupNameInputViewProps) {
  return (
    <View style={styles.container}>
      <View style={[styles.inputShell, { borderColor: getBorderColor(state) }]}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.inputPlaceholder}
          style={styles.input}
          autoCapitalize="none"
          autoCorrect={false}
          maxLength={maxLength}
        />
        <Text style={styles.count}>{countText}</Text>
      </View>
      {state === "error" && errorMessage ? (
        <Text style={styles.error}>{errorMessage}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  inputShell: {
    minHeight: 58,
    borderWidth: 1,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: typography.button,
    fontFamily: typography.family.regular,
    lineHeight: 22,
    paddingVertical: 0,
  },
  count: {
    color: colors.textSecondary,
    fontSize: typography.helper,
    fontFamily: typography.family.regular,
    minWidth: 34,
    textAlign: "right",
  },
  error: {
    color: colors.errorText,
    fontSize: typography.helper,
    fontFamily: typography.family.regular,
    paddingHorizontal: spacing.xs,
  },
});
