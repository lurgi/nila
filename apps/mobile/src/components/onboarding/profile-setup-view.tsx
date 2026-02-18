import { StyleSheet, View } from "react-native";
import { ProfileSetupHeaderView } from "@/src/components/onboarding/profile-setup-header-view";
import { ProfileSetupNameInputView } from "@/src/components/onboarding/profile-setup-name-input-view";
import { ProfileSetupSubmitButtonView } from "@/src/components/onboarding/profile-setup-submit-button-view";
import { colors, spacing } from "@/src/theme/tokens";

type ProfileSetupInputState = "default" | "focused" | "error";

type ProfileSetupViewProps = {
  title: string;
  description: string;
  value?: string;
  placeholder?: string;
  countText?: string;
  inputMaxLength?: number;
  inputState?: ProfileSetupInputState;
  errorMessage?: string;
  submitLabel: string;
  submitDisabled?: boolean;
  onChangeValue?: (text: string) => void;
  onSubmitPress?: () => void;
};

export function ProfileSetupView({
  title,
  description,
  value,
  placeholder,
  countText,
  inputMaxLength,
  inputState = "default",
  errorMessage,
  submitLabel,
  submitDisabled,
  onChangeValue,
  onSubmitPress,
}: ProfileSetupViewProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <ProfileSetupHeaderView title={title} description={description} />
        <ProfileSetupNameInputView
          value={value}
          placeholder={placeholder}
          countText={countText}
          maxLength={inputMaxLength}
          state={inputState}
          errorMessage={errorMessage}
          onChangeText={onChangeValue}
        />
      </View>

      <View style={styles.submitSection}>
        <ProfileSetupSubmitButtonView
          label={submitLabel}
          disabled={submitDisabled}
          onPress={onSubmitPress}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: "center",
    width: "100%",
    maxWidth: 520,
    backgroundColor: colors.background,
  },
  content: {
    paddingTop: spacing.lg,
    gap: spacing.xl,
  },
  submitSection: {
    marginTop: "auto",
    paddingTop: spacing.lg,
  },
});
